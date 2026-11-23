<?php

namespace App\Http\Repositories;

use App\Models\DeviceToken;
use App\Traits\Response;
use Carbon\Carbon;
use Illuminate\Http\Client\Pool;
use Illuminate\Http\Client\Response as HttpResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class NotificationRepository
{
    private $response;
    private $deviceToken;

    public function __construct(Response $response, DeviceToken $deviceToken)
    {
        $this->response = $response;
        $this->deviceToken = $deviceToken;
    }

    private function validate(): array
    {
        return [
            'title' => 'required|string|max:255',
            'body' => 'required|string|max:1000',
            'target' => 'required|in:all,inactive',
            'inactive_days' => 'required_if:target,inactive|nullable|integer|min:1',
        ];
    }

    public function summary()
    {
        return [
            'total_device' => $this->deviceToken->count(),
            'total_user' => $this->deviceToken->distinct('user_id')->count('user_id'),
        ];
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->validate());
        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        $query = $this->deviceToken->query();

        // User inaktif = tidak melakukan transaksi selama X hari terakhir
        if ($request->input('target') === 'inactive') {
            $since = Carbon::now()->subDays((int) $request->input('inactive_days'));
            $query->whereNotIn('user_id', function ($q) use ($since) {
                $q->select('user_id')
                    ->from('transactions')
                    ->whereNotNull('user_id')
                    ->where('created_at', '>=', $since);
            });
        }

        $tokens = $query->pluck('device_token')->all();

        return $this->send($tokens, $request->input('title'), $request->input('body'), [
            'type' => $request->input('target') === 'inactive' ? 'inactive_user' : 'general',
        ]);
    }

    public function send_to_all($title, $body, array $data = [])
    {
        $tokens = $this->deviceToken->pluck('device_token')->all();

        return $this->send($tokens, $title, $body, $data);
    }

    public function send(array $tokens, $title, $body, array $data = [])
    {
        $result = [
            'total' => count($tokens),
            'success' => 0,
            'failure' => 0,
        ];

        if (empty($tokens)) {
            return $result;
        }

        $accessToken = $this->accessToken();
        $url = 'https://fcm.googleapis.com/v1/projects/' . config('services.firebase.project_id') . '/messages:send';
        $invalidTokens = [];

        // FCM HTTP v1 hanya menerima 1 token per request, jadi dikirim paralel per 100 token
        foreach (array_chunk($tokens, 100) as $chunk) {
            $responses = Http::pool(function (Pool $pool) use ($chunk, $url, $accessToken, $title, $body, $data) {
                foreach ($chunk as $token) {
                    $pool->as($token)
                        ->withToken($accessToken)
                        ->post($url, ['message' => $this->message($token, $title, $body, $data)]);
                }
            });

            foreach ($responses as $token => $response) {
                if ($response instanceof HttpResponse && $response->successful()) {
                    $result['success']++;
                    continue;
                }

                $result['failure']++;

                // 404 = token sudah tidak terdaftar (app di-uninstall / token kadaluarsa)
                if ($response instanceof HttpResponse && $response->status() === 404) {
                    $invalidTokens[] = $token;
                } else {
                    Log::warning('Firebase send FAILED', [
                        'response' => $response instanceof HttpResponse ? $response->body() : (string) $response,
                    ]);
                }
            }
        }

        if (!empty($invalidTokens)) {
            $this->deviceToken->whereIn('device_token', $invalidTokens)->delete();
        }

        return $result;
    }

    private function message($token, $title, $body, array $data = []): array
    {
        $message = [
            'token' => $token,
            'notification' => [
                'title' => $title,
                'body' => $body,
            ],
            'android' => [
                'priority' => 'high',
                'notification' => [
                    'sound' => 'default',
                ],
            ],
            'apns' => [
                'payload' => [
                    'aps' => [
                        'sound' => 'default',
                    ],
                ],
            ],
        ];

        // FCM hanya menerima value string pada data
        if (!empty($data)) {
            $message['data'] = array_map('strval', $data);
        }

        if (config('services.firebase.android_channel_id')) {
            $message['android']['notification']['channel_id'] = config('services.firebase.android_channel_id');
        }

        return $message;
    }

    private function accessToken()
    {
        return Cache::remember('firebase_access_token', 3000, function () {
            $projectId = config('services.firebase.project_id');
            $clientEmail = config('services.firebase.client_email');
            $privateKey = str_replace('\n', "\n", (string) config('services.firebase.private_key'));

            if (!$projectId || !$clientEmail || !openssl_pkey_get_private($privateKey)) {
                throw ValidationException::withMessages([
                    'firebase' => ['Konfigurasi Firebase belum lengkap. Cek FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL dan FIREBASE_PRIVATE_KEY di .env'],
                ]);
            }

            $now = time();
            $header = $this->base64UrlEncode(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
            $payload = $this->base64UrlEncode(json_encode([
                'iss' => $clientEmail,
                'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
                'aud' => 'https://oauth2.googleapis.com/token',
                'iat' => $now,
                'exp' => $now + 3600,
            ]));

            openssl_sign($header . '.' . $payload, $signature, $privateKey, OPENSSL_ALGO_SHA256);
            $jwt = $header . '.' . $payload . '.' . $this->base64UrlEncode($signature);

            $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion' => $jwt,
            ]);

            if ($response->failed() || !$response->json('access_token')) {
                Log::error('Firebase access token FAILED', [
                    'response' => $response->body(),
                ]);

                throw ValidationException::withMessages([
                    'firebase' => ['Gagal autentikasi ke Firebase, cek kredensial service account.'],
                ]);
            }

            return $response->json('access_token');
        });
    }

    private function base64UrlEncode($value)
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }
}

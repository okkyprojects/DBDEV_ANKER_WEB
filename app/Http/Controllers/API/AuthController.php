<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Mail\OtpMail;
use App\Mail\OtpPassword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name'                  => 'required|string|max:255',
                'email'                 => 'required|email',
                'password'              => 'required|string|min:6|confirmed',
                'password_confirmation' => 'required|string|min:6',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors'  => $e->errors(),
            ], 422);
        }
        $existingUser = User::where('email', $request->email)->first();

        if ($existingUser) {
            if (!is_null($existingUser->email_verified_at)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email sudah terdaftar dan sudah terverifikasi.',
                ], 409);
            }
            $user = $existingUser;
            $user->name = $request->name;
            $user->password = Hash::make($request->password);
        } else {
            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
            ]);
        }
        $plainOtp = rand(100000, 999999);
        $expiresInMinutes = 10;

        $user->otp = Hash::make($plainOtp);
        $user->otp_expires_at = Carbon::now()->addMinutes($expiresInMinutes);
        $user->save();

        Mail::to($user->email)->send(new OtpMail($plainOtp, $expiresInMinutes, $user));

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil. Kode OTP telah dikirim ke email.',
            'data'   => $user,
        ], 201);
    }



    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp'   => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan.'], 404);
        }

        if (!$user->otp || !$user->otp_expires_at) {
            return response()->json(['success' => false, 'message' => 'Tidak ada OTP aktif. Silakan minta ulang.'], 400);
        }

        if (Carbon::now()->greaterThan($user->otp_expires_at)) {
            return response()->json(['success' => false, 'message' => 'OTP sudah kadaluarsa. Silakan minta ulang.'], 400);
        }

        if (!Hash::check($request->otp, $user->otp)) {
            return response()->json(['success' => false, 'message' => 'OTP salah.'], 400);
        }

        $user->email_verified_at = now();
        $user->otp = null;
        $user->otp_expires_at = null;
        $user->save();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Verifikasi berhasil.',
            'token'   => $token,
            'user'    => $user,
        ]);
    }
    public function resendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan.'], 404);
        }

        if (!is_null($user->email_verified_at)) {
            return response()->json(['success' => false, 'message' => 'Akun sudah terverifikasi.'], 400);
        }
        $cacheKey = 'resend_otp_cooldown_' . $user->id;
        $cooldownSeconds = 60;

        if (Cache::has($cacheKey)) {
            $secondsLeft = Cache::ttl($cacheKey);
            return response()->json([
                'success' => false,
                'message' => "Tunggu {$secondsLeft} detik sebelum mengirim ulang OTP."
            ], 429);
        }

        $plainOtp = rand(100000, 999999);
        $expiresInMinutes = 10;

        $user->otp = Hash::make($plainOtp);
        $user->otp_expires_at = Carbon::now()->addMinutes($expiresInMinutes);
        $user->save();

        try {
            Mail::to($user->email)->send(new OtpMail($plainOtp, $expiresInMinutes, $user));
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim OTP: ' . $e->getMessage()
            ], 500);
        }

        Cache::put($cacheKey, true, $cooldownSeconds);

        return response()->json([
            'success' => true,
            'message' => 'OTP baru telah dikirim ke email.',
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah',
                'errors'  => [
                    'email' => ['Email atau password salah'],
                ]
            ], 401);
        }

        if (is_null($user->email_verified_at)) {
            return response()->json([
                'success' => false,
                'message' => 'Akun belum terverifikasi. Silakan cek email untuk kode OTP atau minta kirim ulang.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }


    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout berhasil']);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('main_address');
        return response()->json($user);
    }

    public function sendForgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors'  => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan.'], 404);
        }
        $cacheKey = 'forgot_pw_cooldown_' . $user->id;
        $cooldownSeconds = 60;

        if (Cache::has($cacheKey)) {
            $secondsLeft = Cache::ttl($cacheKey);
            return response()->json([
                'success' => false,
                'message' => "Tunggu {$secondsLeft} detik sebelum mengirim ulang OTP."
            ], 429);
        }

        $plainOtp = rand(100000, 999999);
        $expiresInMinutes = 10;

        $user->otp = Hash::make($plainOtp);
        $user->otp_expires_at = Carbon::now()->addMinutes($expiresInMinutes);
        $user->save();

        try {
            Mail::to($user->email)->send(new OtpPassword($plainOtp, $expiresInMinutes, $user));
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim OTP: ' . $e->getMessage()
            ], 500);
        }

        Cache::put($cacheKey, true, $cooldownSeconds);

        return response()->json([
            'success' => true,
            'message' => 'OTP untuk reset password telah dikirim ke email.',
        ]);
    }
    public function checkOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp'   => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan.'], 404);
        }

        if (!$user->otp || !$user->otp_expires_at) {
            return response()->json(['success' => false, 'message' => 'Tidak ada OTP aktif. Silakan minta ulang.'], 400);
        }

        if (Carbon::now()->greaterThan($user->otp_expires_at)) {
            return response()->json(['success' => false, 'message' => 'OTP sudah kadaluarsa. Silakan minta ulang.'], 400);
        }

        if (!Hash::check($request->otp, $user->otp)) {
            return response()->json(['success' => false, 'message' => 'OTP salah.'], 400);
        }
        return response()->json([
            'success' => true,
            'message' => 'OTP valid. Silakan lanjut ke halaman ganti password sebelum ' . $user->otp_expires_at->toDateTimeString(),
        ]);
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp'   => 'required|string',
            'password' => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User tidak ditemukan.'], 404);
        }
        if (!$user->otp || !$user->otp_expires_at) {
            return response()->json(['success' => false, 'message' => 'Tidak ada OTP aktif. Silakan minta ulang.'], 400);
        }
        if (Carbon::now()->greaterThan($user->otp_expires_at)) {
            return response()->json(['success' => false, 'message' => 'OTP sudah kadaluarsa. Silakan minta ulang.'], 400);
        }
        if (!Hash::check($request->otp, $user->otp)) {
            return response()->json(['success' => false, 'message' => 'OTP salah.'], 400);
        }
        $user->password = Hash::make($request->password);
        $user->email_verified_at = $user->email_verified_at ?? now();
        $user->otp = null;
        $user->otp_expires_at = null;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil direset. Silakan login menggunakan password baru.',
        ]);
    }
}

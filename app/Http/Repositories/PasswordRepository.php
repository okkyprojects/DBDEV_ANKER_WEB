<?php

namespace App\Http\Repositories;

use App\Traits\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\MessageBag;

class PasswordRepository
{
    private $response;

    public function __construct(Response $response)
    {
        $this->response = $response;
    }

    private function validate()
    {
        return [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8',
        ];
    }

    private function request(Request $request): array
    {
        return [
            'current_password' => $request->input('current_password'),
            'new_password' => $request->input('new_password'),
        ];
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->validate());

        if ($validator->fails()) {
            return $this->response->validationError($validator->errors());
        }

        $data = $this->request($request);
        $user = Auth::user();

        if (!Hash::check($data['current_password'], $user->password)) {
            return $this->response->validationError(new MessageBag([
                'current_password' => ['Password saat ini tidak sesuai.'],
            ]));
        }

        $user->password = Hash::make($data['new_password']);
        $saved = $user->save();

        if (!$saved) {
            return $this->response->updateError();
        }

        return $this->response->update($user);
    }
}

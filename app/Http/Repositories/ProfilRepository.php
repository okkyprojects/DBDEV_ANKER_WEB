<?php

namespace App\Http\Repositories;

use App\Models\Seller;
use App\Models\User;
use App\Traits\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class ProfilRepository
{
    private $response;

    public function __construct(Response $response)
    {
        $this->response = $response;
    }

    private function validate()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . Auth::id(),
            'phone_number' => 'nullable|string|max:15',
            'gender' => 'nullable|in:L,P',
            'dob' => 'nullable|date',
            'img' => 'nullable|file|image|max:2048',
        ];
    }

    private function request(Request $request): array
    {
        $data = [
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone_number' => $request->input('phone_number'),
            'gender' => $request->input('gender'),
            'dob' => $request->input('dob'),
        ];
        if ($request->hasFile('img')) {
            $file = $request->file('img');
            $filename = time() . '-' . $file->getClientOriginalName();
            $path = $file->storeAs('profile-images', $filename, 'public');
            $data['img'] = 'storage/' . $path;
        }
        return $data;
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->validate());
        if ($validator->fails()) {
            return $this->response->validationError($validator->errors());
        }
        $user = Auth::user();
        $data = $this->request($request);

        $updated = $user->update($data);

        if (!$updated) {
            return $this->response->updateError();
        }

        return $this->response->update($user);
    }
}

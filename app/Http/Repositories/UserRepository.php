<?php

namespace App\Http\Repositories;

use App\Models\User;
use App\Traits\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UserRepository
{
    private $response;
    private $user;

    public function __construct(Response $response, User $user)
    {
        $this->response = $response;
        $this->user = $user;
    }

    private function validate(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . request()->input('id'),
            'phone_number' => 'nullable|string|max:20',
            'password' => request()->filled('id') ? 'nullable|min:6' : 'required|min:6',
            'gender' => 'nullable|in:L,P',
            'dob' => 'nullable|date',
            'role' => 'required|in:admin,user',
            'img' => 'nullable|image|max:2048',
        ];
    }

    private function request(Request $request): array
    {
        $data = [
            'id' => $request->input('id'),
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone_number' => $request->input('phone_number'),
            'gender' => $request->input('gender'),
            'dob' => $request->input('dob'),
            'role' => $request->input('role', 'user'),
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->input('password'));
        }

        if ($request->hasFile('img')) {
            $file = $request->file('img');
            $filename = time() . '-' . $file->getClientOriginalName();
            $path = $file->storeAs('user-images', $filename, 'public');
            $data['img'] = 'storage/' . $path;
        }

        return $data;
    }

    public function index(Request $request)
    {
        $query = $this->user->query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->input('search') . '%')
                ->orWhere('email', 'like', '%' . $request->input('search') . '%');
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function index_pagination(Request $request)
    {
        $query = $this->user->query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->input('search') . '%')
                ->orWhere('email', 'like', '%' . $request->input('search') . '%');
        }

        return $query->orderBy('created_at', 'desc')->paginate(10);
    }

    public function store(Request $request)
    {
        // dd($request->all());
        $validator = Validator::make($request->all(), $this->validate());
        if ($validator->fails()) {
            return $this->response->validationError($validator->errors());
        }

        $data = $this->request($request);
        if ($request->filled('id')) {
            $existing = $this->user->find($request->id);
            if ($existing && $existing->img && $request->hasFile('img')) {
                Storage::disk('public')->delete(str_replace('storage/', '', $existing->img));
            }
        }

        $user = $this->user->updateOrCreate(
            ['id' => $request->input('id')],
            $data
        );

        return $request->filled('id')
            ? $this->response->update($user)
            : $this->response->store($user);
    }

    public function destroy($id)
    {
        $user = $this->user->find($id);

        if (!$user) {
            return $this->response->notFound();
        }

        if ($user->img && Storage::disk('public')->exists(str_replace('storage/', '', $user->img))) {
            Storage::disk('public')->delete(str_replace('storage/', '', $user->img));
        }

        $user->delete();
        return $this->response->destroy($user);
    }
}

<?php

namespace App\Http\Repositories;

use Spatie\Permission\Models\Role;
use App\Traits\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoleRepository
{
    private $response;
    private $role;

    public function __construct(Response $response, Role $role)
    {
        $this->response = $response;
        $this->role = $role;
    }

    private function validate(): array
    {
        return [
            'name' => 'required|string|max:255|unique:roles,name,' . request()->input('id'),
            'guard_name' => 'nullable|string|in:web,api'
        ];
    }

    private function request(Request $request): array
    {
        return [
            'name' => $request->input('name'),
            'guard_name' => $request->input('guard_name', 'web'),
        ];
    }

    public function index(Request $request)
    {
        $query = $this->role->query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        return $query->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($role) {
                $role->users_count = $role->users()->count();
                $role->permissions_count = $role->permissions()->count();
                return $role;
            });
    }
    public function show($id)
    {
        $data = $this->role->where('id', $id)->first();

        if (!$data) {
            return $this->response->notFound();
        }

        return $data;
    }
    public function index_pagination(Request $request)
    {
        $query = $this->role->query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $roles = $query->orderBy('created_at', 'desc')->paginate(10);

        $roles->getCollection()->transform(function ($role) {
            $role->users_count = $role->users()->count();
            $role->permissions_count = $role->permissions()->count();
            return $role;
        });

        return $roles;
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->validate());
        if ($validator->fails()) {
            return $this->response->validationError($validator->errors());
        }

        $data = $this->request($request);

        $role = $this->role->updateOrCreate(
            ['id' => $request->input('id')],
            $data
        );

        return $request->filled('id')
            ? $this->response->update($role)
            : $this->response->store($role);
    }

    public function destroy($id)
    {
        $role = $this->role->find($id);

        if (!$role) {
            return $this->response->notFound();
        }

        $role->delete();

        return $this->response->destroy($role);
    }
}

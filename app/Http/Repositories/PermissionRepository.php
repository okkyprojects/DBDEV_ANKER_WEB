<?php

namespace App\Http\Repositories;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Traits\Response;

class PermissionRepository
{
    private $response;
    private $permission;

    public function __construct(Response $response, Permission $permission)
    {
        $this->response = $response;
        $this->permission = $permission;
    }

    public function getByRole($role_id)
    {
        $role = Role::with('permissions')->findOrFail($role_id);
        $permissions = $role->permissions->pluck('name')->toArray();
        return  $permissions;
    }

    public function store($request)
    {
        $role = Role::findOrFail($request->role_id);
        $role->syncPermissions($request->permissions);
        return $this->response->update($role);
    }

    public function destroy($id)
    {
        $perm = $this->permission->find($id);
        if (!$perm) return $this->response->notFound();
        $perm->delete();
        return $this->response->destroy($perm);
    }
}

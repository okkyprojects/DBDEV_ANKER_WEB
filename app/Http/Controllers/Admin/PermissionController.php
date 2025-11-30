<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Repositories\PermissionRepository;
use App\Http\Repositories\RoleRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    private $permission;
    private $role;

    public function __construct(PermissionRepository $permission,RoleRepository $role)
    {
        $this->middleware('permission:role-index', ['only' => ['index', 'show']]);
        $this->middleware('permission:role-add', ['only' => ['store']]);
        $this->middleware('permission:role-update', ['only' => ['edit', 'update']]);
        $this->middleware('permission:role-delete', ['only' => ['destroy']]);
        $this->permission = $permission;
        $this->role = $role;
    }
    public function index($role_id, Request $request)
    {
        $data['role'] = $this->role->show($role_id);
        $data['permissions'] = $this->permission->getByRole($role_id);
        return Inertia::render('Permission/Index', compact('data'));
    }

    public function store(Request $request)
    {
        $this->permission->store($request);
        return redirect()->back()->with('success', 'Berhasil menyimpan permission!');
    }

    public function destroy($id)
    {
        $this->permission->destroy($id);
        return redirect()->back()->with('success', 'Berhasil menghapus permission!');
    }
}

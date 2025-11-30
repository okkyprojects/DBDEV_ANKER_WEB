<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Repositories\RoleRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    private $role;

    public function __construct(RoleRepository $role)
    {
        $this->middleware('permission:role-index', ['only' => ['index', 'show']]);
        $this->middleware('permission:role-add', ['only' => ['store']]);
        $this->middleware('permission:role-update', ['only' => ['edit', 'update']]);
        $this->middleware('permission:role-delete', ['only' => ['destroy']]);
        $this->role = $role;
    }

    public function index(Request $request)
    {
        $data['roles'] = $this->role->index_pagination($request);
        return Inertia::render('Role/Index', compact('data'));
    }

    public function store(Request $request)
    {
        $this->role->store($request);
        return redirect()->back()->with('success', 'Berhasil Menambahkan Data!');
    }

    public function destroy($id)
    {
        $this->role->destroy($id);
        return redirect()->back()->with('success', 'Berhasil Menghapus Data!');
    }
}

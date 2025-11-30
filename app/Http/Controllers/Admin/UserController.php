<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Repositories\RoleRepository;
use App\Http\Repositories\UserRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    private $user;
    private $role;

    public function __construct(UserRepository $user,RoleRepository $role)
    {
        $this->middleware('permission:user-index', ['only' => ['index', 'show']]);
        $this->middleware('permission:user-add', ['only' => ['store']]);
        $this->middleware('permission:user-update', ['only' => ['edit', 'update']]);
        $this->middleware('permission:user-delete', ['only' => ['destroy']]);
        $this->user = $user;
        $this->role = $role;
    }

    public function index(Request $request)
    {
        $data['users'] = $this->user->index_pagination($request);
        $data['roles'] = $this->role->index($request);
        return Inertia::render('User/Index', compact('data'));
    }

    public function store(Request $request)
    {
        $data =  $this->user->store($request);
        return redirect()->back()->with('success', 'Berhasil Menambahkan Data!');
    }
    public function destroy($id)
    {
        $data = $this->user->destroy($id);
        return redirect()->back()->with('success', 'Berhasil Menghapus Data!');
    }
}

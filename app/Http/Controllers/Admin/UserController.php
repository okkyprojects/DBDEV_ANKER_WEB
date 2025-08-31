<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Repositories\UserRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    private $user;

    public function __construct(UserRepository $user)
    {
        $this->user = $user;
    }

    public function index(Request $request)
    {
        $data['users'] = $this->user->index_pagination($request);
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

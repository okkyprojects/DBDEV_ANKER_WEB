<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Repositories\PasswordRepository;

class PasswordController extends Controller
{
    protected $passwordRepository;

    public function __construct(PasswordRepository $passwordRepository)
    {
        $this->passwordRepository = $passwordRepository;
    }

    public function store(Request $request)
    {
        return $this->passwordRepository->store($request);
    }
}

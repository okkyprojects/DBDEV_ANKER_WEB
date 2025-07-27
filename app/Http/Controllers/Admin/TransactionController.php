<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Repositories\TransactionRepository;
use App\Traits\Response;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    private $response;
    private $repository;

    public function __construct(
        Response $response,
        TransactionRepository $repository
    ) {
        $this->response = $response;
        $this->repository = $repository;
    }
    public function index(Request $request)
    {
        $data['transactions'] = $this->repository->index($request);
        return Inertia::render('Pesanan/ManajemenPesanan', compact('data'));
    }
}

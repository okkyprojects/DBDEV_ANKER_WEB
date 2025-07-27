<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Repositories\TransactionRepository;
use App\Traits\Response;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    private $transactionRepository;
    private $response;


    public function __construct(
        Response $response,
        TransactionRepository $transactionRepository
    ) {
        $this->response = $response;
        $this->transactionRepository = $transactionRepository;
    }

    public function index(Request $request)
    {
        $data = $this->transactionRepository->index($request);
        return $this->response->index($data);
    }
    public function show(string $id)
    {
        $data = $this->transactionRepository->show($id);
        return $this->response->index($data);
    }
    public function store(Request $request)
    {
        $data = $this->transactionRepository->store($request);
        return $data;
    }

    public function destroy($id)
    {
        $data = $this->transactionRepository->destroy($id);
        return $data;
    }
}

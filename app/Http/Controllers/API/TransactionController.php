<?php

namespace App\Http\Controllers\API;

use App\Exports\PesananExport;
use App\Http\Controllers\Controller;
use App\Http\Repositories\CartRepository;
use App\Http\Repositories\TransactionRepository;
use App\Traits\Response;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class TransactionController extends Controller
{
    private $transactionRepository;
    private $cartRepository;
    private $response;


    public function __construct(
        Response $response,
        TransactionRepository $transactionRepository,
        CartRepository $cartRepository,
    ) {
        $this->response = $response;
        $this->transactionRepository = $transactionRepository;
        $this->cartRepository = $cartRepository;
    }

    public function index(Request $request)
    {
        $data = $this->transactionRepository->index($request);
        return $this->response->index($data);
    }
    public function repeat_order($uuid)
    {
        return $this->cartRepository->repeat_order($uuid);
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
    public function export(Request $request)
    {
        return Excel::download(
            new PesananExport($request, $this->transactionRepository),
            'pesanan.xlsx'
        );
    }
}

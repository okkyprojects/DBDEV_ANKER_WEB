<?php

namespace App\Http\Controllers\API;

use App\Exports\PesananExport;
use App\Http\Controllers\Controller;
use App\Http\Repositories\CartRepository;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Repositories\TransactionRepository;
use App\Traits\Response;
use Maatwebsite\Excel\Excel as ExcelType;

class TransactionController extends Controller
{
    private $transactionRepository;
    private $cartRepository;
    private $response;

    public function __construct(
        Response $response,
        TransactionRepository $transactionRepository,
        CartRepository $cartRepository
    ) {
        $this->response = $response;
        $this->transactionRepository = $transactionRepository;
        $this->cartRepository = $cartRepository;
    }

    public function index(Request $request)
    {
        $data = $this->transactionRepository->index_api($request);
        return $this->response->index($data);
    }

    public function repeat_order($uuid)
    {
        return $this->cartRepository->repeat_order($uuid);
    }

    public function show(string $id)
    {
        $data = $this->transactionRepository->show($id);
        return $this->response->show($data);
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
        try {
            $excelBinary = Excel::raw(
                new PesananExport($request, $this->transactionRepository),
                ExcelType::XLSX
            );

            $base64 = base64_encode($excelBinary);
            $data = [
                'filename' => 'pesanan.xlsx',
                'file_base64' => $base64,
            ];

            return $this->response->index($data);
        } catch (\Exception $e) {
            return $this->response->internalError($e->getMessage());
        }
    }
}

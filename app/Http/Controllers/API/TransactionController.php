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
use Illuminate\Support\Facades\Storage;

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
            $filename = 'pesanan_' . now()->format('Ymd_His') . '.xlsx';
            $path = 'exports/' . $filename;

            Excel::store(
                new PesananExport($request, $this->transactionRepository),
                $path,
                'public',
                ExcelType::XLSX
            );

            $data = [
                'filename' => $filename,
                'url' => Storage::disk('public')->url($path),
            ];

            return $this->response->index($data);
        } catch (\Exception $e) {
            return $this->response->internalError($e->getMessage());
        }
    }
}

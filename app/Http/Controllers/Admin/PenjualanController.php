<?php

namespace App\Http\Controllers\Admin;

use App\Exports\PenjualanExport;
use App\Http\Controllers\Controller;
use App\Http\Repositories\BrandRepository;
use App\Http\Repositories\CategoryRepository;
use App\Http\Repositories\TransactionRepository;
use App\Traits\Response;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class PenjualanController extends Controller
{
    private $response;
    private $transactionRepository;
    private $brandRepository;
    private $categoryRepository;

    public function __construct(
        Response $response,
        TransactionRepository $transactionRepository,
        BrandRepository $brandRepository,
        CategoryRepository $categoryRepository
    ) {
        $this->response = $response;
        $this->transactionRepository = $transactionRepository;
        $this->brandRepository = $brandRepository;
        $this->categoryRepository = $categoryRepository;
    }

    public function index(Request $request)
    {
        $data['transactions'] = $this->transactionRepository->index_penjualan($request);
        $data['brands'] = $this->brandRepository->index($request);
        $data['categories'] = $this->categoryRepository->index($request);
        return Inertia::render('Reporting/Penjualan', compact('data'));
    }
    public function export(Request $request)
    {
        return Excel::download(
            new PenjualanExport($request, $this->transactionRepository),
            'penjualan.xlsx'
        );
    }
}

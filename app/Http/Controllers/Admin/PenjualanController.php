<?php

namespace App\Http\Controllers\Admin;

use App\Exports\PenjualanExport;
use App\Exports\ShowPenjualanExport;
use App\Http\Controllers\Controller;
use App\Http\Repositories\BrandRepository;
use App\Http\Repositories\CategoryRepository;
use App\Http\Repositories\ProductRepository;
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
    private $productRepository;

    public function __construct(
        Response $response,
        TransactionRepository $transactionRepository,
        BrandRepository $brandRepository,
        CategoryRepository $categoryRepository,
        ProductRepository $productRepository
    ) {
        $this->response = $response;
        $this->transactionRepository = $transactionRepository;
        $this->brandRepository = $brandRepository;
        $this->categoryRepository = $categoryRepository;
        $this->productRepository = $productRepository;
    }

    public function index(Request $request)
    {
        $data['transactions'] = $this->transactionRepository->index_penjualan($request);
        $data['summary'] = $this->transactionRepository->get_penjualan_summary($request);
        $data['brands'] = $this->brandRepository->index($request);
        $data['categories'] = $this->categoryRepository->index($request);
        return Inertia::render('Reporting/Penjualan', compact('data'));
    }
    public function show(Request $request, $uuid)
    {
        $data['product'] = $this->productRepository->single($uuid);
        $data['transactions'] = $this->transactionRepository->show_penjualan_by_product($request, $uuid);
        $data['summary'] = $this->transactionRepository->get_summary_detail_by_product($request, $uuid);
        return Inertia::render('Reporting/Detail/Index', compact('data'));
    }
    public function show_export(Request $request, $uuid)
    {
        return Excel::download(
            new ShowPenjualanExport($request, $this->transactionRepository, $uuid),
            'penjualan_detail.xlsx'
        );
    }

    public function export(Request $request)
    {
        return Excel::download(
            new PenjualanExport($request, $this->transactionRepository),
            'penjualan.xlsx'
        );
    }
}

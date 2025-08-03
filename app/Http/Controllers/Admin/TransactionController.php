<?php

namespace App\Http\Controllers\Admin;

use App\Exports\PesananExport;
use App\Http\Controllers\Controller;
use App\Http\Repositories\BrandRepository;
use App\Http\Repositories\CategoryRepository;
use App\Http\Repositories\TransactionRepository;
use App\Traits\Response;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class TransactionController extends Controller
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
        $data['transactions'] = $this->transactionRepository->index($request);
        $data['brands'] = $this->brandRepository->index($request);
        $data['categories'] = $this->categoryRepository->index($request);
        return Inertia::render('Pesanan/ManajemenPesanan', compact('data'));
    }
    public function export(Request $request)
    {
        return Excel::download(
            new PesananExport($request, $this->transactionRepository),
            'pesanan.xlsx'
        );
    }
    public function destroy($uuid)
    {
        $data = $this->transactionRepository->destroy($uuid);
        return redirect()->back()->with('success', 'Berhasil Menghapus Data!');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Exports\PesananExport;
use App\Http\Controllers\Controller;
use App\Http\Repositories\BrandRepository;
use App\Http\Repositories\CategoryRepository;
use App\Http\Repositories\TransactionRepository;
use App\Imports\ProductImport;
use App\Imports\TransactionImport;
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
        $this->middleware('permission:transaction-index', ['only' => ['index', 'show']]);
        $this->middleware('permission:transaction-add', ['only' => ['store']]);
        $this->middleware('permission:transaction-update', ['only' => ['edit', 'update']]);
        $this->middleware('permission:transaction-delete', ['only' => ['destroy']]);
        $this->response = $response;
        $this->transactionRepository = $transactionRepository;
        $this->brandRepository = $brandRepository;
        $this->categoryRepository = $categoryRepository;
    }
    public function index(Request $request)
    {
        $data['summary'] = $this->transactionRepository->summary_index($request);
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
    public function update(Request $request, $uuid)
    {
        $request['uuid'] = $uuid;
        $this->transactionRepository->store($request);
        return redirect()->back()->with('success', 'Berhasil Update Data!');
    }

    public function destroy($uuid)
    {
        $data = $this->transactionRepository->destroy($uuid);
        return redirect()->back()->with('success', 'Berhasil Menghapus Data!');
    }
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,csv'
        ]);

        Excel::import(
            new TransactionImport($this->transactionRepository),
            request()->file('file')
        );

        return redirect()->route('produk.product.index')->with('success', 'Produk dan varian berhasil disimpan!');
    }
}

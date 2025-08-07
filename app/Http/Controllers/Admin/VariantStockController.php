<?php

namespace App\Http\Controllers\Admin;

use App\Exports\BarangMasukExport;
use App\Http\Controllers\Controller;
use App\Http\Repositories\BrandRepository;
use App\Http\Repositories\CategoryRepository;
use App\Http\Repositories\VariantStockRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class VariantStockController extends Controller
{
    private $variantStock;
    private $brandRepository;
    private $categoryRepository;

    public function __construct(
        VariantStockRepository $variantStock,
        BrandRepository $brandRepository,
        CategoryRepository $categoryRepository
    ) {
        $this->variantStock = $variantStock;
        $this->brandRepository = $brandRepository;
        $this->categoryRepository = $categoryRepository;
    }

    public function index(Request $request)
    {
        $data['brands'] = $this->brandRepository->index($request);
        $data['categories'] = $this->categoryRepository->index($request);
        $data['variant_stocks'] = $this->variantStock->index_pagination($request);
        $data['summary'] = $this->variantStock->summary($request);
        return Inertia::render('Reporting/Item', compact('data'));
    }
    public function export(Request $request)
    {
        return Excel::download(
            new BarangMasukExport($request, $this->variantStock),
            'barang_masuk.xlsx'
        );
    }
    public function store(Request $request)
    {
        $this->variantStock->store($request);
        return redirect()->back()->with('success', 'Berhasil Menambahkan Data!');
    }

    public function destroy($uuid)
    {
        $this->variantStock->destroy($uuid);
        return redirect()->back()->with('success', 'Berhasil Menghapus Data!');
    }
}

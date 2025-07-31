<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Repositories\VariantStockRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VariantStockController extends Controller
{
    private $variantStock;

    public function __construct(VariantStockRepository $variantStock)
    {
        $this->variantStock = $variantStock;
    }

    public function index(Request $request)
    {
        $data['variant_stocks'] = $this->variantStock->index_pagination($request);
        return Inertia::render('Reporting/Item', compact('data'));
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

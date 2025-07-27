<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Http\Repositories\BrandRepository;
use App\Http\Repositories\CategoryRepository;
use App\Http\Repositories\ProductRepository;
use App\Http\Repositories\VariantRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    private $product;
    private $category;
    private $brand;
    private $variant;
    public function __construct(ProductRepository $product, CategoryRepository $category, BrandRepository $brand, VariantRepository $variant)
    {
        $this->product = $product;
        $this->category = $category;
        $this->brand = $brand;
        $this->variant = $variant;
    }
    public function index(Request $request)
    {
        $data['products'] = $this->product->index($request);
        return Inertia::render('Stok/StokPage', compact('data'));
    }
    public function create(Request $request)
    {
        $data['categories'] = $this->category->index($request);
        $data['brands'] = $this->brand->index($request);
        return Inertia::render('Stok/ManajemenStok/Create', compact('data'));
    }
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $product = $this->product->store($request);

            dd($request->variants); // untuk ngecek isi variants

            if ($request->has('variants')) {
                $this->variant->store($request->variants, $product->uuid);
            }

            DB::commit();
            return redirect()->route('products.index')->with('success', 'Produk dan varian berhasil disimpan!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menyimpan data: ' . $e->getMessage());
        }
    }


    public function destroy($uuid)
    {
        $data = $this->product->destroy($uuid);
        return redirect()->back()->with('success', 'Berhasil Menghapus Data!');
    }
}

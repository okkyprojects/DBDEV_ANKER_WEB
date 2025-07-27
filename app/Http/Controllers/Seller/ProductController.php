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
    public function edit(Request $request, $uuid)
    {
        $data['categories'] = $this->category->index($request);
        $data['brands'] = $this->brand->index($request);
        $data['product'] = $this->product->single($uuid);
        $variant_request = new Request(['product_uuid' => $uuid]);
        $data['variants'] = $this->variant->index($variant_request);
        return Inertia::render('Stok/ManajemenStok/Edit', compact('data'));
    }

    public function store(Request $request)
    {
        $product = $this->product->store($request);
        if ($request->has('variants')) {
            $cleanVariants = collect($request->variants)->map(function ($variant) {
                unset($variant['isOpen']);
                return $variant;
            })->toArray();
            $variant = $this->variant->store($cleanVariants, $product->uuid);
        }

        return redirect()->route('produk.product.index')->with('success', 'Produk dan varian berhasil disimpan!');
    }




    public function destroy($uuid)
    {
        $data = $this->product->destroy($uuid);
        return redirect()->back()->with('success', 'Berhasil Menghapus Data!');
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Repositories\BrandRepository;
use App\Http\Repositories\CategoryRepository;
use App\Http\Repositories\ProductRepository;
use App\Http\Repositories\SellerRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    private $category;
    private $brand;
    private $product;
    private $seller;
    public function __construct(CategoryRepository $category, BrandRepository $brand, ProductRepository $product, SellerRepository $seller)
    {
        $this->category = $category;
        $this->brand = $brand;
        $this->product = $product;
        $this->seller = $seller;
    }
    public function index(Request $request)
    {
        $data['categories'] = $this->category->index(new Request());
        $data['brands'] = $this->brand->index(new Request());
        $data['products'] = $this->product->index($request);
        return Inertia::render('Beranda', compact('data'));
    }

    public function product(Request $request)
    {
        return Inertia::render('Product',  [
            'categories' => $this->category->index(new Request()),
            'brands' => $this->brand->index(new Request()),
            'products' => $this->product->index($request),
        ]);
    }
    public function product_show($uuid)
    {
        $data['product'] = $this->product->single($uuid);
        return Inertia::render('DetailProduct',  compact('data'));
    }
    public function daftar_seller(Request $request)
    {
        return Inertia::render('Seller/Daftar');
    }

    public function store_seller(Request $request)
    {
        $data = $this->seller->store($request);
        return redirect()->back()->with('success', 'Pesan sukses atau error');
    }
}

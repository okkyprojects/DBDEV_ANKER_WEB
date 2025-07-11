<?php

namespace App\Http\Controllers;

use App\Http\Repositories\BrandRepository;
use App\Http\Repositories\CategoryRepository;
use App\Http\Repositories\ProductRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    private $category;
    private $brand;
    private $product;
    public function __construct(CategoryRepository $category, BrandRepository $brand, ProductRepository $product)
    {
        $this->category = $category;
        $this->brand = $brand;
        $this->product = $product;
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
}

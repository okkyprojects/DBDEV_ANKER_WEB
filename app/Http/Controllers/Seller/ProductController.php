<?php

namespace App\Http\Controllers\Seller;

use App\Exports\ProductExport;
use App\Http\Controllers\Controller;
use App\Http\Repositories\BrandRepository;
use App\Http\Repositories\CategoryRepository;
use App\Http\Repositories\ProductRepository;
use App\Http\Repositories\VariantRepository;
use App\Imports\ProductImport;
use App\Imports\ProductVariantImport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

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
        $data['categories'] = $this->category->index($request);
        $data['brands'] = $this->brand->index($request);
        $data['products'] = $this->product->index($request);
        $data['summary'] = $this->product->summary_product($request);
        return Inertia::render('Stok/StokPage', compact('data'));
    }
    public function create(Request $request)
    {
        $data['categories'] = $this->category->index($request);
        $data['brands'] = $this->brand->index($request);
        return Inertia::render('Stok/ManajemenStok/Create', compact('data'));
    }
    public function export(Request $request)
    {
        return Excel::download(
            new ProductExport($request, $this->product),
            'produk.xlsx'
        );
    }
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,csv'
        ]);

        Excel::import(
            new ProductImport($this->product),
            request()->file('file')
        );

        return redirect()->route('produk.product.index')->with('success', 'Produk dan varian berhasil disimpan!');
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
        try {
            $product = $this->product->store($request);

            if ($request->has('variants')) {
                $cleanVariants = collect($request->variants)->map(function ($variant) {
                    unset($variant['isOpen']);
                    return $variant;
                })->toArray();

                $this->variant->store($cleanVariants, $product->uuid);
            }

            return redirect()->route('produk.product.index')
                ->with('success', 'Produk dan varian berhasil disimpan!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->validator)
                ->withInput();
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', $e->getMessage())
                ->withInput();
        }
    }




    public function destroy($uuid)
    {
        $data = $this->product->destroy($uuid);
        return redirect()->back()->with('success', 'Berhasil Menghapus Data!');
    }
    public function downloadTemplate()
    {
        $filePath = public_path('files/product.xlsx');
        return response()->download($filePath, 'Template Produk.xlsx');
    }
    public function bulk_destroy(Request $request)
    {
        $this->product->bulk_destroy($request);
        return redirect()->back()->with('success', 'Berhasil Menghapus Data!');
    }
}

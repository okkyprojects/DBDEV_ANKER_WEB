<?php

namespace App\Http\Repositories;

use App\Models\Product;
use App\Traits\Response;
use Illuminate\Http\Request;

class ProductRepository
{
    private $response;
    private $product;

    public function __construct(
        Response $response,
        Product $product,
    ) {
        $this->response = $response;
        $this->product = $product;
    }

    public function index(Request $request)
    {
        $query = $this->product
            ->with([
                'category:uuid,name',
                'brand:uuid,name',
                'variants'
            ])
            ->select('products.*')
            ->leftJoin('categories', 'categories.uuid', '=', 'products.category_uuid')
            ->leftJoin('brands', 'brands.uuid', '=', 'products.brand_uuid')
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where('products.name', 'like', '%' . $request->input('search') . '%');
            })
            ->when($request->filled('category'), function ($q) use ($request) {
                $q->where('categories.name', 'like', '%' . $request->input('category') . '%');
            })
            ->when($request->filled('brand'), function ($q) use ($request) {
                $q->where('brands.name', 'like', '%' . $request->input('brand') . '%');
            })
            ->when(
                $request->has('status') && in_array($request->input('status'), ['0', '1']),
                function ($q) use ($request) {
                    $q->where('products.status', $request->input('status'));
                }
            );
        if (in_array($request->input('sort_by'), ['lowest_price', 'highest_price'])) {
            $query->withMin('variants', 'price')->withMax('variants', 'price');

            if ($request->input('sort_by') == 'lowest_price') {
                $query->orderBy('variants_min_price', 'asc');
            } else {
                $query->orderBy('variants_max_price', 'desc');
            }
        } else {
            $query->orderBy('products.created_at', 'desc');
        }

        $products = $query->distinct()->paginate(10);
        $products->getCollection()->transform(function ($product) {
            $product->price = $product->variants->min('price');
            return $product;
        });
        return $products;
    }
}

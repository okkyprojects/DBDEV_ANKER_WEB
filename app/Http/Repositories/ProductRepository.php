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
                'variants',
                'seller.province',
                'seller.city'
            ])
            ->select('products.*')
            ->leftJoin('categories', 'categories.uuid', '=', 'products.category_uuid')
            ->leftJoin('brands', 'brands.uuid', '=', 'products.brand_uuid')
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where('products.name', 'like', '%' . $request->input('search') . '%');
            })
            ->when($request->filled('category'), function ($q) use ($request) {
                $category = $request->input('category');
                $q->when(is_array($category), function ($q) use ($category) {
                    $q->whereIn('categories.name', $category);
                }, function ($q) use ($category) {
                    $q->where('categories.name', 'like', '%' . $category . '%');
                });
            })
            ->when($request->filled('seller'), function ($q) use ($request) {
                $seller = $request->input('seller');
                $q->whereHas('seller', function ($q) use ($seller) {
                    $q->when(is_array($seller), function ($q) use ($seller) {
                        $q->whereIn('name', $seller);
                    }, function ($q) use ($seller) {
                        $q->where('name', 'like', '%' . $seller . '%');
                    });
                });
            })
            ->when($request->filled('brand'), function ($q) use ($request) {
                $brand = $request->input('brand');
                $q->when(is_array($brand), function ($q) use ($brand) {
                    $q->whereIn('brands.name', $brand);
                }, function ($q) use ($brand) {
                    $q->where('brands.name', 'like', '%' . $brand . '%');
                });
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
                $query->orderBy('variants_min_price', 'desc');
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
    public function single($uuid)
    {
        $data = $this->product
            ->with(['brand', 'category', 'variants', 'seller.province', 'seller.city'])
            ->where('uuid', $uuid)
            ->firstOrFail();

        return $data;
    }
}

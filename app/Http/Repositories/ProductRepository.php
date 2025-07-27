<?php

namespace App\Http\Repositories;

use App\Models\Product;
use App\Traits\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

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
    private function validate()
    {
        return [
            'name' => 'required|string|max:255',
            'category_uuid' => 'required|exists:categories,uuid',
            'brand_uuid' => 'required|exists:brands,uuid',
            'seller_uuid' => 'required|exists:sellers,uuid',
            'status' => 'required|boolean',
            'img' => 'nullable|string',
            'description' => 'nullable|string',
        ];
    }


    private function request(Request $request): array
    {
        return [
            'uuid' => $request->input('uuid', Str::uuid()),
            'name' => $request->input('name'),
            'category_uuid' => $request->input('category_uuid'),
            'brand_uuid' => $request->input('brand_uuid'),
            'seller_uuid' => $request->input('seller_uuid'),
            'status' => $request->input('status', true),
        ];
        if ($request->hasFile('img')) {
            $file = $request->file('img');
            $filename = time() . '-' . $file->getClientOriginalName();
            $path = $file->storeAs('product-images', $filename, 'public');
            $data['img'] = 'storage/' . $path;
        }
    }
    public function index(Request $request)
    {
        $query = $this->product
            ->with([
                'category:uuid,name',
                'brand:uuid,name',
                'variants',
            ])
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->input('search') . '%');
            })
            ->when($request->filled('category'), function ($q) use ($request) {
                $category = $request->input('category');
                $q->whereHas('category', function ($subQuery) use ($category) {
                    $subQuery->when(is_array($category), function ($q) use ($category) {
                        $q->whereIn('name', $category);
                    }, function ($q) use ($category) {
                        $q->where('name', 'like', '%' . $category . '%');
                    });
                });
            })
            ->when($request->filled('brand'), function ($q) use ($request) {
                $brand = $request->input('brand');
                $q->whereHas('brand', function ($subQuery) use ($brand) {
                    $subQuery->when(is_array($brand), function ($q) use ($brand) {
                        $q->whereIn('name', $brand);
                    }, function ($q) use ($brand) {
                        $q->where('name', 'like', '%' . $brand . '%');
                    });
                });
            })
            ->when(
                $request->has('status') && in_array($request->input('status'), ['0', '1']),
                fn($q) => $q->where('status', $request->input('status'))
            );
        if (in_array($request->input('sort_by'), ['lowest_price', 'highest_price'])) {
            $query->withMin('variants', 'price')->withMax('variants', 'price');

            $query->orderBy(
                'variants_min_price',
                $request->input('sort_by') === 'lowest_price' ? 'asc' : 'desc'
            );
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $products = $query->paginate(10);
        $products->getCollection()->transform(function ($product) {
            $product->price = $product->variants->min('price');
            $product->variant_count = $product->variants->count();
            return $product;
        });

        return $products;
    }

    public function single($uuid)
    {
        $data = $this->product
            ->with([
                'brand',
                'category',
                'variants.total_stock',
            ])
            ->where('uuid', $uuid)
            ->firstOrFail();


        return $data;
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->validate());
        if ($validator->fails()) {
            return $this->response->validationError($validator->errors());
        }

        $data = $this->request($request);

        $product = $this->product->updateOrCreate(
            ['uuid' => $request->input('uuid')],
            $data
        );

        return $product;
    }


    public function destroy($uuid)
    {
        $product = $this->product->where('uuid', $uuid)->first();

        if (!$product) {
            return $this->response->notFound();
        }
        if ($product->img && Storage::disk('public')->exists(str_replace('storage/', '', $product->img))) {
            Storage::disk('public')->delete(str_replace('storage/', '', $product->img));
        }

        $product->delete();
        return $this->response->destroy($product);
    }
}

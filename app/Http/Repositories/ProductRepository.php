<?php

namespace App\Http\Repositories;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Variant;
use App\Traits\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProductRepository
{
    private $response;
    private $product;
    private $variant;
    private $brand;
    private $category;

    public function __construct(
        Response $response,
        Product $product,
        Variant $variant,
        Brand $brand,
        Category $category,
    ) {
        $this->response = $response;
        $this->product = $product;
        $this->variant = $variant;
        $this->brand = $brand;
        $this->category = $category;
    }
    private function validate()
    {
        return [
            'name' => 'required|string|max:255',
            'category_uuid' => 'required|exists:categories,uuid',
            'brand_uuid' => 'required|exists:brands,uuid',
            'img' => 'nullable',
            'description' => 'nullable|string',
        ];
    }
    public function import(array $row)
    {
        $category = $this->category->firstOrCreate(
            ['name' => $row['category_name'] ?? ''],
            ['uuid' => Str::uuid()]
        );

        $brand = $this->brand->firstOrCreate(
            ['name' => $row['brand_name'] ?? ''],
            ['uuid' => Str::uuid()]
        );

        $product = $this->product->updateOrCreate(
            ['name' => $row['product_name'] ?? ''],
            [
                'uuid'          => Str::uuid(),
                'category_uuid' => $category->uuid,
                'brand_uuid'    => $brand->uuid,
                'img'           => $row['product_img'] ?? null,
                'description'   => $row['description'] ?? null,
            ]
        );
        return true;
    }


    private function request(Request $request): array
    {
        $data = [
            'uuid' => $request->filled('uuid') ? $request->input('uuid') : Str::uuid(),
            'name' => $request->input('name'),
            'category_uuid' => $request->input('category_uuid'),
            'brand_uuid' => $request->input('brand_uuid'),
            'description' => $request->input('description'),
        ];

        if ($request->hasFile('img')) {
            $file = $request->file('img');
            $filename = time() . '-' . $file->getClientOriginalName();
            $path = $file->storeAs('product-images', $filename, 'public');
            $data['img'] = 'storage/' . $path;
        }

        return $data;
    }
    public function summary_product(Request $request)
    {
        $query = $this->product
            ->with([
                'category:uuid,name',
                'brand:uuid,name',
                'variants.total_stock',
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
            });

        $products = $query->get();

        $products->transform(function ($product) {
            $product->total_stock = $product->variants->sum(function ($variant) {
                return $variant->total_stock->total_stock ?? 0;
            });
            return $product;
        });

        return [
            'produk_aktif' => $products->filter(fn($p) => $p->total_stock > 5)->count(),
            'produk_stok_menipis' => $products->filter(fn($p) => $p->total_stock <= 5 && $p->total_stock > 0)->count(),
            'produk_stok_habis' => $products->filter(fn($p) => $p->total_stock <= 0)->count(),
        ];
    }
    public function index(Request $request)
    {
        $query = $this->product
            ->with([
                'category:uuid,name',
                'brand:uuid,name',
                'variants' => function ($q) {
                    $q->with(['total_stock']); // jangan pakai transactionItems di eager load
                }
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
            });

        // Sorting by price
        if ($request->input('sort_by') === 'lowest_price' || $request->input('sort_by') === 'highest_price') {
            $query->withMin('variants', 'price')->withMax('variants', 'price');
            $query->orderBy(
                'variants_min_price',
                $request->input('sort_by') === 'lowest_price' ? 'asc' : 'desc'
            );
        }

        // Paginate
        $products = $query->paginate(10);

        // Transform collection: hitung price, variant_count, total_stock, total_sold
        $products->getCollection()->transform(function ($product) {
            $product->price = $product->variants->min('price');
            $product->variant_count = $product->variants->count();

            $product->total_stock = $product->variants->sum(function ($variant) {
                return $variant->total_stock->total_stock ?? 0;
            });

            // total_sold via query join, pasti benar
            $variantUuids = $product->variants->pluck('uuid')->toArray();
            $product->total_sold = DB::table('transaction_items')
                ->whereIn('variant_uuid', $variantUuids)
                ->sum('quantity');

            return $product;
        });

        // Sorting best_seller setelah transform
        if ($request->input('sort_by') === 'best_seller') {
            $products->getCollection()->sortByDesc('total_sold')->values();
        }

        return $products;
    }
    public function export(Request $request)
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
            });
        if (in_array($request->input('sort_by'), ['lowest_price', 'highest_price'])) {
            $query->withMin('variants', 'price')->withMax('variants', 'price');

            $query->orderBy(
                'variants_min_price',
                $request->input('sort_by') === 'lowest_price' ? 'asc' : 'desc'
            );
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $products = $query->get();
        $products->transform(function ($product) {
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
    public function store($request)
    {
        $validator = Validator::make($request->all(), $this->validate());

        if ($validator->fails()) {
            return $this->response->validationError($validator->errors());
        }

        $data = $this->request($request);

        if ($request->filled('uuid')) {
            $product = $this->product->where('uuid', $request->input('uuid'))->first();

            if (!$product) {
                return $this->response->notFound();
            }

            $product->update($data);
        } else {
            $product = $this->product->create($data);
        }

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

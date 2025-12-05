<?php

namespace App\Http\Repositories;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Variant;
use App\Models\VariantStock;
use App\Traits\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProductRepository
{
    private $response;
    private $product;
    private $variant;
    private $brand;
    private $category;
    private $variantStock;

    public function __construct(
        Response $response,
        Product $product,
        Variant $variant,
        Brand $brand,
        Category $category,
        VariantStock $variantStock,
    ) {
        $this->response = $response;
        $this->product = $product;
        $this->variant = $variant;
        $this->brand = $brand;
        $this->category = $category;
        $this->variantStock = $variantStock;
    }
    private function validate($request = null)
    {
        $uuid = $request?->input('uuid');

        return [
            'name' => 'required|string|max:255',
            'code' => [
                'required',
                'string',
            ],
            'category_uuid' => 'required|exists:categories,uuid',
            'brand_uuid' => 'required|exists:brands,uuid',
            'img' => 'nullable',
            'description' => 'nullable|string',
        ];
    }
    // public function import(array $row)
    // {
    //     if (empty($row['product_name'])) {
    //         return false;
    //     }

    //     $category = $this->category
    //         ->withTrashed()
    //         ->firstOrCreate(
    //             ['name' => $row['category_name'] ?? ''],
    //             ['uuid' => Str::uuid()]
    //         );
    //     if ($category->trashed()) {
    //         $category->restore();
    //     }

    //     $brand = $this->brand
    //         ->withTrashed()
    //         ->firstOrCreate(
    //             ['name' => $row['brand_name'] ?? ''],
    //             ['uuid' => Str::uuid()]
    //         );
    //     if ($brand->trashed()) {
    //         $brand->restore();
    //     }

    //     $product = $this->product
    //         ->withTrashed()
    //         ->firstOrCreate(
    //             [
    //                 'name'          => $row['product_name'],
    //                 'category_uuid' => $category->uuid,
    //                 'brand_uuid'    => $brand->uuid,
    //             ],
    //             [
    //                 'uuid'        => Str::uuid(),
    //                 'img'         => $row['product_img'] ?? null,
    //                 'description' => $row['description'] ?? null,
    //             ]
    //         );
    //     if ($product->trashed()) {
    //         $product->restore();
    //     }

    //     if (!empty($row['sku'])) {
    //         $variant = $this->variant
    //             ->withTrashed()
    //             ->firstOrCreate(
    //                 ['sku' => $row['sku']],
    //                 [
    //                     'uuid'           => Str::uuid(),
    //                     'product_uuid'   => $product->uuid,
    //                     'name'           => $row['variant_name'] ?? '',
    //                     'img'            => $row['variant_img'] ?? null,
    //                     'price'          => $row['price'] ?? 0,
    //                     'discount_price' => $row['discount_price'] ?? null,
    //                 ]
    //             );
    //         if ($variant->trashed()) {
    //             $variant->restore();
    //         }
    //     }

    //     return true;
    // }

    // public function import(array $row)
    // {
    //     if (empty($row['product_name']) || empty($row['product_code'])) {
    //         return false;
    //     }

    //     // CATEGORY
    //     $category = $this->category
    //         ->withTrashed()
    //         ->firstOrCreate(
    //             ['name' => $row['category_name'] ?? ''],
    //             ['uuid' => Str::uuid()]
    //         );

    //     // BRAND
    //     $brand = $this->brand
    //         ->withTrashed()
    //         ->firstOrCreate(
    //             ['name' => $row['brand_name'] ?? ''],
    //             ['uuid' => Str::uuid()]
    //         );

    //     // PRODUCT
    //     $product = $this->product
    //         ->withTrashed()
    //         ->firstOrCreate(
    //             [
    //                 'code' => $row['product_code'],
    //                 'name' => $row['product_name'],
    //                 'category_uuid' => $category->uuid,
    //                 'brand_uuid' => $brand->uuid,
    //             ],
    //             [
    //                 'uuid' => Str::uuid(),
    //                 'img' => $row['product_img'] ?? '/images/no/product.jpg',
    //                 'description' => $row['description'] ?? null,
    //             ]
    //         );

    //     // VARIANT
    //     if (!empty($row['sku'])) {
    //         $variant = $this->variant
    //             ->withTrashed()
    //             ->firstOrCreate(
    //                 ['sku' => $row['sku']],
    //                 [
    //                     'uuid' => Str::uuid(),
    //                     'product_uuid' => $product->uuid,
    //                     'name' => $row['variant_name'] ?? '',
    //                     'img' => $row['variant_img'] ?? '/images/no/product.jpg',
    //                     'price' => $row['price'] ?? 0,
    //                 ]
    //             );
    //         if (!empty($row['stock'])) {
    //             $newStock =  (int) $row['stock'];

    //             $variant->update([
    //                 'stock' => $newStock,
    //             ]);
    //         }
    //     }

    //     return true;
    // }

    public function import(array $row)
    {
        if (empty($row['product_name']) || empty($row['product_code'])) {
            return false;
        }

        // CATEGORY
        $category = $this->category
            ->withTrashed()
            ->firstOrCreate(
                ['name' => $row['category_name'] ?? ''],
                ['uuid' => Str::uuid()]
            );

        // 🔥 UPDATE CATEGORY NAME kalau sudah ada
        if (!empty($row['category_name'])) {
            $category->update([
                'name' => $row['category_name'],
            ]);
        }

        // BRAND
        $brand = $this->brand
            ->withTrashed()
            ->firstOrCreate(
                ['name' => $row['brand_name'] ?? ''],
                ['uuid' => Str::uuid()]
            );

        // 🔥 UPDATE BRAND NAME kalau sudah ada
        if (!empty($row['brand_name'])) {
            $brand->update([
                'name' => $row['brand_name'],
            ]);
        }

        // PRODUCT
        $product = $this->product
            ->withTrashed()
            ->firstOrCreate(
                [
                    'code' => $row['product_code'],
                    'name' => $row['product_name'],
                    'category_uuid' => $category->uuid,
                    'brand_uuid' => $brand->uuid,
                ],
                [
                    'uuid' => Str::uuid(),
                    'img' => $row['product_img'] ?? '/images/no/product.jpg',
                    'description' => $row['description'] ?? null,
                ]
            );

        // UPDATE PRODUCT
        $product->update([
            'name' => $row['product_name'],
            'category_uuid' => $category->uuid,
            'brand_uuid' => $brand->uuid,
            'img' => $row['product_img'] ?? $product->img,
            'description' => $row['description'] ?? $product->description,
        ]);

        // VARIANT
        if (!empty($row['sku'])) {

            $variant = $this->variant
                ->withTrashed()
                ->firstOrCreate(
                    ['sku' => $row['sku']],
                    [
                        'uuid' => Str::uuid(),
                        'product_uuid' => $product->uuid,
                        'name' => $row['variant_name'] ?? '',
                        'img' => $row['variant_img'] ?? '/images/no/product.jpg',
                        'price' => $row['price'] ?? 0,
                    ]
                );

            // UPDATE VARIANT
            $variant->update([
                'product_uuid' => $product->uuid,
                'name' => $row['variant_name'] ?? $variant->name,
                'img' => $row['variant_img'] ?? $variant->img,
                'price' => $row['price'] ?? $variant->price,
                'stock' => !empty($row['stock']) ? (int)$row['stock'] : ($variant->stock ?? 0),
            ]);
        }

        return true;
    }










    private function request(Request $request): array
    {
        $data = [
            'uuid' => $request->filled('uuid') ? $request->input('uuid') : Str::uuid(),
            'name' => $request->input('name'),
            'code' => $request->input('code'),
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
            $product->total_stock = $product->variants->sum('stock') ?? 0;
            return $product;
        });

        return [
            'produk_aktif' => $products->filter(fn($p) => $p->total_stock > 5)->count(),
            'produk_stok_menipis' => $products->filter(fn($p) => $p->total_stock <= 5 && $p->total_stock > 0)->count(),
            'produk_stok_habis' => $products->filter(fn($p) => $p->total_stock <= 0 && $p->variants->isNotEmpty())->count(),
        ];
    }
    public function index(Request $request)
    {
        $query = $this->product
            ->with([
                'category:uuid,name',
                'brand:uuid,name',
                'variants' => function ($q) {
                    $q->whereNull('variants.deleted_at')
                        ->with('total_stock');
                },
            ])->whereHas('variants', function ($q) {
                $q->whereNull('variants.deleted_at');
            })
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where(function ($q2) use ($request) {
                    $q2->where('name', 'like', '%' . $request->input('search') . '%')
                        ->orWhere('code', 'like', '%' . $request->input('search') . '%');
                });
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

        $query->select('products.*')
            ->selectSub(function ($q) {
                $q->from('transaction_items')
                    ->join('variants', 'transaction_items.variant_uuid', '=', 'variants.uuid')
                    ->whereColumn('variants.product_uuid', 'products.uuid')
                    ->selectRaw('COALESCE(SUM(transaction_items.quantity),0)');
            }, 'total_sold');

        if ($request->input('sort_by') === 'best_seller') {
            $query->orderByDesc('total_sold');
        } elseif ($request->input('sort_by') === 'lowest_price' || $request->input('sort_by') === 'highest_price') {
            $query->withMin('variants', 'price')->withMax('variants', 'price');
            $query->orderBy(
                'variants_min_price',
                $request->input('sort_by') === 'lowest_price' ? 'asc' : 'desc'
            );
        } else {
            $query->orderBy('updated_at', 'desc');
        }

        $products = $query->paginate(10);

        $products->getCollection()->transform(function ($product) {
            $product->price = $product->variants->min('price');
            $product->variant_count = $product->variants->count();
            $product->total_stock = $product->variants
                ->whereNull('deleted_at')
                ->sum('stock');
            return $product;
        });

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
                $q->where(function ($q2) use ($request) {
                    $q2->where('name', 'like', '%' . $request->input('search') . '%')
                        ->orWhere('code', 'like', '%' . $request->input('search') . '%');
                });
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
                'variants' => function ($q) {
                    $q->whereNull('deleted_at')
                        ->with('total_stock');
                },
            ])
            ->where('uuid', $uuid)
            ->whereNull('deleted_at')
            ->first();

        return $data;
    }
    public function single_withoout_delete($uuid)
    {
        $data = $this->product->withTrashed()
            ->with([
                'brand',
                'category',
                'variants' => function ($q) {
                    $q->whereNull('deleted_at')
                        ->with('total_stock');
                },
            ])
            ->where('uuid', $uuid)
            ->first();

        return $data;
    }



    public function store($request)
    {
        $validator = Validator::make($request->all(), $this->validate($request));

        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }

        $code = $request->input('code');
        $uuid = $request->input('uuid');

        $variantExists = $this->product->where('code', $code)
            ->whereNull('deleted_at')
            ->whereHas('variants', function ($q) {
                $q->whereNull('deleted_at');
            }, '>', 0)
            ->when($uuid, fn($q) => $q->where('uuid', '!=', $uuid))
            ->exists();

        if ($variantExists) {
            $validator->errors()->add('code', 'The code has already been taken');
            throw new \Illuminate\Validation\ValidationException($validator);
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
    public function bulk_destroy($request)
    {
        $uuids = $request->input('uuids', []);

        if (empty($uuids)) {
            return $this->response->validationError(['uuids' => ['Data tidak boleh kosong']]);
        }

        $products = $this->product->whereIn('uuid', $uuids)->get();

        foreach ($products as $product) {
            if ($product->img && Storage::disk('public')->exists(str_replace('storage/', '', $product->img))) {
                Storage::disk('public')->delete(str_replace('storage/', '', $product->img));
            }
            $product->delete();
        }

        return $this->response->destroy('Berhasil menghapus beberapa data!');
    }
}

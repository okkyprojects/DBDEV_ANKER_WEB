<?php

namespace App\Http\Repositories;

use App\Models\Product;
use App\Models\Variant;
use App\Traits\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class VariantRepository
{
    private $response;
    private $variant;
    private $product;

    public function __construct(Response $response, Variant $variant, Product $product)
    {
        $this->response = $response;
        $this->variant = $variant;
        $this->product = $product;
    }

    private function validate($isUpdate = false, $uuid = null): array
    {
        $skuRule = ['required', 'distinct'];

        if ($isUpdate && $uuid) {
            $skuRule[] = 'unique:variants,sku,' . $uuid . ',uuid';
        } else {
            $skuRule[] = 'unique:variants,sku';
        }

        return [
            'variants' => 'required|array',
            'variants.*.name' => 'required',
            'variants.*.sku' => $skuRule,
            'variants.*.price' => 'required|numeric',
            'variants.*.img' => 'nullable',
            'variants.*.stock' => 'nullable',
        ];
    }


    public function index(Request $request)
    {
        if (!$request->filled('product_uuid')) {
            return $this->response->validationError(['product_uuid' => ['This field is required.']]);
        }

        $variants = $this->variant
            ->where('product_uuid', $request->input('product_uuid'))
            ->orderBy('created_at', 'desc')
            ->get();

        return $variants;
    }
    public function store(array $variants, $productUuid)
    {
        $results = [];

        foreach ($variants as $item) {
            $isUpdate = !empty($item['uuid']);
            $uuid = $isUpdate ? $item['uuid'] : (string) Str::uuid();

            $validator = Validator::make(
                ['variants' => [$item]],
                $this->validate($isUpdate, $uuid)
            );

            if ($validator->fails()) {
                dd($validator->errors());
            }


            $item['uuid'] = $uuid;
            $item['product_uuid'] = $productUuid;

            $data = $this->request($item);

            $variant = $this->variant->updateOrCreate(
                ['uuid' => $uuid],
                $data
            );

            $results[] = $variant;
        }

        return $results;
    }





    private function request(array $item): array
    {
        $data = [
            'uuid' => $item['uuid'] ?? (string) Str::uuid(),
            'product_uuid' => $item['product_uuid'],
            'name' => $item['name'],
            'sku' => $item['sku'],
            'price' => $item['price'],
            'stock' => $item['stock'] ?? 0,
        ];

        if (isset($item['img']) && $item['img'] instanceof \Illuminate\Http\UploadedFile) {
            $file = $item['img'];
            $filename = time() . '-' . $file->getClientOriginalName();
            $path = $file->storeAs('variant-images', $filename, 'public');
            $data['img'] = 'storage/' . $path;
        }

        return $data;
    }


    public function destroy($uuid)
    {
        $variant = $this->variant->where('uuid', $uuid)->first();

        if (!$variant) {
            return $this->response->notFound();
        }
        $productUuid = $variant->product_uuid;
        $variant->delete();
        $variantCount = $this->variant
            ->where('product_uuid', $productUuid)
            ->count();

        if ($variantCount === 0) {

            $this->product->where('uuid', $productUuid)->delete();
        }

        return $this->response->destroy($variant);
    }


    public function export(Request $request)
    {
        $variants = $this->variant
            ->with([
                'product' => function ($q) {
                    $q->with(['category', 'brand']);
                },
                'total_stock'
            ])
            ->when($request->input('search'), function ($q, $search) {
                $q->whereHas('product', function ($q) use ($search) {
                    $q->where('products.name', 'like', "%{$search}%");
                });
            })
            ->when($request->input('status'), function ($q, $status) {
                $q->whereHas('product', function ($q) use ($status) {
                    $q->where('products.status', 'like', "%{$status}%");
                });
            })
            ->when($request->input('category'), function ($q, $categoryName) {
                $q->whereHas('product.category', function ($q) use ($categoryName) {
                    $q->where('categories.name', $categoryName);
                });
            })
            ->when($request->input('brand'), function ($q, $brandName) {
                $q->whereHas('product.brand', function ($q) use ($brandName) {
                    $q->where('brands.name', $brandName);
                });
            })
            ->join('products', 'variants.product_uuid', '=', 'products.uuid')
            ->orderBy('products.name', 'asc')
            ->orderBy('variants.name', 'asc')
            ->select('variants.*')
            ->get();

        return $variants;
    }
}

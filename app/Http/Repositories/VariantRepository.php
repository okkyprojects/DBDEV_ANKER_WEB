<?php

namespace App\Http\Repositories;

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

    public function __construct(Response $response, Variant $variant)
    {
        $this->response = $response;
        $this->variant = $variant;
    }

    private function validate(): array
    {
        return [

            'variants' => 'required|array',
            'variants.*.product_uuid' => 'required|exists:products,uuid',
            'variants.*.name' => 'required',
            'variants.*.sku' => 'required',
            'variants.*.price' => 'required|numeric',
            'variants.*.discount_price' => 'nullable|numeric',
            'variants.*.img' => 'nullable|image|max:2048',
        ];
    }

    public function index(Request $request)
    {
        if (!$request->filled('product_uuid')) {
            return $this->response->validationError(['product_uuid' => ['This field is required.']]);
        }

        $variants = $this->variant
            ->with('total_stock')
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

            $item['uuid'] = $uuid;
            $item['product_uuid'] = $productUuid;

            $data = $this->request($item);

            if ($isUpdate) {
                $existing = $this->variant->where('uuid', $uuid)->first();

                // if (
                //     $existing &&
                //     $existing->img &&
                //     isset($item['img']) &&
                //     $item['img'] instanceof \Illuminate\Http\UploadedFile
                // ) {
                //     Storage::disk('public')->delete(str_replace('storage/', '', $existing->img));
                // }
            }

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
            'discount_price' => $item['discount_price'] ?? null,
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

        // if ($variant->img && Storage::disk('public')->exists(str_replace('storage/', '', $variant->img))) {
        //     Storage::disk('public')->delete(str_replace('storage/', '', $variant->img));
        // }

        $variant->delete();
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
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->when($request->input('category'), function ($q, $categoryName) {
                $q->whereHas('product.category', function ($q) use ($categoryName) {
                    $q->where('name', $categoryName);
                });
            })
            ->when($request->input('brand'), function ($q, $brandName) {
                $q->whereHas('product.brand', function ($q) use ($brandName) {
                    $q->where('name', $brandName);
                });
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return $variants;
    }
}

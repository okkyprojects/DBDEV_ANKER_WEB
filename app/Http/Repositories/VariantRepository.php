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
            'product_uuid' => 'required|exists:products,uuid',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'discount_price' => 'nullable|numeric',
            'status' => 'required|boolean',
            'img' => 'nullable|image|max:2048',
        ];
    }

    private function request(Request $request): array
    {
        $data = [
            'uuid' => $request->input('uuid', Str::uuid()),
            'product_uuid' => $request->input('product_uuid'),
            'name' => $request->input('name'),
            'price' => $request->input('price'),
            'discount_price' => $request->input('discount_price'),
            'status' => $request->input('status', true),
        ];

        if ($request->hasFile('img')) {
            $file = $request->file('img');
            $filename = time() . '-' . $file->getClientOriginalName();
            $path = $file->storeAs('variant-images', $filename, 'public');
            $data['img'] = 'storage/' . $path;
        }

        return $data;
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

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->validate());
        if ($validator->fails()) {
            return $this->response->validationError($validator->errors());
        }

        $data = $this->request($request);

        if ($request->filled('uuid')) {
            $existing = $this->variant->where('uuid', $request->uuid)->first();
            if ($existing && $existing->img && $request->hasFile('img')) {
                Storage::disk('public')->delete(str_replace('storage/', '', $existing->img));
            }
        }

        $variant = $this->variant->updateOrCreate(
            ['uuid' => $request->input('uuid')],
            $data
        );

        return $request->filled('uuid')
            ? $this->response->update($variant)
            : $this->response->store($variant);
    }

    public function destroy($uuid)
    {
        $variant = $this->variant->where('uuid', $uuid)->first();

        if (!$variant) {
            return $this->response->notFound();
        }

        if ($variant->img && Storage::disk('public')->exists(str_replace('storage/', '', $variant->img))) {
            Storage::disk('public')->delete(str_replace('storage/', '', $variant->img));
        }

        $variant->delete();
        return $this->response->destroy($variant);
    }
}

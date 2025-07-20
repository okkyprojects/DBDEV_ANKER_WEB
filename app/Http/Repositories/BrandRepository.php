<?php

namespace App\Http\Repositories;

use App\Models\Brand;
use App\Traits\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BrandRepository
{
    public function __construct(private Response $response, private Brand $brand) {}

    private function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'status' => 'required|boolean',
            'img' => 'nullable|image|max:2048',
        ];
    }

    private function extractData(Request $request): array
    {
        $data = [
            'uuid' => $request->input('uuid', Str::uuid()),
            'name' => $request->input('name'),
            'status' => $request->input('status', true),
        ];

        if ($request->hasFile('img')) {
            $filename = time() . '-' . $request->file('img')->getClientOriginalName();
            $path = $request->file('img')->storeAs('brand-images', $filename, 'public');
            $data['img'] = 'storage/' . $path;
        }

        return $data;
    }

    public function index(Request $request)
    {
        $query = $this->brand->query();

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%$search%");
        }

        if ($request->has('status') && in_array($request->status, ['0', '1'])) {
            $query->where('status', $request->status);
        }

        return $query->orderByDesc('created_at')->get();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->rules());
        if ($validator->fails()) return $this->response->validationError($validator->errors());

        $data = $this->extractData($request);

        if ($request->filled('uuid')) {
            $existing = $this->brand->where('uuid', $request->uuid)->first();
            if ($existing && $existing->img && $request->hasFile('img')) {
                Storage::disk('public')->delete(str_replace('storage/', '', $existing->img));
            }
        }

        $brand = $this->brand->updateOrCreate(['uuid' => $request->uuid], $data);

        return $request->filled('uuid')
            ? $this->response->update($brand)
            : $this->response->store($brand);
    }

    public function destroy($uuid)
    {
        $brand = $this->brand->where('uuid', $uuid)->first();

        if (!$brand) return $this->response->notFound();

        if ($brand->img && Storage::disk('public')->exists(str_replace('storage/', '', $brand->img))) {
            Storage::disk('public')->delete(str_replace('storage/', '', $brand->img));
        }

        $brand->delete();
        return $this->response->destroy($brand);
    }
}

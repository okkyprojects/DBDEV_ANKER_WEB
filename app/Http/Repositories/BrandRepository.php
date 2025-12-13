<?php

namespace App\Http\Repositories;

use App\Models\Brand;
use App\Traits\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class BrandRepository
{
    public function __construct(private Response $response, private Brand $brand) {}

    private function validate($uuid = null): array
    {
        return [
            'name' => [
                'required',
                'string',
                Rule::unique('brands', 'name')
                    ->ignore($uuid, 'uuid'),
            ],
            'status' => 'required|boolean',
            'img' => 'nullable|image|max:2048',
        ];
    }


    private function request(Request $request): array
    {
        $data = [
            'uuid' => $request->input('uuid', Str::uuid()),
            'name' => $request->input('name'),
            'status' => $request->input('status', true),
        ];

        if ($request->hasFile('img')) {
            $file = $request->file('img');
            $filename = time() . '-' . $file->getClientOriginalName();
            $path = $file->storeAs('brand-images', $filename, 'public');
            $data['img'] = 'storage/' . $path;
        }

        return $data;
    }

    public function index_pagination(Request $request)
    {
        $query = $this->brand->query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->input('search') . '%');
        }

        if ($request->has('status') && in_array($request->input('status'), ['0', '1'])) {
            $query->where('status', $request->input('status'));
        }

        $data = $query->orderBy('created_at', 'desc')->paginate(10);

        return $data;
    }
    public function index(Request $request)
    {
        $query = $this->brand->query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->input('search') . '%');
        }

        if ($request->has('status') && in_array($request->input('status'), ['0', '1'])) {
            $query->where('status', $request->input('status'));
        }

        $data = $query->orderBy('created_at', 'desc')->get();

        return $data;
    }

    public function store(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            $this->validate($request->uuid)
        );
        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        $data = $this->request($request);

        if ($request->filled('uuid')) {
            $existing = $this->brand->where('uuid', $request->uuid)->first();
            if ($existing && $existing->img && $request->hasFile('img')) {
                Storage::disk('public')->delete(str_replace('storage/', '', $existing->img));
            }
        }


        return $this->brand->updateOrCreate(
            ['uuid' => $request->input('uuid')],
            $data
        );
    }

    public function destroy($uuid)
    {
        $brand = $this->brand->where('uuid', $uuid)->first();

        if (!$brand) {
            return $this->response->notFound();
        }

        if ($brand->img && Storage::disk('public')->exists(str_replace('storage/', '', $brand->img))) {
            Storage::disk('public')->delete(str_replace('storage/', '', $brand->img));
        }

        $brand->delete();
        return $this->response->destroy($brand);
    }
    public function bulk_destroy($request)
    {
        $uuids = $request->input('uuids', []);

        if (empty($uuids)) {
            return $this->response->validationError(['uuids' => ['Data tidak boleh kosong']]);
        }

        $brands = $this->brand->whereIn('uuid', $uuids)->get();

        foreach ($brands as $brand) {
            if ($brand->img && Storage::disk('public')->exists(str_replace('storage/', '', $brand->img))) {
                Storage::disk('public')->delete(str_replace('storage/', '', $brand->img));
            }
            $brand->delete();
        }

        return $this->response->destroy('Berhasil menghapus beberapa data!');
    }
}

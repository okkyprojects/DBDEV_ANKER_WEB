<?php

namespace App\Http\Repositories;

use App\Models\Banner;
use App\Traits\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BannerRepository
{
    private $response;
    private $banner;

    public function __construct(Response $response, Banner $banner)
    {
        $this->response = $response;
        $this->banner = $banner;
    }

    private function validate(): array
    {
        return [
            'img' => 'required|image'
        ];
    }

    private function request(Request $request): array
    {
        $data = [
            'uuid' => $request->input('uuid', (string) Str::uuid()),
        ];

        if ($request->hasFile('img')) {
            $file = $request->file('img');
            $filename = time() . '-' . $file->getClientOriginalName();
            $path = $file->storeAs('banner-images', $filename, 'public');
            $data['img'] = 'storage/' . $path;
        }

        return $data;
    }

    public function index(Request $request)
    {
        $query = $this->banner->query();

        if ($request->filled('search')) {
            $query->where('img', 'like', '%' . $request->input('search') . '%');
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function index_pagination(Request $request)
    {
        $query = $this->banner->query();

        if ($request->filled('search')) {
            $query->where('img', 'like', '%' . $request->input('search') . '%');
        }

        return $query->orderBy('created_at', 'desc')->paginate(10);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->validate());
        if ($validator->fails()) {
            return $this->response->validationError($validator->errors());
        }

        $data = $this->request($request);

        if ($request->filled('uuid')) {
            $existing = $this->banner->where('uuid', $request->uuid)->first();
            if ($existing && $existing->img && $request->hasFile('img')) {
                Storage::disk('public')->delete(str_replace('storage/', '', $existing->img));
            }
        }

        $banner = $this->banner->updateOrCreate(
            ['uuid' => $request->input('uuid')],
            $data
        );

        return $request->filled('uuid')
            ? $this->response->update($banner)
            : $this->response->store($banner);
    }

    public function destroy($uuid)
    {
        $banner = $this->banner->where('uuid', $uuid)->first();

        if (!$banner) {
            return $this->response->notFound();
        }

        if ($banner->img && Storage::disk('public')->exists(str_replace('storage/', '', $banner->img))) {
            Storage::disk('public')->delete(str_replace('storage/', '', $banner->img));
        }

        $banner->delete();
        return $this->response->destroy($banner);
    }
}

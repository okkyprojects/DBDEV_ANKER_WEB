<?php

namespace App\Http\Repositories;

use App\Models\Seller;
use App\Traits\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class SellerRepository
{
    private $response;
    private $seller;

    public function __construct(Response $response, Seller $seller)
    {
        $this->response = $response;
        $this->seller = $seller;
    }

    private function validate()
    {
        return [
            'id_card_number' => 'required|string|max:255',
            'id_card_img' => 'required|file|image|max:2048',
            'id_card_name' => 'required|string|max:255',
            'seller_name' => 'required|string|max:255',
            'seller_phone' => 'required|string|max:12',
            'img' => 'nullable|file|image|max:2048',
            'province_id' => 'required|integer|exists:provinces,id',
            'city_id' => 'required|integer|exists:cities,id',
            'note' => 'nullable|string',
            'status' => 'nullable|in:0,1,2',
        ];
    }

    private function request(Request $request): array
    {
        $data = [
            'user_id' => Auth::id(),
            'id_card_number' => $request->input('id_card_number'),
            'id_card_name' => $request->input('id_card_name'),
            'seller_name' => $request->input('seller_name'),
            'seller_phone' => $request->input('seller_phone'),
            'province_id' => $request->input('province_id'),
            'city_id' => $request->input('city_id'),
            'note' => $request->input('note'),
            'status' => $request->input('status', 0),
        ];
        if ($request->hasFile('id_card_img')) {
            $file = $request->file('id_card_img');
            $filename = time() . '-' . $file->getClientOriginalName();
            $path = $file->storeAs('id-card-images', $filename, 'public');
            $data['id_card_img'] = 'storage/' . $path;
        }
        if ($request->hasFile('img')) {
            $file = $request->file('img');
            $filename = time() . '-' . $file->getClientOriginalName();
            $path = $file->storeAs('seller-images', $filename, 'public');
            $data['img'] = 'storage/' . $path;
        }

        return $data;
    }


    public function index(Request $request)
    {
        $query = $this->seller->query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('seller_name', 'like', "%$search%")
                    ->orWhere('id_card_name', 'like', "%$search%")
                    ->orWhere('city', 'like', "%$search%");
            });
        }

        if ($request->has('status') && in_array($request->input('status'), ['0', '1', '2'])) {
            $query->where('status', $request->input('status'));
        }

        $data = $query->orderBy('created_at', 'desc')->paginate(10);

        return $this->response->index($data);
    }

    public function show($uuid)
    {
        $data = $this->seller->where('uuid', $uuid)->first();

        if (!$data) {
            return $this->response->notFound();
        }

        return $this->response->show($data);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->validate());
        if ($validator->fails()) {
            return $this->response->validationError($validator->errors());
        }
        $data = $this->request($request);
        if ($request->filled('uuid')) {
            $seller = $this->seller->where('uuid', $request->uuid)->first();
            if (!$seller) {
                return $this->response->notFound();
            }
            $updated = $seller->update($data);

            if (!$updated) {
                return $this->response->updateError();
            }
            return $this->response->update($seller);
        } else {
            $data['uuid'] = Str::uuid();
            $seller = $this->seller->create($data);
            if (!$seller) {
                return $this->response->storeError();
            }
            return $this->response->store($seller);
        }
    }


    public function destroy($uuid)
    {
        $seller = $this->seller->where('uuid', $uuid)->first();
        if (!$seller) {
            return $this->response->notFound();
        }
        $seller->delete();
        return $this->response->destroy($seller);
    }
}

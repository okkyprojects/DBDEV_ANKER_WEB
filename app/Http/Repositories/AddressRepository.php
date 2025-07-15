<?php

namespace App\Http\Repositories;

use App\Models\Address;
use App\Traits\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AddressRepository
{
    private $response;
    private $address;

    public function __construct(Response $response, Address $address)
    {
        $this->response = $response;
        $this->address = $address;
    }

    private function validate()
    {
        return [
            'province_id' => 'required|integer|exists:provinces,id',
            'city_id' => 'required|integer|exists:cities,id',
            'district_id' => 'required|integer|exists:districts,id',
            'category' => 'required|in:rumah,kantor',
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:15',
            'address' => 'required|string',
            'postal_code' => 'required|string|max:10',
            'note' => 'nullable|string',
            'is_main' => 'nullable|boolean',
        ];
    }

    private function request(Request $request): array
    {
        return [
            'user_id' => Auth::id(),
            'province_id' => $request->input('province_id'),
            'city_id' => $request->input('city_id'),
            'district_id' => $request->input('district_id'),
            'category' => $request->input('category', 'rumah'),
            'name' => $request->input('name'),
            'phone_number' => $request->input('phone_number'),
            'address' => $request->input('address'),
            'postal_code' => $request->input('postal_code'),
            'note' => $request->input('note'),
            'is_main' => $request->input('is_main', false),
        ];
    }

    public function index(Request $request)
    {
        $query = $this->address->with(['province', 'city', 'district'])
            ->where('user_id', Auth::id());
        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('phone_number', 'like', "%$search%")
                    ->orWhere('address', 'like', "%$search%")
                    ->orWhere('postal_code', 'like', "%$search%")
                    ->orWhere('note', 'like', "%$search%")
                    ->orWhereHas('province', function ($sub) use ($search) {
                        $sub->where('name', 'like', "%$search%");
                    })
                    ->orWhereHas('city', function ($sub) use ($search) {
                        $sub->where('name', 'like', "%$search%");
                    })
                    ->orWhereHas('district', function ($sub) use ($search) {
                        $sub->where('name', 'like', "%$search%");
                    });
            });
        }
        $data = $query->orderByDesc('is_main')->orderBy('created_at', 'desc')->get();
        return $data;
    }


    public function show($uuid)
    {
        $data = $this->address->where('uuid', $uuid)->where('user_id', Auth::id())->first();
        if (!$data) {
            return $this->response->notFound();
        }
        return $data;
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->validate());
        if ($validator->fails()) {
            return $this->response->validationError($validator->errors());
        }
        $data = $this->request($request);
        if ($data['is_main']) {
            $this->address->where('user_id', Auth::id())->update(['is_main' => false]);
        }
        if ($request->filled('uuid')) {
            $address = $this->address->where('uuid', $request->uuid)->where('user_id', Auth::id())->first();
            if (!$address) {
                return $this->response->notFound();
            }
            $updated = $address->update($data);
            if (!$this->address->where('user_id', Auth::id())->where('is_main', true)->exists()) {
                $address->update(['is_main' => true]);
            }
            return $updated
                ? $this->response->update($address)
                : $this->response->updateError();
        } else {
            $data['uuid'] = Str::uuid();
            if (!$this->address->where('user_id', Auth::id())->exists()) {
                $data['is_main'] = true;
            }
            $address = $this->address->create($data);
            return $address
                ? $this->response->store($address)
                : $this->response->storeError();
        }
    }

    public function destroy($uuid)
    {
        $address = $this->address->where('uuid', $uuid)->where('user_id', Auth::id())->first();
        if (!$address) {
            return $this->response->notFound();
        }
        $wasMain = $address->is_main;
        $address->delete();
        if ($wasMain) {
            $another = $this->address->where('user_id', Auth::id())->first();
            if ($another) {
                $another->update(['is_main' => true]);
            }
        }

        return $this->response->destroy($address);
    }
}

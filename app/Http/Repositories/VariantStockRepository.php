<?php

namespace App\Http\Repositories;

use App\Models\VariantStock;
use App\Traits\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VariantStockRepository
{
    private $response;
    private $model;

    public function __construct(Response $response, VariantStock $model)
    {
        $this->response = $response;
        $this->model = $model;
    }

    private function validate()
    {
        return [
            'variant_uuid' => 'nullable|uuid|exists:variants,uuid',
            'quantity' => 'required|integer|min:0',
            'note' => 'nullable|string',
        ];
    }

    private function request(Request $request): array
    {
        return [
            'variant_uuid' => $request->input('variant_uuid'),
            'quantity' => $request->input('quantity'),
            'note' => $request->input('note'),
        ];
    }

    public function index(Request $request)
    {
        $query = $this->model->with(['variant.product']);

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('note', 'like', "%$search%")
                    ->orWhereHas('variant', function ($q1) use ($search) {
                        $q1->where('name', 'like', "%$search%")
                            ->orWhereHas('product', function ($q2) use ($search) {
                                $q2->where('name', 'like', "%$search%");
                            });
                    });
            });
        }

        $data = $query->orderBy('created_at', 'desc')->get();

        return $data;
    }

    public function index_pagination(Request $request)
    {
        $query = $this->model->with(['variant.product']);

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('note', 'like', "%$search%")
                    ->orWhereHas('variant', function ($q1) use ($search) {
                        $q1->where('name', 'like', "%$search%")
                            ->orWhereHas('product', function ($q2) use ($search) {
                                $q2->where('name', 'like', "%$search%");
                            });
                    });
            });
        }

        $data = $query->orderBy('created_at', 'desc')->paginate(10);

        return $data;
    }

    public function show($uuid)
    {
        $data = $this->model->where('uuid', $uuid)->first();
        if (!$data) {
            return $this->response->notFound();
        }
        return $this->response->index($data);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->validate());

        if ($validator->fails()) {
            return $this->response->validationError($validator->errors());
        }

        $data = $this->request($request);

        if ($request->filled('uuid')) {
            $existing = $this->model->where('uuid', $request->uuid)->first();
            if (!$existing) {
                return $this->response->notFound();
            }
            $updated = $existing->update($data);
            return $updated
                ? $this->response->update($existing)
                : $this->response->updateError();
        } else {
            $data['uuid'] = Str::uuid();
            $created = $this->model->create($data);
            return $created
                ? $this->response->store($created)
                : $this->response->storeError();
        }
    }

    public function destroy($uuid)
    {
        $data = $this->model->where('uuid', $uuid)->first();
        if (!$data) {
            return $this->response->notFound();
        }

        $data->delete();

        return $this->response->destroy($data);
    }
}

<?php

namespace App\Http\Repositories;

use App\Models\TransactionItem;
use App\Models\VariantStock;
use App\Traits\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VariantStockRepository
{
    private $response;
    private $model;
    private $transactionItem;

    public function __construct(Response $response, VariantStock $model, TransactionItem $transactionItem)
    {
        $this->response = $response;
        $this->model = $model;
        $this->transactionItem = $transactionItem;
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
        $query = $this->model->with(['variant.product','user']);

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('note', 'like', "%$search%")->orWhere('via', 'like', "%$search%")
                    ->orWhereHas('user', function ($qUser) use ($search) {
                        $qUser->where('name', 'like', "%$search%");
                    })
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
    public function summary(Request $request)
    {
        $stockInQuery = $this->model->with([
            'variant.product.category',
            'variant.product.brand'
        ]);

        $stockOutQuery = $this->transactionItem->with([
            'variant.product.category',
            'variant.product.brand'
        ])
            ->whereHas('transaction', function ($q) {
                $q->where('status', '>', 0)
                    ->where('status', '<', 5);
            });
        if ($request->filled('search')) {
            $search = $request->input('search');

            $stockInQuery->whereHas('variant', function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhereHas('product', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%$search%")
                            ->orWhereHas('category', fn($q3) => $q3->where('name', 'like', "%$search%"))
                            ->orWhereHas('brand', fn($q4) => $q4->where('name', 'like', "%$search%"));
                    });
            });

            $stockOutQuery->whereHas('variant', function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhereHas('product', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%$search%")
                            ->orWhereHas('category', fn($q3) => $q3->where('name', 'like', "%$search%"))
                            ->orWhereHas('brand', fn($q4) => $q4->where('name', 'like', "%$search%"));
                    });
            });
        }

        if ($request->filled('category')) {
            $category = $request->input('category');
            $stockInQuery->whereHas('variant.product.category', fn($q) => $q->where('name', 'like', "%$category%"));
            $stockOutQuery->whereHas('variant.product.category', fn($q) => $q->where('name', 'like', "%$category%"));
        }

        if ($request->filled('brand')) {
            $brand = $request->input('brand');
            $stockInQuery->whereHas('variant.product.brand', fn($q) => $q->where('name', 'like', "%$brand%"));
            $stockOutQuery->whereHas('variant.product.brand', fn($q) => $q->where('name', 'like', "%$brand%"));
        }

        if ($request->filled('startDate') && $request->filled('endDate')) {
            $start = Carbon::parse($request->startDate)->startOfDay();
            $end   = Carbon::parse($request->endDate)->endOfDay();

            $stockInQuery->whereBetween('created_at', [$start, $end]);
            $stockOutQuery->whereBetween('created_at', [$start, $end]);
        }

        $totalMasuk = (int) $stockInQuery->sum('quantity');
        $totalTerjual = (int) $stockOutQuery->sum('quantity');

        return [
            'barang_masuk' => $totalMasuk,
            'stok_terjual' => $totalTerjual,
        ];
    }


    public function index_pagination(Request $request)
    {
        $query = $this->model->with([
            'variant.product.category',
            'variant.product.brand','user'
        ]);

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('note', 'like', "%$search%")->orWhere('via', 'like', "%$search%")
                    ->orWhereHas('user', function ($qUser) use ($search) {
                        $qUser->where('name', 'like', "%$search%");
                    })
                    ->orWhereHas('variant', function ($q1) use ($search) {
                        $q1->where('name', 'like', "%$search%")
                            ->orWhereHas('product', function ($q2) use ($search) {
                                $q2->where('name', 'like', "%$search%")
                                    ->orWhereHas('category', function ($q3) use ($search) {
                                        $q3->where('name', 'like', "%$search%");
                                    })
                                    ->orWhereHas('brand', function ($q4) use ($search) {
                                        $q4->where('name', 'like', "%$search%");
                                    });
                            });
                    });
            });
        }

        if ($request->filled('category')) {
            $category = $request->input('category');
            $query->whereHas('variant.product.category', function ($q) use ($category) {
                $q->where('name', 'like', "%$category%");
            });
        }

        if ($request->filled('brand')) {
            $brand = $request->input('brand');
            $query->whereHas('variant.product.brand', function ($q) use ($brand) {
                $q->where('name', 'like', "%$brand%");
            });
        }

        if ($request->filled('startDate') && $request->filled('endDate')) {
            $start = Carbon::parse($request->startDate)->startOfDay();
            $end   = Carbon::parse($request->endDate)->endOfDay();

            $query->whereBetween('created_at', [$start, $end]);
        }

        return $query->orderBy('created_at', 'desc')->paginate(10);
    }
    public function export(Request $request)
    {
        $query = $this->model->with([
            'variant.product.category',
            'variant.product.brand'
        ]);

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('note', 'like', "%$search%")
                    ->orWhereHas('variant', function ($q1) use ($search) {
                        $q1->where('name', 'like', "%$search%")
                            ->orWhereHas('product', function ($q2) use ($search) {
                                $q2->where('name', 'like', "%$search%")
                                    ->orWhereHas('category', function ($q3) use ($search) {
                                        $q3->where('name', 'like', "%$search%");
                                    })
                                    ->orWhereHas('brand', function ($q4) use ($search) {
                                        $q4->where('name', 'like', "%$search%");
                                    });
                            });
                    });
            });
        }

        if ($request->filled('category')) {
            $category = $request->input('category');
            $query->whereHas('variant.product.category', function ($q) use ($category) {
                $q->where('name', 'like', "%$category%");
            });
        }

        if ($request->filled('brand')) {
            $brand = $request->input('brand');
            $query->whereHas('variant.product.brand', function ($q) use ($brand) {
                $q->where('name', 'like', "%$brand%");
            });
        }

        if ($request->filled('startDate') && $request->filled('endDate')) {
            $start = Carbon::parse($request->startDate)->startOfDay();
            $end   = Carbon::parse($request->endDate)->endOfDay();

            $query->whereBetween('created_at', [$start, $end]);
        }

        return $query->orderBy('created_at', 'desc')->get();
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

            unset($data['user_id'], $data['via']);

            $updated = $existing->update($data);
            return $updated
                ? $this->response->update($existing)
                : $this->response->updateError();
        } else {
            $data['uuid'] = Str::uuid();
            $data['user_id'] = auth()->id();
            $data['via'] = 'Manual';

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

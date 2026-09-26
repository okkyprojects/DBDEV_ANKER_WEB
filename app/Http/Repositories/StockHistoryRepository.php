<?php

namespace App\Http\Repositories;

use App\Models\StockHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class StockHistoryRepository
{
    private $model;

    public function __construct(StockHistory $model)
    {
        $this->model = $model;
    }

    public function index_pagination(Request $request)
    {
        $query = $this->model->with(['variant.product', 'user']);

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->whereHas('variant', function ($q) use ($search) {
                $q->where('sku', 'like', "%$search%")
                    ->orWhereHas('product', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%$search%");
                    });
            });
        }

        if ($request->filled('sku')) {
            $sku = $request->input('sku');
            $query->whereHas('variant', function ($q) use ($sku) {
                $q->where('sku', 'like', "%$sku%");
            });
        }

        if ($request->filled('product')) {
            $product = $request->input('product');
            $query->whereHas('variant.product', function ($q) use ($product) {
                $q->where('name', 'like', "%$product%");
            });
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        if ($request->filled('startDate') && $request->filled('endDate')) {
            $start = Carbon::parse($request->startDate)->startOfDay();
            $end = Carbon::parse($request->endDate)->endOfDay();

            $query->whereBetween('created_at', [$start, $end]);
        }

        return $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();
    }
}

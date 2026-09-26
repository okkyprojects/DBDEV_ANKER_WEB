<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Repositories\StockHistoryRepository;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockHistoryController extends Controller
{
    private $stockHistory;

    public function __construct(StockHistoryRepository $stockHistory)
    {
        $this->middleware('permission:stock-history-index', ['only' => ['index']]);
        $this->stockHistory = $stockHistory;
    }

    public function index(Request $request)
    {
        $data['stock_histories'] = $this->stockHistory->index_pagination($request);
        $data['users'] = User::orderBy('name')->get(['id', 'name']);
        return Inertia::render('Stok/History/Index', compact('data'));
    }
}

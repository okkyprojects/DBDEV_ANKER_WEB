<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Repositories\TransactionRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    private $transactionRepository;

    public function __construct(
        TransactionRepository $transactionRepository,
    ) {
        $this->transactionRepository = $transactionRepository;
    }
    public function index(Request $request)
    {
        $data['products'] = $this->transactionRepository->summary_top_selling($request);
        $data['transactions'] = $this->transactionRepository->get_limit_penjualan($request);
        $data['summary'] = $this->transactionRepository->get_penjualan_summary($request);
        $data['chart'] = $this->transactionRepository->get_chart_data($request);
        return Inertia::render('Dashboard/Dashboard', compact('data'));
    }
}

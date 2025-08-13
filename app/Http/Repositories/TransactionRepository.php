<?php

namespace App\Http\Repositories;

use App\Models\Address;
use App\Models\Bill;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\TransactionAddress;
use App\Models\TransactionBill;
use App\Models\Variant;
use App\Models\Cart;
use App\Models\CartItem;
use App\Traits\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionRepository
{
    private $response;
    private $transaction;
    private $transactionItem;
    private $transactionAddress;
    private $transactionBill;
    private $bill;
    private $address;
    private $variant;
    private $cartItem;

    public function __construct(
        Response $response,
        Transaction $transaction,
        TransactionItem $transactionItem,
        TransactionAddress $transactionAddress,
        TransactionBill $transactionBill,
        Bill $bill,
        Address $address,
        Variant $variant,
        CartItem $cartItem,
    ) {
        $this->response = $response;
        $this->transaction = $transaction;
        $this->transactionItem = $transactionItem;
        $this->transactionAddress = $transactionAddress;
        $this->transactionBill = $transactionBill;
        $this->bill = $bill;
        $this->address = $address;
        $this->variant = $variant;
        $this->cartItem = $cartItem;
    }
    public function index_penjualan(Request $request)
    {
        $query = DB::table('products')
            ->select([
                'products.name as product_name',
                'products.uuid as uuid',
                'categories.name as category_name',
                'brands.name as brand_name',
                DB::raw('COALESCE((
                SELECT SUM(vs.quantity)
                FROM variants v
                JOIN variant_stocks vs ON vs.variant_uuid = v.uuid
                WHERE v.product_uuid = products.uuid
            ), 0) as kuantitas'),
                DB::raw('COALESCE(SUM(transaction_items.quantity), 0) as terjual'),
                DB::raw('COALESCE(SUM(transaction_items.quantity * transaction_items.price), 0) as pendapatan'),
            ])
            ->leftJoin('variants', 'products.uuid', '=', 'variants.product_uuid')
            ->leftJoin('transaction_items', 'variants.uuid', '=', 'transaction_items.variant_uuid')
            ->leftJoin('transactions', 'transaction_items.transaction_uuid', '=', 'transactions.uuid')
            ->leftJoin('categories', 'products.category_uuid', '=', 'categories.uuid')
            ->leftJoin('brands', 'products.brand_uuid', '=', 'brands.uuid')
            ->where('transactions.status', '>=', 1)
            ->groupBy('products.uuid', 'products.name', 'categories.name', 'brands.name');

        if ($request->filled('startDate') && $request->filled('endDate')) {
            $start = Carbon::parse($request->startDate)->startOfDay();
            $end   = Carbon::parse($request->endDate)->endOfDay();
            $query->whereBetween('transactions.created_at', [$start, $end]);
        }

        if ($request->filled('category')) {
            $query->where('categories.name', 'LIKE', '%' . $request->category . '%');
        }

        if ($request->filled('brand')) {
            $query->where('brands.name', 'LIKE', '%' . $request->brand . '%');
        }

        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('products.name', 'LIKE', $search)
                    ->orWhere('categories.name', 'LIKE', $search)
                    ->orWhere('brands.name', 'LIKE', $search);
            });
        }

        return $query->paginate(10);
    }
    public function get_chart_data(Request $request)
    {
        $filter = $request->input('filter', 'Harian');
        $now = Carbon::now();
        $year = $now->year;
        $month = $now->month;

        if ($filter === 'Harian') {
            $day = $now->day;
            $lastDay = $now->daysInMonth;
            $startDay = $day >= 16 ? 16 : 1;
            $endDay = $day >= 16 ? $lastDay : 15;

            $categories = [];
            $pendapatan = [];
            $pesanan = [];

            for ($d = $startDay; $d <= $endDay; $d++) {
                $categories[] = $d . ' ' . Str::limit($now->translatedFormat('F'), 3, '');

                $start = Carbon::createFromDate($year, $month, $d)->startOfDay();
                $end = Carbon::createFromDate($year, $month, $d)->endOfDay();

                $pendapatan[] = $this->transaction
                    ->whereBetween('created_at', [$start, $end])
                    ->where('status', '>', 0)
                    ->where('status', '<', 5)
                    ->sum('grand_total');

                $pesanan[] = $this->transaction
                    ->whereBetween('created_at', [$start, $end])
                    ->where('status', '>', 0)
                    ->where('status', '<', 5)
                    ->count();
            }

            return [
                'categories' => $categories,
                'pendapatan' => $pendapatan,
                'pesanan' => $pesanan
            ];
        }

        if ($filter === 'Mingguan') {
            $weeks = ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"];
            $pendapatan = [];
            $pesanan = [];

            foreach (range(1, 4) as $week) {
                $start = Carbon::createFromDate($year, $month, 1)->startOfMonth()->addWeeks($week - 1)->startOfWeek();
                $end = (clone $start)->endOfWeek();

                $pendapatan[] = $this->transaction
                    ->whereBetween('created_at', [$start, $end])
                    ->where('status', '>', 0)
                    ->where('status', '<', 5)
                    ->sum('grand_total');

                $pesanan[] = $this->transaction
                    ->whereBetween('created_at', [$start, $end])
                    ->where('status', '>', 0)
                    ->where('status', '<', 5)
                    ->count();
            }

            return [
                'categories' => $weeks,
                'pendapatan' => $pendapatan,
                'pesanan' => $pesanan
            ];
        }

        if ($filter === 'Bulanan') {
            $months = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'Mei',
                'Jun',
                'Jul',
                'Agu',
                'Sep',
                'Okt',
                'Nov',
                'Des'
            ];
            $pendapatan = [];
            $pesanan = [];

            foreach (range(1, 12) as $m) {
                $start = Carbon::createFromDate($year, $m, 1)->startOfMonth();
                $end = Carbon::createFromDate($year, $m, 1)->endOfMonth();

                $pendapatan[] = $this->transaction
                    ->whereBetween('created_at', [$start, $end])
                    ->where('status', '>', 0)
                    ->where('status', '<', 5)
                    ->sum('grand_total');

                $pesanan[] = $this->transaction
                    ->whereBetween('created_at', [$start, $end])
                    ->where('status', '>', 0)
                    ->where('status', '<', 5)
                    ->count();
            }

            return [
                'categories' => $months,
                'pendapatan' => $pendapatan,
                'pesanan' => $pesanan
            ];
        }

        return [
            'categories' => [],
            'pendapatan' => [],
            'pesanan' => []
        ];
    }
    public function get_chart_data_by_product($request, $uuid)
    {
        $filter = $request->input('filter', 'Harian');
        $productUuid = $uuid;
        $now = Carbon::now();
        $year = $now->year;
        $month = $now->month;

        $baseQuery = $this->transaction
            ->join('transaction_items', 'transactions.uuid', '=', 'transaction_items.transaction_uuid')
            ->join('variants', 'transaction_items.variant_uuid', '=', 'variants.uuid')
            ->join('products', 'variants.product_uuid', '=', 'products.uuid')
            ->where('transactions.status', '>', 0)
            ->where('transactions.status', '<', 5);

        if ($productUuid) {
            $baseQuery->where('products.uuid', $productUuid);
        }

        if ($filter === 'Harian') {
            $day = $now->day;
            $lastDay = $now->daysInMonth;
            $startDay = $day >= 16 ? 16 : 1;
            $endDay = $day >= 16 ? $lastDay : 15;

            $categories = [];
            $pendapatan = [];
            $pesanan = [];

            for ($d = $startDay; $d <= $endDay; $d++) {
                $categories[] = $d . ' ' . Str::limit($now->translatedFormat('F'), 3, '');

                $start = Carbon::createFromDate($year, $month, $d)->startOfDay();
                $end = Carbon::createFromDate($year, $month, $d)->endOfDay();

                $pendapatan[] = (clone $baseQuery)
                    ->whereBetween('transactions.created_at', [$start, $end])
                    ->sum(DB::raw('transaction_items.price * transaction_items.quantity'));

                $pesanan[] = (clone $baseQuery)
                    ->whereBetween('transactions.created_at', [$start, $end])
                    ->distinct('transactions.uuid')
                    ->count('transactions.uuid');
            }

            return [
                'categories' => $categories,
                'pendapatan' => $pendapatan,
                'pesanan' => $pesanan
            ];
        }

        if ($filter === 'Mingguan') {
            $weeks = ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"];
            $pendapatan = [];
            $pesanan = [];

            foreach (range(1, 4) as $week) {
                $start = Carbon::createFromDate($year, $month, 1)->startOfMonth()->addWeeks($week - 1)->startOfWeek();
                $end = (clone $start)->endOfWeek();

                $pendapatan[] = (clone $baseQuery)
                    ->whereBetween('transactions.created_at', [$start, $end])
                    ->sum(DB::raw('transaction_items.price * transaction_items.quantity'));

                $pesanan[] = (clone $baseQuery)
                    ->whereBetween('transactions.created_at', [$start, $end])
                    ->distinct('transactions.uuid')
                    ->count('transactions.uuid');
            }

            return [
                'categories' => $weeks,
                'pendapatan' => $pendapatan,
                'pesanan' => $pesanan
            ];
        }

        if ($filter === 'Bulanan') {
            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            $pendapatan = [];
            $pesanan = [];

            foreach (range(1, 12) as $m) {
                $start = Carbon::createFromDate($year, $m, 1)->startOfMonth();
                $end = Carbon::createFromDate($year, $m, 1)->endOfMonth();

                $pendapatan[] = (clone $baseQuery)
                    ->whereBetween('transactions.created_at', [$start, $end])
                    ->sum(DB::raw('transaction_items.price * transaction_items.quantity'));

                $pesanan[] = (clone $baseQuery)
                    ->whereBetween('transactions.created_at', [$start, $end])
                    ->distinct('transactions.uuid')
                    ->count('transactions.uuid');
            }

            return [
                'categories' => $months,
                'pendapatan' => $pendapatan,
                'pesanan' => $pesanan
            ];
        }

        return [
            'categories' => [],
            'pendapatan' => [],
            'pesanan' => []
        ];
    }


    public function get_limit_penjualan(Request $request, $limit = 5)
    {
        $query = $this->transaction
            ->with([
                'user',
                'items',
                'address.province',
                'address.city',
                'address.district',
                'bill'
            ])
            ->orderBy('created_at', 'desc');

        if (Auth::user()->role !== 'admin') {
            $query->where('user_id', Auth::id());
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('uuid', 'like', "%$search%")
                    ->orWhere('transaction_code', 'like', "%$search%")
                    ->orWhere('note', 'like', "%$search%")
                    ->orWhere('total_price', 'like', "%$search%")
                    ->orWhere('grand_total', 'like', "%$search%")
                    ->orWhere('admin_fee', 'like', "%$search%")
                    ->orWhere('status', 'like', "%$search%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('startDate') && $request->filled('endDate')) {
            $start = Carbon::parse($request->startDate)->startOfDay();
            $end   = Carbon::parse($request->endDate)->endOfDay();
            $query->whereBetween('created_at', [$start, $end]);
        }

        return $query->limit($limit)->get();
    }
    public function summary_top_selling($request, $limit = 5)
    {
        $query = Variant::with(['product', 'total_stock'])
            ->select(
                'variants.uuid',
                'variants.product_uuid',
                'variants.name',
                'variants.price',
                'variants.created_at',
                'variants.updated_at',
                DB::raw('COALESCE(SUM(transaction_items.quantity), 0) as total_sold')
            )
            ->leftJoin('transaction_items', 'transaction_items.variant_uuid', '=', 'variants.uuid')
            ->leftJoin('transactions', 'transactions.uuid', '=', 'transaction_items.transaction_uuid')
            ->where('transactions.status', '>', 0)
            ->where('transactions.status', '<', 5);

        if ($request->startDate && $request->endDate) {
            $startDate = Carbon::parse($request->startDate)->startOfDay();
            $endDate = Carbon::parse($request->endDate)->endOfDay();

            $query->whereBetween('transaction_items.created_at', [$startDate, $endDate]);
        }

        return $query
            ->groupBy(
                'variants.uuid',
                'variants.product_uuid',
                'variants.name',
                'variants.price',
                'variants.created_at',
                'variants.updated_at'
            )
            ->orderByDesc('total_sold')
            ->take($limit)
            ->get()
            ->map(function ($variant) {
                return [
                    'product' => $variant->product,
                    'stok_saat_ini' => $variant->total_stock->total_stock ?? 0,
                    'terjual' => (int) $variant->total_sold
                ];
            });
    }


    public function get_penjualan_summary(Request $request)
    {
        $query = DB::table('transaction_items')
            ->join('transactions', 'transaction_items.transaction_uuid', '=', 'transactions.uuid')
            ->join('variants', 'transaction_items.variant_uuid', '=', 'variants.uuid')
            ->join('products', 'variants.product_uuid', '=', 'products.uuid')
            ->leftJoin('categories', 'products.category_uuid', '=', 'categories.uuid')
            ->leftJoin('brands', 'products.brand_uuid', '=', 'brands.uuid')
            ->where('transactions.status', '>=', 1);

        if ($request->filled('startDate') && $request->filled('endDate')) {
            $start = Carbon::parse($request->startDate)->startOfDay();
            $end   = Carbon::parse($request->endDate)->endOfDay();
            $query->whereBetween('transactions.created_at', [$start, $end]);
        }

        if ($request->filled('category')) {
            $query->where('categories.name', 'LIKE', '%' . $request->category . '%');
        }
        if ($request->filled('brand')) {
            $query->where('brands.name', 'LIKE', '%' . $request->brand . '%');
        }
        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('products.name', 'LIKE', $search)
                    ->orWhere('categories.name', 'LIKE', $search)
                    ->orWhere('brands.name', 'LIKE', $search);
            });
        }
        $result = $query->selectRaw('
        COALESCE(SUM(transaction_items.quantity * transaction_items.price), 0) as pendapatan_kotor,
        COUNT(DISTINCT transactions.uuid) as total_pesanan,
        COALESCE(SUM(transaction_items.quantity), 0) as item_terjual
    ')->first();

        return [
            'pendapatan_kotor' => (int) $result->pendapatan_kotor,
            'total_pesanan'    => (int) $result->total_pesanan,
            'item_terjual'     => (int) $result->item_terjual,
        ];
    }

    public function get_summary_detail_by_product(Request $request, $productUuid)
    {
        $subKuantitas = DB::table('variant_stocks')
            ->select('variant_uuid', DB::raw('SUM(quantity) as total_stok'))
            ->groupBy('variant_uuid');

        $rekap = DB::table('variants')
            ->leftJoinSub($subKuantitas, 'vs', function ($join) {
                $join->on('variants.uuid', '=', 'vs.variant_uuid');
            })
            ->leftJoin('transaction_items', 'variants.uuid', '=', 'transaction_items.variant_uuid')
            ->leftJoin('transactions', 'transaction_items.transaction_uuid', '=', 'transactions.uuid')
            ->where('variants.product_uuid', $productUuid)
            ->when($request->filled('startDate') && $request->filled('endDate'), function ($q) use ($request) {
                $start = Carbon::parse($request->startDate)->startOfDay();
                $end = Carbon::parse($request->endDate)->endOfDay();
                $q->whereBetween('transactions.created_at', [$start, $end]);
            })
            ->where(function ($q) {
                $q->where('transactions.status', '>', 0)
                    ->where('transactions.status', '<', 5);
            })
            ->selectRaw('
            COALESCE(SUM(vs.total_stok), 0) as total_stok,
            COALESCE(SUM(transaction_items.quantity), 0) as total_terjual,
            COALESCE(SUM(transaction_items.quantity * transaction_items.price), 0) as total_pendapatan
        ')
            ->first();

        return [
            'total_stok' => (int) $rekap->total_stok,
            'total_terjual' => (int) $rekap->total_terjual,
            'total_pendapatan' => (int) $rekap->total_pendapatan,
            'stok_tersisa' => (int) $rekap->total_stok - (int) $rekap->total_terjual,
        ];
    }
    public function export_penjualan_by_product(Request $request, $productUuid)
    {
        $query = DB::table('variants')
            ->select([
                'variants.name as variant_name',
                'variants.img as variant_img',
                'categories.name as category_name',
                'brands.name as brand_name',
                DB::raw('COALESCE((
                SELECT SUM(vs.quantity)
                FROM variant_stocks vs
                WHERE vs.variant_uuid = variants.uuid
            ), 0) as kuantitas'),
                DB::raw('COALESCE(SUM(transaction_items.quantity), 0) as terjual'),
                DB::raw('COALESCE(SUM(transaction_items.quantity * transaction_items.price), 0) as pendapatan')
            ])
            ->leftJoin('products', 'variants.product_uuid', '=', 'products.uuid')
            ->leftJoin('categories', 'products.category_uuid', '=', 'categories.uuid')
            ->leftJoin('brands', 'products.brand_uuid', '=', 'brands.uuid')
            ->leftJoin('transaction_items', 'variants.uuid', '=', 'transaction_items.variant_uuid')
            ->leftJoin('transactions', 'transaction_items.transaction_uuid', '=', 'transactions.uuid')
            ->where('variants.product_uuid', $productUuid)
            ->when($request->filled('startDate') && $request->filled('endDate'), function ($q) use ($request) {
                $start = Carbon::parse($request->startDate)->startOfDay();
                $end = Carbon::parse($request->endDate)->endOfDay();
                $q->whereBetween('transactions.created_at', [$start, $end]);
            })
            ->where(function ($q) {
                $q->whereNull('transactions.status')
                    ->orWhere('transactions.status', '>=', 1);
            })
            ->groupBy('variants.uuid', 'variants.name', 'categories.name', 'brands.name')->get();

        return $query;
    }
    public function show_penjualan_by_product(Request $request, $productUuid)
    {
        $query = DB::table('variants')
            ->select([
                'variants.name as variant_name',
                'variants.img as variant_img',
                'categories.name as category_name',
                'brands.name as brand_name',
                DB::raw('COALESCE((
                SELECT SUM(vs.quantity)
                FROM variant_stocks vs
                WHERE vs.variant_uuid = variants.uuid
            ), 0) as kuantitas'),
                DB::raw('COALESCE(SUM(transaction_items.quantity), 0) as terjual'),
                DB::raw('COALESCE(SUM(transaction_items.quantity * transaction_items.price), 0) as pendapatan')
            ])
            ->leftJoin('products', 'variants.product_uuid', '=', 'products.uuid')
            ->leftJoin('categories', 'products.category_uuid', '=', 'categories.uuid')
            ->leftJoin('brands', 'products.brand_uuid', '=', 'brands.uuid')
            ->leftJoin('transaction_items', 'variants.uuid', '=', 'transaction_items.variant_uuid')
            ->leftJoin('transactions', 'transaction_items.transaction_uuid', '=', 'transactions.uuid')
            ->where('variants.product_uuid', $productUuid)
            ->when($request->filled('startDate') && $request->filled('endDate'), function ($q) use ($request) {
                $start = Carbon::parse($request->startDate)->startOfDay();
                $end = Carbon::parse($request->endDate)->endOfDay();
                $q->whereBetween('transactions.created_at', [$start, $end]);
            })
            ->where(function ($q) {
                $q->where('transactions.status', '>', 0)
                    ->where('transactions.status', '<', 5);
            })

            ->groupBy('variants.uuid', 'variants.name', 'categories.name', 'brands.name')->paginate(10);

        return $query;
    }


    public function index(Request $request)
    {
        $query = $this->transaction
            ->with([
                'user',
                'items',
                'address.province',
                'address.city',
                'address.district',
                'bill'
            ])
            ->orderBy('created_at', 'desc');

        if (Auth::user()->role !== 'admin') {
            $query->where('user_id', Auth::id());
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('uuid', 'like', "%$search%")
                    ->orWhere('transaction_code', 'like', "%$search%")
                    ->orWhere('note', 'like', "%$search%")
                    ->orWhere('total_price', 'like', "%$search%")
                    ->orWhere('grand_total', 'like', "%$search%")
                    ->orWhere('admin_fee', 'like', "%$search%")
                    ->orWhere('status', 'like', "%$search%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('startDate') && $request->filled('endDate')) {
            $start = Carbon::parse($request->startDate)->startOfDay();
            $end   = Carbon::parse($request->endDate)->endOfDay();
            $query->whereBetween('created_at', [$start, $end]);
        }

        return $query->paginate(10);
    }
    public function summary_index(Request $request)
    {
        $baseQuery = $this->transaction->query();

        if (Auth::user()->role !== 'admin') {
            $baseQuery->where('user_id', Auth::id());
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $baseQuery->where(function ($q) use ($search) {
                $q->where('uuid', 'like', "%$search%")
                    ->orWhere('transaction_code', 'like', "%$search%")
                    ->orWhere('note', 'like', "%$search%")
                    ->orWhere('total_price', 'like', "%$search%")
                    ->orWhere('grand_total', 'like', "%$search%")
                    ->orWhere('admin_fee', 'like', "%$search%")
                    ->orWhere('status', 'like', "%$search%");
            });
        }

        if ($request->filled('startDate') && $request->filled('endDate')) {
            $start = Carbon::parse($request->startDate)->startOfDay();
            $end   = Carbon::parse($request->endDate)->endOfDay();
            $baseQuery->whereBetween('created_at', [$start, $end]);
        }
        $counts = [
            'pesanan_selesai'         => (clone $baseQuery)->where('status', 4)->count(),
            'pesanan_belum_diproses'  => (clone $baseQuery)->where('status', 1)->count(),
            'pesanan_dikirim'         => (clone $baseQuery)->where('status', 3)->count(),
            'pesanan_ditolak'         => (clone $baseQuery)->where('status', 5)->count(),
        ];

        return $counts;
    }

    public function export_pesanan(Request $request)
    {
        $query = $this->transaction
            ->with([
                'user',
                'items',
                'address.province',
                'address.city',
                'address.district',
                'bill'
            ])
            ->orderBy('created_at', 'desc');

        if (Auth::user()->role !== 'admin') {
            $query->where('user_id', Auth::id());
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('uuid', 'like', "%$search%")
                    ->orWhere('transaction_code', 'like', "%$search%")
                    ->orWhere('note', 'like', "%$search%")
                    ->orWhere('total_price', 'like', "%$search%")
                    ->orWhere('grand_total', 'like', "%$search%")
                    ->orWhere('admin_fee', 'like', "%$search%")
                    ->orWhere('status', 'like', "%$search%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('startDate') && $request->filled('endDate')) {
            $start = Carbon::parse($request->startDate)->startOfDay();
            $end   = Carbon::parse($request->endDate)->endOfDay();
            $query->whereBetween('created_at', [$start, $end]);
        }

        return $query->get();
    }
    public function export_penjualan(Request $request)
    {
        $query = DB::table('products')
            ->select([
                'products.name as product_name',
                'products.uuid as uuid',
                'categories.name as category_name',
                'brands.name as brand_name',
                DB::raw('COALESCE((
                SELECT SUM(vs.quantity)
                FROM variants v
                JOIN variant_stocks vs ON vs.variant_uuid = v.uuid
                WHERE v.product_uuid = products.uuid
            ), 0) as kuantitas'),
                DB::raw('COALESCE(SUM(transaction_items.quantity), 0) as terjual'),
                DB::raw('COALESCE(SUM(transaction_items.quantity * transaction_items.price), 0) as pendapatan'),
            ])
            ->leftJoin('variants', 'products.uuid', '=', 'variants.product_uuid')
            ->leftJoin('transaction_items', 'variants.uuid', '=', 'transaction_items.variant_uuid')
            ->leftJoin('transactions', 'transaction_items.transaction_uuid', '=', 'transactions.uuid')
            ->leftJoin('categories', 'products.category_uuid', '=', 'categories.uuid')
            ->leftJoin('brands', 'products.brand_uuid', '=', 'brands.uuid')
            ->where('transactions.status', '>=', 1)
            ->groupBy('products.uuid', 'products.name', 'categories.name', 'brands.name');

        if ($request->filled('startDate') && $request->filled('endDate')) {
            $start = Carbon::parse($request->startDate)->startOfDay();
            $end   = Carbon::parse($request->endDate)->endOfDay();
            $query->whereBetween('transactions.created_at', [$start, $end]);
        }

        if ($request->filled('category')) {
            $query->where('categories.name', 'LIKE', '%' . $request->category . '%');
        }

        if ($request->filled('brand')) {
            $query->where('brands.name', 'LIKE', '%' . $request->brand . '%');
        }

        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('products.name', 'LIKE', $search)
                    ->orWhere('categories.name', 'LIKE', $search)
                    ->orWhere('brands.name', 'LIKE', $search);
            });
        }

        return $query->get();
    }
    public function show($transaction_code)
    {
        $transaction = $this->transaction
            ->with([
                'user',
                'items',
                'address.province',
                'address.city',
                'address.district',
                'bill'
            ])
            ->where('transaction_code', $transaction_code)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if (!$transaction) {
            return $this->response->notFound('Data transaksi tidak ditemukan');
        }

        return $transaction;
    }

    protected function generateTransactionCode(): string
    {
        do {
            $random = strtoupper(Str::random(10));
            $code = 'ANKER-' . $random;
        } while ($this->transaction->where('transaction_code', $code)->exists());

        return $code;
    }

    public function store($request)
    {
        $validator = Validator::make($request->all(), $this->validate());

        if ($validator->fails()) {
            return $this->response->validationError($validator->errors());
        }

        if (!empty($request['uuid'])) {
            return $this->update($request);
        }

        $uuid = (string) Str::uuid();
        $transaction_code = $this->generateTransactionCode();
        $total_price = 0;
        $items = [];

        foreach ($request['items'] as $item) {
            $variant = $this->variant->with('product')->where('uuid', $item['variant_uuid'])->first();

            if (!$variant) {
                return $this->response->validationError([
                    'items' => ['Variant tidak ditemukan untuk salah satu item.']
                ]);
            }

            $price = $variant->price;
            $quantity = $item['quantity'];
            $total_price += $price * $quantity;

            $items[] = [
                'uuid'             => Str::uuid(),
                'transaction_uuid' => $uuid,
                'transaction_code' => $transaction_code,
                'variant_uuid'     => $variant->uuid,
                'product_name'     => $variant->product->name,
                'variant_name'     => $variant->name,
                'img'              => $variant->img,
                'quantity'         => $quantity,
                'price'            => $price,
            ];
        }
        $variantUuids = collect($request['items'])->pluck('variant_uuid')->toArray();
        $this->cartItem
            ->whereHas('cart', function ($q) use ($request) {
                $q->where('user_id', $request['user_id']);
            })
            ->whereIn('variant_uuid', $variantUuids)
            ->delete();
        $admin_fee = 0;
        $grand_total = $total_price + $admin_fee;

        $trxData = $this->request($request);
        $trxData['uuid'] = $uuid;
        $trxData['transaction_code'] = $transaction_code;
        $trxData['total_price'] = $total_price;
        $trxData['admin_fee'] = $admin_fee;
        $trxData['grand_total'] = $grand_total;

        $transaction = $this->transaction->create($trxData);

        $address = $this->address->where('uuid', $request['address_uuid'])->first();
        $this->transactionAddress->create([
            'uuid'              => Str::uuid(),
            'transaction_uuid'  => $uuid,
            'user_id'           => $address->user_id,
            'province_id'       => $address->province_id,
            'city_id'           => $address->city_id,
            'district_id'       => $address->district_id,
            'category'          => $address->category,
            'name'              => $address->name,
            'phone_number'      => $address->phone_number,
            'is_main'           => $address->is_main,
            'address'           => $address->address,
            'postal_code'       => $address->postal_code,
            'note'              => $address->note,
        ]);

        $bill = $this->bill->where('uuid', $request['bill_uuid'])->first();
        $this->transactionBill->create([
            'uuid'                 => Str::uuid(),
            'transaction_uuid'     => $uuid,
            'account_number'       => $bill->account_number,
            'bank_name'            => $bill->bank_name,
            'account_holder_name'  => $bill->account_holder_name,
            'is_main'              => $bill->is_main,
        ]);

        foreach ($items as $itemData) {
            $this->transactionItem->create($itemData);
        }

        return $this->response->store($transaction);
    }

    private function update($request)
    {
        $trx = $this->transaction->where('uuid', $request['uuid'])->first();

        if (!$trx) {
            return $this->response->notFound('Transaksi tidak ditemukan berdasarkan kode transaksi.');
        }

        $updateData = $this->request($request, $trx);
        if (isset($updateData['file']) && $trx->file) {
            Storage::disk('public')->delete(str_replace('storage/', '', $trx->file));
        }

        $trx->fill($updateData);
        $trx->save();

        return $this->response->update($trx);
    }

    public function destroy($uuid)
    {
        $trx = $this->transaction->where('uuid', $uuid)->first();
        if (!$trx) {
            return $this->response->notFound();
        }

        $trx->items()->delete();
        $trx->address()->delete();
        $deleted = $trx->delete();

        return $deleted
            ? $this->response->destroy($trx)
            : $this->response->destroyError();
    }

    private function request(Request $request, $trx = null): array
    {
        $data = [
            'uuid'             => $request->input('uuid', $trx?->uuid ?? (string) Str::uuid()),
            'transaction_code' => $request->input('transaction_code', $trx?->transaction_code ?? $this->generateTransactionCode()),
            'user_id'          => $trx?->user_id ?? Auth::id(),
            'total_price'      => $request->input('total_price', $trx?->total_price),
            'admin_fee'        => $request->input('admin_fee', $trx?->admin_fee),
            'grand_total'      => $request->input('grand_total', $trx?->grand_total),
            'status' => $request->input('status', $trx?->status ?? 0),
            'paid_at'          => $request->input('paid_at', $trx?->paid_at),
            'unpaid_at'        => $request->input('unpaid_at', $trx?->unpaid_at),
            'expired_at'       => $request->input('expired_at', $trx?->expired_at),
            'processing_at'  => $request->input('processing_at', $trx?->processing_at),
            'shipping_at'    => $request->input('shipping_at', $trx?->shipping_at),
            'completed_at'   => $request->input('completed_at', $trx?->completed_at),
            'canceled_at'    => $request->input('canceled_at', $trx?->canceled_at),
            'note'             => $request->input('note', $trx?->note),
        ];

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '-' . $file->getClientOriginalName();
            $path = $file->storeAs('transaction-files', $filename, 'public');
            $data['file'] = 'storage/' . $path;
        }

        return $data;
    }

    private function validate(): array
    {
        return [
            'items' => 'nullable|array|min:1',
            'items.*.variant_uuid' => 'nullable|exists:variants,uuid',
            'items.*.quantity' => 'nullable|integer|min:1',
            'address_uuid' => 'nullable|exists:addresses,uuid',
            'bill_uuid' => 'nullable|exists:bills,uuid',
            'note' => 'nullable|string',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf',
        ];
    }
}

<?php

namespace App\Http\Repositories;

use App\Models\Product;
use App\Models\Promo;
use App\Models\TransactionItem;
use App\Models\Variant;
use App\Traits\Response;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PromoRepository
{
    private $response;
    private $promo;
    private $product;
    private $variant;
    private $transactionItem;
    private $notificationRepository;

    public function __construct(
        Response $response,
        Promo $promo,
        Product $product,
        Variant $variant,
        TransactionItem $transactionItem,
        NotificationRepository $notificationRepository
    ) {
        $this->response = $response;
        $this->promo = $promo;
        $this->product = $product;
        $this->variant = $variant;
        $this->transactionItem = $transactionItem;
        $this->notificationRepository = $notificationRepository;
    }

    private function validate(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:qty,value',
            'product_uuid' => 'required|exists:products,uuid',
            'min_purchase' => 'required|integer|min:1',
            'free_variant_uuid' => 'required|exists:variants,uuid',
            'free_quantity' => 'required|integer|min:1',
            'quota' => 'required|integer|min:1',
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date|after_or_equal:start_at',
            'is_active' => 'nullable|boolean',
        ];
    }

    private function request(Request $request): array
    {
        return [
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'type' => $request->input('type'),
            'product_uuid' => $request->input('product_uuid'),
            'min_purchase' => $request->input('min_purchase'),
            'free_variant_uuid' => $request->input('free_variant_uuid'),
            'free_quantity' => $request->input('free_quantity'),
            'quota' => $request->input('quota'),
            'start_at' => $request->input('start_at'),
            'end_at' => $request->input('end_at'),
            'is_active' => $request->input('is_active', true),
        ];
    }

    /**
     * Promo yang sedang berjalan dan kuotanya masih ada
     */
    private function active()
    {
        $now = Carbon::now();

        return $this->promo
            ->where('is_active', true)
            ->whereColumn('used_quota', '<', 'quota')
            ->where(function ($q) use ($now) {
                $q->whereNull('start_at')->orWhere('start_at', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('end_at')->orWhere('end_at', '>=', $now);
            });
    }

    public function index_pagination(Request $request)
    {
        $query = $this->promo->with(['product', 'free_variant.product']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhereHas('product', function ($q) use ($search) {
                        $q->where('name', 'like', "%$search%");
                    })
                    ->orWhereHas('free_variant', function ($q) use ($search) {
                        $q->where('name', 'like', "%$search%")
                            ->orWhere('sku', 'like', "%$search%");
                    });
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate(10);
    }

    public function index_api(Request $request)
    {
        return $this->active()
            ->with(['product', 'free_variant.product'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function product_options()
    {
        return $this->product->orderBy('name')->get(['uuid', 'code', 'name']);
    }

    public function variant_options()
    {
        return $this->variant
            ->with('product:uuid,name')
            ->whereHas('product')
            ->orderBy('name')
            ->get(['uuid', 'product_uuid', 'name', 'sku', 'stock']);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->validate());
        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        $data = $this->request($request);

        if ($request->filled('uuid')) {
            $promo = $this->promo->where('uuid', $request->uuid)->first();
            if (!$promo) {
                return $this->response->notFound();
            }

            if ($data['quota'] < $promo->used_quota) {
                throw ValidationException::withMessages([
                    'quota' => ["Kuota tidak boleh kurang dari kuota yang sudah terpakai ({$promo->used_quota})."],
                ]);
            }

            $updated = $promo->update($data);

            return $updated
                ? $this->response->update($promo)
                : $this->response->updateError();
        }

        $data['uuid'] = Str::uuid();
        $promo = $this->promo->create($data);

        return $promo
            ? $this->response->store($promo)
            : $this->response->storeError();
    }

    public function destroy($uuid)
    {
        $promo = $this->promo->where('uuid', $uuid)->first();

        if (!$promo) {
            return $this->response->notFound();
        }

        $promo->delete();
        return $this->response->destroy($promo);
    }

    public function notify($uuid)
    {
        $promo = $this->promo->with(['product', 'free_variant.product'])->where('uuid', $uuid)->first();

        if (!$promo) {
            throw ValidationException::withMessages([
                'promo' => ['Promo tidak ditemukan.'],
            ]);
        }

        return $this->notificationRepository->send_to_all(
            $promo->name,
            $promo->description ?: $this->describe($promo),
            [
                'type' => 'promo',
                'promo_uuid' => $promo->uuid,
            ]
        );
    }

    public function describe($promo)
    {
        $freeItem = ($promo->free_variant->product->name ?? '-') . ' - ' . ($promo->free_variant->name ?? '-');
        $product = $promo->product->name ?? '-';

        if ($promo->type === 'value') {
            return "Belanja {$product} kelipatan Rp " . number_format($promo->min_purchase, 0, ',', '.') . " gratis {$promo->free_quantity} pcs {$freeItem}. Kuota terbatas!";
        }

        return "Beli {$product} kelipatan {$promo->min_purchase} pcs gratis {$promo->free_quantity} pcs {$freeItem}. Kuota terbatas!";
    }

    public function check(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.variant_uuid' => 'required|exists:variants,uuid',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return $this->response->validationError($validator->errors());
        }

        $data = $this->format_free_items($this->free_items($request->input('items')));
        return $this->response->index($data);
    }

    /**
     * Hitung barang gratis dari item yang dibeli.
     * Berlaku kelipatan & dibulatkan ke bawah (beli 60 dengan syarat 40 = gratis 1x),
     * dibatasi sisa kuota promo dan stok barang gratis.
     *
     * @param array $items [['variant_uuid' => ..., 'quantity' => ...], ...]
     */
    public function free_items(array $items)
    {
        $items = collect($items)->filter(function ($item) {
            return empty($item['is_free']) && !empty($item['variant_uuid']) && (int) ($item['quantity'] ?? 0) > 0;
        });

        if ($items->isEmpty()) {
            return [];
        }

        $variants = $this->variant->whereIn('uuid', $items->pluck('variant_uuid'))->get()->keyBy('uuid');

        $purchases = [];
        $orderedQty = [];
        foreach ($items as $item) {
            $variant = $variants->get($item['variant_uuid']);
            if (!$variant || !$variant->product_uuid) {
                continue;
            }

            $quantity = (int) $item['quantity'];
            $purchases[$variant->product_uuid]['qty'] = ($purchases[$variant->product_uuid]['qty'] ?? 0) + $quantity;
            $purchases[$variant->product_uuid]['value'] = ($purchases[$variant->product_uuid]['value'] ?? 0) + ($variant->price * $quantity);
            $orderedQty[$variant->uuid] = ($orderedQty[$variant->uuid] ?? 0) + $quantity;
        }

        $promos = $this->active()
            ->with('free_variant.product')
            ->whereIn('product_uuid', array_keys($purchases))
            ->orderBy('created_at')
            ->get();

        $freeItems = [];
        foreach ($promos as $promo) {
            $variant = $promo->free_variant;
            if (!$variant || !$variant->product) {
                continue;
            }

            $purchased = (int) ($purchases[$promo->product_uuid][$promo->type] ?? 0);
            $quantity = intdiv($purchased, $promo->min_purchase) * $promo->free_quantity;

            // stok barang gratis dikurangi yang ikut dibeli (harga normal) di pesanan yang sama
            $availableStock = $variant->stock - ($orderedQty[$variant->uuid] ?? 0);
            $quantity = min($quantity, $promo->quota - $promo->used_quota, $availableStock);

            if ($quantity <= 0) {
                continue;
            }

            $orderedQty[$variant->uuid] = ($orderedQty[$variant->uuid] ?? 0) + $quantity;
            $freeItems[] = [
                'promo' => $promo,
                'variant' => $variant,
                'quantity' => $quantity,
            ];
        }

        return $freeItems;
    }

    /**
     * Ambil kuota promo saat checkout (first come, first served).
     */
    public function claim_free_items(array $items)
    {
        return DB::transaction(function () use ($items) {
            $freeItems = [];

            foreach ($this->free_items($items) as $free) {
                // kunci baris promo agar kuota tidak terpakai melebihi batas saat checkout bersamaan
                $promo = $this->promo->where('uuid', $free['promo']->uuid)->lockForUpdate()->first();
                $quantity = min($free['quantity'], $promo->quota - $promo->used_quota);

                if ($quantity <= 0) {
                    continue;
                }

                $promo->increment('used_quota', $quantity);
                $free['quantity'] = $quantity;
                $freeItems[] = $free;
            }

            return $freeItems;
        });
    }

    /**
     * Kembalikan kuota promo ketika pesanan dibatalkan / kadaluarsa / dihapus.
     */
    public function release_quota($transactionUuid)
    {
        $items = $this->transactionItem
            ->where('transaction_uuid', $transactionUuid)
            ->where('is_free', true)
            ->whereNotNull('promo_uuid')
            ->get();

        foreach ($items as $item) {
            $this->promo
                ->where('uuid', $item->promo_uuid)
                ->where('used_quota', '>=', $item->quantity)
                ->decrement('used_quota', $item->quantity);
        }
    }

    public function format_free_items(array $freeItems)
    {
        $data = [];

        foreach ($freeItems as $free) {
            $data[] = [
                'itemcart_uuid'   => null,
                'variant_uuid'    => $free['variant']->uuid,
                'variant_name'    => $free['variant']->name,
                'variant_sku'     => $free['variant']->sku,
                'quantity'        => $free['quantity'],
                'discount_price'  => 0,
                'price'           => 0,
                'product_uuid'    => $free['variant']->product->uuid,
                'product_name'    => $free['variant']->product->name,
                'img'             => $free['variant']->img,
                'stock'           => $free['variant']->stock,
                'is_free'         => true,
                'promo_uuid'      => $free['promo']->uuid,
                'promo_name'      => $free['promo']->name,
            ];
        }

        return $data;
    }
}

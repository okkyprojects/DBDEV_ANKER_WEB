<?php

namespace App\Http\Repositories;

use App\Models\Address;
use App\Models\Bill;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\TransactionAddress;
use App\Models\TransactionBill;
use App\Models\Variant;
use App\Traits\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

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

    public function __construct(
        Response $response,
        Transaction $transaction,
        TransactionItem $transactionItem,
        TransactionAddress $transactionAddress,
        TransactionBill $transactionBill,
        Bill $bill,
        Address $address,
        Variant $variant,
    ) {
        $this->response = $response;
        $this->transaction = $transaction;
        $this->transactionItem = $transactionItem;
        $this->transactionAddress = $transactionAddress;
        $this->transactionBill = $transactionBill;
        $this->bill = $bill;
        $this->address = $address;
        $this->variant = $variant;
    }

    public function index(Request $request)
    {
        $query = $this->transaction
            ->with(['items', 'address','bill'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc');

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
    public function show($transaction_code)
    {
        $transaction = $this->transaction
            ->with([
                'items',
                'address',
                'bill',
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

        DB::beginTransaction();

        try {
            if (!empty($request['uuid'])) {
                return $this->update($request);
            }

            $uuid = (string) Str::uuid();
            $items = [];
            $total_price = 0;

            foreach ($request['items'] as $item) {
                $variant = $this->variant->with('product')->where('uuid', $item['variant_uuid'])->first();

                if (!$variant) {
                    DB::rollBack();
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
                    'transaction_code' => $this->generateTransactionCode(),
                    'variant_uuid'     => $variant->uuid,
                    'product_name'     => $variant->product->name,
                    'variant_name'     => $variant->name,
                    'quantity'         => $quantity,
                    'price'            => $price,
                ];
            }

            $transaction_code = $this->generateTransactionCode();
            $admin_fee = 0;
            $grand_total = $total_price + $admin_fee;

            $transaction = $this->transaction->create([
                'uuid'             => $uuid,
                'transaction_code' => $transaction_code,
                'user_id'          => Auth::id(),
                'total_price'      => $total_price,
                'admin_fee'        => $admin_fee,
                'grand_total'      => $grand_total,
                'unpaid_at'        => now(),
                'expired_at'       => now()->addMinutes(15),
                'note'             => $request['note'] ?? null,
            ]);
            $address = $this->address->where('uuid', $request['address_uuid'])->first();
            if (!$address) {
                DB::rollBack();
                return $this->response->validationError(['address_uuid' => ['Alamat tidak ditemukan.']]);
            }

            $this->transactionAddress->create([
                'uuid'              => Str::uuid(),
                'transaction_uuid'  => $transaction->uuid,
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
            if (!$bill) {
                DB::rollBack();
                return $this->response->validationError(['bill_uuid' => ['Data rekening tidak ditemukan.']]);
            }

            $this->transactionBill->create([
                'uuid'              => Str::uuid(),
                'transaction_uuid'  => $transaction->uuid,
                'account_number'    => $bill->account_number,
                'bank_name'         => $bill->bank_name,
                'account_holder_name' => $bill->account_holder_name,
                'is_main'           => $bill->is_main,
            ]);
            foreach ($items as $itemData) {
                $this->transactionItem->create($itemData);
            }

            DB::commit();
            return $this->response->store($transaction);
        } catch (\Throwable $e) {
            DB::rollBack();
            return $this->response->storeError($e->getMessage());
        }
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

    private function update($request)
    {
        $trx = $this->transaction->where('uuid', $request['uuid'])->first();
        if (!$trx) {
            return $this->response->notFound();
        }

        $trx->fill([
            'status'    => $request['status'] ?? $trx->status,
            'note'      => $request['note'] ?? $trx->note,
        ])->save();

        return $this->response->update($trx);
    }

    public function validate()
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.variant_uuid' => 'required|exists:variants,uuid',
            'items.*.quantity' => 'required|integer|min:1',
            'address_uuid' => 'required|exists:addresses,uuid',
            'note' => 'nullable|string',
        ];
    }
}

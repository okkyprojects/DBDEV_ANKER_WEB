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
use Illuminate\Support\Facades\Storage;

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
            ->with(['items', 'address', 'bill'])
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
                'quantity'         => $quantity,
                'price'            => $price,
            ];
        }

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

        $updateData = $this->request($request);
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


    private function request(Request $request): array
    {
        $data = [
            'uuid'             => $request->input('uuid', (string) Str::uuid()),
            'transaction_code' => $request->input('transaction_code', $this->generateTransactionCode()),
            'user_id'          => Auth::id(),
            'total_price'      => $request->input('total_price', 0),
            'admin_fee'        => $request->input('admin_fee', 0),
            'grand_total'      => $request->input('grand_total', 0),
            'status'           => $request->input('status', 0),
            'paid_at'        => $request->input('paid_at'),
            'unpaid_at'        => $request->input('unpaid_at'),
            'expired_at'       => $request->input('expired_at'),
            'note'             => $request->input('note'),
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

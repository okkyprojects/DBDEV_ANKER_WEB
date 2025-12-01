<?php

namespace App\Http\Repositories;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\Variant;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Traits\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\MessageBag;

class CartRepository
{
    private $response;
    private $product;
    private $cart;
    private $cartItem;
    private $variant;
    private $transaction;
    private $transactionItem;

    public function __construct(
        Response $response,
        Product $product,
        Cart $cart,
        CartItem $cartItem,
        Variant $variant,
        Transaction $transaction,
        TransactionItem $transactionItem,
    ) {
        $this->response = $response;
        $this->product = $product;
        $this->cart = $cart;
        $this->cartItem = $cartItem;
        $this->variant = $variant;
        $this->transaction = $transaction;
        $this->transactionItem = $transactionItem;
    }
    public function index()
    {
        $cart = $this->cart
            ->with(['variants' => function ($q) {
                $q->whereNull('deleted_at') // hanya yang variant belum dihapus
                    ->whereHas('product', function ($q2) {
                        $q2->whereNull('deleted_at'); // hanya yang product belum dihapus
                    });
            }, 'variants.product'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->first();

        $data = [];

        if ($cart) {
            foreach ($cart->variants as $variant) {
                $data[] = [
                    'itemcart_uuid'   => $variant->pivot->uuid,
                    'variant_uuid'    => $variant->uuid,
                    'variant_name'    => $variant->name,
                    'variant_sku'    => $variant->sku,
                    'quantity'        => $variant->pivot->quantity,
                    'discount_price'  => $variant->discount_price,
                    'price'           => $variant->price,
                    'product_uuid'    => $variant->product->uuid,
                    'product_name'    => $variant->product->name,
                    'img'             => $variant->img,
                    'stock'     => $variant->stock,
                ];
            }
        }

        return $data;
    }





    // public function index()
    // {
    //     $query = $this->cart
    //         ->with(['variants.product.seller'])
    //         ->where('user_id', Auth::id())
    //         ->orderBy('created_at', 'desc');
    //     $data = $query->first();
    //     return $data;
    // }
    // public function repeat_order($transactionUuid)
    // {
    //     $userId = Auth::id();
    //     $transaction = $this->transaction->where('uuid', $transactionUuid)
    //         ->where('user_id', $userId)
    //         ->first();

    //     if (!$transaction) {
    //         return $this->response->notFound('Transaksi tidak ditemukan');
    //     }
    //     $items = $this->transactionItem->where('transaction_uuid', $transaction->uuid)->get();

    //     if ($items->isEmpty()) {
    //         return $this->response->notFound('Tidak ada item dalam transaksi');
    //     }
    //     $cart = $this->cart->firstOrCreate(
    //         ['user_id' => $userId],
    //         ['uuid' => Str::uuid()]
    //     );

    //     foreach ($items as $item) {
    //         $variant = $this->variant->where('uuid', $item->variant_uuid)->first();
    //         if (!$variant) {
    //             continue;
    //         }
    //         $existingItem = $this->cartItem
    //             ->where('cart_uuid', $cart->uuid)
    //             ->where('variant_uuid', $item->variant_uuid)
    //             ->first();

    //         if ($existingItem) {
    //             $existingItem->quantity += $item->quantity;
    //             $existingItem->save();
    //         } else {
    //             $this->cartItem->create([
    //                 'uuid' => Str::uuid(),
    //                 'cart_uuid' => $cart->uuid,
    //                 'variant_uuid' => $item->variant_uuid,
    //                 'quantity' => $item->quantity,
    //             ]);
    //         }
    //     }

    //     return $this->response->store('Produk berhasil dimasukkan ke keranjang lagi');
    // }

    public function repeat_order($transactionUuid)
    {
        $userId = Auth::id();
        $transaction = $this->transaction->where('uuid', $transactionUuid)
            ->where('user_id', $userId)
            ->first();

        if (!$transaction) {
            return $this->response->notFound('Transaksi tidak ditemukan');
        }

        $items = $this->transactionItem->where('transaction_uuid', $transaction->uuid)->get();
        if ($items->isEmpty()) {
            return $this->response->notFound('Tidak ada item dalam transaksi');
        }

        $cart = $this->cart->firstOrCreate(
            ['user_id' => $userId],
            ['uuid' => Str::uuid()]
        );

        foreach ($items as $item) {
            $variant = $this->variant
                ->with(['product' => function ($q) {
                    $q->whereNull('deleted_at');
                }])
                ->where('uuid', $item->variant_uuid)
                ->whereNull('deleted_at')
                ->first();

            if (!$variant || !$variant->product) {
                return $this->response->validationError(
                    new MessageBag(['items' => ['Variant atau produk tidak ditemukan untuk salah satu item.']])
                );
            }

            $existingItem = $this->cartItem
                ->where('cart_uuid', $cart->uuid)
                ->where('variant_uuid', $item->variant_uuid)
                ->first();

            if ($existingItem) {
                $existingItem->quantity += $item->quantity;
                $existingItem->save();
            } else {
                $this->cartItem->create([
                    'uuid'         => Str::uuid(),
                    'cart_uuid'    => $cart->uuid,
                    'variant_uuid' => $item->variant_uuid,
                    'quantity'     => $item->quantity,
                ]);
            }
        }

        return $this->response->store('Produk berhasil dimasukkan ke keranjang lagi');
    }


    // public function store($request)
    // {
    //     $validator = Validator::make($request->all(), $this->validate());
    //     if ($validator->fails()) {
    //         return $this->response->validationError($validator->errors());
    //     }
    //     $validated = $validator->validated();
    //     $userId = Auth::id();
    //     $cart = $this->cart->firstOrCreate(
    //         ['user_id' => $userId],
    //         ['uuid' => Str::uuid()]
    //     );
    //     if (!empty($request['uuid'])) {
    //         return $this->update($request);
    //     }
    //     $existingItem = $this->cartItem
    //         ->where('cart_uuid', $cart->uuid)
    //         ->where('variant_uuid', $validated['variant_uuid'])
    //         ->first();

    //     if ($existingItem) {
    //         $existingItem->quantity += $validated['quantity'] ?? 1;
    //         $existingItem->save();

    //         return $this->response->update($existingItem);
    //     }
    //     $data = $this->cartItem->create(array_merge(
    //         ['uuid' => Str::uuid()],
    //         $this->request($request, $cart->uuid)
    //     ));
    //     return $data
    //         ? $this->response->store($data)
    //         : $this->response->storeError();
    // }

    // public function store($request)
    // {
    //     $validator = Validator::make($request->all(), $this->validate());
    //     if ($validator->fails()) {
    //         return $this->response->validationError($validator->errors());
    //     }
    //     $validated = $validator->validated();

    //     $variant = $this->variant
    //         ->with(['product' => function ($q) {
    //             $q->whereNull('deleted_at');
    //         }])
    //         ->where('uuid', $validated['variant_uuid'])
    //         ->whereNull('deleted_at')
    //         ->first();

    //     if (!$variant || !$variant->product) {
    //         $errors = new MessageBag([
    //             'variant_uuid' => ['Variant atau Product sudah dihapus, tidak bisa dimasukkan ke keranjang.']
    //         ]);
    //         return $this->response->validationError($errors);
    //     }

    //     $userId = Auth::id();
    //     $cart = $this->cart->firstOrCreate(
    //         ['user_id' => $userId],
    //         ['uuid' => Str::uuid()]
    //     );

    //     if (!empty($request['uuid'])) {
    //         return $this->update($request);
    //     }

    //     $existingItem = $this->cartItem
    //         ->where('cart_uuid', $cart->uuid)
    //         ->where('variant_uuid', $validated['variant_uuid'])
    //         ->first();

    //     if ($existingItem) {
    //         $existingItem->quantity += $validated['quantity'] ?? 1;
    //         $existingItem->save();
    //         return $this->response->update($existingItem);
    //     }

    //     $data = $this->cartItem->create(array_merge(
    //         ['uuid' => Str::uuid()],
    //         $this->request($request, $cart->uuid)
    //     ));

    //     return $data
    //         ? $this->response->store($data)
    //         : $this->response->storeError();
    // }

    public function store($request)
    {
        $validator = Validator::make($request->all(), $this->validate());
        if ($validator->fails()) {
            return $this->response->validationError($validator->errors());
        }

        $validated = $validator->validated();

        $variant = $this->variant
            ->with(['product' => function ($q) {
                $q->whereNull('deleted_at');
            }])
            ->where('uuid', $validated['variant_uuid'])
            ->whereNull('deleted_at')
            ->first();

        if (!$variant || !$variant->product) {
            $errors = new MessageBag([
                'variant_uuid' => ['Variant atau Product sudah dihapus, tidak bisa dimasukkan ke keranjang.']
            ]);
            return $this->response->validationError($errors);
        }

        if (isset($validated['quantity']) && $validated['quantity'] > $variant->stock) {
            $errors = new MessageBag([
                'quantity' => ["Jumlah di keranjang tidak dapat melebihi stok yang tersedia ({$variant->stock})."]

            ]);
            return $this->response->validationError($errors);
        }

        $userId = Auth::id();
        $cart = $this->cart->firstOrCreate(
            ['user_id' => $userId],
            ['uuid' => Str::uuid()]
        );

        if (!empty($request['uuid'])) {
            return $this->update($request);
        }
        $existingItem = $this->cartItem
            ->where('cart_uuid', $cart->uuid)
            ->where('variant_uuid', $validated['variant_uuid'])
            ->first();

        if ($existingItem) {

            $newQty = $existingItem->quantity + ($validated['quantity'] ?? 1);

            if ($newQty > $variant->stock) {
                $errors = new MessageBag([
                    'quantity' => ["Jumlah di keranjang tidak dapat melebihi stok yang tersedia ({$variant->stock})."]
                ]);
                return $this->response->validationError($errors);
            }

            $existingItem->quantity = $newQty;
            $existingItem->save();
            return $this->response->update($existingItem);
        }

        $data = $this->cartItem->create(array_merge(
            ['uuid' => Str::uuid()],
            $this->request($request, $cart->uuid)
        ));

        return $data
            ? $this->response->store($data)
            : $this->response->storeError();
    }



    // private function update($request)
    // {
    //     $item = $this->cartItem->where('uuid', $request['uuid'])->first();
    //     if (!$item) {
    //         return $this->response->notFound();
    //     }
    //     $updated = $item->fill($this->request($request, $item->cart_uuid))->save();
    //     if (!$updated) {
    //         return $this->response->updateError();
    //     } else {
    //         return $this->response->update($item);
    //     }
    // }
    private function update($request)
    {
        $item = $this->cartItem->where('uuid', $request['uuid'])->first();
        if (!$item) {
            return $this->response->notFound();
        }

        $variant = $this->variant
            ->where('uuid', $item->variant_uuid)
            ->whereNull('deleted_at')
            ->first();

        if (!$variant) {
            $errors = new MessageBag([
                'variant_uuid' => ['Variant sudah tidak tersedia.']
            ]);
            return $this->response->validationError($errors);
        }

        $newQty = $request['quantity'] ?? $item->quantity;

        if ($newQty > $variant->stock) {
            $errors = new MessageBag([
                'quantity' => ["Jumlah di keranjang tidak dapat melebihi stok yang tersedia ({$variant->stock})."]
            ]);
            return $this->response->validationError($errors);
        }

        $updated = $item->fill($this->request($request, $item->cart_uuid))->save();

        if (!$updated) {
            return $this->response->updateError();
        }

        return $this->response->update($item);
    }


    public function destroy($uuid)
    {
        $check = $this->cartItem->where('uuid', $uuid)->first();
        if (empty($check)) {
            return $this->response->notFound();
        }
        $data = $this->cartItem->where('uuid', $uuid)->delete();

        if (!$data) {
            return $this->response->destroyError();
        } else {
            return $this->response->destroy($check);
        }
    }
    private function validate()
    {
        return [
            'variant_uuid' => 'required|exists:variants,uuid',
            'quantity'     => 'nullable|integer|min:1',
        ];
    }

    private function request($request, $cartUuid)
    {
        return [
            'cart_uuid'    => $cartUuid,
            'variant_uuid' => $request['variant_uuid'],
            'quantity'     => $request['quantity'] ?? 1,
        ];
    }
}

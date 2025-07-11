<?php

namespace App\Http\Repositories;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\Variant;
use App\Traits\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class CartRepository
{
    private $response;
    private $product;
    private $cart;
    private $cartItem;
    private $variant;

    public function __construct(
        Response $response,
        Product $product,
        Cart $cart,
        CartItem $cartItem,
        Variant $variant,
    ) {
        $this->response = $response;
        $this->product = $product;
        $this->cart = $cart;
        $this->cartItem = $cartItem;
        $this->variant = $variant;
    }
    public function index()
    {
        $query = $this->cart
            ->with(['variants.product']) 
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc');
        $data = $query->get();
        return $data;
    }

    public function store($request)
    {
        $validator = Validator::make($request->all(), $this->validate());
        if ($validator->fails()) {
            return $this->response->validationError($validator->errors());
        }
        $validated = $validator->validated();
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
            $existingItem->quantity += $validated['quantity'] ?? 1;
            if (isset($request['is_select'])) {
                $existingItem->is_select = $request['is_select'];
            }
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

    private function update($request)
    {
        $item = $this->cartItem->where('uuid', $request['uuid'])->first();
        if (!$item) {
            return $this->response->notFound();
        }
        $updated = $item->fill($this->request($request, $item->cart_uuid))->save();
        if (!$updated) {
            return $this->response->updateError();
        }else{
            return $this->response->update($item);}
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
            'is_select'  => 'nullable|boolean',
        ];
    }

    private function request($request, $cartUuid)
    {
        return [
            'cart_uuid'    => $cartUuid,
            'variant_uuid' => $request['variant_uuid'],
            'quantity'     => $request['quantity'] ?? 1,
            'is_select'  => $request['is_select'] ?? true,
        ];
    }
}

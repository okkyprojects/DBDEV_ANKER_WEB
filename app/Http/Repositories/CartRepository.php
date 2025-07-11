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
        $validation = Validator::make($request->all(), $this->validate());
        if ($validation->fails()) {
            return $this->response->validationError($validation->errors());
        }

        $userId = Auth::id();
        $cart = $this->cart->firstOrCreate(
            ['user_id' => $userId],
            ['uuid' => Str::uuid()]
        );

        $cartItem = $this->cartItem
            ->where('cart_uuid', $cart->uuid)
            ->where('variant_uuid', $request['variant_uuid'])
            ->first();

        if (!$cartItem) {
            $data = $this->cartItem->create($this->request($request, $cart->uuid));
            if (!$data) {
                return $this->response->storeError();
            } else {
                return $this->response->store($data);
            }
        } else {
            $cartItem->quantity += $request['quantity'];
            $cartItem->save();
            return $this->response->update($cartItem);
        }
    }



    private function validate()
    {
        return [
            'variant_uuid' => 'required|exists:variants,uuid',
            'quantity' => 'nullable|integer|min:1',
        ];
    }

    private function request($request, $cartUuid)
    {
        return [
            'cart_uuid' => $cartUuid,
            'variant_uuid' => $request['variant_uuid'],
            'quantity' => $request['quantity'],
        ];
    }
}

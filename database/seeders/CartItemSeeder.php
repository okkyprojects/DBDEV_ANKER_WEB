<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\Variant;
use App\Models\CartItem;
use Illuminate\Database\Seeder;

class CartItemSeeder extends Seeder
{
    public function run(): void
    {
        $carts = Cart::all();
        $variants = Variant::all();
        $used = [];

        foreach ($carts as $cart) {
            $sample = $variants->random(rand(1, 5));
            foreach ($sample as $variant) {
                $key = $cart->uuid . '-' . $variant->uuid;
                if (!in_array($key, $used)) {
                    $used[] = $key;
                    CartItem::factory()->create([
                        'cart_uuid' => $cart->uuid,
                        'variant_uuid' => $variant->uuid,
                    ]);
                }
            }
        }
    }
}

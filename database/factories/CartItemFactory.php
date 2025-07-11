<?php

namespace Database\Factories;

use Illuminate\Support\Str;
use App\Models\Cart;
use App\Models\Variant;
use Illuminate\Database\Eloquent\Factories\Factory;

class CartItemFactory extends Factory
{
    public function definition(): array
    {
        $variant = Variant::inRandomOrder()->first();
        $cart = Cart::inRandomOrder()->first();
        return [
            'uuid' => Str::uuid(),
            'cart_uuid' => null,        
            'variant_uuid' => null,
            'is_select'   => false,
            'quantity' => $this->faker->numberBetween(1, 5),
        ];
    }
}

<?php

namespace Database\Factories;

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
            'cart_uuid' => $cart?->uuid,
            'variant_uuid' => $variant?->uuid,
            'quantity' => $this->faker->numberBetween(1, 5),
            'price' => $variant?->price ?? 0,
        ];
    }
}

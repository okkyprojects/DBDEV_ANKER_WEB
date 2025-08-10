<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Variant>
 */
class VariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $price = $this->faker->randomFloat(2, 10000, 500000);
        $discount = $this->faker->boolean(50)
            ? $price - $this->faker->randomFloat(2, 1000, $price * 0.3)
            : null;

        return [
            'uuid'          => Str::uuid(),
            'product_uuid'  => Product::inRandomOrder()->first()?->uuid,
            'sku'           => strtoupper('SKU-' . Str::random(8)),
            'name'          => $this->faker->word(),
            'price'         => $price,
            'img'           => 'https://fastly.picsum.photos/id/8/300/100.jpg?hmac=fEbCJREOWHtYm21WgwubKRUVUp7vPF2V9FY9gSJHwZs',
            'discount_price' => $discount,
        ];
    }
}

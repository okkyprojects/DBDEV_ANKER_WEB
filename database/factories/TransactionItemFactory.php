<?php

namespace Database\Factories;

use App\Models\Transaction;
use App\Models\Variant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TransactionItem>
 */
class TransactionItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $variant = Variant::inRandomOrder()->first();
        $quantity = $this->faker->numberBetween(1, 5);
        $price = $variant?->price ?? $this->faker->randomFloat(2, 10000, 500000);

        return [
            'transaction_uuid' => Transaction::inRandomOrder()->first()?->uuid,
            'variant_uuid' => $variant?->uuid,
            'product_name' => $variant?->product->name ?? $this->faker->words(3, true),
            'variant_name' => $variant?->name ?? $this->faker->word(),
            'quantity' => $quantity,
            'price' => $price,
        ];
    }
}

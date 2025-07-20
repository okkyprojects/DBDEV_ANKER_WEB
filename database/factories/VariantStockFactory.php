<?php

namespace Database\Factories;

use App\Models\Variant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductStock>
 */
class VariantStockFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => Str::uuid(),
            'variant_uuid' => Variant::inRandomOrder()->first()?->uuid,
            'quantity' => $this->faker->numberBetween(1, 100),
            'note' => $this->faker->optional()->sentence(),
        ];
    }
}

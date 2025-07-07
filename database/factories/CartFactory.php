<?php

namespace Database\Factories;

use App\Models\Cart;
use App\Models\User;
use App\Models\Variant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cart>
 */
class CartFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()?->id,
            'variant_uuid' => Variant::inRandomOrder()->first()?->uuid,
            'quantity' => $this->faker->numberBetween(1, 5),
        ];
    }
}

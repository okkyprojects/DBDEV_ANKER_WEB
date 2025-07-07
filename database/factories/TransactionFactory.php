<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $totalPrice = $this->faker->randomFloat(2, 10000, 1000000); 
        $adminFee = $this->faker->randomFloat(2, 1000, 5000);
        $grandTotal = $totalPrice + $adminFee;
        $status = $this->faker->numberBetween(0, 5);
        return [
            'uuid' => Str::uuid(),
            'user_id' => User::inRandomOrder()->first()?->id,
            'total_price' => $totalPrice,
            'admin_fee' => $adminFee,
            'grand_total' => $grandTotal,
            'status' => $status,
            'unpaid_at' => ($status === 0) ? now() : null,
            'processing_at' => ($status === 1) ? now() : null,
            'shipping_at' => ($status === 2) ? now() : null,
            'completed_at' => ($status === 3) ? now() : null,
            'failed_at' => ($status === 4) ? now() : null,
            'expired_at' => ($status === 5) ? now() : null,
            'note' => $this->faker->sentence(),
        ];
    }
}

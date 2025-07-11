<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Brand>
 */
class BrandFactory extends Factory
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
            'name' => $this->faker->word,
            'status' => $this->faker->boolean,
            'img' => 'https://fastly.picsum.photos/id/8/300/100.jpg?hmac=fEbCJREOWHtYm21WgwubKRUVUp7vPF2V9FY9gSJHwZs',
        ];
    }
}

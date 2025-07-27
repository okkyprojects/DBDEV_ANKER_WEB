<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Brand;
use App\Models\Seller;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
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
            'name' => $this->faker->words(3, true),
            'category_uuid' => Category::inRandomOrder()->first()?->uuid,
            'brand_uuid' => Brand::inRandomOrder()->first()?->uuid,
            'img' => 'https://fastly.picsum.photos/id/8/300/100.jpg?hmac=fEbCJREOWHtYm21WgwubKRUVUp7vPF2V9FY9gSJHwZs',
            'description' => $this->faker->paragraph(),
        ];
    }
}

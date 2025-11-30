<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Brand;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\User;
use App\Models\Variant;
use App\Models\VariantStock;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $this->call(LocationSeeder::class);
        $this->call(UserSeeder::class);
        User::factory()->count(5)->create();
        Category::factory()->count(5)->create();
        Brand::factory()->count(5)->create();
        // Product::factory()->count(30)->create()->each(function ($product) {
        //     Variant::factory()->count(rand(1, 3))->create([
        //         'product_uuid' => $product->uuid,
        //     ])->each(function ($variant) {
        //         VariantStock::create([
        //             'uuid' => Str::uuid(),
        //             'variant_uuid' => $variant->uuid,
        //             'quantity' => rand(10, 100),
        //             'note' => 'Initial stock seeder',
        //         ]);
        //     });
        // });

        // Cart::factory()->count(200)->create();
        // CartItem::factory()->count(500)->create();
        // Transaction::factory()->count(200)->create();
        // TransactionItem::factory()->count(200)->create();
        // $this->call(CartItemSeeder::class);
    }
}

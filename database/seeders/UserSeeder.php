<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Province;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'User Biasa',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $sellerUser = User::create([
            'name' => 'Seller User',
            'email' => 'seller@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
        ]);
        $province = Province::where('nama', 'JAWA TIMUR')->first();
        $city = City::where('nama', 'KOTA SURABAYA')->first();
        if ($province && $city) {
            Seller::create([
                'user_id' => $sellerUser->id,
                'id_card_number' => '1234567890123456',
                'id_card_name' => 'Seller User',
                'id_card_img' => 'ktp.jpg',
                'seller_name' => 'Toko Jaya Abadi',
                'seller_phone' => '087712345678',
                'img' => 'store.jpg',
                'province_id' => $province->id,
                'city_id' => $city->id,
                'note' => 'Diverifikasi oleh admin.',
                'status' => 1,
            ]);
        } else {
            $this->command->warn('Province or City not found. Please seed provinces and cities first.');
        }
    }
}

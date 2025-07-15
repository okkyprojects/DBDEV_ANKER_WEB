<?php

namespace Database\Seeders;

use App\Models\Address;
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
        // Creating Admin User
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'admin',
        ]);

        // Creating Regular User
        $userBiasa = User::create([
            'name' => 'User Biasa',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
        ]);

        // Creating Seller User
        $sellerUser = User::create([
            'name' => 'Seller User',
            'email' => 'seller@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'user',
        ]);

        // Creating Seller and linking to Province and City
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
            Seller::create([
                'user_id' => $sellerUser->id,
                'id_card_number' => '5555666677778888',
                'id_card_name' => 'Seller User 2',
                'id_card_img' => 'ktp2.jpg',
                'seller_name' => 'Toko Makmur Sentosa',
                'seller_phone' => '082222222222',
                'img' => 'store2.jpg',
                'province_id' => $province->id,
                'city_id' => $city->id,
                'note' => 'Diverifikasi oleh admin.',
                'status' => 1,
            ]);
            Seller::create([
                'user_id' => $sellerUser->id,
                'id_card_number' => '5555666677778888',
                'id_card_name' => 'Seller User 3',
                'id_card_img' => 'ktp2.jpg',
                'seller_name' => 'Toko Maju Jaya',
                'seller_phone' => '082222222222',
                'img' => 'store2.jpg',
                'province_id' => $province->id,
                'city_id' => $city->id,
                'note' => 'Diverifikasi oleh admin.',
                'status' => 1,
            ]);
        } else {
            $this->command->warn('Province or City not found. Please seed provinces and cities first.');
        }

        Address::create([
            'user_id' => $userBiasa->id,
            'province_id' => $province->id,
            'city_id' => $city->id,
            'district_id' => 3578010, 
            'category' => 'rumah', 
            'name' => 'Mr Jos',
            'phone_number' => '081234567890',
            'address' => 'Jl. Arema, No. 1',
            'postal_code' => '65123',
            'note' => 'Admin Address Note',
            'is_main' => true, 
        ]);

        Address::create([
            'user_id' => $userBiasa->id,
            'province_id' => $province->id, 
            'city_id' => $city->id,
            'district_id' => 3578010, 
            'category' => 'rumah',
            'name' => 'User Biasa Address',
            'phone_number' => '082345678901',
            'address' => 'Jl. Biasa, No. 10',
            'postal_code' => '65123',
            'note' => 'User Biasa Address Note',
            'is_main' => false, 
        ]);
        Address::create([
            'user_id' => $userBiasa->id,
            'province_id' => $province->id,
            'city_id' => $city->id, 
            'district_id' => 3578010, 
            'category' => 'kantor',
            'name' => ' User Address',
            'phone_number' => '083456789012',
            'address' => 'Jl. Alanaa, No. 20',
            'postal_code' => '65123',
            'note' => 'Seller User Address Note',
            'is_main' => false, 
        ]);
    }
}

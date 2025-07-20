<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Bill;
use App\Models\City;
use App\Models\Province;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'phone_number' => '081234567890',
            'gender' => 'L',
            'role' => 'admin',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $userBiasa = User::create([
            'name' => 'User Biasa',
            'email' => 'user@example.com',
            'phone_number' => '082345678901',
            'gender' => 'P',
            'role' => 'user',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $sellerUser = User::create([
            'name' => 'Seller User',
            'email' => 'seller@example.com',
            'phone_number' => '083456789012',
            'gender' => 'L',
            'role' => 'user',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
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
                'img' => null,
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
                'img' => null,
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
                'img' => null,
                'province_id' => $province->id,
                'city_id' => $city->id,
                'note' => 'Diverifikasi oleh admin.',
                'status' => 1,
            ]);

            $bankList = ['BCA', 'Mandiri', 'BNI', 'BRI', 'Muamalat', 'CIMB Niaga', 'BTN', 'Danamon', 'Permata'];

            for ($i = 0; $i < count($bankList); $i++) {
                Bill::create([
                    'uuid' => Str::uuid(),
                    'user_id' => $admin->id,
                    'account_number' => '9876543210' . $i,
                    'bank_name' => $bankList[$i],
                    'account_holder_name' => 'Admin Holder ' . ($i + 1),
                    'is_main' => $i === 0,
                ]);
            }
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
            'name' => 'User Address',
            'phone_number' => '083456789012',
            'address' => 'Jl. Alanaa, No. 20',
            'postal_code' => '65123',
            'note' => 'Seller User Address Note',
            'is_main' => false,
        ]);
    }
}

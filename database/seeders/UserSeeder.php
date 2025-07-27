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

        $province = Province::where('nama', 'JAWA TIMUR')->first();
        $city = City::where('nama', 'KOTA SURABAYA')->first();
        $bankList = ['BCA', 'Mandiri', 'BNI', 'BRI', 'Muamalat', 'CIMB Niaga', 'BTN', 'Danamon', 'Permata'];

        for ($i = 0; $i < count($bankList); $i++) {
            Bill::create([
                'uuid' => Str::uuid(),
                'account_number' => '9876543210' . $i,
                'bank_name' => $bankList[$i],
                'account_holder_name' => 'Admin Holder ' . ($i + 1),
                'is_main' => $i === 0,
            ]);
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

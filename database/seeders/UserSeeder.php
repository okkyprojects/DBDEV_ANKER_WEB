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
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        $permissions = [
            'product-index',
            'product-add',
            'product-update',
            'product-delete',
            'product-export',

            'bill-index',
            'bill-add',
            'bill-update',
            'bill-delete',
            'bill-export',

            'address-index',
            'address-add',
            'address-update',
            'address-delete',
            'address-export',

            'category-index',
            'category-add',
            'category-update',
            'category-delete',
            'category-export',

            // 'banner-index',
            // 'banner-add',
            // 'banner-update',
            // 'banner-delete',
            // 'banner-export',

            'user-index',
            'user-add',
            'user-update',
            'user-delete',
            'user-export',

            'role-index',
            'role-add',
            'role-update',
            'role-delete',
            'role-export',

            'transaction-index',
            'transaction-add',
            'transaction-update',
            'transaction-delete',
            'transaction-export',

            'term-index',
            'term-add',
            'term-update',
            'term-delete',
            'term-export',

            'brand-index',
            'brand-add',
            'brand-update',
            'brand-delete',
            'brand-export',
        ];
        foreach ($permissions as $p) {
            Permission::firstOrCreate([
                'name' => $p,
                'guard_name' => 'web',
            ]);
        }
        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        $userRole = Role::firstOrCreate([
            'name' => 'user',
            'guard_name' => 'web',
        ]);


        $adminRole->givePermissionTo(Permission::all());
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'phone_number' => '081234567890',
            'gender' => 'L',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $userBiasa = User::create([
            'name' => 'User Biasa',
            'email' => 'user@example.com',
            'phone_number' => '082345678901',
            'gender' => 'P',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');
        $userBiasa->assignRole('user');

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

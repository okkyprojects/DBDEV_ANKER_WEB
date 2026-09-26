<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class StockHistoryPermissionSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permission = Permission::firstOrCreate([
            'name' => 'stock-history-index',
            'guard_name' => 'web',
        ]);

        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);
        $adminRole->givePermissionTo($permission);

        // Any other role that can already see "Data Produk" gets this too,
        // so custom roles set up via Role & Permission menu aren't left out.
        Role::whereHas('permissions', function ($q) {
            $q->where('name', 'product-index');
        })->get()->each(function (Role $role) use ($permission) {
            $role->givePermissionTo($permission);
        });
    }
}

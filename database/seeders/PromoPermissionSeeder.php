<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PromoPermissionSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'promo-index',
            'promo-add',
            'promo-update',
            'promo-delete',
            'promo-export',

            'notification-index',
            'notification-add',
            'notification-update',
            'notification-delete',
            'notification-export',
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
        $adminRole->givePermissionTo($permissions);
    }
}

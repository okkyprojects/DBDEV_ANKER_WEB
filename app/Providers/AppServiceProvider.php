<?php

namespace App\Providers;

use App\Models\Variant;
use App\Observers\VariantObserver;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        Variant::observe(VariantObserver::class);

        Inertia::share('auth', function () {
            return [
                'user' => Auth::user(),
                'permissions' => function () {
                    return Auth::check() ? Auth::user()->getAllPermissions()->pluck('name') : [];
                },
            ];
        });
        Inertia::share('permissions', function () {
            $user = Auth::user();
            return $user ? $user->getAllPermissions()->pluck('name')->toArray() : [];
        });
    }
}

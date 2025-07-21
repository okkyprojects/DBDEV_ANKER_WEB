<?php

use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\User\CartController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [HomeController::class, 'index'])->name('home.index');
Route::get('/product', [HomeController::class, 'product'])->name('home.product');
Route::get('/product/{uuid}', [HomeController::class, 'product_show'])->name('home.product.show');
Route::middleware('auth')->group(function () {
    Route::get('/daftar-seller', [HomeController::class, 'daftar_seller'])->name('home.seller.daftar_seller');
    Route::post('/store-seller', [HomeController::class, 'store_seller'])->name('home.seller.store_seller');
    Route::resource('/cart', CartController::class);
    Route::prefix('profil')->name('profil.')->group(function () {
        Route::get('/informasi-pribadi', [ProfilController::class, 'informasiPribadi'])->name('informasi_pribadi');
        Route::get('/informasi-toko', [ProfilController::class, 'informasiToko'])->name('informasi_toko');
        Route::get('/ubah-kata-sandi', [ProfilController::class, 'ubahKataSandi'])->name('ubah_kata_sandi');
        Route::get('/alamat', [ProfilController::class, 'alamat'])->name('alamat.index');
        Route::post('/alamat', [ProfilController::class, 'store_alamat'])->name('alamat.store');
        Route::post('/informasi-pribadi', [ProfilController::class, 'store_informasi_pribadi'])->name('informasi_pribadi.store');
    });

    Route::prefix('master')->name('master.')->middleware('auth')->group(function () {
        // Category
        Route::get('/category', [CategoryController::class, 'index'])->name('category.index');
        Route::post('/category', [CategoryController::class, 'store'])->name('category.store');
        Route::delete('/category/{uuid}', [CategoryController::class, 'destroy'])->name('category.destroy');

        // Brand
        Route::get('/brand', [BrandController::class, 'index'])->name('brand.index');
        Route::post('/brand', [BrandController::class, 'store'])->name('brand.store');
        Route::delete('/brand/{uuid}', [BrandController::class, 'destroy'])->name('brand.destroy');

        // Banner
        Route::get('/banner', [BannerController::class, 'index'])->name('banner.index');
        Route::post('/banner', [BannerController::class, 'store'])->name('banner.store');
        Route::delete('/banner/{uuid}', [BannerController::class, 'destroy'])->name('banner.destroy');

    });
});
Route::get('/checkout', function () {
    return Inertia::render('Checkout');
});
Route::get('/riwayat-transaksi', function () {
    return Inertia::render('RiwayatTransaksi');
});
Route::get('/payment', function () {
    return Inertia::render('Payment');
});
Route::get('/product/detail', function () {
    return Inertia::render('DetailProduct');
});


//Auth
Route::prefix('stok')->group(function () {
    Route::get('/manajemen-stok', fn() => Inertia::render('Stok/StokPage'));
    Route::get('/manajemen-stok/create', fn() => Inertia::render('Stok/ManajemenStok/Create'));
});

Route::prefix('reporting')->group(function () {
    Route::get('/penjualan', fn() => Inertia::render('Reporting/Penjualan'));
    Route::get('/item', fn() => Inertia::render('Reporting/Item'));
});

Route::prefix('pesanan')->group(function () {
    Route::get('/manajemen-pesanan', fn() => Inertia::render('Pesanan/ManajemenPesanan'));
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard/Dashboard');
})->name('dashboard');

// ->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

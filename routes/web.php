<?php

use App\Http\Controllers\HomeController;
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
Route::get('/profil/informasi-pribadi', function () {
    return Inertia::render('Profil/InformasiPribadi');
});
Route::get('/profil/informasi-toko', function () {
    return Inertia::render('Profil/InformasiToko');
});
Route::get('/profil/ubah-kata-sandi', function () {
    return Inertia::render('Profil/InformasiToko');
});
Route::get('/profil/alamat', function () {
    return Inertia::render('Profil/Alamat');
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

<?php

use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\BillController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\PenjualanController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\VariantController;
use App\Http\Controllers\Admin\VariantStockController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Seller\ProductController;
use App\Http\Controllers\User\CartController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
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

// Route::get('/', [HomeController::class, 'index'])->name('home.index');
// Route::get('/product', [HomeController::class, 'product'])->name('home.product');
// Route::get('/product/{uuid}', [HomeController::class, 'product_show'])->name('home.product.show');
Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});
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
    Route::prefix('produk')->name('produk.')->middleware('auth')->group(function () {
        Route::get('/data-produk', [ProductController::class, 'index'])->name('product.index');
        Route::get('/export-data-produk', [ProductController::class, 'export'])->name('product.export');
        Route::get('/data-produk/create', [ProductController::class, 'create'])->name('product.create');
        Route::post('/data-produk', [ProductController::class, 'store'])->name('product.store');
        Route::get('/data-produk/{uuid}/edit', [ProductController::class, 'edit'])->name('product.edit'); // 👈 tambah edit
        // Route::post('/data-produk/{uuid}', [ProductController::class, 'update'])->name('product.update'); // 👈 tambah update
        Route::delete('/data-produk/{uuid}', [ProductController::class, 'destroy'])->name('product.destroy');
    });
    Route::prefix('reporting')->name('reporting.')->middleware('auth')->group(function () {
        Route::get('/penjualan', [PenjualanController::class, 'index'])->name('penjualan.index');
        Route::get('/export-penjualan', [PenjualanController::class, 'export'])->name('penjualan.export');
        // Route::get('/item', fn() => Inertia::render('Reporting/Item'));
        Route::get('/item', [VariantStockController::class, 'index'])->name('item.index');
        Route::post('/item', [VariantStockController::class, 'store'])->name('item.store');
        Route::delete('/item/{uuid}', [VariantStockController::class, 'destroy'])->name('item.destroy');
    });
    Route::prefix('pesanan')->name('pesanan.')->group(function () {
        Route::get('/manajemen-pesanan', [TransactionController::class, 'index'])->name('manajemen.index');
        Route::get('/export-pesanan', [TransactionController::class, 'export'])->name('manajemen.export');
        Route::delete('/manajemen-pesanan/{uuid}', [TransactionController::class, 'destroy'])->name('manajemen.destroy');
    });
    Route::delete('/variant/{uuid}', [VariantController::class, 'destroy'])->name('variant.destroy');

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

        // Bill
        Route::get('/bill', [BillController::class, 'index'])->name('bill.index');
        Route::post('/bill', [BillController::class, 'store'])->name('bill.store');
        Route::delete('/bill/{uuid}', [BillController::class, 'destroy'])->name('bill.destroy');
    });
});
// Route::get('/checkout', function () {
//     return Inertia::render('Checkout');
// });
// Route::get('/riwayat-transaksi', function () {
//     return Inertia::render('RiwayatTransaksi');
// });
// Route::get('/payment', function () {
//     return Inertia::render('Payment');
// });
// Route::get('/product/detail', function () {
//     return Inertia::render('DetailProduct');
// });



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

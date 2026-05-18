<?php

use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\BillController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\HomeController as AdminHomeController;
use App\Http\Controllers\Admin\PenjualanController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\TermController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;
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
        return redirect()->route('home.index');
    }
    return redirect()->route('login');
});

Route::get('/penghapusan-akun', function () {
    return Inertia::render('AccountDeletion');
})->name('account.deletion');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [AdminHomeController::class, 'index'])->name('home.index');
    Route::get('/daftar-seller', [HomeController::class, 'daftar_seller'])->name('home.seller.daftar_seller');
    Route::post('/store-seller', [HomeController::class, 'store_seller'])->name('home.seller.store_seller');
    Route::resource('/cart', CartController::class);
    Route::prefix('profil')
        ->name('profil.')
        ->group(function () {
            Route::get('/informasi-pribadi', [ProfilController::class, 'informasiPribadi'])->name('informasi_pribadi');
            Route::get('/informasi-toko', [ProfilController::class, 'informasiToko'])->name('informasi_toko');
            Route::get('/ubah-kata-sandi', [ProfilController::class, 'ubahKataSandi'])->name('ubah_kata_sandi');
            Route::get('/alamat', [ProfilController::class, 'alamat'])->name('alamat.index');
            Route::post('/alamat', [ProfilController::class, 'store_alamat'])->name('alamat.store');
            Route::post('/informasi-pribadi', [ProfilController::class, 'store_informasi_pribadi'])->name('informasi_pribadi.store');
        });
    Route::prefix('produk')
        ->name('produk.')
        ->middleware('auth')
        ->group(function () {
            Route::get('/data-produk', [ProductController::class, 'index'])->name('product.index');
            Route::get('/export-data-produk', [ProductController::class, 'export'])->name('product.export');
            Route::post('/import-data-produk', [ProductController::class, 'import'])->name('product.import');
            Route::get('/data-produk/create', [ProductController::class, 'create'])->name('product.create');
            Route::post('/data-produk', [ProductController::class, 'store'])->name('product.store');
            Route::get('/data-produk/{uuid}/edit', [ProductController::class, 'edit'])->name('product.edit'); //
            // Route::post('/data-produk/{uuid}', [ProductController::class, 'update'])->name('product.update'); /
            Route::delete('/data-produk/{uuid}', [ProductController::class, 'destroy'])->name('product.destroy');
            Route::delete('/bulk-delete/data-produk', [ProductController::class, 'bulk_destroy'])->name('product.bulk_destroy');
            Route::get('/download-template-produk', [ProductController::class, 'downloadTemplate'])->name('product.downloadTemplate');
        });
    Route::prefix('reporting')
        ->name('reporting.')
        ->middleware('auth')
        ->group(function () {
            Route::get('/penjualan', [PenjualanController::class, 'index'])->name('penjualan.index');
            Route::get('/penjualan/{uuid}', [PenjualanController::class, 'show'])->name('penjualan.show');
            Route::get('/penjualan-export/{uuid}', [PenjualanController::class, 'show_export'])->name('penjualan.export.detail');
            Route::get('/export-penjualan', [PenjualanController::class, 'export'])->name('penjualan.export');
            // Route::get('/item', fn() => Inertia::render('Reporting/Item'));
            // Route::get('/item', [VariantStockController::class, 'index'])->name('item.index');
            // Route::get('/item-export', [VariantStockController::class, 'export'])->name('item.export');
            // Route::post('/item', [VariantStockController::class, 'store'])->name('item.store');
            // Route::delete('/item/{uuid}', [VariantStockController::class, 'destroy'])->name('item.destroy');
        });
    Route::prefix('pesanan')
        ->name('pesanan.')
        ->group(function () {
            Route::get('/manajemen-pesanan', [TransactionController::class, 'index'])->name('manajemen.index');
            Route::get('/export-pesanan', [TransactionController::class, 'export'])->name('manajemen.export');
            Route::post('/import-pesanan', [TransactionController::class, 'import'])->name('manajemen.import');
            Route::delete('/manajemen-pesanan/{uuid}', [TransactionController::class, 'destroy'])->name('manajemen.destroy');
            Route::post('/manajemen-pesanan/{uuid}', [TransactionController::class, 'update'])->name('manajemen.update');
        });
    Route::delete('/variant/{uuid}', [VariantController::class, 'destroy'])->name('variant.destroy');
    Route::get('/export-variant', [VariantController::class, 'export'])->name('variant.export');

    Route::prefix('master')
        ->name('master.')
        ->middleware('auth')
        ->group(function () {
            // Category
            Route::get('/category', [CategoryController::class, 'index'])->name('category.index');
            Route::post('/category', [CategoryController::class, 'store'])->name('category.store');
            Route::delete('/category/{uuid}', [CategoryController::class, 'destroy'])->name('category.destroy');
            Route::delete('/bulk-delete/category', [CategoryController::class, 'bulk_destroy'])->name('category.bulk_destroy');


            // Brand
            Route::get('/brand', [BrandController::class, 'index'])->name('brand.index');
            Route::post('/brand', [BrandController::class, 'store'])->name('brand.store');
            Route::delete('/brand/{uuid}', [BrandController::class, 'destroy'])->name('brand.destroy');
            Route::delete('/bulk-delete/brand', [BrandController::class, 'bulk_destroy'])->name('brand.bulk_destroy');

            // Banner
            Route::get('/banner', [BannerController::class, 'index'])->name('banner.index');
            Route::post('/banner', [BannerController::class, 'store'])->name('banner.store');
            Route::delete('/banner/{uuid}', [BannerController::class, 'destroy'])->name('banner.destroy');

            // Bill
            Route::get('/bill', [BillController::class, 'index'])->name('bill.index');
            Route::post('/bill', [BillController::class, 'store'])->name('bill.store');
            Route::delete('/bill/{uuid}', [BillController::class, 'destroy'])->name('bill.destroy');
        });
    Route::prefix('setting')
        ->name('setting.')
        ->middleware('auth')
        ->group(function () {
            // Category
            Route::get('/term', [TermController::class, 'index'])->name('term.index');
            Route::post('/term', [TermController::class, 'store'])->name('term.store');
            Route::delete('/term/{uuid}', [TermController::class, 'destroy'])->name('term.destroy');

            Route::get('/user', [UserController::class, 'index'])->name('user.index');
            Route::post('/user', [UserController::class, 'store'])->name('user.store');
            Route::delete('/user/{id}', [UserController::class, 'destroy'])->name('user.destroy');

            Route::get('/role', [RoleController::class, 'index'])->name('role.index');
            Route::post('/role', [RoleController::class, 'store'])->name('role.store');
            Route::delete('/role/{id}', [RoleController::class, 'destroy'])->name('role.destroy');

            Route::get('/permission/{role_id}', [PermissionController::class, 'index'])->name('permission.index');
            Route::post('/permission', [PermissionController::class, 'store'])->name('permission.store');
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


// ->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

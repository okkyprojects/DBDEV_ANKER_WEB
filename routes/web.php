<?php

use App\Http\Controllers\ProfileController;
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

Route::get('/', function () {
    return Inertia::render('Beranda', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::get('/cart', function () {
    return Inertia::render('Cart');
});
Route::get('/checkout', function () {
return Inertia::render('Checkout');
});
Route::get('/product', function () {
    return Inertia::render('Product');
});
Route::get('/product/detail', function () {
    return Inertia::render('DetailProduct');
});


//Auth
Route::get('/stok/manajemen-stok', function () {
    return Inertia::render('Stok/StokPage');
});
Route::get('/reporting/penjualan', function () {
    return Inertia::render('Reporting/Penjualan');
});
Route::get('/reporting/item', function () {
    return Inertia::render('Reporting/Item');
});
Route::get('/pesanan/manajemen-pesanan', function () {
    return Inertia::render('Pesanan/ManajemenPesanan');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

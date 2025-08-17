<?php

use App\Http\Controllers\API\AddressController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BannerController;
use App\Http\Controllers\API\BillController;
use App\Http\Controllers\API\BrandController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\LocationController;
use App\Http\Controllers\API\PasswordController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\ProfilController;
use App\Http\Controllers\API\SellerController;
use App\Http\Controllers\API\TransactionController;
use App\Http\Controllers\API\VariantController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::apiResource('categories', CategoryController::class);
Route::apiResource('brands', BrandController::class);
Route::apiResource('products', ProductController::class);
Route::apiResource('variants', VariantController::class);
Route::get('/provinces', [LocationController::class, 'indexProvince']);
Route::get('/cities', [LocationController::class, 'indexCity']);
Route::get('/districts', [LocationController::class, 'indexDistrict']);
Route::get('/banners', [BannerController::class, 'index']);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('/resend-otp', [AuthController::class, 'resendOtp']);
    Route::post('/resend-otp/forgot-password', [AuthController::class, 'sendForgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/change-password', [PasswordController::class, 'store']);
    });
});
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('carts', CartController::class);
    Route::apiResource('transactions', TransactionController::class);
    Route::apiResource('addresses', AddressController::class);
    Route::post('/profile', [ProfilController::class, 'store']);
    Route::get('/sellers/{id}', [SellerController::class, 'show']);
    Route::get('/bills', [BillController::class, 'index']);
    Route::post('/transactions/{uuid}/repeat-order', [TransactionController::class, 'repeat_order']);
});

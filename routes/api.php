<?php

use App\Http\Controllers\API\AddressController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\BillController;
use App\Http\Controllers\API\BrandController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\LocationController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\ProfilController;
use App\Http\Controllers\API\SellerController;
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
Route::get('/provinces', [LocationController::class, 'indexProvince']);
Route::get('/cities', [LocationController::class, 'indexCity']);
Route::get('/districts', [LocationController::class, 'indexDistrict']);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('carts', CartController::class);
    Route::apiResource('addresses', AddressController::class);
    Route::post('/profile', [ProfilController::class, 'store']);
    Route::get('/sellers/{id}', [SellerController::class, 'show']);
    Route::get('/bills', [BillController::class, 'index']);
});

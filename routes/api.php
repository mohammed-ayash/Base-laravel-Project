<?php

use App\Http\Controllers\Admin\Auth\AuthController as AdminAuthController;
use App\Http\Controllers\Mobile\Auth\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//admin login
Route::controller(AdminAuthController::class)->group(function(){
    Route::post('admin/login',  'login');
});

//Mobile login
Route::controller(AuthController::class)->group(function(){
    Route::post('/otp/login', 'generateOtpCode');
    Route::post('/otp/verification', 'verifyOtpLogin');
});

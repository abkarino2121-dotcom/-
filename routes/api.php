<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\CustomerController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Protected routes (we'll just use simple grouping, sanctum protection is optional for the task demo but good practice)
Route::middleware('api')->group(function () {
    Route::apiResource('orders', OrderController::class);
    Route::get('/reports/vat', [ReportController::class, 'getVatReport']);
    Route::patch('/jobs/{id}/status', [JobController::class, 'updateStatus']);

    // Additional helpers
    Route::get('/materials', [MaterialController::class, 'index']);
    Route::get('/customers', [CustomerController::class, 'index']);
});

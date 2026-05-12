<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TaskPhotoController;
use App\Http\Controllers\Api\OfficeController;
use App\Http\Controllers\Api\ReportsController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BarangController;
use App\Http\Controllers\Api\BarangLogController;
use App\Http\Controllers\Api\StockController;


// 🔥 Handle OPTIONS request untuk CORS (diletakkan di paling atas)
Route::options('/{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', 'https://localhost')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With, X-CSRF-TOKEN')
        ->header('Access-Control-Allow-Credentials', 'true')
        ->header('Access-Control-Max-Age', '86400');
})->where('any', '.*');

Route::prefix('auth')->name('auth.')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->name('register');
    Route::post('login', [AuthController::class, 'login'])->name('login');

    Route::middleware('jwt')->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('me', [AuthController::class, 'me'])->name('me');
        Route::post('refresh', [AuthController::class, 'refresh'])->name('refresh');
    });
});

Route::middleware('jwt')->group(function () {

    // semua user login (admin & itsupport) bisa akses
    Route::get('employees', [EmployeeController::class, 'index']);
    Route::get('employees/options', [EmployeeController::class, 'options']);
    Route::post('employees', [EmployeeController::class, 'store']);
    Route::get('employees/{id}', [EmployeeController::class, 'show']);
    Route::put('employees/{id}', [EmployeeController::class, 'update']);
    Route::delete('employees/{id}', [EmployeeController::class, 'destroy']);

    Route::get('offices', [OfficeController::class, 'index']);
    // ======================
    // INVENTORY - BARANG
    // ======================
    Route::prefix('barang')->group(function () {
        Route::get('/', [BarangController::class, 'index']);
        Route::post('/', [BarangController::class, 'store']);
        Route::get('{id}', [BarangController::class, 'show']);
        Route::put('{id}', [BarangController::class, 'update']);
        Route::delete('{id}', [BarangController::class, 'destroy']);
    });

    // ======================
    // INVENTORY - LOG (INTI)
    // ======================
    Route::prefix('barang-logs')->group(function () {
        Route::get('/', [BarangLogController::class, 'index']);
        Route::post('/', [BarangLogController::class, 'store']);
        Route::get('{id}', [BarangLogController::class, 'show']);
        Route::delete('{id}', [BarangLogController::class, 'destroy']);
    });

    Route::get('/stocks', [StockController::class, 'index']);

    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']); // register pindah sini
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
        Route::put('/{id}/password', [UserController::class, 'updatePassword']);
    });

    Route::prefix('tasks')->group(function () {
        Route::get('/', [TaskController::class, 'index']);
        Route::post('/', [TaskController::class, 'store']);

        Route::get('/photo/download/{filename}', [TaskController::class, 'downloadPhoto']);

        Route::get('{id}', [TaskController::class, 'show']);
        Route::put('{id}', [TaskController::class, 'update']);
        Route::delete('{id}', [TaskController::class, 'destroy']);
        Route::post('{id}/photos', [TaskPhotoController::class, 'store']);
    });
    Route::delete('/task-photos/{id}', [TaskPhotoController::class, 'destroy']);
    Route::get('/reports/tasks/export', [ReportsController::class, 'exportTasks']);
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
    Route::get('/dashboard/recent', [DashboardController::class, 'recentTasks']);
    // Admin only
    // Route::middleware('role:admin')->group(function () {
    //     Route::post('phonebooks', [PhonebookController::class, 'store']);
    //     Route::put('phonebooks/{phonebook}', [PhonebookController::class, 'update']);
    //     Route::delete('phonebooks/{phonebook}', [PhonebookController::class, 'destroy']);
    // });
});

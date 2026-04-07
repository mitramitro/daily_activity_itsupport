<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\api\DashboardController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TaskPhotoController;
use App\Http\Controllers\Api\OfficeController;
use App\Http\Controllers\Api\ReportsController;
use App\Http\Controllers\api\UserController;

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
    Route::post('employees', [EmployeeController::class, 'store']);
    Route::get('employees/{id}', [EmployeeController::class, 'show']);
    Route::put('employees/{id}', [EmployeeController::class, 'update']);
    Route::delete('employees/{id}', [EmployeeController::class, 'destroy']);

    Route::get('offices', [OfficeController::class, 'index']);
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
        Route::get('{id}', [TaskController::class, 'show']);
        Route::put('{id}', [TaskController::class, 'update']);
        Route::delete('{id}', [TaskController::class, 'destroy']);
        // 🔥 upload foto
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

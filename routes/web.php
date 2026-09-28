<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminUserManagementController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\EventPackageController;

Route::get('/', [VenueController::class, 'welcome'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();
        if ($user->hasAnyRole(['admin', 'superadmin'])) {
            return redirect()->route('admin.dashboard');
        } elseif ($user->hasRole('staff')) {
            return redirect()->route('staff.dashboard');
        }
        return redirect()->route('user.dashboard');
    })->name('dashboard');

    Route::inertia('user-dashboard', 'UserDashboard')->name('user.dashboard');
    Route::get('users-staff', [AdminUserManagementController::class, 'index'])->name('users');
    Route::post('users-staff', [AdminUserManagementController::class, 'store'])->name('users.store');
    Route::put('users-staff/{user}', [AdminUserManagementController::class, 'update'])->name('users.update');
    Route::delete('users-staff/{user}', [AdminUserManagementController::class, 'destroy'])->name('users.destroy');

    Route::get('venues', [VenueController::class, 'index'])->name('venues');
    Route::post('venues', [VenueController::class, 'store'])->name('venues.store');
    Route::put('venues/{venue}', [VenueController::class, 'update'])->name('venues.update');
    Route::delete('venues/{venue}', [VenueController::class, 'destroy'])->name('venues.destroy');
    Route::patch('venues/{venue}/availability', [VenueController::class, 'toggleAvailability'])->name('venues.availability');

    Route::get('reservations', [ReservationController::class, 'index'])->name('reservations');
    Route::post('reservations', [ReservationController::class, 'store'])->name('reservations.store');

    Route::get('admin/reservations', [ReservationController::class, 'adminIndex'])
        ->name('admin.reservations');
    Route::patch('admin/reservations/{reservation}/status', [ReservationController::class, 'updateStatus'])
        ->name('admin.reservations.status');

    Route::inertia('userCalendar', 'userCalendar')->name('scheduling');
    Route::get('cafe-orders', [MenuItemController::class, 'customerIndex'])
    ->name('cafe');
    Route::post('cafe/orders', [OrderController::class, 'store'])
    ->name('cafe.orders.store');
    Route::patch('cafe/orders/{order}/status', [OrderController::class, 'updateStatus'])
    ->name('cafe.orders.status');
    Route::get(
        'event-packages',
        [EventPackageController::class, 'index']
    )->name('packages');
    Route::get('payments', [ReservationController::class, 'payments'])
    ->name('payments');
    Route::post(
        'reservations/{reservation}/payment-proof',
        [ReservationController::class, 'submitPaymentProof']
    )->name('reservations.payment-proof');
    Route::patch(
        'admin/reservations/{reservation}/payment-status',
        [ReservationController::class, 'updatePaymentStatus']
    )->name('admin.reservations.payment-status');
    Route::inertia('reports', 'reports')->name('reports');
    Route::inertia('notifications', 'notifications')->name('notifications');

    //ADMIN ROUTES HERE PLEASE
    Route::get('admin-dashboard', [AdminDashboardController::class, 'index'])
    ->name('admin.dashboard');
    Route::get('admin-venues', [VenueController::class, 'adminIndex'])
        ->name('admin.venues');
    Route::get('admin-cafe', [MenuItemController::class, 'index'])
    ->name('admin.cafe');
    Route::post('admin-cafe', [MenuItemController::class, 'store'])
    ->name('admin.cafe.store');

    Route::put('admin-cafe/{menuItem}', [MenuItemController::class, 'update'])
    ->name('admin.cafe.update');

    Route::delete('admin-cafe/{menuItem}', [MenuItemController::class, 'destroy'])
    ->name('admin.cafe.destroy');

    Route::patch('admin-cafe/{menuItem}/availability', [MenuItemController::class, 'toggleAvailability'])
    ->name('admin.cafe.availability');
    Route::get(
        'admin-packages',
        [EventPackageController::class, 'adminIndex']
    )->name('admin.packages');

    Route::post(
        'admin-packages',
        [EventPackageController::class, 'store']
    )->name('admin.packages.store');

    Route::put(
        'admin-packages/{eventPackage}',
        [EventPackageController::class, 'update']
    )->name('admin.packages.update');

    Route::delete(
        'admin-packages/{eventPackage}',
        [EventPackageController::class, 'destroy']
    )->name('admin.packages.destroy');

    Route::patch(
        'admin-packages/{eventPackage}/availability',
        [EventPackageController::class, 'toggleAvailability']
    )->name('admin.packages.availability');
    Route::inertia('admin-scheduling', 'AdminScheduling')->name('admin.scheduling');
    Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('admin.activity-logs');

    //STAFF ROUTES HERE PLEASE
    Route::inertia('staff-dashboard', 'StaffDashboard')->name('staff.dashboard');
    Route::inertia('assigned-events', 'StaffAssigned-Events')->name('events');
    Route::get('staff-cafe', [OrderController::class, 'staffIndex'])
    ->name('staff.cafe');
});

require __DIR__ . '/settings.php';

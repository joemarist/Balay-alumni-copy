<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminUserManagementController;
use App\Http\Controllers\ActivityLogController;

Route::inertia('/', 'welcome')->name('home');

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
    Route::inertia('venues', 'UserVenues')->name('venues');
    Route::inertia('reservations', 'reservations')->name('reservations');
    Route::inertia('userCalendar', 'userCalendar')->name('scheduling');
    Route::inertia('cafe-orders', 'UserCafe')->name('cafe');
    Route::inertia('event-packages', 'event-packages')->name('packages');
    Route::inertia('payments', 'payments')->name('payments');
    Route::inertia('reports', 'reports')->name('reports');
    Route::inertia('notifications', 'notifications')->name('notifications');

    //ADMIN ROUTES HERE PLEASE
    Route::inertia('admin-dashboard', 'AdminDashboard')->name('admin.dashboard');
    Route::inertia('admin-venues', 'AdminVenues')->name('admin.venues');
    Route::inertia('admin-cafe', 'AdminCafe')->name('admin.cafe');
    Route::inertia('admin-packages', 'AdminPackages')->name('admin.packages');
    Route::inertia('admin-scheduling', 'AdminScheduling')->name('admin.scheduling');
    Route::get('activity-logs', [ActivityLogController::class, 'index'])
    ->name('admin.activity-logs');

    //STAFF ROUTES HERE PLEASE
    Route::inertia('staff-dashboard', 'StaffDashboard')->name('staff.dashboard');
    Route::inertia('assigned-events', 'StaffAssigned-Events')->name('events');
    Route::inertia('staff-cafe', 'StaffCafe')->name('staff.cafe');


});

require __DIR__ . '/settings.php';

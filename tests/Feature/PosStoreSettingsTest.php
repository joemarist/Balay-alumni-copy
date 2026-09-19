<?php

use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Spatie\Permission\Models\Role;

test('the required roles and permissions are seeded idempotently', function () {
    Artisan::call('db:seed', ['--class' => 'RolesAndPermissionsSeeder']);
    Artisan::call('db:seed', ['--class' => 'RolesAndPermissionsSeeder']);

    expect(Role::whereIn('name', ['admin', 'staff', 'user'])->count())->toBe(3);
    expect(Role::findByName('admin')->hasPermissionTo('manage-settings'))->toBeTrue();
    expect(Role::findByName('staff')->hasPermissionTo('view-settings'))->toBeTrue();
    expect(Role::findByName('user')->hasPermissionTo('view-settings'))->toBeFalse();
    expect(Role::findByName('user')->hasPermissionTo('manage-settings'))->toBeFalse();
});

test('staff can view pos store settings but cannot update them', function () {
    Artisan::call('db:seed', ['--class' => 'RolesAndPermissionsSeeder']);

    $staff = User::factory()->create();
    $staff->assignRole('staff');

    $this->actingAs($staff)
        ->get(route('pos-settings.edit'))
        ->assertOk();

    $this->actingAs($staff)
        ->put(route('pos-settings.update'), [
            'store_name' => 'Updated Name',
        ])
        ->assertForbidden();
});

test('admin can update pos store settings and persist them', function () {
    Artisan::call('db:seed', ['--class' => 'RolesAndPermissionsSeeder']);

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->put(route('pos-settings.update'), [
            'store_name' => 'Balay Alumni HQ',
            'store_address' => '123 Alumni St',
            'store_phone' => '+639171234567',
            'store_email' => 'hello@balay.local',
            'currency' => 'PHP',
            'currency_symbol' => '₱',
            'tax_rate' => 12,
            'receipt_header' => 'Welcome to Balay Alumni',
            'receipt_footer' => 'Thank you for shopping!',
            'show_store_contact_on_receipt' => true,
            'low_stock_threshold' => 15,
            'invoice_prefix' => 'BAL-',
        ])
        ->assertRedirect(route('pos-settings.edit'));

    $settings = app(App\Settings\PosStoreSettings::class);

    expect($settings->store_name)->toBe('Balay Alumni HQ');
    expect($settings->invoice_prefix)->toBe('BAL-');
    expect((bool) $settings->show_store_contact_on_receipt)->toBeTrue();
});

test('user cannot access pos store settings', function () {
    Artisan::call('db:seed', ['--class' => 'RolesAndPermissionsSeeder']);

    $user = User::factory()->create();
    $user->assignRole('user');

    $this->actingAs($user)
        ->get(route('pos-settings.edit'))
        ->assertForbidden();
});

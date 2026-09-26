<?php

use App\Models\User;
use Tests\TestCase;

test('guests are redirected to the login page', function () {
    /** @var TestCase $this */
    $response = $this->get(route('dashboard'));

    $response->assertRedirect(route('login'));
});

test('authenticated customers are redirected to the user dashboard', function () {
    /** @var TestCase $this */
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $user->assignRole('user');

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    $response->assertRedirect(route('user.dashboard'));
});

test('authenticated admins are redirected to the admin dashboard', function () {
    /** @var TestCase $this */
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $user->assignRole('admin');

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    $response->assertRedirect(route('admin.dashboard'));
});

test('authenticated staff are redirected to the staff dashboard', function () {
    /** @var TestCase $this */
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $user->assignRole('staff');

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    $response->assertRedirect(route('staff.dashboard'));
});

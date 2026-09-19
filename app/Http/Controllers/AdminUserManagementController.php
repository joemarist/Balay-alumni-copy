<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class AdminUserManagementController extends Controller
{
    public function index(): Response
    {
        $users = User::with('roles')
            ->latest()
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => match ($user->getRoleNames()->first()) {
                    'admin', 'superadmin' => 'Admin',
                    'staff' => 'Staff',
                    default => 'Customer',
                },
                'joined' => $user->created_at?->format('M j, Y'),
                'reservations' => 0,
                'status' => $user->status ?? 'Inactive',
            ]);

        return Inertia::render('AdminUserManagement', [
            'users' => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'in:Customer,Staff,Admin'],
        ]);

        $role = match ($validated['role']) {
            'Admin' => 'admin',
            'Staff' => 'staff',
            default => 'user',
        };

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignRole($role);

        return redirect()->route('users')->with('success', 'User added successfully.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
            $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],
            'role' => ['required', 'in:Customer,Staff,Admin'],
            'status' => ['required', 'in:Active,Suspended,Inactive'],
        ]);

        $attributes = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'status' => $validated['status'],
        ];

        if (! empty($validated['password'])) {
            $attributes['password'] = Hash::make($validated['password']);
        }

        $oldRole = $user->getRoleNames()->first();

        $newRole = match ($validated['role']) {
            'Admin' => 'admin',
            'Staff' => 'staff',
            default => 'user',
        };

        $user->update($attributes);

        $user->syncRoles($newRole);

        if ($oldRole !== $newRole) {
            activity('users')
                ->causedBy(Auth::user())
                ->performedOn($user)
                ->withProperties([
                    'old_role' => $oldRole,
                    'new_role' => $newRole,
                ])
                ->log('role changed');
}



        return redirect()->route('users')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->syncRoles([]);
        $user->delete();

        return redirect()->route('users')->with('success', 'User deleted successfully.');
    }
}
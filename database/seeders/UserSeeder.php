<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;
    public function run(): void
    {
        $users = [['name' => 'Admin User', 'email' => 'admin@balay.com', 'role' => 'admin', 'password' => 'password123', 'status' => 'Active',], ['name' => 'Staff User', 'email' => 'staff@balay.com', 'role' => 'staff', 'password' => 'password123', 'status' => 'Active',], ['name' => 'Juan', 'email' => 'juan@example.com', 'role' => 'user', 'password' => 'password', 'status' => 'Active',], ['name' => 'Maria', 'email' => 'maria@example.com', 'role' => 'user', 'password' => 'password', 'status' => 'Inactive',], ['name' => 'Pedro', 'email' => 'pedro@example.com', 'role' => 'user', 'password' => 'password', 'status' => 'Inactive',], ['name' => 'Ana', 'email' => 'ana@example.com', 'role' => 'user', 'password' => 'password', 'status' => 'Inactive',], ['name' => 'Jose', 'email' => 'jose@example.com', 'role' => 'user', 'password' => 'password', 'status' => 'Inactive',],];
        foreach ($users as $data) {
            $user = User::updateOrCreate(['email' => $data['email']], ['name' => $data['name'], 'password' => Hash::make($data['password']), 'status' => $data['status'], 'email_verified_at' => now(),]);
            $user->syncRoles([$data['role']]);
        }
    }
}

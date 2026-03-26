<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleAndUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Roles
        $roles = [
            'Admin',
            'Sales',
            'Designer',
            'Production',
            'Installer',
            'Accountant'
        ];

        foreach ($roles as $role) {
            Role::create(['name' => $role]);
        }

        // Create Admin User
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@egyprint.com',
            'password' => Hash::make('password')
        ]);
        $admin->assignRole('Admin');

        // Create Sales User
        $sales = User::create([
            'name' => 'Sales User',
            'email' => 'sales@egyprint.com',
            'password' => Hash::make('password')
        ]);
        $sales->assignRole('Sales');
    }
}

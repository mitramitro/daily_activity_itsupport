<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('Admin@123'),
            'role' => 'admin'
        ]);

        User::create([
            'name' => 'IT Support',
            'email' => 'itsupport@gmail.com',
            'password' => Hash::make('Support@123'),
            'role' => 'user'
        ]);
    }
}

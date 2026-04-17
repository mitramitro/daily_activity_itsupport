<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Office; // 🔥 UPDATED

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 🔥 ambil ID office berdasarkan nama
        $officeIds = Office::pluck('id', 'name');

        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('Admin@123'),
            'role' => 'admin',

            // 🔥 OPTIONAL admin kasih office pusat
            'office_id' => $officeIds['Region JBB'] ?? null,
        ]);

        User::create([
            'name' => 'Sumitro H',
            'email' => 'bbmblg@mail.com',
            'password' => Hash::make('Balongan@123'),
            'role' => 'user',

            // 🔥 FT Balongan
            'office_id' => $officeIds['FT Balongan'] ?? null,
        ]);

        User::create([
            'name' => 'Adryanto T',
            'email' => 'lpgblg@mail.com',
            'password' => Hash::make('Balongan@123'),
            'role' => 'user',

            // 🔥 LPG Balongan
            'office_id' => $officeIds['LPG Balongan'] ?? null,
        ]);
    }
}

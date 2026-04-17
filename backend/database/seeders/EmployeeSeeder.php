<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Employee;
use App\Models\Office; // 🔥 UPDATED

class EmployeeSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 🔥 UPDATED: ambil ID berdasarkan nama office
        $officeIds = Office::pluck('id', 'name');

        $employees = [
            [
                'nama' => 'Siti Aminah',
                'nomor_pekerja' => 'EMP003',
                'no_hp' => '0813333333',
                'email' => 'siti@mail.com',
                'jabatan' => 'Admin',
                'status' => 'Mitra Kerja',
                'fungsi' => 'Administrasi',
                'office_id' => $officeIds['FT Balongan'] ?? null,
            ],

            [
                'nama' => 'Dewi Lestari',
                'nomor_pekerja' => 'EMP005',
                'no_hp' => '0815555555',
                'email' => 'dewi@mail.com',
                'jabatan' => 'Finance',
                'status' => 'Pekerja',
                'fungsi' => 'Keuangan',
                'office_id' => $officeIds['LPG Balongan'] ?? null,
            ],


            [
                'nama' => 'Fajar Nugroho',
                'nomor_pekerja' => 'EMP010',
                'no_hp' => '0810000000',
                'email' => 'fajar@mail.com',
                'jabatan' => 'Operator',
                'status' => 'Pekerja',
                'fungsi' => 'Operasional',
                'office_id' => $officeIds['FT Cikampek'] ?? null,
            ],
        ];

        foreach ($employees as $employee) {
            Employee::create($employee);
        }
    }
}

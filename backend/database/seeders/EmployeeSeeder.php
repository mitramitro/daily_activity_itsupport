<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Employee;

class EmployeeSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = [
            [
                'nama' => 'Budi Santoso',
                'nomor_pekerja' => 'EMP001',
                'no_hp' => '0811111111',
                'email' => 'budi@mail.com',
                'jabatan' => 'Operator',
                'status' => 'Pekerja',
                'lokasi' => 'FT Cikampek',
                'keterangan' => 'User printer'
            ],
            [
                'nama' => 'Andi Wijaya',
                'nomor_pekerja' => 'EMP002',
                'no_hp' => '0812222222',
                'email' => 'andi@mail.com',
                'jabatan' => 'Supervisor',
                'status' => 'Pekerja',
                'lokasi' => 'FT Padalarang',
                'keterangan' => null
            ],
            [
                'nama' => 'Siti Aminah',
                'nomor_pekerja' => 'EMP003',
                'no_hp' => '0813333333',
                'email' => 'siti@mail.com',
                'jabatan' => 'Admin',
                'status' => 'Mitra Kerja',
                'lokasi' => 'Integrated Terminal Balongan - Fuel',
                'keterangan' => null
            ],
            [
                'nama' => 'Rudi Hartono',
                'nomor_pekerja' => 'EMP004',
                'no_hp' => '0814444444',
                'email' => 'rudi@mail.com',
                'jabatan' => 'Operator',
                'status' => 'Pekerja',
                'lokasi' => 'FT Cikampek',
                'keterangan' => null
            ],
            [
                'nama' => 'Dewi Lestari',
                'nomor_pekerja' => 'EMP005',
                'no_hp' => '0815555555',
                'email' => 'dewi@mail.com',
                'jabatan' => 'Finance',
                'status' => 'Pekerja',
                'lokasi' => 'FT Padalarang',
                'keterangan' => null
            ],
            [
                'nama' => 'Ahmad Fauzi',
                'nomor_pekerja' => 'EMP006',
                'no_hp' => '0816666666',
                'email' => 'ahmad@mail.com',
                'jabatan' => 'Operator',
                'status' => 'Mitra Kerja',
                'lokasi' => 'Integrated Terminal Balongan - Fuel',
                'keterangan' => null
            ],
            [
                'nama' => 'Rina Kurnia',
                'nomor_pekerja' => 'EMP007',
                'no_hp' => '0817777777',
                'email' => 'rina@mail.com',
                'jabatan' => 'HR',
                'status' => 'Pekerja',
                'lokasi' => 'FT Cikampek',
                'keterangan' => null
            ],
            [
                'nama' => 'Yoga Pratama',
                'nomor_pekerja' => 'EMP008',
                'no_hp' => '0818888888',
                'email' => 'yoga@mail.com',
                'jabatan' => 'Technician',
                'status' => 'Pekerja',
                'lokasi' => 'FT Padalarang',
                'keterangan' => null
            ],
            [
                'nama' => 'Lina Marlina',
                'nomor_pekerja' => 'EMP009',
                'no_hp' => '0819999999',
                'email' => 'lina@mail.com',
                'jabatan' => 'Admin',
                'status' => 'Mitra Kerja',
                'lokasi' => 'Integrated Terminal Balongan - Fuel',
                'keterangan' => null
            ],
            [
                'nama' => 'Fajar Nugroho',
                'nomor_pekerja' => 'EMP010',
                'no_hp' => '0810000000',
                'email' => 'fajar@mail.com',
                'jabatan' => 'Operator',
                'status' => 'Pekerja',
                'lokasi' => 'FT Cikampek',
                'keterangan' => null
            ]
        ];

        foreach ($employees as $employee) {
            Employee::create($employee);
        }
    }
}

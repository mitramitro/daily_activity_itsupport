<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OfficeSeeder extends Seeder
{
    public function run(): void
    {
        $offices = [
            'FT Cikampek',
            'FT Padalarang',
            'FT Tasikmalaya',
            'FT Tj Gerem',
            'FT Ujung Berung',
            'IT Balongan - FT Balongan',
            'IT Balongan - LPG Balongan',
            'IT Jakarta - FT Plumpang',
            'IT Jakarta - FT Priok',
            'IT Jakarta - LPG Priok',
            'Kantor Cabang Bandung',
            'SHAFTI',
            'Kantor Region JBB',
        ];

        foreach ($offices as $office) {
            DB::table('offices')->insert([
                'name' => $office,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}

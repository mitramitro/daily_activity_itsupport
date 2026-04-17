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
            'FT Balongan',
            'LPG Balongan',
            'FT Plumpang',
            'FT Priok',
            'LPG Priok',
            'Cabang Bandung',
            'SHAFTI',
            'Region JBB',
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

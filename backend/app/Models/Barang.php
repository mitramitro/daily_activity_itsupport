<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    protected $table = 'barang';

    protected $fillable = [
        'name',
        'type', // consumable / non_consumable
        'unit',

    ];

    // 🔗 Relasi ke logs
    public function logs()
    {
        return $this->hasMany(BarangLog::class, 'barang_id');
    }
    public function stocks()
    {
        return $this->hasMany(BarangStock::class);
    }
}

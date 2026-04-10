<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarangStock extends Model
{
    protected $table = 'barang_stocks';

    protected $fillable = [
        'barang_id',
        'office_id',
        'stock',
    ];

    // ======================
    // RELATION
    // ======================

    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }

    public function office()
    {
        return $this->belongsTo(Office::class);
    }
}

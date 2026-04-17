<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'nama',
        'nomor_pekerja',
        'no_hp',
        'email',
        'jabatan',
        'status',
        'office_id',
    ];

    public function office()
    {
        return $this->belongsTo(Office::class);
    }
}

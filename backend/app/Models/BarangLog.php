<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarangLog extends Model
{
    protected $table = 'barang_logs';

    protected $fillable = [
        'barang_id',
        'qty',
        'type',

        'from_office_id',
        'to_office_id',

        'from_employee_id',
        'to_employee_id',

        'condition',
        'notes',
        'tanggal',
        'created_by'
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    // 🔗 Relasi
    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }

    public function fromOffice()
    {
        return $this->belongsTo(Office::class, 'from_office_id');
    }

    public function toOffice()
    {
        return $this->belongsTo(Office::class, 'to_office_id');
    }

    public function fromEmployee()
    {
        return $this->belongsTo(Employee::class, 'from_employee_id');
    }

    public function toEmployee()
    {
        return $this->belongsTo(Employee::class, 'to_employee_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

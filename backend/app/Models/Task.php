<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'employee_id',
        'user_id',
        'office_id',
        'kategori',
        'jenis_task',
        'kendala',
        'solusi',
        'status',
        'tanggal'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function photos()
    {
        return $this->hasMany(TaskPhoto::class);
    }

    public function logs()
    {
        return $this->hasMany(TaskLog::class);
    }
    public function office()
    {
        return $this->belongsTo(Office::class);
    }
}

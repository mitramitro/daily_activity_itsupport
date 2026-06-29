<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    protected $fillable = ['name'];

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function barangStocks()
    {
        return $this->hasMany(BarangStock::class);
    }

    public function barangLogsFrom()
    {
        return $this->hasMany(BarangLog::class, 'from_office_id');
    }

    public function barangLogsTo()
    {
        return $this->hasMany(BarangLog::class, 'to_office_id');
    }
}

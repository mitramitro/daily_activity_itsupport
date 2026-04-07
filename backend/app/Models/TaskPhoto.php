<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskPhoto extends Model
{
    protected $fillable = [
        'task_id',
        'photo',
    ];
    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function photos()
    {
        return $this->hasMany(TaskPhoto::class);
    }
}

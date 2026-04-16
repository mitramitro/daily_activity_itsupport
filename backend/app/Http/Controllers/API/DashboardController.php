<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Task;

class DashboardController extends Controller
{


    public function summary()
    {
        $user = auth()->user();
        //$user = \App\Models\User::first(); // dummy
        $now = now();

        // 🔥 simpan range biar tidak hitung ulang
        $start = $now->copy()->startOfMonth();
        $end   = $now->copy()->endOfMonth();

        $query = Task::query();

        // 🔒 Role-based filter
        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        $summary = (clone $query)
            ->where(function ($q) use ($start, $end) {
                $q->whereBetween('created_at', [$start, $end])
                    ->orWhereBetween('updated_at', [$start, $end]);
            })
            ->selectRaw("
            COALESCE(SUM(status = 'resolved'), 0) as resolved,
            COALESCE(SUM(status = 'pending'), 0) as pending,
            COALESCE(SUM(status = 'in_progress'), 0) as progress
        ")
            ->first();

        return response()->json([
            'resolved' => (int) $summary->resolved,
            'pending'  => (int) $summary->pending,
            'progress' => (int) $summary->progress,
        ]);
    }

    public function recentTasks()
    {
        $query = Task::with(['user:id,name']);

        // 🔒 role-based
        if (auth()->user()->role !== 'admin') {
            $query->where('user_id', auth()->id());
        }

        $tasks = $query->latest()->take(3)->get();

        return response()->json($tasks);
    }
}

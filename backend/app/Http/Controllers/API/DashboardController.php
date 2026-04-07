<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Task;

class DashboardController extends Controller
{


    public function summary()
    {
        $user = auth()->user();
        $now = Carbon::now();

        $query = Task::query();

        // 🔒 Role-based filter
        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        // clone query biar tidak bentrok
        $resolved = (clone $query)
            ->whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->where('status', 'resolved')
            ->count();

        $pending = (clone $query)
            ->whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->where('status', 'pending')
            ->count();

        $progress = (clone $query)
            ->whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->where('status', 'in_progress')
            ->count();

        return response()->json([
            'resolved' => $resolved,
            'pending' => $pending,
            'progress' => $progress
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

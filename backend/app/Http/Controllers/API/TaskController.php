<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\TaskPhoto;
use App\Models\TaskLog;
use Carbon\Carbon;

class TaskController extends Controller
{
    /**
     * GET /tasks (pagination + search + filter)
     */
    public function index(Request $request)
    {
        $query = Task::with([
            'employee:id,nama',
            'user:id,name',
            'office:id,name',
            'photos:id,task_id,photo',
            'logs.user:id,name'
        ]);

        // 🔒 ROLE BASED FILTER (WAJIB DI SINI)
        if (auth()->user()->role !== 'admin') {
            $query->where('user_id', auth()->id());
        }

        // 🔍 SEARCH GLOBAL (MULTI KEYWORD)
        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $keywords = explode(' ', $search);

            $query->where(function ($q) use ($keywords) {

                // 🔹 kendala
                $q->where(function ($sub) use ($keywords) {
                    foreach ($keywords as $word) {
                        $sub->where('kendala', 'like', "%$word%");
                    }
                })

                    // 🔹 kategori
                    ->orWhere(function ($sub) use ($keywords) {
                        foreach ($keywords as $word) {
                            $sub->where('kategori', 'like', "%$word%");
                        }
                    })

                    // 🔹 office (relasi)
                    ->orWhereHas('office', function ($q2) use ($keywords) {
                        foreach ($keywords as $word) {
                            $q2->whereRaw('LOWER(name) LIKE ?', ["%$word%"]);
                        }
                    })

                    // 🔹 user (relasi)
                    ->orWhereHas('user', function ($q2) use ($keywords) {
                        foreach ($keywords as $word) {
                            $q2->where('name', 'like', "%$word%");
                        }
                    })
                    ->orWhereHas('employee', function ($q2) use ($keywords) {
                        foreach ($keywords as $word) {
                            $q2->whereRaw('LOWER(nama) LIKE ?', ["%$word%"]);
                        }
                    });
            });
        }

        if ($request->filled('jenis_task')) {
            $query->where('jenis_task', $request->jenis_task);
        }
        // 🎯 filter status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // 🎯 filter office
        if ($request->office_id) {
            $query->where('office_id', $request->office_id);
        }

        // filter tanggal
        if ($request->tanggal_dari && $request->tanggal_sampai) {
            $query->whereBetween('tanggal', [
                $request->tanggal_dari,
                $request->tanggal_sampai
            ]);
        }

        // 🔥 SUMMARY (FIXED)
        $summaryQuery = Task::query();
        $now = Carbon::now();

        if (auth()->user()->role !== 'admin') {
            $summaryQuery->where('user_id', auth()->id());
        }

        // 📅 Filter bulan & tahun
        $summaryQuery->whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year);

        $summary = [
            'total_all' => (clone $summaryQuery)->count(),

            'total_incident' => (clone $summaryQuery)
                ->where('jenis_task', 'incident')
                ->count(),

            'total_request' => (clone $summaryQuery)
                ->where('jenis_task', 'request')
                ->count(),
        ];

        $tasks = $query->latest()->paginate(10);

        return response()->json([
            'message' => 'List Task',
            'data' => $tasks,
            'summary' => $summary
        ]);
    }

    /**
     * GET /tasks/{id}
     */
    public function show($id)
    {
        $task = Task::with([
            'employee:id,nama',
            'office:id,name',
            'user:id,name',
            'photos',
            'logs.user:id,name'
        ])->find($id);

        if (!$task) {
            return response()->json([
                'message' => 'Task tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'message' => 'Detail Task',
            'data' => $task
        ]);
    }

    /**
     * POST /tasks
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'office_id' => 'required',
            'kategori' => 'required',
            'jenis_task' => 'required|in:incident,request',
            'kendala' => 'required',
            'tanggal' => 'required|date',
            'photos.*' => 'image|mimes:jpg,jpeg,png|max:2048'
        ]);

        // 1. simpan task
        $task = Task::create([
            'employee_id' => $request->employee_id,
            'user_id' => $user->id,
            'office_id' => $request->office_id,
            'kategori' => $request->kategori,
            'jenis_task' => $request->jenis_task,
            'kendala' => $request->kendala,
            'solusi' => $request->solusi,
            'status' =>  $request->status ?? 'in_progress',
            'tanggal' => $request->tanggal,
        ]);

        // 2. log awal
        TaskLog::create([
            'task_id' => $task->id,
            'user_id' => $user->id,
            'status' => $task->status,
            'note' => 'Task dibuat'
        ]);

        // 3. upload foto (multi)
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $file) {
                $path = $file->store('tasks', 'public');

                TaskPhoto::create([
                    'task_id' => $task->id,
                    'photo' => $path
                ]);
            }
        }

        return response()->json([
            'message' => 'Task berhasil dibuat',
            'data' => $task
        ], 201);
    }

    /**
     * PUT /tasks/{id}
     */
    public function update(Request $request, $id)
    {
        $user = auth()->user();

        $task = Task::find($id);

        if (!$task) {
            return response()->json([
                'message' => 'Task tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'status' => 'required|in:pending,in_progress,resolved',
            'kendala' => 'nullable',
            'solusi' => 'nullable',
            'photos.*' => 'image|max:2048'
        ]);

        $oldStatus = $task->status;

        // update task
        $task->update([
            'status' => $request->status,
            'kendala' => $request->kendala,
            'solusi' => $request->solusi ?? $task->solusi,
        ]);

        // 🔥 hanya log jika status berubah
        if ($request->status !== $oldStatus) {
            TaskLog::create([
                'task_id' => $task->id,
                'user_id' => $user->id,
                'status' => $request->status,
                'note' => 'Update ke ' . $request->status
            ]);
        }

        // upload foto tambahan
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $file) {
                $path = $file->store('tasks', 'public');

                TaskPhoto::create([
                    'task_id' => $task->id,
                    'photo' => $path
                ]);
            }
        }

        return response()->json([
            'message' => 'Task berhasil diupdate',
            'data' => $task
        ]);
    }

    /**
     * DELETE /tasks/{id}
     */
    public function destroy($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json([
                'message' => 'Task tidak ditemukan'
            ], 404);
        }

        $task->delete();

        return response()->json([
            'message' => 'Task berhasil dihapus'
        ]);
    }
}

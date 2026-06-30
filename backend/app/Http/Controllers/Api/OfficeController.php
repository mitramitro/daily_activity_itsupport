<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Office;
use Illuminate\Http\Request;

class OfficeController extends Controller
{
    public function options()
    {
        return response()->json(
            Office::select('id', 'name')->orderBy('name')->get()
        );
    }

    public function index(Request $request)
    {
        $search = $request->search;
        $limit = $request->limit ?? 10;

        $offices = Office::select('id', 'name', 'parent_office_id')
            ->with('parent:id,name')
            ->when($search, fn ($q) => $q->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate($limit);

        return response()->json($offices);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:offices,name',
            'parent_office_id' => 'nullable|exists:offices,id',
        ]);

        $office = Office::create([
            'name' => $request->name,
            'parent_office_id' => $request->parent_office_id,
        ]);

        return response()->json([
            'message' => 'Office berhasil ditambahkan',
            'data' => $office,
        ], 201);
    }

    public function show($id)
    {
        $office = Office::with('parent:id,name')->findOrFail($id);

        return response()->json([
            'data' => $office,
        ]);
    }

    public function update(Request $request, $id)
    {
        $office = Office::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:offices,name,'.$id,
            'parent_office_id' => 'nullable|exists:offices,id|different:'.$id,
        ]);

        $office->update([
            'name' => $request->name,
            'parent_office_id' => $request->parent_office_id,
        ]);

        return response()->json([
            'message' => 'Office berhasil diupdate',
            'data' => $office,
        ]);
    }

    public function destroy($id)
    {
        $office = Office::findOrFail($id);

        $relations = [];

        $countChildren = $office->children()->count();
        if ($countChildren > 0) {
            $relations[] = "{$countChildren} child office";
        }

        $countEmployees = $office->employees()->count();
        if ($countEmployees > 0) {
            $relations[] = "{$countEmployees} employee";
        }

        $countUsers = $office->users()->count();
        if ($countUsers > 0) {
            $relations[] = "{$countUsers} user";
        }

        $countTasks = $office->tasks()->count();
        if ($countTasks > 0) {
            $relations[] = "{$countTasks} task";
        }

        $countStocks = $office->barangStocks()->count();
        if ($countStocks > 0) {
            $relations[] = "{$countStocks} barang stock";
        }

        $countLogsFrom = $office->barangLogsFrom()->count();
        $countLogsTo = $office->barangLogsTo()->count();
        if ($countLogsFrom + $countLogsTo > 0) {
            $relations[] = ($countLogsFrom + $countLogsTo).' barang log';
        }

        if (! empty($relations)) {
            $message = 'Tidak dapat menghapus office yang masih digunakan oleh '.implode(', ', $relations).'. Hapus data terkait terlebih dahulu.';

            return response()->json([
                'message' => $message,
            ], 409);
        }

        $office->delete();

        return response()->json([
            'message' => 'Office berhasil dihapus',
        ]);
    }
}

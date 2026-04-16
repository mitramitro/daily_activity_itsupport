<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\BarangLog;
use App\Models\BarangStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BarangLogController extends Controller
{
    /**
     * LIST
     */
    public function index(Request $request)
    {
        // ======================
        // PARAMS
        // ======================
        $search = trim($request->get('search', ''));
        $limit  = (int) $request->get('limit', 10);

        // 🔥 limit guard (anti abuse)
        if ($limit <= 0) $limit = 10;
        if ($limit > 100) $limit = 100;

        // ======================
        // QUERY
        // ======================
        $query = BarangLog::select(
            'id',
            'barang_id',
            'type',
            'qty',
            'tanggal',
            'notes',
            'condition',
            'from_employee_id',
            'to_employee_id',
            'from_office_id',
            'to_office_id',
            'created_by'
        )
            ->with([
                'barang:id,name',
                'fromOffice:id,name',
                'toOffice:id,name',
                'fromEmployee:id,nama',
                'toEmployee:id,nama',
                'creator:id,name'
            ]);

        // ======================
        // SEARCH (SERVER SIDE)
        // ======================
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('barang', function ($q2) use ($search) {
                    $q2->where('name', 'like', "%{$search}%");
                })
                    ->orWhereHas('fromEmployee', function ($q2) use ($search) {
                        $q2->where('nama', 'like', "%{$search}%");
                    })
                    ->orWhereHas('toEmployee', function ($q2) use ($search) {
                        $q2->where('nama', 'like', "%{$search}%");
                    })
                    ->orWhere('type', 'like', "%{$search}%");
            });
        }

        // ======================
        // SORTING (TERBARU DI ATAS 🔥)
        // ======================
        $data = $query
            ->orderByDesc('tanggal') // 🔥 terbaru di atas
            ->orderByDesc('id')      // fallback biar stabil
            ->paginate($limit)
            ->appends($request->query());

        // ======================
        // RESPONSE
        // ======================
        return response()->json($data);
    }

    /**
     * STORE (MULTI STOCK)
     */
    public function store(Request $request)
    {
        $request->validate([
            'barang_id' => 'required|exists:barang,id',
            'qty' => 'required|integer|min:1',
            'type' => 'required|in:IN,OUT',
            'tanggal' => 'required|date',

            'from_office_id' => 'nullable|exists:offices,id',
            'to_office_id' => 'nullable|exists:offices,id',

            'from_employee_id' => 'nullable|exists:employees,id',
            'to_employee_id' => 'nullable|exists:employees,id',

            'condition' => 'nullable|in:baru,bekas,rusak',
            'notes' => 'nullable|string'
        ]);

        $user = auth()->user();

        if (!$user->office_id) {
            return response()->json([
                'message' => 'User tidak memiliki office'
            ], 403);
        }

        return DB::transaction(function () use ($request, $user) {

            $barang = Barang::lockForUpdate()->findOrFail($request->barang_id);
            $userOfficeId = $user->office_id;

            // ======================
            // 🔥 VALIDASI BISNIS
            // ======================
            if ($request->type === 'OUT') {
                if (!$request->to_employee_id) {
                    throw new \Exception('Pilih employee tujuan');
                }
            }

            if ($request->type === 'IN') {
                if (!$request->from_employee_id) {
                    throw new \Exception('Pilih employee asal');
                }
            }

            // ======================
            // 🔥 AUTO SET OFFICE
            // ======================
            $fromOffice = null;
            $toOffice = null;

            if ($request->type === 'OUT') {
                $fromOffice = $userOfficeId;
                $toOffice = $request->to_office_id; // optional
            }

            if ($request->type === 'IN') {
                $toOffice = $userOfficeId;
                $fromOffice = $request->from_office_id; // optional
            }

            // ======================
            // 🔥 HANDLE STOCK
            // ======================
            if ($request->type === 'OUT') {

                $stock = BarangStock::where([
                    'barang_id' => $barang->id,
                    'office_id' => $fromOffice
                ])->lockForUpdate()->first();

                if (!$stock || $stock->stock < $request->qty) {
                    throw new \Exception('Stock tidak cukup di office ini');
                }

                $stock->decrement('stock', $request->qty);
            }

            if ($request->type === 'IN') {

                $stock = BarangStock::firstOrCreate([
                    'barang_id' => $barang->id,
                    'office_id' => $toOffice
                ]);

                $stock->increment('stock', $request->qty);
            }

            // ======================
            // 🔥 SIMPAN LOG
            // ======================
            $log = BarangLog::create([
                'barang_id' => $barang->id,
                'qty' => $request->qty,
                'type' => $request->type,

                'from_office_id' => $fromOffice,
                'to_office_id' => $toOffice,

                'from_employee_id' => $request->from_employee_id,
                'to_employee_id' => $request->to_employee_id,

                'condition' => $request->condition,
                'notes' => $request->notes,
                'tanggal' => $request->tanggal,

                'created_by' => $user->id
            ]);

            return response()->json([
                'message' => 'Transaksi berhasil',
                'data' => $log
            ], 201);
        });
    }

    /**
     * SHOW
     */
    public function show($id)
    {
        $data = BarangLog::with([
            'barang',
            'fromOffice',
            'toOffice',
            'fromEmployee',
            'toEmployee',
            'creator'
        ])->findOrFail($id);

        return response()->json([
            'data' => $data
        ]);
    }

    /**
     * DELETE (ROLLBACK STOCK)
     */
    public function destroy($id)
    {
        $log = BarangLog::findOrFail($id);

        return DB::transaction(function () use ($log) {

            $barang = Barang::lockForUpdate()->findOrFail($log->barang_id);

            if ($log->type === 'IN') {

                $stock = BarangStock::where([
                    'barang_id' => $barang->id,
                    'office_id' => $log->to_office_id
                ])->lockForUpdate()->first();

                if ($stock && $stock->stock < $log->qty) {
                    throw new \Exception('Tidak bisa rollback, stock tidak cukup');
                }

                if ($stock) {
                    $stock->decrement('stock', $log->qty);
                }
            } else {

                $stock = BarangStock::firstOrCreate([
                    'barang_id' => $barang->id,
                    'office_id' => $log->from_office_id
                ]);

                $stock->increment('stock', $log->qty);
            }

            $log->delete();

            return response()->json([
                'message' => 'Data berhasil dihapus'
            ]);
        });
    }
}

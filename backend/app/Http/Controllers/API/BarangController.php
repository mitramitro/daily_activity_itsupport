<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use Illuminate\Http\Request;

class BarangController extends Controller
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

        // 🔥 batasin limit biar aman (anti abuse)
        if ($limit > 100) $limit = 100;

        // ======================
        // QUERY
        // ======================
        $query = Barang::with([
            'stocks.office:id,name'
        ]);
        // $query = Barang::with('stocks');

        // 🔍 SEARCH (AMAN)
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        // ======================
        // PAGINATION
        // ======================
        $data = $query
            ->orderBy('name')
            ->paginate($limit)
            ->appends($request->query()); // 🔥 penting buat pagination + search

        return response()->json($data);
    }

    /**
     * STORE
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:consumable,non_consumable',
            'unit' => 'required|string|max:50',
        ]);

        $barang = Barang::create(
            $request->only('name', 'type', 'unit')
        );

        return response()->json([
            'message' => 'Barang created',
            'data' => $barang
        ], 201);
    }

    /**
     * SHOW
     */
    public function show($id)
    {
        $barang = Barang::with([
            'stocks.office:id,name'
        ])->findOrFail($id);

        return response()->json([
            'data' => $barang
        ]);
    }

    /**
     * UPDATE
     */
    public function update(Request $request, $id)
    {
        $barang = Barang::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:consumable,non_consumable',
            'unit' => 'required|string|max:50',
        ]);

        $barang->update(
            $request->only('name', 'type', 'unit')
        );

        return response()->json([
            'message' => 'Barang updated',
            'data' => $barang
        ]);
    }

    /**
     * DELETE
     */
    public function destroy($id)
    {
        $barang = Barang::with('stocks')->findOrFail($id);

        // 🔥 CEK TOTAL STOCK SEMUA OFFICE
        $totalStock = $barang->stocks->sum('stock');

        if ($totalStock > 0) {
            return response()->json([
                'message' => 'Barang tidak bisa dihapus karena masih memiliki stock di beberapa office',
                'total_stock' => $totalStock
            ], 400);
        }

        $barang->delete();

        return response()->json([
            'message' => 'Barang deleted'
        ]);
    }
}

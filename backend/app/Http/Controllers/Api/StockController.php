<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BarangStock;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function index(Request $request)
    {
        $query = BarangStock::with([
            'barang:id,name,type,unit',
            'office:id,name',
        ]);

        if ($request->filled('office_id')) {
            $query->where('office_id', $request->office_id);
        }

        $data = $query->orderBy('barang_id')->get();

        return response()->json([
            'data' => $data,
        ]);
    }
}

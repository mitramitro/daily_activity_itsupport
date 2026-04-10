<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\BarangStock;
use Illuminate\Http\Request;

class stockController extends Controller
{
    public function index(Request $request)
    {
        $data = BarangStock::with([
            'barang:id,name,type,unit',
            'office:id,name'
        ])
            ->orderBy('barang_id')
            ->get();

        return response()->json([
            'data' => $data
        ]);
    }
}

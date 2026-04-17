<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Office;

class OfficeController extends Controller
{
    public function index()
    {
        $offices = Office::select('id', 'name')
            ->orderBy('name')
            ->get();

        return response()->json([
            'message' => 'List Office',
            'data' => $offices
        ]);
    }
}

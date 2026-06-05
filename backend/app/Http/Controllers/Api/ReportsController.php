<?php

namespace App\Http\Controllers\Api;

use Maatwebsite\Excel\Facades\Excel;
use App\Exports\TaskExport;
use App\Exports\BarangLogExport;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ReportsController extends Controller
{
    public function exportTasks(Request $request)
    {
        return Excel::download(new TaskExport($request), 'tasks.xlsx');
    }

    public function exportBarangLogs(Request $request)
    {
        return Excel::download(new BarangLogExport($request), 'barang-logs.xlsx');
    }
}

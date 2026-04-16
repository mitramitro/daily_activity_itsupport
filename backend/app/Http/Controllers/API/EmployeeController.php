<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    /**
     * LIST + SEARCH + PAGINATION
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $limit  = $request->limit ?? 10;

        $employees = Employee::query()

            ->select(
                'id',
                'nama',
                'nomor_pekerja',
                'no_hp',
                'email',
                'jabatan',
                'status',
                'lokasi'
            )

            ->when($search, function ($q) use ($search) {
                $q->where(function ($query) use ($search) {
                    $query->where('nama', 'like', "%$search%")
                        ->orWhere('nomor_pekerja', 'like', "%$search%");
                });
            })

            ->orderBy('nama')
            ->paginate($limit);

        return response()->json($employees);
    }


    /**
     * STORE (CREATE)
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'nomor_pekerja' => 'required|string|unique:employees',
            'jabatan' => 'required|string',
            'status' => 'required|in:Pekerja,Mitra Kerja',
            'lokasi' => 'required|string',
            'email' => 'nullable|email',
            'no_hp' => 'nullable|string'
        ]);

        $employee = Employee::create([
            'nama' => $request->nama,
            'nomor_pekerja' => $request->nomor_pekerja,
            'no_hp' => $request->no_hp,
            'email' => $request->email,
            'jabatan' => $request->jabatan,
            'status' => $request->status,
            'lokasi' => $request->lokasi,
            'keterangan' => $request->keterangan
        ]);

        return response()->json([
            'message' => 'Employee created successfully',
            'data' => $employee
        ], 201);
    }


    /**
     * SHOW (DETAIL)
     */
    public function show($id)
    {
        $employee = Employee::findOrFail($id);

        return response()->json([
            'data' => $employee
        ]);
    }


    /**
     * UPDATE
     */
    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);

        $request->validate([
            'nama' => 'required|string|max:255',
            'nomor_pekerja' => 'required|string|unique:employees,nomor_pekerja,' . $id,
            'jabatan' => 'required|string',
            'status' => 'required|in:Pekerja,Mitra Kerja',
            'lokasi' => 'required|string',
            'email' => 'nullable|email',
            'no_hp' => 'nullable|string'
        ]);

        $employee->update([
            'nama' => $request->nama,
            'nomor_pekerja' => $request->nomor_pekerja,
            'no_hp' => $request->no_hp,
            'email' => $request->email,
            'jabatan' => $request->jabatan,
            'status' => $request->status,
            'lokasi' => $request->lokasi,
            'keterangan' => $request->keterangan
        ]);

        return response()->json([
            'message' => 'Employee updated successfully',
            'data' => $employee
        ]);
    }


    /**
     * DELETE
     */
    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);

        $employee->delete();

        return response()->json([
            'message' => 'Employee deleted successfully'
        ]);
    }
}

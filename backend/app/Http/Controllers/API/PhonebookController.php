<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Phonebook;
use Illuminate\Support\Facades\Validator;

class PhonebookController extends Controller
{
    /**
     * GET /api/phonebooks
     * Ambil semua data phonebook
     */
    public function index()
    {
        $phonebooks = Phonebook::latest()->get();

        return response()->json([
            'status'  => 'success',
            'message' => 'List phonebook',
            'data'    => $phonebooks
        ]);
    }

    /**
     * POST /api/phonebooks
     * Simpan data baru
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'  => 'required|string|max:255',
            'phone' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $phonebook = Phonebook::create([
            'name'  => $request->name,
            'phone' => $request->phone,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Phonebook created',
            'data'    => $phonebook
        ], 201);
    }

    /**
     * GET /api/phonebooks/{id}
     */
    public function show($id)
    {
        $phonebook = Phonebook::find($id);

        if (!$phonebook) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Phonebook not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $phonebook
        ]);
    }

    /**
     * PUT /api/phonebooks/{id}
     */
    public function update(Request $request, $id)
    {
        $phonebook = Phonebook::find($id);

        if (!$phonebook) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Phonebook not found'
            ], 404);
        }

        $phonebook->update($request->only('name', 'phone'));

        return response()->json([
            'status'  => 'success',
            'message' => 'Phonebook updated',
            'data'    => $phonebook
        ]);
    }

    /**
     * DELETE /api/phonebooks/{id}
     */
    public function destroy($id)
    {
        $phonebook = Phonebook::find($id);

        if (!$phonebook) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Phonebook not found'
            ], 404);
        }

        $phonebook->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Phonebook deleted'
        ]);
    }
}

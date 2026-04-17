<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * 🔒 CHECK ADMIN
     */
    private function checkAdmin()
    {
        return auth()->check() && auth()->user()->role === 'admin';
    }

    /**
     * 📋 GET USERS (PAGINATION + SEARCH)
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $limit  = $request->limit ?? 10;

        $users = User::with('office') // 🔥 relasi office
            ->select('id', 'name', 'email', 'role', 'office_id')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%$search%")
                        ->orWhere('email', 'like', "%$search%");
                });
            })
            ->orderBy('name')
            ->paginate($limit);

        return response()->json([
            'status' => 'success',
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total(),
            ]
        ]);
    }

    /**
     * ➕ CREATE USER
     */
    public function store(Request $request)
    {
        if (!$this->checkAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email',
            'password'  => 'required|string|min:6|confirmed',
            'role'      => ['required', Rule::in(['admin', 'user'])],
            'office_id' => 'required|exists:offices,id', // 🔥 tambahan
        ]);

        $user = User::create([
            'name'      => $validated['name'],
            'email'     => $validated['email'],
            'password'  => Hash::make($validated['password']),
            'role'      => $validated['role'],
            'office_id' => $validated['office_id'], // 🔥 tambahan
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'User berhasil dibuat',
            'data'    => $user
        ], 201);
    }

    /**
     * ✏️ UPDATE USER (NO PASSWORD)
     */
    public function update(Request $request, $id)
    {
        if (!$this->checkAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($id),
            ],
            'role'  => ['required', Rule::in(['admin', 'user'])],
            'office_id' => 'required|exists:offices,id', // 🔥 tambahan
        ]);

        // ❌ cegah turunkan diri sendiri
        if (auth()->id() == $user->id && $validated['role'] === 'user') {
            return response()->json([
                'message' => 'Tidak bisa menurunkan role diri sendiri'
            ], 403);
        }

        $user->update([
            'name'      => $validated['name'],
            'email'     => $validated['email'],
            'role'      => $validated['role'],
            'office_id' => $validated['office_id'], // 🔥 tambahan
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'User berhasil diupdate',
            'data'    => $user
        ]);
    }

    /**
     * 🔐 UPDATE PASSWORD
     */
    public function updatePassword(Request $request, $id)
    {
        if (!$this->checkAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'password' => 'required|string|min:6|confirmed'
        ]);

        $user->update([
            'password' => Hash::make($validated['password'])
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Password berhasil diubah'
        ]);
    }

    /**
     * 🗑 DELETE USER
     */
    public function destroy($id)
    {
        if (!$this->checkAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);

        // ❌ cegah hapus diri sendiri
        if (auth()->id() == $user->id) {
            return response()->json([
                'message' => 'Tidak bisa menghapus akun sendiri'
            ], 400);
        }

        $user->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'User berhasil dihapus'
        ]);
    }
}

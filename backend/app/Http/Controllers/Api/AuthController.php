<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Register user baru
     */
    public function registerxx(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role'     => 'in:admin,user',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Validation failed',
                'errors'  => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role ?? 'user',
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'status'  => 'success',
            'message' => 'User successfully registered',
            'data'    => [
                'user'  => $user,
                'token' => $this->respondWithToken($token),
            ]
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Invalid credentials'
                ], 401);
            }
        } catch (JWTException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Could not create token',
                'error'   => $e->getMessage()
            ], 500);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Login successful',
            'data'    => $this->respondWithToken($token),
        ]);
    }

    /**
     * Logout user (invalidate token)
     */
    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());

            return response()->json([
                'status'  => 'success',
                'message' => 'User logged out successfully'
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Failed to logout, token invalid',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Refresh token (bisa dipanggil dengan token expired)
     */
    public function refresh(Request $request)
    {
        try {
            $token = JWTAuth::getToken();

            if (!$token) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Token tidak ditemukan'
                ], 401);
            }

            $newToken = JWTAuth::refresh($token);

            return response()->json([
                'status'  => 'success',
                'message' => 'Token refreshed',
                'data'    => $this->respondWithToken($newToken),
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Token tidak bisa di-refresh, silakan login ulang'
            ], 401);
        }
    }

    /**
     * Get user profile
     */
    public function me()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate()->load('office');

            return response()->json([
                'status'  => 'success',
                'message' => 'User profile fetched',
                'data'    => $user
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Token is invalid or expired',
                'error'   => $e->getMessage()
            ], 401);
        }
    }

    // ============================================
    // FINGERPRINT
    // ============================================

    /**
     * Cek status fingerprint user (sebelum login)
     * POST /auth/check-fingerprint-user
     */
    public function checkFingerprintUser(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        return response()->json([
            'fingerprint_enabled' => (bool) $user->fingerprint_enabled,
        ]);
    }

    /**
     * Aktifkan fingerprint (harus login)
     * POST /fingerprint/enable
     */
    public function enableFingerprint(Request $request)
    {
        $request->validate([
            'password'          => 'required|string',
            'fingerprint_token' => 'required|string|min:10',
            'device_id'         => 'required|string|min:5',
        ]);

        $user = auth()->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Password salah'], 403);
        }

        $hashedToken = Hash::make($request->fingerprint_token);

        $user->update([
            'fingerprint_enabled'    => true,
            'fingerprint_token_hash' => $hashedToken,
            'device_id'              => $request->device_id,
        ]);

        return response()->json([
            'message'            => 'Fingerprint berhasil diaktifkan',
            'fingerprint_enabled' => true,
        ]);
    }

    /**
     * Nonaktifkan fingerprint (harus login)
     * POST /fingerprint/disable
     */
    public function disableFingerprint(Request $request)
    {
        $user = auth()->user();

        $user->update([
            'fingerprint_enabled'    => false,
            'fingerprint_token_hash' => null,
            'device_id'              => null,
        ]);

        return response()->json([
            'message'             => 'Fingerprint berhasil dinonaktifkan',
            'fingerprint_enabled' => false,
        ]);
    }

    /**
     * Login dengan fingerprint (tanpa JWT)
     * POST /auth/login/fingerprint
     */
    public function loginFingerprint(Request $request)
    {
        $request->validate([
            'fingerprint_token' => 'required|string',
            'device_id'         => 'required|string',
        ]);

        $user = User::where('device_id', $request->device_id)
            ->where('fingerprint_enabled', true)
            ->first();

        if (!$user || !Hash::check($request->fingerprint_token, $user->fingerprint_token_hash)) {
            return response()->json(['error' => 'Fingerprint tidak valid'], 401);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => JWTAuth::factory()->getTTL() * 60,
            'user'         => $user->load('office'),
        ]);
    }

    // ============================================
    // HELPERS
    // ============================================

    /**
     * Helper: format token response
     */
    protected function respondWithToken($token)
    {
        return [
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => JWTAuth::factory()->getTTL() * 60,
        ];
    }
}

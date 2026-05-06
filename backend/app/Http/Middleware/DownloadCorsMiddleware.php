<?php

namespace App\Http\Middleware;


use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class DownloadCorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        Log::info('DownloadCorsMiddleware', [
            'method' => $request->method(),
            'origin' => $request->header('Origin'),
            'url'    => $request->url(),
        ]);
        $allowedOrigins = config('cors.allowed_origins');
        $origin = $request->header('Origin');
        $isAllowed = in_array($origin, $allowedOrigins);

        // ✅ Handle preflight OPTIONS — jangan diteruskan ke $next()
        if ($request->isMethod('OPTIONS')) {
            return response('', 200, [
                'Access-Control-Allow-Origin'      => $isAllowed ? $origin : '',
                'Access-Control-Allow-Methods'     => 'GET, OPTIONS',
                'Access-Control-Allow-Headers'     => 'Authorization, Content-Type',
                'Access-Control-Allow-Credentials' => 'true',
            ]);
        }

        $response = $next($request);

        if ($isAllowed) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Access-Control-Allow-Methods', 'GET, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
        }

        return $response;
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class DownloadCorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $allowedOrigins = config('cors.allowed_origins');
        $origin = $request->header('Origin');

        $response = $next($request);

        if (in_array($origin, $allowedOrigins)) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Access-Control-Allow-Methods', 'GET, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
        }

        return $response;
    }
}

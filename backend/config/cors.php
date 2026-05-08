<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Paths yang diizinkan untuk CORS
    |--------------------------------------------------------------------------
    */
    'paths' => ['api/*'],  // Cukup ini, karena API route Anda pakai prefix 'api'

    /*
    |--------------------------------------------------------------------------
    | Method HTTP yang diizinkan
    |--------------------------------------------------------------------------
    */
    'allowed_methods' => ['*'],  // Izinkan semua method (GET, POST, PUT, DELETE, OPTIONS)

    /*
    |--------------------------------------------------------------------------
    | Origin yang diizinkan (Domain frontend Anda)
    |--------------------------------------------------------------------------
    */
    'allowed_origins' => [
        'https://itdesk.digisib.net',      // Production frontend
        'capacitor://localhost',            // Capacitor native app
        'http://localhost',                 // Local development
        'http://localhost:3000',            // React dev server (default)
        'http://localhost:5173',            // Vite dev server
        'http://localhost:5174',            // Vite alternate port
        'http://192.168.0.38:8000',         // Local network
        'https://192.168.0.38:8000',        // Local network HTTPS
    ],

    /*
    |--------------------------------------------------------------------------
    | Pattern untuk origin (jika perlu regex)
    |--------------------------------------------------------------------------
    */
    'allowed_origins_patterns' => [],

    /*
    |--------------------------------------------------------------------------
    | Headers yang diizinkan
    |--------------------------------------------------------------------------
    */
    'allowed_headers' => ['*'],  // Izinkan semua headers

    /*
    |--------------------------------------------------------------------------
    | Headers yang diekspos ke client (PENTING untuk download file!)
    |--------------------------------------------------------------------------
    */
    'exposed_headers' => [
        'Authorization',
        'Content-Disposition',  // 🔥 KRUSIAL: Untuk download file
        'Content-Length',       // 🔥 Untuk progress download
        'Content-Type',
    ],

    /*
    |--------------------------------------------------------------------------
    | Max age cache preflight request (detik)
    |--------------------------------------------------------------------------
    */
    'max_age' => 86400,  // 24 jam (dari 0 jadi 86400 untuk caching)

    /*
    |--------------------------------------------------------------------------
    | Support credentials (cookies, authorization headers)
    |--------------------------------------------------------------------------
    */
    'supports_credentials' => true,
];

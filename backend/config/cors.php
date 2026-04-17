<?php

return [

    /*
    |--------------------------------------------------------------------------
    | CORS Configuration - JWT Optimized
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Daftarkan domain Front-end kamu
    'allowed_origins' => [
        'https://itdesk.digisib.net',
        'http://localhost:3000', // Untuk testing lokal (sesuaikan portnya)
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    // PENTING UNTUK JWT: 
    // Jika API kamu mengirimkan token di header (misal: Authorization), 
    // tambahkan di sini agar bisa dibaca oleh JavaScript di Front-end.
    'exposed_headers' => ['Authorization'],

    'max_age' => 0,

    // Set TRUE karena JWT sering dikirim via Authorization Header atau Cookie
    'supports_credentials' => true,

];

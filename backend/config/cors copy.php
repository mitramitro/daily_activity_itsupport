<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'storage/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://itdesk.digisib.net',
        'http://localhost:3000',
        'http://localhost',
        'https://localhost',
        'capacitor://localhost',
        'http://localhost:5173',
        'http://192.168.0.38:8000', // ← IP laptop
        'https://192.168.0.38:8000', // ← IP laptop
        'http://localhost:5174', // ← ini yang kurang
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['Authorization'],

    'max_age' => 0,

    'supports_credentials' => true,
];

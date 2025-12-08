<?php

/**
 * Test Connection Status API
 * Returns status of database and Cloudinary connections
 */

header('Content-Type: application/json');

// Load environment variables
if (file_exists('vendor/autoload.php')) {
    require_once 'vendor/autoload.php';
    if (file_exists('.env.cloud')) {
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__, '.env.cloud');
        $dotenv->load();
    } elseif (file_exists('.env')) {
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
        $dotenv->load();
    }
}

$response = [
    'database' => [
        'connected' => false,
        'host' => null,
        'database' => null,
        'tables' => 0,
        'error' => null
    ],
    'cloudinary' => [
        'configured' => false,
        'cloud_name' => null,
        'upload_preset' => null
    ]
];

// Test Database Connection
try {
    define('SUPPRESS_DB_DIE', true);
    $use_cloud = filter_var(getenv('DB_USE_SSL') ?: ($_ENV['DB_USE_SSL'] ?? 'false'), FILTER_VALIDATE_BOOLEAN);

    if ($use_cloud) {
        require_once 'config/db_cloud.php';
    } else {
        require_once 'config/db.php';
    }

    // Debug Info
    $db_pass = getenv('DB_PASS') ?: ($_ENV['DB_PASS'] ?? '');
    $response['database']['debug'] = [
        'user' => getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? ''),
        'host' => getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? ''),
        'pass_len' => strlen($db_pass),
        'pass_first' => substr($db_pass, 0, 1),
        'pass_last' => substr($db_pass, -1)
    ];

    if (db_health_check()) {
        $response['database']['connected'] = true;
        $response['database']['host'] = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? 'localhost');
        $response['database']['database'] = getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? 'smart_tailoring');

        // Count tables
        $tables = db_fetch_all("SHOW TABLES");
        $response['database']['tables'] = count($tables);
    }
} catch (Exception $e) {
    $response['database']['error'] = $e->getMessage();
}

// Test Cloudinary Configuration
$cloud_name = getenv('CLOUDINARY_CLOUD_NAME') ?: ($_ENV['CLOUDINARY_CLOUD_NAME'] ?? '');
$upload_preset = getenv('CLOUDINARY_UPLOAD_PRESET') ?: ($_ENV['CLOUDINARY_UPLOAD_PRESET'] ?? '');

if (!empty($cloud_name) && !empty($upload_preset)) {
    $response['cloudinary']['configured'] = true;
    $response['cloudinary']['cloud_name'] = $cloud_name;
    $response['cloudinary']['upload_preset'] = $upload_preset;
}

echo json_encode($response, JSON_PRETTY_PRINT);

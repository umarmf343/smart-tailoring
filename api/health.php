<?php

/**
 * Health Check Endpoint
 * 
 * Returns application health status including:
 * - Overall status
 * - Database connectivity
 * - Environment info
 * - Timestamp
 * 
 * Usage: GET /api/health.php
 * Response: JSON with status information
 */

header('Content-Type: application/json');

// Load environment
require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

$health = [
    'status' => 'ok',
    'timestamp' => date('c'), // ISO 8601 format
    'environment' => $_ENV['APP_ENV'] ?? 'unknown',
    'checks' => []
];

// Check database connection
try {
    define('DB_ACCESS', true);
    require_once __DIR__ . '/../config/db.php';

    // Test query using mysqli connection
    $result = $conn->query('SELECT 1 as test');

    if ($result && $result->num_rows > 0) {
        $health['checks']['database'] = [
            'status' => 'ok',
            'message' => 'Database connection successful'
        ];
    } else {
        $health['status'] = 'degraded';
        $health['checks']['database'] = [
            'status' => 'warning',
            'message' => 'Database query returned no result'
        ];
    }
} catch (Exception $e) {
    $health['status'] = 'error';
    $health['checks']['database'] = [
        'status' => 'error',
        'message' => 'Database connection failed'
    ];

    // Include error details only in development
    if (isset($_ENV['APP_DEBUG']) && $_ENV['APP_DEBUG'] === 'true') {
        $health['checks']['database']['error'] = $e->getMessage();
    }
}

// Check uploads directory write access
$uploadsDir = __DIR__ . '/../uploads/profiles';
if (is_writable($uploadsDir)) {
    $health['checks']['uploads'] = [
        'status' => 'ok',
        'message' => 'Uploads directory is writable'
    ];
} else {
    $health['status'] = 'degraded';
    $health['checks']['uploads'] = [
        'status' => 'warning',
        'message' => 'Uploads directory is not writable'
    ];
}

// Check session functionality
try {
    if (session_status() === PHP_SESSION_NONE) {
        require_once __DIR__ . '/../config/session.php';
    }

    $health['checks']['session'] = [
        'status' => 'ok',
        'message' => 'Session system operational'
    ];
} catch (Exception $e) {
    $health['status'] = 'degraded';
    $health['checks']['session'] = [
        'status' => 'warning',
        'message' => 'Session initialization issue'
    ];
}

// Add version info (if available)
if (file_exists(__DIR__ . '/../composer.json')) {
    $composer = json_decode(file_get_contents(__DIR__ . '/../composer.json'), true);
    $health['version'] = $composer['version'] ?? 'dev';
}

// Set appropriate HTTP status code
http_response_code($health['status'] === 'ok' ? 200 : ($health['status'] === 'degraded' ? 500 : 503));

echo json_encode($health, JSON_PRETTY_PRINT);

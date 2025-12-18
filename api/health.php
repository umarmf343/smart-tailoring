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

// Disable error display for clean JSON response
ini_set('display_errors', 0);
error_reporting(0);

header('Content-Type: application/json');
require_once __DIR__ . '/../config/env_loader.php';
$appConfig = load_env_config();

$health = [
    'status' => 'ok',
    'timestamp' => date('c'), // ISO 8601 format
    'environment' => $appConfig['app_env'] ?? 'unknown',
    'app_url' => $appConfig['app_url'] ?? null,
    'checks' => []
];

// Check database connection
try {
    define('DB_ACCESS', true);
    require_once __DIR__ . '/../config/db.php';

    // Test query using mysqli connection when available
    if (isset($conn) && $conn instanceof mysqli && db_health_check()) {
        $health['checks']['database'] = [
            'status' => 'ok',
            'message' => 'Database connection successful'
        ];
    } else {
        $health['status'] = 'degraded';
        $health['checks']['database'] = [
            'status' => 'warning',
            'message' => $GLOBALS['db_connection_error'] ?? 'Database unavailable or not configured'
        ];
    }
} catch (Throwable $e) {
    $health['status'] = 'error';
    $health['checks']['database'] = [
        'status' => 'error',
        'message' => 'Database connection failed'
    ];

    // Include error details only in development
    if (!empty($appConfig['app_debug'])) {
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
$statusCode = 200;
if ($health['status'] === 'error') {
    $statusCode = 503;
} elseif ($health['status'] === 'degraded') {
    $statusCode = 206; // Partial availability but endpoint still answers
}

http_response_code($statusCode);

echo json_encode($health, JSON_PRETTY_PRINT);

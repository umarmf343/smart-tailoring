<?php

/**
 * Database Connection Router
 * Automatically routes to cloud or local database based on .env settings
 * Updated for Render deployment
 */

// Load environment from .env file (simple loader without dependencies)
$env_file = __DIR__ . '/../.env';
if (file_exists($env_file)) {
    $lines = file($env_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0) continue;

        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $key = trim($parts[0]);
            $value = trim($parts[1]);
            if (!isset($_ENV[$key])) {
                $_ENV[$key] = $value;
                putenv($key . '=' . $value);
            }
        }
    }
}

// Check if SSL/Cloud mode is enabled
$use_ssl = filter_var(getenv('DB_USE_SSL') ?: ($_ENV['DB_USE_SSL'] ?? 'false'), FILTER_VALIDATE_BOOLEAN);

if ($use_ssl) {
    // Use cloud database with SSL
    require_once __DIR__ . '/db_cloud.php';
} else {
    // Use local database (traditional)
    $local_db_path = __DIR__ . '/db_local.php';

    if (file_exists($local_db_path)) {
        require_once $local_db_path;
    } else {
        // Fallback to cloud configuration when local file is missing
        require_once __DIR__ . '/db_cloud.php';
    }
}

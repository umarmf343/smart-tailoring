<?php

/**
 * Database Connection Router
 * Automatically routes to cloud or local database based on .env settings
 * Updated for Render deployment
 */

require_once __DIR__ . '/env_loader.php';
$appConfig = load_env_config();

// Fail fast when mysqli extension is missing (common on misconfigured hosts)
if (!function_exists('mysqli_init')) {
    $GLOBALS['db_connection_error'] = 'PHP MySQLi extension is missing. Enable mysqli or install the PHP MySQL extension on the server.';
    $conn = null;
    return;
}

// Check if SSL/Cloud mode is enabled
$use_ssl = filter_var(env_value('DB_USE_SSL', 'false'), FILTER_VALIDATE_BOOLEAN);

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

<?php

/**
 * Local Database Configuration (Non-SSL)
 * Reuses the cloud configuration with SSL disabled to keep settings consistent.
 */

// Prevent direct access
if (!defined('DB_ACCESS')) {
    define('DB_ACCESS', true);
}

// Ensure SSL is disabled for local connections
putenv('DB_USE_SSL=false');
$_ENV['DB_USE_SSL'] = 'false';

// Use the shared connection logic
require_once __DIR__ . '/db_cloud.php';

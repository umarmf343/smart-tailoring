<?php

/**
 * Configuration Loader
 * Loads environment-specific configuration
 */

// Prevent direct access
if (!defined('DB_ACCESS')) {
    die('Direct access not permitted');
}

// Load configuration
$config_file = __DIR__ . '/config.php';

// If config.php doesn't exist, use example as fallback
if (!file_exists($config_file)) {
    $config_file = __DIR__ . '/config.example.php';
}

$config = require $config_file;

// Define configuration constants for backward compatibility
define('DB_HOST', $config['db']['host']);
define('DB_USER', $config['db']['username']);
define('DB_PASS', $config['db']['password']);
define('DB_NAME', $config['db']['database']);
define('APP_ENV', $config['app']['environment']);
define('APP_DEBUG', $config['app']['debug']);
define('SESSION_TIMEOUT', $config['security']['session_timeout']);
define('MAX_LOGIN_ATTEMPTS', $config['security']['max_login_attempts']);

// Return config array for use in application
return $config;

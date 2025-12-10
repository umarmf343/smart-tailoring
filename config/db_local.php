<?php

/**
 * Enhanced Database Configuration with Environment Variables
 * Smart Tailoring Service
 * 
 * This file loads database credentials from .env file for security
 */

// Suppress all errors
@ini_set('display_errors', 0);
@error_reporting(0);

// Load environment from .env file (simple loader)
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

// Prevent direct access to this file
if (!defined('DB_ACCESS')) {
    define('DB_ACCESS', true);
}

// Database Configuration from Environment
define('DB_HOST', getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? 'localhost'));
define('DB_USER', getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? 'root'));
define('DB_PASS', getenv('DB_PASS') ?: ($_ENV['DB_PASS'] ?? ''));
define('DB_NAME', getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? 'smart_tailoring'));

// Feature flags - Default to FALSE for cloud (cloud uses db_cloud.php which doesn't have pooling)
define('USE_CONNECTION_POOL', filter_var(getenv('USE_CONNECTION_POOL') ?: ($_ENV['USE_CONNECTION_POOL'] ?? 'false'), FILTER_VALIDATE_BOOLEAN));

if (USE_CONNECTION_POOL) {
    // Use connection pooling for better performance
    require_once __DIR__ . '/../database/DatabaseConnectionPool.php';

    try {
        $pool = DatabaseConnectionPool::getInstance(
            DB_HOST,
            DB_USER,
            DB_PASS,
            DB_NAME,
            [
                'max_connections' => (int)($_ENV['MAX_CONNECTIONS'] ?? 10),
                'min_connections' => (int)($_ENV['MIN_CONNECTIONS'] ?? 2),
                'idle_timeout' => 300,
                'connection_timeout' => 30
            ]
        );

        // Get connection from pool
        $connData = $pool->getConnection();
        $conn = $connData['connection'];
        $GLOBALS['_pool_conn_id'] = $connData['id'];

        // Register shutdown function to release connection
        register_shutdown_function(function () use ($pool) {
            if (isset($GLOBALS['_pool_conn_id'])) {
                $pool->releaseConnection($GLOBALS['_pool_conn_id']);
            }
        });
    } catch (Exception $e) {
        // Fallback to direct connection if pool fails
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($conn->connect_error) {
            die("Database Connection Failed: " . $conn->connect_error);
        }
        $conn->set_charset("utf8mb4");
        $conn->query("SET time_zone = '+05:30'");
    }
} else {
    // Traditional connection (backward compatible)
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    // Check connection
    if ($conn->connect_error) {
        die("Database Connection Failed: " . $conn->connect_error);
    }

    // Set character set to UTF-8
    $conn->set_charset("utf8mb4");

    // Set timezone (adjust as needed)
    $conn->query("SET time_zone = '+05:30'");
}

// Helper function for safe query execution
function db_query($sql, $types = "", $params = [])
{
    global $conn;

    if (empty($types)) {
        return $conn->query($sql);
    }

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        error_log("Database prepare error: " . $conn->error);
        return false;
    }

    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    $result = $stmt->execute();

    if (!$result) {
        error_log("Database execute error: " . $stmt->error);
    }

    return $result ? $stmt : false;
}

// Helper function to fetch a single row
function db_fetch_one($query)
{
    global $conn;

    $result = $conn->query($query);
    if (!$result) {
        error_log("Database query error: " . $conn->error);
        return false;
    }

    return $result->fetch_assoc();
}

// Helper function to fetch all rows
function db_fetch_all($query)
{
    global $conn;

    $result = $conn->query($query);
    if (!$result) {
        error_log("Database query error: " . $conn->error);
        return [];
    }

    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    return $rows;
}

// Helper function to close database connection
function db_close()
{
    global $conn;

    if (isset($conn) && $conn instanceof mysqli) {
        try {
            // Check if connection is still alive before closing
            if (@$conn->ping()) {
                $conn->close();
            }
        } catch (Exception $e) {
            // Connection already closed, ignore
        }
    }
}

// Set error handling based on environment
if (($_ENV['APP_ENV'] ?? 'production') === 'production') {
    // Production: Log errors, don't display
    error_reporting(E_ALL);
    ini_set('display_errors', '0');
    ini_set('log_errors', '1');
} else {
    // Development: Show errors
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
}

<?php

/**
 * Cloud-Ready Database Configuration with SSL Support
 * Optimized for: Render (App) + Aiven (MySQL)
 * 
 * Features:
 * - SSL/TLS connection for Aiven MySQL
 * - Environment variable configuration
 * - Connection timeout handling
 * - Fallback for local development
 * - Error logging
 */

// Suppress all errors
@ini_set('display_errors', 0);
@error_reporting(0);

// Prevent direct access
if (!defined('DB_ACCESS')) {
    define('DB_ACCESS', true);
}

// Load environment variables from .env file (development) or system environment (production)
if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    require_once __DIR__ . '/../vendor/autoload.php';

    if (file_exists(__DIR__ . '/../.env')) {
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
        $dotenv->load();
    }
}

// Database Configuration from Environment Variables
$db_host = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? 'localhost');
$db_user = getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? 'root');
$db_pass = getenv('DB_PASS') ?: ($_ENV['DB_PASS'] ?? '');
$db_name = getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? 'smart_tailoring');
$db_port = (int)(getenv('DB_PORT') ?: ($_ENV['DB_PORT'] ?? 3306));
$use_ssl = filter_var(getenv('DB_USE_SSL') ?: ($_ENV['DB_USE_SSL'] ?? 'false'), FILTER_VALIDATE_BOOLEAN);
$allow_ssl_fallback = filter_var(getenv('DB_SSL_FALLBACK') ?: ($_ENV['DB_SSL_FALLBACK'] ?? 'true'), FILTER_VALIDATE_BOOLEAN);

// SSL Certificate Path (for Aiven MySQL)
$ca_cert_path = __DIR__ . '/../ca.pem';

// Migration manager for schema auto-healing
require_once __DIR__ . '/../database/DatabaseMigrationManager.php';

/**
 * Identify missing core account tables.
 */
function getMissingCoreAccountTables($conn)
{
    $coreTables = ['tailors', 'customers'];
    $missing = [];

    foreach ($coreTables as $table) {
        $safeTable = $conn ? $conn->real_escape_string($table) : $table;
        $result = $conn ? $conn->query("SHOW TABLES LIKE '{$safeTable}'") : false;

        if (!$result || $result->num_rows === 0) {
            $missing[] = $table;
        }

        if ($result instanceof mysqli_result) {
            $result->free();
        }
    }

    return $missing;
}

/**
 * Execute a SQL file (used for last-resort schema recreation).
 */
function executeSqlFile($conn, $filepath)
{
    if (!$conn || !file_exists($filepath)) {
        return false;
    }

    $sql = file_get_contents($filepath);

    // Remove comments to avoid accidental splits
    $normalizedSql = preg_replace('/\/\*.*?\*\//s', '', $sql);
    $normalizedSql = preg_replace('/^\s*--.*$/m', '', $normalizedSql);

    $statements = array_filter(array_map('trim', explode(';', $normalizedSql)));

    foreach ($statements as $statement) {
        if (empty($statement)) {
            continue;
        }

        if (!$conn->query($statement)) {
            error_log("Schema bootstrap failed at {$filepath}: " . $conn->error);
            return false;
        }
    }

    return true;
}

/**
 * Ensure critical account tables exist by auto-running migrations or the fallback schema.
 */
function ensureCoreAccountTables($conn)
{
    static $schemaVerified = false;

    if ($schemaVerified || !$conn) {
        return;
    }

    $schemaVerified = true;
    $missing = getMissingCoreAccountTables($conn);

    if (empty($missing)) {
        return;
    }

    // Attempt to run all pending migrations automatically
    try {
        $manager = new DatabaseMigrationManager($conn, __DIR__ . '/../database/migrations/');
        $manager->runMigrations();
    } catch (Throwable $e) {
        error_log('Automatic migration run failed: ' . $e->getMessage());
    }

    $missing = getMissingCoreAccountTables($conn);

    // As a last resort, recreate core account tables directly
    if (!empty($missing)) {
        $fallbackFile = __DIR__ . '/../database/migrations/005_recreate_core_account_tables.sql';
        executeSqlFile($conn, $fallbackFile);
    }

    $stillMissing = getMissingCoreAccountTables($conn);
    if (!empty($stillMissing)) {
        error_log('Critical database schema missing: ' . implode(', ', $stillMissing));
    }
}

/**
 * Establish Database Connection with SSL Support
 */

// Suppress all errors
@ini_set('display_errors', 0);
@error_reporting(0);
function getCloudDatabaseConnection()
{
    global $db_host, $db_user, $db_pass, $db_name, $db_port, $use_ssl, $ca_cert_path;

    // Initialize mysqli
    $conn = mysqli_init();

    if (!$conn) {
        error_log("Cloud DB: mysqli_init failed");
        return false;
    }

    // Set connection timeout (important for cloud deployments)
    mysqli_options($conn, MYSQLI_OPT_CONNECT_TIMEOUT, 30); // Increased for slow connections

    // Set read timeout (if supported)
    if (defined('MYSQLI_OPT_READ_TIMEOUT')) {
        mysqli_options($conn, MYSQLI_OPT_READ_TIMEOUT, 30);
    }

    try {
        $tried_ssl = false;

        if ($use_ssl && file_exists($ca_cert_path)) {
            // SSL Connection for Aiven MySQL
            mysqli_ssl_set(
                $conn,
                NULL,           // key
                NULL,           // cert
                $ca_cert_path,  // ca
                NULL,           // capath
                NULL            // cipher
            );

            // Connect with SSL
            // Add MYSQLI_CLIENT_SSL_DONT_VERIFY_SERVER_CERT to avoid hostname mismatch issues
            $flags = MYSQLI_CLIENT_SSL;
            if (defined('MYSQLI_CLIENT_SSL_DONT_VERIFY_SERVER_CERT')) {
                $flags |= MYSQLI_CLIENT_SSL_DONT_VERIFY_SERVER_CERT;
            }

            $connected = mysqli_real_connect(
                $conn,
                $db_host,
                $db_user,
                $db_pass,
                $db_name,
                $db_port,
                NULL,
                $flags
            );

            $tried_ssl = true;

            if (!$connected) {
                if (!$allow_ssl_fallback) {
                    throw new Exception("SSL connection failed: " . mysqli_connect_error());
                }
            }
        }

        // If SSL failed or not requested, try non-SSL
        if (!$connected) {
            // Non-SSL connection (local development)
            $connected = mysqli_real_connect(
                $conn,
                $db_host,
                $db_user,
                $db_pass,
                $db_name,
                $db_port
            );

            if (!$connected) {
                $mode = $tried_ssl ? 'after SSL fallback' : 'non-SSL';
                throw new Exception("Connection failed ({$mode}): " . mysqli_connect_error());
            }
        }

        // Set character set to UTF-8
        mysqli_set_charset($conn, "utf8mb4");

        // Set timezone
        mysqli_query($conn, "SET time_zone = '+00:00'");

        return $conn;
    } catch (Exception $e) {
        error_log("Cloud DB Connection Error: " . $e->getMessage());
        return false;
    }
}

// Establish connection
$conn = getCloudDatabaseConnection();

// Auto-heal schema if core tables are missing
if ($conn) {
    ensureCoreAccountTables($conn);
}

if (!$conn) {
    // Critical error - cannot proceed without database
    $GLOBALS['db_connection_error'] = getenv('APP_ENV') === 'production'
        ? "Database service unavailable. Please try again later."
        : "Database Connection Failed. Check your .env configuration.";

    // Keep the script running so callers can handle the error gracefully
    $conn = null;
}

/**
 * Helper function for safe query execution with prepared statements
 * 
 * @param string $sql SQL query with placeholders
 * @param string $types Parameter types (e.g., "ssi" for string, string, int)
 * @param array $params Parameters to bind
 * @return mysqli_stmt|bool
 */

// Suppress all errors
@ini_set('display_errors', 0);
@error_reporting(0);
function db_query($sql, $types = "", $params = [])
{
    global $conn;

    if (!$conn) {
        error_log("Database unavailable for query execution.");
        return false;
    }

    if (empty($types)) {
        return mysqli_query($conn, $sql);
    }

    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) {
        error_log("Database prepare error: " . mysqli_error($conn));
        return false;
    }

    if (!empty($params)) {
        mysqli_stmt_bind_param($stmt, $types, ...$params);
    }

    $result = mysqli_stmt_execute($stmt);

    if (!$result) {
        error_log("Database execute error: " . mysqli_stmt_error($stmt));
    }

    return $result ? $stmt : false;
}

/**
 * Fetch a single row from database
 * 
 * @param string $query SQL query
 * @return array|false|null
 */

// Suppress all errors
@ini_set('display_errors', 0);
@error_reporting(0);
function db_fetch_one($query)
{
    global $conn;

    if (!$conn) {
        error_log("Database unavailable for fetching a single row.");
        return false;
    }

    $result = mysqli_query($conn, $query);
    if (!$result) {
        error_log("Database query error: " . mysqli_error($conn));
        return false;
    }

    return mysqli_fetch_assoc($result);
}

/**
 * Fetch all rows from database
 * 
 * @param string $query SQL query
 * @return array
 */

// Suppress all errors
@ini_set('display_errors', 0);
@error_reporting(0);
function db_fetch_all($query)
{
    global $conn;

    if (!$conn) {
        error_log("Database unavailable for fetching rows.");
        return [];
    }

    $result = mysqli_query($conn, $query);
    if (!$result) {
        error_log("Database query error: " . mysqli_error($conn));
        return [];
    }

    $rows = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row;
    }

    return $rows;
}

/**
 * Close database connection
 */

// Suppress all errors
@ini_set('display_errors', 0);
@error_reporting(0);
function db_close()
{
    global $conn;

    if (!$conn) {
        return;
    }

    if (isset($conn) && $conn instanceof mysqli) {
        try {
            // Check if connection is still alive before closing
            if ($conn->query("SELECT 1")) {
                mysqli_close($conn);
            }
        } catch (Exception $e) {
            // Connection already closed, ignore
        }
    }
}

/**
 * Test database connection health
 * 
 * @return bool
 */

// Suppress all errors
@ini_set('display_errors', 0);
@error_reporting(0);
function db_health_check()
{
    global $conn;

    if (!$conn) {
        return false;
    }

    try {
        return (bool) $conn->query("SELECT 1");
    } catch (Exception $e) {
        return false;
    }
}

// Set error handling based on environment
$app_env = getenv('APP_ENV') ?: ($_ENV['APP_ENV'] ?? 'development');

if ($app_env === 'production') {
    // Production: Log errors, don't display
    error_reporting(E_ALL);
    ini_set('display_errors', '0');
    ini_set('log_errors', '1');
} else {
    // Development: Show errors
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
}

// Don't auto-close - let PHP handle it to avoid double-close errors
// register_shutdown_function('db_close');

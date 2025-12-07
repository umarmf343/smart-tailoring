#!/usr/bin/env php
<?php
/**
 * Database Migration CLI Tool
 * Smart Tailoring Service
 * 
 * Usage:
 *   php migrate.php status     - Show migration status
 *   php migrate.php run        - Run pending migrations
 *   php migrate.php rollback   - Rollback last batch
 *   php migrate.php pool       - Show connection pool stats
 *   php migrate.php help       - Show this help
 */

// Prevent web access
if (php_sapi_name() !== 'cli') {
    die("This script can only be run from command line\n");
}

// Load configuration
define('DB_ACCESS', true);
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/database/DatabaseMigrationManager.php';
require_once __DIR__ . '/database/DatabaseConnectionPool.php';

// Colors for CLI output
class CliColors
{
    public static $green = "\033[32m";
    public static $red = "\033[31m";
    public static $yellow = "\033[33m";
    public static $blue = "\033[34m";
    public static $reset = "\033[0m";

    public static function success($text)
    {
        return self::$green . $text . self::$reset;
    }

    public static function error($text)
    {
        return self::$red . $text . self::$reset;
    }

    public static function warning($text)
    {
        return self::$yellow . $text . self::$reset;
    }

    public static function info($text)
    {
        return self::$blue . $text . self::$reset;
    }
}

// Initialize migration manager
$manager = new DatabaseMigrationManager($conn, __DIR__ . '/database/migrations/');

// Parse command
$command = $argv[1] ?? 'help';

switch ($command) {
    case 'status':
        echo CliColors::info("=== Migration Status ===\n\n");
        $status = $manager->getStatus();

        echo "Executed Migrations: " . CliColors::success($status['total_executed']) . "\n";
        if (!empty($status['executed'])) {
            foreach ($status['executed'] as $migration) {
                echo "  ✓ " . $migration . "\n";
            }
        }

        echo "\nPending Migrations: " . CliColors::warning($status['total_pending']) . "\n";
        if (!empty($status['pending'])) {
            foreach ($status['pending'] as $migration) {
                echo "  ○ " . $migration . "\n";
            }
        } else {
            echo "  " . CliColors::success("No pending migrations\n");
        }
        break;

    case 'run':
        echo CliColors::info("=== Running Migrations ===\n\n");

        $status = $manager->getStatus();
        if (empty($status['pending'])) {
            echo CliColors::success("✓ No pending migrations\n");
            exit(0);
        }

        echo "Found " . count($status['pending']) . " pending migration(s)\n";
        echo "Confirm execution? [y/N]: ";
        $confirm = trim(fgets(STDIN));

        if (strtolower($confirm) !== 'y') {
            echo CliColors::warning("Migration cancelled\n");
            exit(0);
        }

        $result = $manager->runMigrations();

        if ($result['success']) {
            echo "\n" . CliColors::success("✓ Migrations completed successfully!\n");
            echo "Executed " . count($result['executed']) . " migration(s):\n";
            foreach ($result['executed'] as $migration) {
                echo "  ✓ " . $migration . "\n";
            }
        } else {
            echo "\n" . CliColors::error("✗ Migration failed!\n");
            foreach ($result['errors'] as $error) {
                echo CliColors::error("  ✗ " . $error['migration'] . "\n");
                echo "    Error: " . $error['error'] . "\n";
            }
            exit(1);
        }
        break;

    case 'rollback':
        echo CliColors::info("=== Rolling Back Migrations ===\n\n");

        echo CliColors::warning("WARNING: This will rollback the last batch of migrations!\n");
        echo "Confirm rollback? [y/N]: ";
        $confirm = trim(fgets(STDIN));

        if (strtolower($confirm) !== 'y') {
            echo CliColors::warning("Rollback cancelled\n");
            exit(0);
        }

        $result = $manager->rollback();

        if ($result['success']) {
            if (empty($result['rolledback'])) {
                echo CliColors::warning("No migrations to rollback\n");
            } else {
                echo "\n" . CliColors::success("✓ Rollback completed successfully!\n");
                echo "Rolled back " . count($result['rolledback']) . " migration(s):\n";
                foreach ($result['rolledback'] as $migration) {
                    echo "  ✓ " . $migration . "\n";
                }
            }
        } else {
            echo "\n" . CliColors::error("✗ Rollback failed!\n");
            foreach ($result['errors'] as $error) {
                echo CliColors::error("  ✗ " . $error['migration'] . "\n");
                echo "    Error: " . $error['error'] . "\n";
            }
            exit(1);
        }
        break;

    case 'pool':
        echo CliColors::info("=== Connection Pool Statistics ===\n\n");

        try {
            $pool = DatabaseConnectionPool::getInstance(DB_HOST, DB_USER, DB_PASS, DB_NAME);
            $stats = $pool->getStats();
            $health = $pool->healthCheck();

            echo "Total Connections Created: " . CliColors::info($stats['total_created']) . "\n";
            echo "Total Connections Reused:  " . CliColors::success($stats['total_reused']) . "\n";
            echo "Total Connections Closed:  " . $stats['total_closed'] . "\n";
            echo "Current Active:            " . CliColors::warning($stats['current_active']) . "\n";
            echo "Idle Connections:          " . $stats['idle_connections'] . "\n";
            echo "Max Connections:           " . $stats['max_connections'] . "\n";
            echo "Min Connections:           " . $stats['min_connections'] . "\n";

            echo "\nHealth Status:\n";
            echo "  Healthy:   " . CliColors::success($health['healthy']) . "\n";
            echo "  Unhealthy: " . ($health['unhealthy'] > 0 ? CliColors::error($health['unhealthy']) : $health['unhealthy']) . "\n";
            echo "  Total:     " . $health['total'] . "\n";

            if ($health['unhealthy'] > 0) {
                echo "\n" . CliColors::warning("⚠ Warning: Some connections are unhealthy\n");
            }
        } catch (Exception $e) {
            echo CliColors::error("Error: " . $e->getMessage() . "\n");
        }
        break;

    case 'help':
    default:
        echo CliColors::info("=== Database Migration CLI Tool ===\n\n");
        echo "Usage:\n";
        echo "  php migrate.php " . CliColors::success("status") . "     - Show migration status\n";
        echo "  php migrate.php " . CliColors::success("run") . "        - Run pending migrations\n";
        echo "  php migrate.php " . CliColors::warning("rollback") . "   - Rollback last batch\n";
        echo "  php migrate.php " . CliColors::info("pool") . "       - Show connection pool stats\n";
        echo "  php migrate.php " . CliColors::info("help") . "       - Show this help\n";
        echo "\nExamples:\n";
        echo "  php migrate.php status\n";
        echo "  php migrate.php run\n";
        echo "  php migrate.php rollback\n";
        break;
}

echo "\n";

<?php

/**
 * Database Migration Manager
 * Automated migration system for Smart Tailoring Service
 * 
 * Features:
 * - Tracks executed migrations
 * - Supports rollback
 * - Prevents duplicate execution
 * - Transaction support
 */

class DatabaseMigrationManager
{
    private $conn;
    private $migrationsPath;
    private $migrationsTable = 'schema_migrations';

    public function __construct($connection, $migrationsPath = null)
    {
        $this->conn = $connection;
        $this->migrationsPath = $migrationsPath ?? __DIR__ . '/migrations/';
        $this->initMigrationsTable();
    }

    /**
     * Create migrations tracking table if not exists
     */
    private function initMigrationsTable()
    {
        $sql = "CREATE TABLE IF NOT EXISTS `{$this->migrationsTable}` (
            `id` INT(11) NOT NULL AUTO_INCREMENT,
            `migration` VARCHAR(255) NOT NULL,
            `batch` INT(11) NOT NULL,
            `executed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `unique_migration` (`migration`),
            KEY `idx_batch` (`batch`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

        $this->conn->query($sql);
    }

    /**
     * Get all pending migrations
     */
    public function getPendingMigrations()
    {
        $files = glob($this->migrationsPath . '*.sql');
        $executed = $this->getExecutedMigrations();

        $pending = [];
        foreach ($files as $file) {
            $filename = basename($file);
            if (!in_array($filename, $executed) && !strpos($filename, 'rollback')) {
                $pending[] = $filename;
            }
        }

        sort($pending);
        return $pending;
    }

    /**
     * Get executed migrations
     */
    private function getExecutedMigrations()
    {
        $sql = "SELECT migration FROM {$this->migrationsTable} ORDER BY id";
        $result = $this->conn->query($sql);

        $migrations = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $migrations[] = $row['migration'];
            }
        }

        return $migrations;
    }

    /**
     * Run all pending migrations
     */
    public function runMigrations()
    {
        $pending = $this->getPendingMigrations();

        if (empty($pending)) {
            return [
                'success' => true,
                'message' => 'No pending migrations',
                'executed' => []
            ];
        }

        $batch = $this->getNextBatch();
        $executed = [];
        $errors = [];

        foreach ($pending as $migration) {
            try {
                $this->conn->begin_transaction();

                $this->executeMigration($migration);
                $this->recordMigration($migration, $batch);

                $this->conn->commit();
                $executed[] = $migration;
            } catch (Exception $e) {
                $this->conn->rollback();
                $errors[] = [
                    'migration' => $migration,
                    'error' => $e->getMessage()
                ];
                break; // Stop on first error
            }
        }

        return [
            'success' => empty($errors),
            'executed' => $executed,
            'errors' => $errors
        ];
    }

    /**
     * Execute a single migration file
     */
    private function executeMigration($filename)
    {
        $filepath = $this->migrationsPath . $filename;
        $sql = file_get_contents($filepath);

        // Split by semicolon and execute each statement
        $statements = array_filter(
            array_map('trim', explode(';', $sql)),
            function ($stmt) {
                return !empty($stmt) && !preg_match('/^--/', $stmt);
            }
        );

        foreach ($statements as $statement) {
            if (!empty($statement)) {
                if (!$this->conn->query($statement)) {
                    throw new Exception($this->conn->error);
                }
            }
        }
    }

    /**
     * Record migration in database
     */
    private function recordMigration($migration, $batch)
    {
        $stmt = $this->conn->prepare(
            "INSERT INTO {$this->migrationsTable} (migration, batch) VALUES (?, ?)"
        );
        $stmt->bind_param('si', $migration, $batch);

        if (!$stmt->execute()) {
            throw new Exception($stmt->error);
        }

        $stmt->close();
    }

    /**
     * Get next batch number
     */
    private function getNextBatch()
    {
        $sql = "SELECT MAX(batch) as max_batch FROM {$this->migrationsTable}";
        $result = $this->conn->query($sql);

        if ($result && $row = $result->fetch_assoc()) {
            return ($row['max_batch'] ?? 0) + 1;
        }

        return 1;
    }

    /**
     * Rollback last batch of migrations
     */
    public function rollback()
    {
        $lastBatch = $this->getLastBatch();

        if ($lastBatch === null) {
            return [
                'success' => true,
                'message' => 'No migrations to rollback',
                'rolledback' => []
            ];
        }

        $migrations = $this->getBatchMigrations($lastBatch);
        $rolledback = [];
        $errors = [];

        // Rollback in reverse order
        foreach (array_reverse($migrations) as $migration) {
            try {
                $this->conn->begin_transaction();

                $rollbackFile = str_replace('.sql', '', $migration);
                $rollbackFile = preg_replace('/^(\d+)_/', '$1_rollback_', $rollbackFile) . '.sql';

                if (file_exists($this->migrationsPath . $rollbackFile)) {
                    $this->executeMigration($rollbackFile);
                }

                $this->removeMigrationRecord($migration);

                $this->conn->commit();
                $rolledback[] = $migration;
            } catch (Exception $e) {
                $this->conn->rollback();
                $errors[] = [
                    'migration' => $migration,
                    'error' => $e->getMessage()
                ];
                break;
            }
        }

        return [
            'success' => empty($errors),
            'rolledback' => $rolledback,
            'errors' => $errors
        ];
    }

    /**
     * Get last batch number
     */
    private function getLastBatch()
    {
        $sql = "SELECT MAX(batch) as last_batch FROM {$this->migrationsTable}";
        $result = $this->conn->query($sql);

        if ($result && $row = $result->fetch_assoc()) {
            return $row['last_batch'];
        }

        return null;
    }

    /**
     * Get migrations from specific batch
     */
    private function getBatchMigrations($batch)
    {
        $stmt = $this->conn->prepare(
            "SELECT migration FROM {$this->migrationsTable} WHERE batch = ? ORDER BY id"
        );
        $stmt->bind_param('i', $batch);
        $stmt->execute();

        $result = $stmt->get_result();
        $migrations = [];

        while ($row = $result->fetch_assoc()) {
            $migrations[] = $row['migration'];
        }

        $stmt->close();
        return $migrations;
    }

    /**
     * Remove migration record
     */
    private function removeMigrationRecord($migration)
    {
        $stmt = $this->conn->prepare(
            "DELETE FROM {$this->migrationsTable} WHERE migration = ?"
        );
        $stmt->bind_param('s', $migration);

        if (!$stmt->execute()) {
            throw new Exception($stmt->error);
        }

        $stmt->close();
    }

    /**
     * Get migration status
     */
    public function getStatus()
    {
        $executed = $this->getExecutedMigrations();
        $pending = $this->getPendingMigrations();

        return [
            'executed' => $executed,
            'pending' => $pending,
            'total_executed' => count($executed),
            'total_pending' => count($pending)
        ];
    }
}

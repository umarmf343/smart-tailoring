<?php

/**
 * Database Connection Pool Manager
 * Implements connection pooling for better performance
 * 
 * Features:
 * - Connection reuse
 * - Connection limits
 * - Automatic cleanup
 * - Health checks
 * - Connection statistics
 */

class DatabaseConnectionPool
{
    private static $instance = null;
    private $connections = [];
    private $activeConnections = [];
    private $maxConnections = 10;
    private $minConnections = 2;
    private $connectionTimeout = 30; // seconds
    private $idleTimeout = 300; // 5 minutes

    private $host;
    private $user;
    private $pass;
    private $database;

    // Statistics
    private $stats = [
        'total_created' => 0,
        'total_reused' => 0,
        'total_closed' => 0,
        'current_active' => 0
    ];

    private function __construct($host, $user, $pass, $database, $config = [])
    {
        $this->host = $host;
        $this->user = $user;
        $this->pass = $pass;
        $this->database = $database;

        // Override defaults with config
        if (isset($config['max_connections'])) {
            $this->maxConnections = $config['max_connections'];
        }
        if (isset($config['min_connections'])) {
            $this->minConnections = $config['min_connections'];
        }
        if (isset($config['connection_timeout'])) {
            $this->connectionTimeout = $config['connection_timeout'];
        }
        if (isset($config['idle_timeout'])) {
            $this->idleTimeout = $config['idle_timeout'];
        }

        // Initialize minimum connections
        $this->initializePool();
    }

    /**
     * Get singleton instance
     */
    public static function getInstance($host = null, $user = null, $pass = null, $database = null, $config = [])
    {
        if (self::$instance === null) {
            if ($host === null) {
                throw new Exception("Database credentials required for first initialization");
            }
            self::$instance = new self($host, $user, $pass, $database, $config);
        }
        return self::$instance;
    }

    /**
     * Initialize pool with minimum connections
     */
    private function initializePool()
    {
        for ($i = 0; $i < $this->minConnections; $i++) {
            $this->createConnection();
        }
    }

    /**
     * Create new database connection
     */
    private function createConnection()
    {
        if (count($this->connections) + count($this->activeConnections) >= $this->maxConnections) {
            return null;
        }

        try {
            $conn = new mysqli($this->host, $this->user, $this->pass, $this->database);

            if ($conn->connect_error) {
                throw new Exception("Connection failed: " . $conn->connect_error);
            }

            // Set charset and timezone
            $conn->set_charset("utf8mb4");
            $conn->query("SET time_zone = '+05:30'");

            // Set connection timeout
            $conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, $this->connectionTimeout);

            $connectionId = uniqid('conn_', true);
            $this->connections[$connectionId] = [
                'connection' => $conn,
                'created_at' => time(),
                'last_used' => time()
            ];

            $this->stats['total_created']++;

            return $connectionId;
        } catch (Exception $e) {
            error_log("Failed to create database connection: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Get connection from pool
     */
    public function getConnection()
    {
        // Try to get from idle pool
        if (!empty($this->connections)) {
            $connectionId = array_key_first($this->connections);
            $connData = $this->connections[$connectionId];

            // Check if connection is still alive
            if (!$connData['connection']->ping()) {
                // Connection dead, remove and create new one
                $this->closeConnection($connectionId, true);
                return $this->getConnection(); // Retry
            }

            // Move to active pool
            unset($this->connections[$connectionId]);
            $connData['last_used'] = time();
            $this->activeConnections[$connectionId] = $connData;

            $this->stats['total_reused']++;
            $this->stats['current_active'] = count($this->activeConnections);

            return [
                'id' => $connectionId,
                'connection' => $connData['connection']
            ];
        }

        // Create new connection if under limit
        $connectionId = $this->createConnection();
        if ($connectionId !== null) {
            $connData = $this->connections[$connectionId];
            unset($this->connections[$connectionId]);
            $this->activeConnections[$connectionId] = $connData;

            $this->stats['current_active'] = count($this->activeConnections);

            return [
                'id' => $connectionId,
                'connection' => $connData['connection']
            ];
        }

        // Wait for connection to become available
        $maxWait = 5; // seconds
        $waited = 0;
        while ($waited < $maxWait) {
            usleep(100000); // 100ms
            $waited += 0.1;

            if (!empty($this->connections)) {
                return $this->getConnection();
            }
        }

        throw new Exception("No database connections available in pool");
    }

    /**
     * Release connection back to pool
     */
    public function releaseConnection($connectionId)
    {
        if (!isset($this->activeConnections[$connectionId])) {
            return;
        }

        $connData = $this->activeConnections[$connectionId];
        unset($this->activeConnections[$connectionId]);

        // Verify connection is still good
        try {
            $isValid = false;
            if (isset($connData['connection']) && is_object($connData['connection'])) {
                // Check if connection is still open
                if (property_exists($connData['connection'], 'thread_id') && $connData['connection']->thread_id) {
                    $isValid = @$connData['connection']->ping();
                }
            }

            if ($isValid) {
                $connData['last_used'] = time();
                $this->connections[$connectionId] = $connData;
            } else {
                // Connection died or invalid, just update stats
                $this->stats['total_closed']++;
            }
        } catch (Throwable $e) {
            // Connection already closed or error, just update stats
            $this->stats['total_closed']++;
        }

        $this->stats['current_active'] = count($this->activeConnections);
    }

    /**
     * Close specific connection
     */
    private function closeConnection($connectionId, $fromIdle = true)
    {
        $pool = $fromIdle ? $this->connections : $this->activeConnections;

        if (isset($pool[$connectionId])) {
            $pool[$connectionId]['connection']->close();
            unset($pool[$connectionId]);
            $this->stats['total_closed']++;
        }
    }

    /**
     * Clean up idle connections
     */
    public function cleanupIdleConnections()
    {
        $now = time();
        $minToKeep = $this->minConnections;
        $cleaned = 0;

        foreach ($this->connections as $id => $connData) {
            if (count($this->connections) - $cleaned <= $minToKeep) {
                break;
            }

            if (($now - $connData['last_used']) > $this->idleTimeout) {
                $this->closeConnection($id, true);
                $cleaned++;
            }
        }

        return $cleaned;
    }

    /**
     * Close all connections
     */
    public function closeAll()
    {
        foreach ($this->connections as $id => $connData) {
            $connData['connection']->close();
        }

        foreach ($this->activeConnections as $id => $connData) {
            $connData['connection']->close();
        }

        $this->connections = [];
        $this->activeConnections = [];
        $this->stats['current_active'] = 0;
    }

    /**
     * Get pool statistics
     */
    public function getStats()
    {
        return array_merge($this->stats, [
            'idle_connections' => count($this->connections),
            'max_connections' => $this->maxConnections,
            'min_connections' => $this->minConnections
        ]);
    }

    /**
     * Health check
     */
    public function healthCheck()
    {
        $healthy = 0;
        $unhealthy = 0;

        foreach ($this->connections as $connData) {
            if ($connData['connection']->ping()) {
                $healthy++;
            } else {
                $unhealthy++;
            }
        }

        foreach ($this->activeConnections as $connData) {
            if ($connData['connection']->ping()) {
                $healthy++;
            } else {
                $unhealthy++;
            }
        }

        return [
            'healthy' => $healthy,
            'unhealthy' => $unhealthy,
            'total' => $healthy + $unhealthy
        ];
    }
}

/**
 * Wrapper class for backward compatibility
 */
class DatabaseConnection
{
    private static $pool = null;
    private $connectionId = null;
    private $conn = null;

    public function __construct()
    {
        if (self::$pool === null) {
            self::$pool = DatabaseConnectionPool::getInstance(
                DB_HOST,
                DB_USER,
                DB_PASS,
                DB_NAME,
                [
                    'max_connections' => 10,
                    'min_connections' => 2
                ]
            );
        }

        $connData = self::$pool->getConnection();
        $this->connectionId = $connData['id'];
        $this->conn = $connData['connection'];
    }

    public function getConnection()
    {
        return $this->conn;
    }

    public function close()
    {
        if ($this->connectionId !== null) {
            self::$pool->releaseConnection($this->connectionId);
            $this->connectionId = null;
            $this->conn = null;
        }
    }

    public static function getPool()
    {
        return self::$pool;
    }

    public function __destruct()
    {
        $this->close();
    }
}

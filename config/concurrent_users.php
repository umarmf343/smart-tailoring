<?php

/**
 * Concurrent Users Management
 * Tracks and limits active users to prevent server overload
 */

if (!defined('DB_ACCESS')) {
    die('Direct access not permitted');
}

class ConcurrentUserManager
{
    private $conn;
    private $max_users;
    private $session_timeout = 1800; // 30 minutes
    private $available = true;

    public function __construct($db_connection, $max_concurrent_users = 100)
    {
        if (!$db_connection instanceof mysqli) {
            $this->available = false;
            $this->conn = null;
            return;
        }

        $this->conn = $db_connection;
        $this->max_users = $max_concurrent_users;
        $this->createTableIfNotExists();
    }

    /**
     * Create active_sessions table if it doesn't exist
     */
    private function createTableIfNotExists()
    {
        if (!$this->available) {
            return;
        }

        $sql = "CREATE TABLE IF NOT EXISTS active_sessions (
            session_id VARCHAR(255) PRIMARY KEY,
            user_id INT NULL,
            user_type VARCHAR(50) NULL,
            ip_address VARCHAR(45),
            user_agent TEXT,
            last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_last_activity (last_activity),
            INDEX idx_user_id (user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

        mysqli_query($this->conn, $sql);
    }

    /**
     * Register a new session
     */
    public function registerSession($user_id = null, $user_type = null)
    {
        if (!$this->available) {
            return true; // Soft-pass when DB is unavailable
        }

        // Clean up expired sessions first
        $this->cleanupExpiredSessions();

        $session_id = session_id();
        $ip_address = $this->getClientIP();
        $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

        // Check if we've reached the limit
        if (!$this->canAcceptNewUser($session_id)) {
            return false;
        }

        // Insert or update session
        $sql = "INSERT INTO active_sessions 
                (session_id, user_id, user_type, ip_address, user_agent, last_activity) 
                VALUES (?, ?, ?, ?, ?, NOW())
                ON DUPLICATE KEY UPDATE 
                user_id = VALUES(user_id),
                user_type = VALUES(user_type),
                last_activity = NOW()";

        $stmt = mysqli_prepare($this->conn, $sql);
        mysqli_stmt_bind_param($stmt, "sisss", $session_id, $user_id, $user_type, $ip_address, $user_agent);
        $result = mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        return $result;
    }

    /**
     * Update session activity
     */
    public function updateActivity()
    {
        if (!$this->available) {
            return;
        }

        $session_id = session_id();

        $sql = "UPDATE active_sessions 
                SET last_activity = NOW() 
                WHERE session_id = ?";

        $stmt = mysqli_prepare($this->conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $session_id);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }

    /**
     * Remove a session
     */
    public function removeSession($session_id = null)
    {
        if (!$this->available) {
            return;
        }

        if ($session_id === null) {
            $session_id = session_id();
        }

        $sql = "DELETE FROM active_sessions WHERE session_id = ?";
        $stmt = mysqli_prepare($this->conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $session_id);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }

    /**
     * Check if we can accept a new user
     */
    private function canAcceptNewUser($session_id)
    {
        if (!$this->available) {
            return true;
        }

        // Check if session already exists (updating existing session is always allowed)
        $sql = "SELECT COUNT(*) as count FROM active_sessions WHERE session_id = ?";
        $stmt = mysqli_prepare($this->conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $session_id);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $row = mysqli_fetch_assoc($result);
        mysqli_stmt_close($stmt);

        if ($row['count'] > 0) {
            return true; // Existing session, allow update
        }

        // Count active sessions
        $active_count = $this->getActiveUserCount();

        return $active_count < $this->max_users;
    }

    /**
     * Get count of active users
     */
    public function getActiveUserCount()
    {
        if (!$this->available) {
            return 0;
        }

        $timeout = date('Y-m-d H:i:s', time() - $this->session_timeout);

        $sql = "SELECT COUNT(*) as count 
                FROM active_sessions 
                WHERE last_activity > ?";

        $stmt = mysqli_prepare($this->conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $timeout);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $row = mysqli_fetch_assoc($result);
        mysqli_stmt_close($stmt);

        return (int)$row['count'];
    }

    /**
     * Clean up expired sessions
     */
    private function cleanupExpiredSessions()
    {
        if (!$this->available) {
            return;
        }

        $timeout = date('Y-m-d H:i:s', time() - $this->session_timeout);

        $sql = "DELETE FROM active_sessions WHERE last_activity < ?";
        $stmt = mysqli_prepare($this->conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $timeout);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }

    /**
     * Get client IP address
     */
    private function getClientIP()
    {
        $ip = '';

        if (isset($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } elseif (isset($_SERVER['REMOTE_ADDR'])) {
            $ip = $_SERVER['REMOTE_ADDR'];
        }

        return $ip;
    }

    /**
     * Check if user limit is reached
     */
    public function isServerFull()
    {
        if (!$this->available) {
            return false; // Don't block traffic when DB is down
        }

        $this->cleanupExpiredSessions();
        $active_count = $this->getActiveUserCount();
        return $active_count >= $this->max_users;
    }

    /**
     * Get server capacity info
     */
    public function getCapacityInfo()
    {
        $this->cleanupExpiredSessions();
        $active = $this->getActiveUserCount();

        return [
            'active_users' => $active,
            'max_users' => $this->max_users,
            'available_slots' => max(0, $this->max_users - $active),
            'capacity_percentage' => round(($active / $this->max_users) * 100, 2),
            'is_full' => $active >= $this->max_users
        ];
    }
}

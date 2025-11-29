<?php

/**
 * Admin - Admin User Management
 * Manage admin users (Super Admin only)
 */

// Security check
require_once 'includes/admin_security.php';

// Only super admins can access this page
requireRole('super_admin');

// Database connection
define('DB_ACCESS', true);
require_once '../config/db.php';

// Handle actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $target_admin_id = intval($_POST['admin_id']);
    $action = $_POST['action'];

    try {
        if ($action === 'toggle_status') {
            // Toggle active status
            $stmt = $conn->prepare("UPDATE admins SET is_active = NOT is_active WHERE id = ? AND id != ?");
            $stmt->bind_param("ii", $target_admin_id, $admin_id);
            $stmt->execute();

            logActivity('toggle_admin_status', "Toggled status for admin ID: $target_admin_id", 'admin', $target_admin_id);
            $success_message = "Admin status updated successfully!";
        } elseif ($action === 'delete') {
            // Delete admin (prevent self-delete)
            if ($target_admin_id != $admin_id) {
                $stmt = $conn->prepare("DELETE FROM admins WHERE id = ? AND id != ?");
                $stmt->bind_param("ii", $target_admin_id, $admin_id);
                $stmt->execute();

                logActivity('delete_admin', "Deleted admin ID: $target_admin_id", 'admin', $target_admin_id);
                $success_message = "Admin deleted successfully!";
            } else {
                $error_message = "You cannot delete yourself!";
            }
        }
    } catch (Exception $e) {
        $error_message = "Error: " . $e->getMessage();
    }
}

// Get all admins
$admins = db_fetch_all("SELECT * FROM admins ORDER BY created_at DESC");

db_close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Management - Admin Panel</title>

    <link rel="icon" type="image/jpg" href="../assets/images/STP-favicon.jpg">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="assets/admin.css">
</head>

<body>
    <?php include 'includes/admin_nav.php'; ?>

    <div class="admin-container">
        <div class="page-header">
            <h1><i class="fas fa-user-shield"></i> Admin Management</h1>
            <p>Manage admin users and permissions</p>
        </div>

        <?php if (isset($success_message)): ?>
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i>
                <?php echo $success_message; ?>
            </div>
        <?php endif; ?>

        <?php if (isset($error_message)): ?>
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i>
                <?php echo $error_message; ?>
            </div>
        <?php endif; ?>

        <!-- Admins Table -->
        <div class="card">
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($admins)): ?>
                            <tr>
                                <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-light);">
                                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                                    No admins found
                                </td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($admins as $admin_user): ?>
                                <tr>
                                    <td>#<?php echo $admin_user['id']; ?></td>
                                    <td>
                                        <strong><?php echo htmlspecialchars($admin_user['name'] ?? $admin_user['username']); ?></strong>
                                        <?php if ($admin_user['id'] == $admin_id): ?>
                                            <span class="badge badge-info" style="margin-left: 0.5rem;">You</span>
                                        <?php endif; ?>
                                    </td>
                                    <td><?php echo htmlspecialchars($admin_user['username']); ?></td>
                                    <td><?php echo htmlspecialchars($admin_user['email']); ?></td>
                                    <td>
                                        <?php
                                        $role_badges = [
                                            'super_admin' => '<span class="badge badge-danger"><i class="fas fa-crown"></i> Super Admin</span>',
                                            'admin' => '<span class="badge badge-primary"><i class="fas fa-user-shield"></i> Admin</span>',
                                            'moderator' => '<span class="badge badge-secondary"><i class="fas fa-user-cog"></i> Moderator</span>'
                                        ];
                                        echo $role_badges[$admin_user['role']] ?? $admin_user['role'];
                                        ?>
                                    </td>
                                    <td>
                                        <?php if ($admin_user['is_active']): ?>
                                            <span class="badge badge-success">
                                                <i class="fas fa-check-circle"></i> Active
                                            </span>
                                        <?php else: ?>
                                            <span class="badge badge-danger">
                                                <i class="fas fa-times-circle"></i> Inactive
                                            </span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php if ($admin_user['last_login']): ?>
                                            <?php echo date('M d, Y H:i', strtotime($admin_user['last_login'])); ?>
                                        <?php else: ?>
                                            <span style="color: var(--text-light);">Never</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <div class="action-buttons">
                                            <?php if ($admin_user['id'] != $admin_id): ?>
                                                <form method="POST" style="display: inline;" onsubmit="return confirm('Toggle this admin status?');">
                                                    <input type="hidden" name="action" value="toggle_status">
                                                    <input type="hidden" name="admin_id" value="<?php echo $admin_user['id']; ?>">
                                                    <button type="submit" class="btn-action btn-warning" title="Toggle Status">
                                                        <i class="fas fa-toggle-on"></i>
                                                    </button>
                                                </form>
                                                <form method="POST" style="display: inline;" onsubmit="return confirm('Delete this admin? This action cannot be undone!');">
                                                    <input type="hidden" name="action" value="delete">
                                                    <input type="hidden" name="admin_id" value="<?php echo $admin_user['id']; ?>">
                                                    <button type="submit" class="btn-action btn-danger" title="Delete">
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </form>
                                            <?php else: ?>
                                                <span style="color: var(--text-light); font-size: 0.875rem;">Cannot modify self</span>
                                            <?php endif; ?>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Admin Information -->
        <div class="card" style="margin-top: 2rem;">
            <h3><i class="fas fa-info-circle"></i> Role Permissions</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-top: 1rem;">
                <div>
                    <h4 style="color: var(--danger-color); margin-bottom: 0.5rem;">
                        <i class="fas fa-crown"></i> Super Admin
                    </h4>
                    <ul style="margin-left: 1.5rem; color: var(--text-light);">
                        <li>Full system access</li>
                        <li>Manage all admins</li>
                        <li>Delete records</li>
                        <li>System settings</li>
                    </ul>
                </div>
                <div>
                    <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">
                        <i class="fas fa-user-shield"></i> Admin
                    </h4>
                    <ul style="margin-left: 1.5rem; color: var(--text-light);">
                        <li>Manage users</li>
                        <li>Verify tailors</li>
                        <li>View orders</li>
                        <li>Handle disputes</li>
                    </ul>
                </div>
                <div>
                    <h4 style="color: var(--secondary-color); margin-bottom: 0.5rem;">
                        <i class="fas fa-user-cog"></i> Moderator
                    </h4>
                    <ul style="margin-left: 1.5rem; color: var(--text-light);">
                        <li>View users</li>
                        <li>View orders</li>
                        <li>Basic moderation</li>
                        <li>Limited access</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <script src="assets/admin.js"></script>
</body>

</html>
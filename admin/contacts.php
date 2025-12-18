<?php

/**
 * Admin - Contact Messages Management
 * View and manage contact form submissions
 */

// Security check
require_once 'includes/admin_security.php';

// Database connection
define('DB_ACCESS', true);
require_once '../config/db.php';

// Handle reply action
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'reply') {
    $message_id = intval($_POST['message_id']);
    $admin_reply = trim($_POST['admin_reply']);

    try {
        $stmt = $conn->prepare("UPDATE contact_messages SET admin_reply = ?, replied_by_admin_id = ?, replied_at = NOW(), status = 'replied' WHERE id = ?");
        $stmt->bind_param("sii", $admin_reply, $admin_id, $message_id);
        $stmt->execute();

        logActivity('reply_contact', "Replied to contact message ID: $message_id", 'contact', $message_id);
        $success_message = "Reply sent successfully!";
    } catch (Exception $e) {
        $error_message = "Error: " . $e->getMessage();
    }
}

// Handle status update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_status') {
    $message_id = intval($_POST['message_id']);
    $new_status = $_POST['status'];

    try {
        $stmt = $conn->prepare("UPDATE contact_messages SET status = ? WHERE id = ?");
        $stmt->bind_param("si", $new_status, $message_id);
        $stmt->execute();

        logActivity('update_contact_status', "Updated contact message ID: $message_id to $new_status", 'contact', $message_id);
        $success_message = "Status updated successfully!";
    } catch (Exception $e) {
        $error_message = "Error: " . $e->getMessage();
    }
}

// Get filter
$filter = $_GET['filter'] ?? 'all';
$search = $_GET['search'] ?? '';

// Build query
$where_conditions = [];
$params = [];
$types = '';

if ($filter === 'new') {
    $where_conditions[] = "status = 'new'";
} elseif ($filter === 'replied') {
    $where_conditions[] = "status = 'replied'";
} elseif ($filter === 'closed') {
    $where_conditions[] = "status = 'closed'";
}

if (!empty($search)) {
    $where_conditions[] = "(name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)";
    $search_param = "%$search%";
    $params = array_merge($params, [$search_param, $search_param, $search_param, $search_param]);
    $types .= 'ssss';
}

$where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

// Get messages
$query = "SELECT * FROM contact_messages $where_clause ORDER BY created_at DESC";
$stmt = $conn->prepare($query);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();
$messages = $result->fetch_all(MYSQLI_ASSOC);

// Get counts
$total_result = db_fetch_one("SELECT COUNT(*) as count FROM contact_messages");
$total_count = $total_result['count'] ?? 0;

$new_result = db_fetch_one("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'new'");
$new_count = $new_result['count'] ?? 0;

$replied_result = db_fetch_one("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'replied'");
$replied_count = $replied_result['count'] ?? 0;

$closed_result = db_fetch_one("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'closed'");
$closed_count = $closed_result['count'] ?? 0;

db_close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Messages - Admin Panel</title>

    <link rel="icon" type="image/svg+xml" href="../assets/images/STP-favicon.svg">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="assets/admin.css">

    <style>
        .filter-tabs {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            border-bottom: 2px solid var(--border-color);
        }

        .filter-tab {
            padding: 1rem 1.5rem;
            background: none;
            border: none;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            color: var(--text-light);
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .filter-tab:hover {
            color: var(--primary-color);
        }

        .filter-tab.active {
            color: var(--primary-color);
        }

        .filter-tab.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        }

        .tab-count {
            background: var(--light-color);
            padding: 0.15rem 0.6rem;
            border-radius: 12px;
            font-size: 0.85rem;
        }

        .filter-tab.active .tab-count {
            background: var(--primary-color);
            color: white;
        }

        .search-bar {
            margin-bottom: 2rem;
        }

        .search-bar form {
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        .search-bar input[type="text"] {
            flex: 1;
            max-width: 500px;
            padding: 0.9rem 1rem 0.9rem 3rem;
            border: 2px solid var(--border-color);
            border-radius: 10px;
            font-family: 'Poppins', sans-serif;
            font-size: 0.95rem;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23888' viewBox='0 0 512 512'%3E%3Cpath d='M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z'/%3E%3C/svg%3E") no-repeat 1rem center;
            background-size: 1rem;
        }

        .search-bar button {
            padding: 0.9rem 2rem;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            border: none;
            border-radius: 10px;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .search-bar button:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }

        .btn-secondary {
            padding: 0.9rem 2rem;
            background: var(--light-color);
            color: var(--text-dark);
            border: none;
            border-radius: 10px;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
        }

        .btn-secondary:hover {
            background: var(--border-color);
        }

        .message-excerpt {
            max-width: 300px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .btn-view {
            padding: 0.5rem 1rem;
            background: var(--info-color);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.875rem;
            transition: all 0.3s ease;
        }

        .btn-view:hover {
            background: #2563eb;
            transform: translateY(-2px);
        }

        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            animation: fadeIn 0.3s ease;
        }

        .modal.show {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-content {
            background: white;
            border-radius: 15px;
            max-width: 700px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        }

        .modal-header {
            padding: 2rem;
            border-bottom: 2px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h3 {
            font-size: 1.5rem;
            color: var(--text-dark);
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--text-light);
            cursor: pointer;
            transition: color 0.3s ease;
        }

        .modal-close:hover {
            color: var(--danger-color);
        }

        .modal-body {
            padding: 2rem;
        }

        .message-detail {
            margin-bottom: 1.5rem;
        }

        .message-detail label {
            display: block;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 0.5rem;
        }

        .message-detail p {
            color: var(--text-light);
            line-height: 1.6;
            background: var(--light-color);
            padding: 1rem;
            border-radius: 8px;
        }

        .message-detail textarea {
            width: 100%;
            padding: 1rem;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            min-height: 120px;
        }

        .modal-actions {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }

        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }

            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    </style>
</head>

<body>
    <?php include 'includes/admin_nav.php'; ?>

    <div class="admin-container">
        <div class="page-header">
            <h1><i class="fas fa-envelope"></i> Contact Messages</h1>
            <p>View and manage contact form submissions</p>
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

        <!-- Filter Tabs -->
        <div class="filter-tabs">
            <a href="?filter=all" class="filter-tab <?php echo $filter === 'all' ? 'active' : ''; ?>">
                <i class="fas fa-list"></i> All
                <span class="tab-count"><?php echo $total_count; ?></span>
            </a>
            <a href="?filter=new" class="filter-tab <?php echo $filter === 'new' ? 'active' : ''; ?>">
                <i class="fas fa-envelope"></i> New
                <span class="tab-count"><?php echo $new_count; ?></span>
            </a>
            <a href="?filter=replied" class="filter-tab <?php echo $filter === 'replied' ? 'active' : ''; ?>">
                <i class="fas fa-reply"></i> Replied
                <span class="tab-count"><?php echo $replied_count; ?></span>
            </a>
            <a href="?filter=closed" class="filter-tab <?php echo $filter === 'closed' ? 'active' : ''; ?>">
                <i class="fas fa-check-circle"></i> Closed
                <span class="tab-count"><?php echo $closed_count; ?></span>
            </a>
        </div>

        <!-- Search Bar -->
        <div class="search-bar">
            <form method="GET" action="">
                <input type="hidden" name="filter" value="<?php echo htmlspecialchars($filter); ?>">
                <input type="text" name="search" placeholder="Search by name, email, subject..." value="<?php echo htmlspecialchars($search); ?>">
                <button type="submit"><i class="fas fa-search"></i> Search</button>
                <?php if (!empty($search)): ?>
                    <a href="?filter=<?php echo $filter; ?>" class="btn-secondary">
                        <i class="fas fa-times"></i> Clear
                    </a>
                <?php endif; ?>
            </form>
        </div>

        <!-- Messages Table -->
        <div class="card">
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($messages)): ?>
                            <tr>
                                <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-light);">
                                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                                    No messages found
                                </td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($messages as $msg): ?>
                                <tr>
                                    <td>#<?php echo $msg['id']; ?></td>
                                    <td>
                                        <strong><?php echo htmlspecialchars($msg['name']); ?></strong><br>
                                        <small style="color: var(--text-light);"><?php echo ucfirst($msg['user_type']); ?></small>
                                    </td>
                                    <td><?php echo htmlspecialchars($msg['email']); ?></td>
                                    <td><?php echo htmlspecialchars($msg['subject']); ?></td>
                                    <td>
                                        <div class="message-excerpt"><?php echo htmlspecialchars(substr($msg['message'], 0, 50)); ?>...</div>
                                    </td>
                                    <td><?php echo date('M d, Y', strtotime($msg['created_at'])); ?></td>
                                    <td>
                                        <?php
                                        $status_badges = [
                                            'new' => '<span class="badge badge-warning"><i class="fas fa-envelope"></i> New</span>',
                                            'read' => '<span class="badge badge-info"><i class="fas fa-eye"></i> Read</span>',
                                            'replied' => '<span class="badge badge-success"><i class="fas fa-reply"></i> Replied</span>',
                                            'closed' => '<span class="badge badge-secondary"><i class="fas fa-check-circle"></i> Closed</span>'
                                        ];
                                        echo $status_badges[$msg['status']] ?? $msg['status'];
                                        ?>
                                    </td>
                                    <td>
                                        <button class="btn-view" onclick='viewMessage(<?php echo json_encode($msg); ?>)'>
                                            <i class="fas fa-eye"></i> View
                                        </button>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- View Message Modal -->
    <div id="messageModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-envelope-open"></i> Message Details</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body" id="modalBody">
                <!-- Content loaded dynamically -->
            </div>
        </div>
    </div>

    <script src="assets/admin.js"></script>
    <script>
        function viewMessage(message) {
            const modal = document.getElementById('messageModal');
            const modalBody = document.getElementById('modalBody');

            // Status badges
            const statusBadges = {
                'new': '<span class="badge badge-warning"><i class="fas fa-envelope"></i> New</span>',
                'read': '<span class="badge badge-info"><i class="fas fa-eye"></i> Read</span>',
                'replied': '<span class="badge badge-success"><i class="fas fa-reply"></i> Replied</span>',
                'closed': '<span class="badge badge-secondary"><i class="fas fa-check-circle"></i> Closed</span>'
            };

            modalBody.innerHTML = `
                <div class="message-detail">
                    <label>From:</label>
                    <p><strong>${message.name}</strong> (${message.user_type})<br>${message.email}${message.phone ? '<br>' + message.phone : ''}</p>
                </div>
                
                <div class="message-detail">
                    <label>Subject:</label>
                    <p>${message.subject}</p>
                </div>
                
                <div class="message-detail">
                    <label>Message:</label>
                    <p>${message.message}</p>
                </div>
                
                <div class="message-detail">
                    <label>Date:</label>
                    <p>${new Date(message.created_at).toLocaleString()}</p>
                </div>
                
                <div class="message-detail">
                    <label>Status:</label>
                    <p>${statusBadges[message.status]}</p>
                </div>
                
                ${message.admin_reply ? `
                <div class="message-detail">
                    <label>Admin Reply:</label>
                    <p>${message.admin_reply}</p>
                </div>
                ` : ''}
                
                <form method="POST" style="margin-top: 2rem;">
                    <input type="hidden" name="action" value="reply">
                    <input type="hidden" name="message_id" value="${message.id}">
                    
                    <div class="message-detail">
                        <label>Send Reply (Optional):</label>
                        <textarea name="admin_reply" placeholder="Type your reply here...">${message.admin_reply || ''}</textarea>
                    </div>
                    
                    <div class="modal-actions">
                        <button type="submit" class="btn-action btn-primary">
                            <i class="fas fa-reply"></i> Send Reply
                        </button>
                        
                        ${message.status !== 'closed' ? `
                        <button type="submit" formaction="" onclick="this.form.action=''; this.form.elements['action'].value='update_status'; this.form.elements['status'].value='closed'; return confirm('Mark as closed?');" class="btn-action btn-success">
                            <i class="fas fa-check"></i> Mark as Closed
                        </button>
                        <input type="hidden" name="status">
                        ` : ''}
                    </div>
                </form>
            `;

            modal.classList.add('show');
        }

        function closeModal() {
            document.getElementById('messageModal').classList.remove('show');
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('messageModal');
            if (event.target === modal) {
                closeModal();
            }
        }
    </script>
</body>

</html>
<?php

/**
 * Reset Password Page
 * Allows users to set a new password using a valid token
 */

session_start();

// Include database connection
define('DB_ACCESS', true);
require_once 'config/db.php';

// Get token from URL
$token = isset($_GET['token']) ? trim($_GET['token']) : '';
$error_message = '';
$success_message = '';
$token_valid = false;
$user_email = '';
$user_type = '';

// Verify token
if ($token) {
    try {
        $stmt = $pdo->prepare("
            SELECT user_type, email, expires_at, used
            FROM password_resets
            WHERE token = ?
        ");
        $stmt->execute([$token]);
        $reset = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($reset) {
            if ($reset['used'] == 1) {
                $error_message = 'This reset link has already been used.';
            } elseif (strtotime($reset['expires_at']) < time()) {
                $error_message = 'This reset link has expired. Please request a new one.';
            } else {
                $token_valid = true;
                $user_email = $reset['email'];
                $user_type = $reset['user_type'];
            }
        } else {
            $error_message = 'Invalid reset link.';
        }
    } catch (PDOException $e) {
        error_log("Token verification error: " . $e->getMessage());
        $error_message = 'An error occurred. Please try again later.';
    }
} else {
    $error_message = 'No reset token provided.';
}

// Handle password reset submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $token_valid) {
    $new_password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    if (strlen($new_password) < 6) {
        $error_message = 'Password must be at least 6 characters long.';
    } elseif ($new_password !== $confirm_password) {
        $error_message = 'Passwords do not match.';
    } else {
        try {
            // Hash the new password
            $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

            // Update password in appropriate table
            $table = ($user_type === 'tailor') ? 'tailors' : 'customers';
            $stmt = $pdo->prepare("UPDATE $table SET password = ? WHERE email = ?");
            $stmt->execute([$hashed_password, $user_email]);

            // Mark token as used
            $stmt = $pdo->prepare("UPDATE password_resets SET used = 1 WHERE token = ?");
            $stmt->execute([$token]);

            $success_message = 'Password reset successfully! You can now login with your new password.';
            $token_valid = false; // Hide form after success
        } catch (PDOException $e) {
            error_log("Password reset error: " . $e->getMessage());
            $error_message = 'An error occurred while resetting your password.';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - Smart Tailoring</title>
    <link rel="icon" type="image/jpg" href="assets/images/STP-favicon.jpg">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }

        .reset-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
            padding: 2.5rem;
        }

        .reset-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .reset-header i {
            font-size: 3rem;
            color: #667eea;
            margin-bottom: 1rem;
        }

        .reset-header h1 {
            font-size: 1.75rem;
            color: #1f2937;
            margin-bottom: 0.5rem;
        }

        .reset-header p {
            color: #6b7280;
            font-size: 0.95rem;
        }

        .alert {
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            font-size: 0.95rem;
        }

        .alert-error {
            background: #fee2e2;
            border-left: 4px solid #ef4444;
            color: #991b1b;
        }

        .alert-success {
            background: #d1fae5;
            border-left: 4px solid #10b981;
            color: #065f46;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-label {
            display: block;
            font-weight: 500;
            color: #374151;
            margin-bottom: 0.5rem;
        }

        .input-group {
            position: relative;
        }

        .input-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: #9ca3af;
        }

        .form-input {
            width: 100%;
            padding: 0.75rem 1rem 0.75rem 2.75rem;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }

        .form-input:focus {
            outline: none;
            border-color: #667eea;
        }

        .password-toggle {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            padding: 0.5rem;
        }

        .form-button {
            width: 100%;
            padding: 0.875rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .form-button:hover {
            transform: translateY(-2px);
        }

        .back-link {
            text-align: center;
            margin-top: 1.5rem;
        }

        .back-link a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
        }

        .password-requirements {
            font-size: 0.875rem;
            color: #6b7280;
            margin-top: 0.5rem;
        }

        .password-requirements ul {
            margin: 0.5rem 0 0 1.5rem;
            padding: 0;
        }
    </style>
</head>

<body>
    <div class="reset-container">
        <div class="reset-header">
            <i class="fas fa-key"></i>
            <h1>Reset Your Password</h1>
            <p><?php echo $token_valid ? 'Enter your new password below' : 'Password Reset'; ?></p>
        </div>

        <?php if ($error_message): ?>
            <div class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i>
                <?php echo htmlspecialchars($error_message); ?>
            </div>
        <?php endif; ?>

        <?php if ($success_message): ?>
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i>
                <?php echo htmlspecialchars($success_message); ?>
            </div>
        <?php endif; ?>

        <?php if ($token_valid): ?>
            <form method="POST" action="">
                <div class="form-group">
                    <label class="form-label">New Password</label>
                    <div class="input-group">
                        <i class="fas fa-lock input-icon"></i>
                        <input type="password" name="password" id="password" class="form-input"
                            placeholder="Enter new password" required minlength="6">
                        <button type="button" class="password-toggle" onclick="togglePassword('password')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div class="password-requirements">
                        <strong>Password must:</strong>
                        <ul>
                            <li>Be at least 6 characters long</li>
                            <li>Contain a mix of letters and numbers (recommended)</li>
                        </ul>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Confirm Password</label>
                    <div class="input-group">
                        <i class="fas fa-lock input-icon"></i>
                        <input type="password" name="confirm_password" id="confirm_password" class="form-input"
                            placeholder="Confirm new password" required minlength="6">
                        <button type="button" class="password-toggle" onclick="togglePassword('confirm_password')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>

                <button type="submit" class="form-button">
                    <i class="fas fa-check"></i> Reset Password
                </button>
            </form>
        <?php endif; ?>

        <div class="back-link">
            <a href="index.php">
                <i class="fas fa-arrow-left"></i> Back to Homepage
            </a>
        </div>
    </div>

    <script>
        function togglePassword(inputId) {
            const input = document.getElementById(inputId);
            const icon = input.nextElementSibling.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    </script>
</body>

</html>
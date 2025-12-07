<?php

/**
 * Quick Fix for Deployment Issues
 * Run this script to prepare for deployment
 */

echo "🔧 Smart Tailoring - Deployment Quick Fix\n";
echo "=========================================\n\n";

$fixed = 0;
$errors = 0;

// 1. Check and create .env if missing
if (!file_exists('.env')) {
    echo "❌ .env file missing\n";
    if (file_exists('.env.example')) {
        copy('.env.example', '.env');
        echo "✅ Created .env from .env.example\n";
        echo "⚠️  IMPORTANT: Edit .env and configure production values!\n\n";
        $fixed++;
    } else {
        echo "❌ .env.example not found! Cannot create .env\n";
        $errors++;
    }
} else {
    echo "✅ .env file exists\n";
}

// 2. Check upload directories
$uploadDirs = [
    'uploads/',
    'uploads/profiles/',
    'uploads/shops/'
];

foreach ($uploadDirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
        echo "✅ Created directory: $dir\n";
        $fixed++;
    } else {
        echo "✅ Directory exists: $dir\n";
    }

    // Create .gitkeep
    $gitkeep = $dir . '.gitkeep';
    if (!file_exists($gitkeep)) {
        file_put_contents($gitkeep, "# Keep this directory in Git\n");
        echo "✅ Created $gitkeep\n";
        $fixed++;
    }
}

// 3. Check .htaccess in uploads
$uploadsHtaccess = 'uploads/.htaccess';
if (!file_exists($uploadsHtaccess)) {
    $content = "# Prevent PHP execution in uploads directory\n";
    $content .= "php_flag engine off\n";
    $content .= "Options -Indexes\n";
    file_put_contents($uploadsHtaccess, $content);
    echo "✅ Created security .htaccess in uploads/\n";
    $fixed++;
}

// 4. Check logs directory
if (!is_dir('logs')) {
    mkdir('logs', 0755, true);
    echo "✅ Created logs/ directory\n";
    $fixed++;
} else {
    echo "✅ logs/ directory exists\n";
}

// 5. Create logs .gitignore
$logsGitignore = 'logs/.gitignore';
if (!file_exists($logsGitignore)) {
    file_put_contents($logsGitignore, "# Ignore all log files\n*.log\n!.gitignore\n");
    echo "✅ Created logs/.gitignore\n";
    $fixed++;
}

// 6. Verify database connection
define('DB_ACCESS', true);
try {
    require_once 'config/db.php';
    echo "✅ Database connection successful\n";
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
    $errors++;
}

// 7. Check admin accounts
if (isset($conn)) {
    $result = mysqli_query($conn, "SELECT COUNT(*) as count FROM admins WHERE is_active = 1");
    if ($result) {
        $row = mysqli_fetch_assoc($result);
        if ($row['count'] > 0) {
            echo "✅ Admin accounts exist ({$row['count']} active)\n";
        } else {
            echo "⚠️  WARNING: No active admin accounts found!\n";
            echo "   Run this to create one:\n";
            echo "   php -r \"echo password_hash('admin123', PASSWORD_DEFAULT);\" \n\n";
        }
    }
}

// 8. Display environment warnings
if (file_exists('.env')) {
    $env = file_get_contents('.env');

    echo "\n📋 Environment Configuration Review:\n";
    echo "====================================\n";

    if (strpos($env, 'APP_ENV=development') !== false) {
        echo "⚠️  APP_ENV is set to 'development' (change to 'production' for deployment)\n";
    }

    if (strpos($env, 'APP_DEBUG=true') !== false) {
        echo "⚠️  APP_DEBUG is 'true' (MUST be 'false' in production)\n";
    }

    if (strpos($env, 'DB_PASS=') !== false && preg_match('/DB_PASS=\s*$/m', $env)) {
        echo "⚠️  DB_PASS is empty (set a strong password for production)\n";
    }

    if (strpos($env, 'SESSION_SECURE=false') !== false) {
        echo "⚠️  SESSION_SECURE is 'false' (set to 'true' when using HTTPS)\n";
    }

    if (strpos($env, 'SMTP_USERNAME=your-email@gmail.com') !== false) {
        echo "⚠️  SMTP not configured (configure for email functionality)\n";
    }
}

echo "\n" . str_repeat("=", 60) . "\n";
echo "Summary: $fixed fixes applied, $errors errors\n";
echo str_repeat("=", 60) . "\n\n";

if ($errors == 0) {
    echo "✅ Basic setup complete!\n\n";
    echo "Next steps for production deployment:\n";
    echo "1. Edit .env file with production values\n";
    echo "2. Set APP_ENV=production and APP_DEBUG=false\n";
    echo "3. Configure database credentials\n";
    echo "4. Set up SMTP for emails\n";
    echo "5. Create admin account if needed\n";
    echo "6. Run deployment_check.php to verify\n\n";
} else {
    echo "❌ Some errors occurred. Please fix them before deployment.\n\n";
}

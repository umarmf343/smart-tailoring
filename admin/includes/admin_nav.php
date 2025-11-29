<nav class="admin-navbar">
    <div class="admin-nav-container">
        <!-- Logo -->
        <div class="admin-logo">
            <i class="fas fa-shield-alt"></i>
            <span>Admin Panel</span>
        </div>

        <!-- Navigation Menu -->
        <ul class="admin-nav-menu">
            <li><a href="dashboard.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'dashboard.php' ? 'active' : ''; ?>">
                    <i class="fas fa-tachometer-alt"></i> Dashboard
                </a></li>
            <li><a href="tailors.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'tailors.php' ? 'active' : ''; ?>">
                    <i class="fas fa-store"></i> Tailors
                    <?php if (isset($stats['pending_verifications']) && $stats['pending_verifications'] > 0): ?>
                        <span class="badge"><?php echo $stats['pending_verifications']; ?></span>
                    <?php endif; ?>
                </a></li>
            <li><a href="customers.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'customers.php' ? 'active' : ''; ?>">
                    <i class="fas fa-users"></i> Customers
                </a></li>
            <li><a href="orders.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'orders.php' ? 'active' : ''; ?>">
                    <i class="fas fa-shopping-bag"></i> Orders
                </a></li>
            <li><a href="contacts.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'contacts.php' ? 'active' : ''; ?>">
                    <i class="fas fa-envelope"></i> Contacts
                </a></li>
            <?php if (isSuperAdmin()): ?>
                <li><a href="admins.php" class="<?php echo basename($_SERVER['PHP_SELF']) == 'admins.php' ? 'active' : ''; ?>">
                        <i class="fas fa-user-shield"></i> Admins
                    </a></li>
            <?php endif; ?>
        </ul>

        <!-- User Info -->
        <div class="admin-user-info">
            <div class="user-dropdown">
                <button class="user-dropdown-btn">
                    <i class="fas fa-user-circle"></i>
                    <span><?php echo htmlspecialchars($admin_name); ?></span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="user-dropdown-menu">
                    <div class="dropdown-header">
                        <strong><?php echo htmlspecialchars($admin_name); ?></strong>
                        <span><?php echo htmlspecialchars($admin_email); ?></span>
                        <span class="role-badge"><?php echo ucfirst(str_replace('_', ' ', $admin_role)); ?></span>
                    </div>
                    <a href="profile.php"><i class="fas fa-user"></i> My Profile</a>
                    <a href="settings.php"><i class="fas fa-cog"></i> Settings</a>
                    <a href="../index.php" target="_blank"><i class="fas fa-external-link-alt"></i> View Website</a>
                    <div class="dropdown-divider"></div>
                    <a href="api/logout.php" class="logout-link"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </div>
        </div>
    </div>
</nav>
<?php

/**
 * Homepage - Smart Tailoring Service
 * Main landing page with tailor listings
 */

// Start session to maintain login state
session_start();

// Check if user is logged in
$is_logged_in = isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
$user_name = $is_logged_in ? $_SESSION['user_name'] : '';
$user_type = $is_logged_in ? $_SESSION['user_type'] : '';

// Include database connection
define('DB_ACCESS', true);
require_once 'config/db.php';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Tailoring Service - Find Best Tailors in Satna</title>

    <!-- Favicon -->
    <link rel="icon" type="image/jpg" href="assets/images/STP-favicon.jpg">

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<!-- Login/Register Modal -->
<div class="modal-overlay" id="authModal">
    <div class="modal-container">
        <!-- Modal Header -->
        <div class="modal-header">
            <h2 id="modalTitle">Welcome Back!</h2>
            <p id="modalSubtitle">Login to access your account</p>
            <button class="modal-close" onclick="closeAuthModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
            <!-- User Type Selection (Customer/Tailor) -->
            <div class="modal-tabs">
                <button class="modal-tab active" data-user-type="customer" onclick="switchUserType('customer')">
                    <i class="fas fa-user"></i> Customer
                </button>
                <button class="modal-tab" data-user-type="tailor" onclick="switchUserType('tailor')">
                    <i class="fas fa-store"></i> Tailor
                </button>
            </div>

            <!-- Login/Register Toggle -->
            <div class="auth-toggle" style="text-align: center; margin-bottom: 2rem;">
                <button class="modal-tab active" id="loginTab" onclick="showLoginForm()">Login</button>
                <button class="modal-tab" id="registerTab" onclick="showRegisterForm()">Register</button>
            </div>

            <!-- Error/Success Message -->
            <div class="form-message" id="authMessage"></div>

            <!-- LOGIN FORM -->
            <form id="loginForm" class="auth-form">
                <input type="hidden" name="user_type" id="loginUserType" value="customer">

                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <div class="input-group">
                        <i class="fas fa-envelope input-icon"></i>
                        <input type="email" name="email" class="form-input"
                            placeholder="Enter your email" required>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Password</label>
                    <div class="input-group">
                        <i class="fas fa-lock input-icon"></i>
                        <input type="password" name="password" id="loginPassword"
                            class="form-input" placeholder="Enter your password" required>
                        <button type="button" class="password-toggle" onclick="togglePassword('loginPassword')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>

                <div class="form-group" style="display: flex; justify-content: space-between; align-items: center;">
                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                        <input type="checkbox" name="remember"> Remember Me
                    </label>
                    <a href="#" style="color: var(--primary-color); text-decoration: none;">Forgot Password?</a>
                </div>

                <button type="submit" class="form-button">
                    <i class="fas fa-sign-in-alt"></i> Login
                </button>
            </form>

            <!-- REGISTER FORM -->
            <form id="registerForm" class="auth-form" style="display: none;">
                <input type="hidden" name="user_type" id="registerUserType" value="customer">

                <!-- Common Fields -->
                <div class="form-group">
                    <label class="form-label">Full Name / Shop Name</label>
                    <div class="input-group">
                        <i class="fas fa-user input-icon"></i>
                        <input type="text" name="name" class="form-input"
                            placeholder="Enter your name" required>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <div class="input-group">
                        <i class="fas fa-envelope input-icon"></i>
                        <input type="email" name="email" class="form-input"
                            placeholder="Enter your email" required>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Phone Number</label>
                    <div class="input-group">
                        <i class="fas fa-phone input-icon"></i>
                        <input type="tel" name="phone" class="form-input"
                            placeholder="10-digit mobile number" pattern="[6-9][0-9]{9}" required>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Password</label>
                    <div class="input-group">
                        <i class="fas fa-lock input-icon"></i>
                        <input type="password" name="password" id="registerPassword"
                            class="form-input" placeholder="Create password (min 6 characters)"
                            minlength="6" required>
                        <button type="button" class="password-toggle" onclick="togglePassword('registerPassword')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>

                <!-- Customer-Specific Fields -->
                <div id="customerFields">
                    <div class="form-group">
                        <label class="form-label">Address (Optional)</label>
                        <textarea name="address" class="form-input form-textarea"
                            placeholder="Enter your address"></textarea>
                    </div>
                </div>

                <!-- Tailor-Specific Fields -->
                <div id="tailorFields" style="display: none;">
                    <div class="form-group">
                        <label class="form-label">Shop Address</label>
                        <textarea name="shop_address" class="form-input form-textarea"
                            placeholder="Complete shop address" required></textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Area/Locality</label>
                        <input type="text" name="area" class="form-input"
                            placeholder="e.g., Civil Lines, Rewa Road">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Speciality</label>
                        <input type="text" name="speciality" class="form-input"
                            placeholder="e.g., Wedding Wear Specialist">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Services Offered</label>
                        <input type="text" name="services" class="form-input"
                            placeholder="e.g., Stitching, Alteration, Embroidery">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Experience (Years)</label>
                        <input type="number" name="experience" class="form-input"
                            placeholder="Years of experience" min="0">
                    </div>
                </div>

                <div class="form-group">
                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                        <input type="checkbox" required> I agree to Terms & Conditions
                    </label>
                </div>

                <button type="submit" class="form-button">
                    <i class="fas fa-user-plus"></i> Register
                </button>
            </form>

            <!-- Switch Between Login/Register -->
            <div class="modal-switch">
                <p id="switchText">
                    Don't have an account?
                    <a onclick="showRegisterForm()">Register Now</a>
                </p>
            </div>
        </div>
    </div>
</div>

<!-- Custom JavaScript -->
<script src="assets/js/app.js"></script>

<!-- Order Placement Modal -->
<div class="modal-overlay" id="orderModal">
    <div class="modal-container" style="max-width: 600px;">
        <!-- Modal Header -->
        <div class="modal-header">
            <h2>Place Your Order</h2>
            <p>Fill in the details for your tailoring order</p>
            <button class="modal-close" onclick="closeOrderModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
            <!-- Error/Success Message -->
            <div class="form-message" id="orderMessage"></div>

            <!-- Order Form -->
            <form id="orderForm">
                <input type="hidden" name="tailor_id" id="orderTailorId">

                <!-- Tailor Info Display -->
                <div id="orderTailorInfo" style="padding: 1rem; background: var(--light-bg); border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                    <h4 style="margin: 0 0 0.5rem 0; color: var(--text-dark);">
                        <i class="fas fa-store"></i> <span id="orderTailorName">Loading...</span>
                    </h4>
                    <p style="margin: 0; color: var(--text-light); font-size: 0.9rem;">
                        <i class="fas fa-map-marker-alt"></i> <span id="orderTailorArea">-</span>
                    </p>
                </div>

                <!-- Service Type -->
                <div class="form-group">
                    <label class="form-label">Service Type *</label>
                    <select name="service_type" class="form-input form-select" required>
                        <option value="">Select service</option>
                        <option value="Stitching">Stitching</option>
                        <option value="Alteration">Alteration</option>
                        <option value="Embroidery">Embroidery</option>
                        <option value="Repair">Repair</option>
                        <option value="Designer Work">Designer Work</option>
                    </select>
                </div>

                <!-- Garment Type -->
                <div class="form-group">
                    <label class="form-label">Garment Type</label>
                    <input type="text" name="garment_type" class="form-input"
                        placeholder="e.g., Shirt, Pants, Kurta, Dress" required>
                </div>

                <!-- Quantity -->
                <div class="form-group">
                    <label class="form-label">Quantity</label>
                    <input type="number" name="quantity" class="form-input"
                        value="1" min="1" required>
                </div>

                <!-- Measurements -->
                <div class="form-group">
                    <label class="form-label">Measurements (Optional)</label>
                    <textarea name="measurements" class="form-input form-textarea"
                        placeholder="Chest: 40, Waist: 32, Length: 28, etc."></textarea>
                    <small style="color: var(--text-light);">You can discuss detailed measurements with the tailor</small>
                </div>

                <!-- Special Instructions -->
                <div class="form-group">
                    <label class="form-label">Special Instructions (Optional)</label>
                    <textarea name="special_instructions" class="form-input form-textarea"
                        placeholder="Any specific requirements, design preferences, fabric details, etc."></textarea>
                </div>

                <!-- Estimated Price -->
                <div class="form-group">
                    <label class="form-label">Estimated Budget (₹)</label>
                    <input type="number" name="estimated_price" class="form-input"
                        placeholder="Enter your budget" min="0">
                    <small style="color: var(--text-light);">Final price will be confirmed by tailor</small>
                </div>

                <!-- Delivery Date -->
                <div class="form-group">
                    <label class="form-label">Expected Delivery Date (Optional)</label>
                    <input type="date" name="delivery_date" class="form-input"
                        min="<?php echo date('Y-m-d', strtotime('+3 days')); ?>">
                </div>

                <!-- Submit Button -->
                <button type="submit" class="form-button">
                    <i class="fas fa-shopping-cart"></i> Place Order
                </button>
            </form>
        </div>
    </div>
</div>

<!-- </body> -->

</html>



<body <?php if ($is_logged_in) echo 'class="logged-in"'; ?> data-user-type="<?php echo $user_type; ?>">


    <!-- Navigation Bar  -->
    <nav class="navbar">
        <div class="nav-container">
            <!-- Logo -->
            <div class="nav-logo">
                <img src="assets/images/logo.jpg" alt="Smart Tailoring Service Logo">
                <span class="logo-text">Smart Tailoring Service</span>
            </div>

            <!-- Navigation Menu -->
            <ul class="nav-menu" id="navMenu">
                <li><a href="#home" class="nav-link active">Home</a></li>
                <li><a href="#services" class="nav-link">Services</a></li>
                <li><a href="#tailors" class="nav-link">Find Tailors</a></li>
                <li><a href="#contact" class="nav-link">Contact</a></li>
            </ul>


            <!-- Auth Buttons -->
            <div class="nav-auth">
                <?php if ($is_logged_in): ?>
                    <!-- Logged in state -->
                    <span style="margin-right: 1rem; color: var(--text-dark);">
                        Welcome, <strong><?php echo htmlspecialchars($user_name); ?></strong>!
                    </span>
                    <button class="btn-login-register" onclick="window.location.href='<?php echo $user_type === 'customer' ? 'customer' : 'tailor'; ?>/dashboard.php'">
                        <i class="fas fa-tachometer-alt"></i> Dashboard
                    </button>
                    <button class="btn-login-register" style="margin-left: 0.5rem; background: transparent; border: 2px solid var(--primary-color); color: var(--primary-color);" onclick="window.location.href='auth/logout.php'">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                <?php else: ?>
                    <!-- Not logged in state -->
                    <button class="btn-login-register" onclick="openLoginModal()">
                        Login & Register
                    </button>
                <?php endif; ?>
            </div>


            <!-- Search Icon -->
            <div class="nav-search">
                <i class="fas fa-search"></i>
            </div>

            <!-- Mobile Menu Toggle -->
            <div class="mobile-menu-icon" onclick="toggleMobileMenu()">
                <i class="fas fa-bars"></i>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero" id="home">
        <div class="hero-overlay"></div>
        <div class="hero-container">
            <div class="hero-content">
                <h1 class="hero-title">Find the Best Tailors in Satna</h1>
                <p class="hero-subtitle">
                    Connect with skilled tailors and get your clothes stitched, altered,
                    or repaired with just a few clicks.
                </p>
                <div class="hero-buttons">
                    <button class="btn btn-primary" onclick="scrollToTailors()">
                        <i class="fas fa-search"></i> Find Tailors
                    </button>
                    <button class="btn btn-secondary" onclick="openRegisterModal('tailor')">
                        <i class="fas fa-store"></i> Register Your Shop
                    </button>
                </div>

                <!-- Stats -->
                <div class="hero-stats">
                    <div class="stat-item">
                        <h3 class="stat-number" id="tailorCount">0</h3>
                        <p class="stat-label">Registered Tailors</p>
                    </div>
                    <div class="stat-item">
                        <h3 class="stat-number" id="customerCount">0</h3>
                        <p class="stat-label">Happy Customers</p>
                    </div>
                    <div class="stat-item">
                        <h3 class="stat-number">500+</h3>
                        <p class="stat-label">Orders Completed</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section class="services-section" id="services">
        <div class="section-container">
            <h2 class="section-title">Our Services</h2>
            <p class="section-subtitle">Everything you need for your tailoring requirements</p>

            <div class="services-grid">
                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-cut"></i>
                    </div>
                    <h3>Custom Stitching</h3>
                    <p>Get your clothes stitched according to your measurements and preferences.</p>
                </div>

                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-ruler"></i>
                    </div>
                    <h3>Alterations</h3>
                    <p>Perfect fit guaranteed with our professional alteration services.</p>
                </div>

                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-paint-brush"></i>
                    </div>
                    <h3>Embroidery</h3>
                    <p>Beautiful embroidery work to make your clothes stand out.</p>
                </div>

                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-tshirt"></i>
                    </div>
                    <h3>Designer Wear</h3>
                    <p>Custom designer outfits for weddings and special occasions.</p>
                </div>

                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-tools"></i>
                    </div>
                    <h3>Repairs</h3>
                    <p>Quick and reliable repair services for damaged garments.</p>
                </div>

                <div class="service-card">
                    <div class="service-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <h3>Express Service</h3>
                    <p>Need it urgently? We offer express delivery options.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Tailors Section -->
    <section class="tailors-section" id="tailors">
        <div class="section-container">
            <h2 class="section-title">Featured Tailors in Satna</h2>
            <p class="section-subtitle">Browse through our verified and experienced tailors</p>

            <!-- Search and Filter -->
            <div class="search-filter-bar">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchInput" placeholder="Search by name, area, or service...">
                </div>

                <div class="filter-buttons">
                    <button class="filter-btn active" data-filter="all">All</button>
                    <button class="filter-btn" data-filter="verified">Verified</button>
                    <button class="filter-btn" data-filter="premium">Premium</button>
                </div>
            </div>

            <!-- Tailors Grid -->
            <div class="tailors-grid" id="tailorsGrid">
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i> Loading tailors...
                </div>
            </div>
        </div>
    </section>

    <!-- Footer (Indian Explorer Style) -->
    <footer class="footer">
        <div class="footer-container">
            <!-- Footer Main Content -->
            <div class="footer-main">
                <!-- Quick Links Column -->
                <div class="footer-column">
                    <h3 class="footer-heading">Quick Links</h3>
                    <ul class="footer-links">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#tailors">Find Tailors</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>

                <!-- Extra Links Column -->
                <div class="footer-column">
                    <h3 class="footer-heading">Extra Links</h3>
                    <ul class="footer-links">
                        <li><a href="#faq">Ask Questions</a></li>
                        <li><a href="#terms">Terms Of Use</a></li>
                        <li><a href="#privacy">Privacy Policy</a></li>
                        <li><a href="#about">About Us</a></li>
                    </ul>
                </div>

                <!-- Contact Info Column -->
                <div class="footer-column">
                    <h3 class="footer-heading">Contact Info</h3>
                    <ul class="footer-contact">
                        <li>
                            <i class="fas fa-phone"></i>
                            <span>+91 6262161170</span>
                        </li>
                        <li>
                            <i class="fas fa-envelope"></i>
                            <span>anupamkushwaha639@gmail.com</span>
                        </li>
                        <li>
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Satna M.P. 485001</span>
                        </li>
                    </ul>
                </div>

                <!-- Follow Us Column -->
                <div class="footer-column">
                    <h3 class="footer-heading">Follow Us</h3>
                    <ul class="footer-social">
                        <li><a href="https://fb.com/anupam kushwaha"><i class="fab fa-facebook"></i> Facebook</a></li>
                        <li><a href="https://instagram.com/anupam_kushwaha_85"><i class="fab fa-instagram"></i> Instagram</a></li>
                        <li><a href="www.linkedin.com/in/anupamkushwaha85"><i class="fab fa-linkedin"></i> LinkedIn</a></li>
                        <li><a href="https://github.com/anupamkushwaha85"><i class="fab fa-github"></i> Github</a></li>
                    </ul>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <p>Created By <span class="highlight">Team Anupam Kushwaha</span> | All Rights Reserved!</p>
            </div>
        </div>
    </footer>

    <!-- Custom JavaScript -->
    <script src="assets/js/app.js"></script>

    <!-- Load stats dynamically -->
    <script>
        // Load database stats
        fetch('api/get_stats.php')
            .then(response => response.json())
            .then(data => {
                document.getElementById('tailorCount').textContent = data.tailors || 3;
                document.getElementById('customerCount').textContent = data.customers || 1;
            })
            .catch(error => {
                // Default values if API fails
                document.getElementById('tailorCount').textContent = '3';
                document.getElementById('customerCount').textContent = '1';
            });
    </script>
</body>

</html>
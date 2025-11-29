<?php

/**
 * About Us Page
 */

session_start();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us - Smart Tailoring Service</title>

    <link rel="icon" type="image/jpg" href="assets/images/STP-favicon.jpg">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/style.css">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
        }

        .page-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: white;
            padding: 1.5rem 2rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 1000;
        }

        .back-button {
            background: var(--primary-color);
            color: white;
            padding: 0.8rem 1.5rem;
            border-radius: 50px;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .back-button:hover {
            background: #5a6fd8;
            transform: translateX(-5px);
        }

        .back-button i {
            font-size: 1rem;
        }

        .page-header h1 {
            font-size: 1.8rem;
            color: var(--text-dark);
            font-weight: 600;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }

        .page-content {
            min-height: 100vh;
            padding: 8rem 2rem 4rem;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
        }

        .content-section {
            background: white;
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            margin-bottom: 2rem;
        }

        .hero-section {
            text-align: center;
            margin-bottom: 3rem;
        }

        .hero-section h2 {
            font-size: 2.5rem;
            color: var(--text-dark);
            margin-bottom: 1rem;
        }

        .hero-section p {
            color: var(--text-light);
            font-size: 1.2rem;
            line-height: 1.8;
        }

        .mission-vision {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin: 3rem 0;
        }

        .mission-box,
        .vision-box {
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
        }

        .mission-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .vision-box {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
        }

        .mission-box i,
        .vision-box i {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .mission-box h3,
        .vision-box h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            margin: 3rem 0;
        }

        .feature-card {
            text-align: center;
            padding: 2rem;
            border: 2px solid #e0e0e0;
            border-radius: 15px;
            transition: all 0.3s ease;
        }

        .feature-card:hover {
            border-color: var(--primary-color);
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
        }

        .feature-card i {
            font-size: 2.5rem;
            color: var(--primary-color);
            margin-bottom: 1rem;
        }

        .feature-card h4 {
            font-size: 1.2rem;
            color: var(--text-dark);
            margin-bottom: 0.5rem;
        }

        .feature-card p {
            color: var(--text-light);
            font-size: 0.95rem;
        }

        .team-section {
            margin: 3rem 0;
            text-align: center;
        }

        .team-section h3 {
            font-size: 2rem;
            color: var(--text-dark);
            margin-bottom: 2rem;
        }

        .team-info {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 15px;
            margin-bottom: 2rem;
        }

        .team-info h4 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }

        .team-info p {
            font-size: 1.1rem;
            line-height: 1.6;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
            margin: 3rem 0;
        }

        .stat-card {
            text-align: center;
            padding: 2rem;
            background: #f8f9fa;
            border-radius: 15px;
        }

        .stat-card h3 {
            font-size: 2.5rem;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
        }

        .stat-card p {
            color: var(--text-light);
            font-size: 1rem;
        }

        .highlight {
            color: var(--primary-color);
            font-weight: 600;
        }

        @media (max-width: 968px) {
            .page-header h1 {
                position: static;
                transform: none;
                font-size: 1.3rem;
            }

            .page-header {
                padding: 1rem 1.5rem;
            }

            .page-content {
                padding: 6rem 1rem 2rem;
            }

            .back-button {
                padding: 0.6rem 1rem;
                font-size: 0.9rem;
            }

            .content-section {
                padding: 2rem;
            }

            .mission-vision,
            .features-grid {
                grid-template-columns: 1fr;
            }

            .stats-grid {
                grid-template-columns: repeat(3, 1fr);
                gap: 0.5rem;
            }

            .stat-card h3 {
                font-size: 1.5rem;
            }

            .stat-card p {
                font-size: 0.75rem;
            }
        }

        @media (max-width: 768px) {
            .features-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>

<body>
    <!-- Page Header -->
    <div class="page-header">
        <a href="index.php" class="back-button">
            <i class="fas fa-arrow-left"></i>
            <span>Back</span>
        </a>
        <h1>About Us</h1>
    </div>

    <!-- Page Content -->
    <div class="page-content">
        <div class="container">
            <div class="content-section">
                <div class="hero-section">
                    <h2>Welcome to Smart Tailoring Service</h2>
                    <p>Your trusted platform for connecting with professional tailors in Satna and beyond. We bridge the gap between skilled artisans and customers seeking quality tailoring services.</p>
                </div>

                <div class="mission-vision">
                    <div class="mission-box">
                        <i class="fas fa-bullseye"></i>
                        <h3>Our Mission</h3>
                        <p>To empower local tailors by providing them with a digital platform to showcase their skills and connect with customers, while making it easier for people to find quality tailoring services.</p>
                    </div>
                    <div class="vision-box">
                        <i class="fas fa-eye"></i>
                        <h3>Our Vision</h3>
                        <p>To become the leading tailoring service platform in India, revolutionizing how people discover and engage with professional tailors in their community.</p>
                    </div>
                </div>
            </div>

            <div class="content-section">
                <h3 style="text-align: center; font-size: 2rem; color: var(--text-dark); margin-bottom: 2rem;">Why Choose Us</h3>
                <div class="features-grid">
                    <div class="feature-card">
                        <i class="fas fa-shield-alt"></i>
                        <h4>Verified Tailors</h4>
                        <p>All tailors are verified to ensure quality and authenticity</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-star"></i>
                        <h4>Quality Service</h4>
                        <p>Premium tailors with 5-star ratings for exceptional work</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-search"></i>
                        <h4>Easy Search</h4>
                        <p>Find tailors by location, services, and specialization</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-comments"></i>
                        <h4>Reviews & Ratings</h4>
                        <p>Read genuine customer reviews before making decisions</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-map-marker-alt"></i>
                        <h4>Local Focus</h4>
                        <p>Connect with tailors in your neighborhood</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-mobile-alt"></i>
                        <h4>User Friendly</h4>
                        <p>Simple and intuitive platform for all users</p>
                    </div>
                </div>
            </div>

            <div class="content-section">
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>100+</h3>
                        <p>Registered Tailors</p>
                    </div>
                    <div class="stat-card">
                        <h3>500+</h3>
                        <p>Happy Customers</p>
                    </div>
                    <div class="stat-card">
                        <h3>1000+</h3>
                        <p>Orders Completed</p>
                    </div>
                    <div class="stat-card">
                        <h3>4.8★</h3>
                        <p>Average Rating</p>
                    </div>
                </div>
            </div>

            <div class="content-section">
                <div class="team-section">
                    <h3>Meet Our Team</h3>
                    <div class="team-info">
                        <h4>Team Anupam Kushwaha</h4>
                        <p>A dedicated team of developers and designers passionate about connecting local businesses with their communities. We believe in the power of technology to transform traditional crafts and services.</p>
                    </div>
                </div>

                <div style="text-align: center; padding: 2rem; background: #f8f9fa; border-radius: 15px;">
                    <h3 style="color: var(--text-dark); margin-bottom: 1rem;">Get In Touch</h3>
                    <p style="color: var(--text-light); margin-bottom: 1.5rem;">Have questions or want to join our platform? We'd love to hear from you!</p>
                    <a href="contact.php" style="display: inline-block; background: var(--primary-color); color: white; padding: 1rem 2rem; border-radius: 50px; text-decoration: none; font-weight: 600; transition: all 0.3s ease;">Contact Us</a>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
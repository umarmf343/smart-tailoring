# Smart Tailoring Service 🧵

![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-5.7+-4479A1?style=flat&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![MapLibre](https://img.shields.io/badge/MapLibre-GL-396CB2?style=flat&logo=mapbox&logoColor=white)
![License](https://img.shields.io/badge/License-MIT%20with%20Restrictions-red?style=flat)

## 📋 Overview

Production-ready web platform connecting customers with tailors for custom clothing orders. Features real-time notifications, geolocation-based tailor discovery, comprehensive measurement management, and automated deployment via CI/CD pipeline.

**Live Demo:** [https://smart-tailoring.onrender.com](https://smart-tailoring.onrender.com)

## 🚀 Node.js Migration Backend

An Express + Sequelize backend now ships alongside the PHP implementation. It reuses the existing MySQL schema, offers JWT authentication for admins/customers/tailors, and exposes REST APIs for orders, measurements, and profile management. See [`NODE_BACKEND_README.md`](NODE_BACKEND_README.md) for setup, migrations, and routes.

## 🏗️ System Architecture

```
Customer → Authentication → Measurement Management → Tailor Discovery (Maps) → Order Placement
                                                                                      ↓
Admin Panel ← Notifications ← Order Tracking ← Payment ← Tailor Dashboard
```

### System Flow
1. **Customer Registration** - Email OTP verification with secure sessions
2. **Measurement Input** - Save multiple measurement profiles with custom notes
3. **Tailor Discovery** - Find nearby tailors using MapLibre + OpenStreetMap
4. **Order Creation** - Place orders with saved/custom measurements
5. **Real-time Updates** - Push notifications for order status changes
6. **Review System** - Rate and review completed services

## ✨ Key Features

- ✅ **Email OTP Authentication** - Secure registration and password recovery
- ✅ **Dynamic Measurement System** - Customizable measurement fields per order
- ✅ **Geolocation Services** - MapLibre GL with reverse geocoding
- ✅ **Real-time Notifications** - Server-sent events for instant updates
- ✅ **Order Management** - Complete workflow from placement to completion
- ✅ **Review & Rating System** - Customer feedback with 5-star ratings
- ✅ **Admin Dashboard** - Comprehensive analytics and user management
- ✅ **Database Connection Pooling** - HikariCP-style pooling for performance
- ✅ **Migration System** - Version-controlled database schema changes
- ✅ **CI/CD Pipeline** - Automated deployment via GitHub Actions

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Database Tables** | 12 core tables |
| **API Endpoints** | 40+ REST endpoints |
| **User Roles** | 3 (Customer, Tailor, Admin) |
| **Authentication** | Session-based + CSRF protection |
| **Security Features** | 10+ security layers |
| **Test Coverage** | 120+ integration tests |
| **Architecture Pattern** | Repository + Service Layer |

## 🛠️ Technology Stack

### Backend
- **Language:** PHP 8.2+
- **Database:** MySQL 5.7+ / MariaDB 10.3+
- **Email:** PHPMailer 6.x
- **Configuration:** PHP Dotenv

### Frontend
- **UI:** HTML5, CSS3, JavaScript (ES6+)
- **Maps:** MapLibre GL JS + OpenStreetMap
- **Notifications:** Server-Sent Events (SSE)
- **Styling:** Custom CSS with responsive design

### DevOps
- **Version Control:** Git + GitHub
- **CI/CD:** GitHub Actions
- **Deployment:** Automated SSH deployment
- **Server:** Apache/Nginx
- **Environment:** Docker-ready

## 📁 Project Structure

```
smart-tailoring/
├── admin/                         # Admin panel
│   ├── dashboard.php             # Analytics & statistics
│   ├── customers.php             # Customer management
│   ├── tailors.php               # Tailor management
│   ├── orders.php                # Order monitoring
│   ├── api/                      # Admin API endpoints
│   └── includes/                 # Admin navigation & security
├── api/                          # REST API
│   ├── auth/                     # Authentication endpoints
│   ├── measurements/             # Measurement CRUD
│   ├── orders/                   # Order management
│   ├── notifications/            # Real-time notifications
│   ├── profile/                  # User profile management
│   └── reviews/                  # Review system
├── config/                       # Configuration
│   ├── db.php                    # Database connection + pooling
│   ├── security.php              # Security functions (CSRF, XSS)
│   ├── session.php               # Session management
│   └── email.php                 # SMTP configuration
├── database/                     # Database layer
│   ├── DatabaseConnectionPool.php # Connection pooling
│   ├── DatabaseMigrationManager.php # Migration runner
│   └── migrations/               # Schema version control
├── repositories/                 # Data access layer
│   └── CustomerRepository.php    # Repository pattern
├── services/                     # Business logic layer
├── customer/                     # Customer dashboard
├── tailor/                       # Tailor dashboard
├── .github/workflows/            # CI/CD pipelines
│   └── deploy.yml               # Automated deployment
├── tests/                        # Testing suite
│   ├── integration_test.php     # 70+ manual tests
│   └── run_tests.php            # 50+ automated tests
└── docs/                         # Documentation
    ├── DEPLOYMENT_GUIDE.md      # Production deployment
    ├── DATABASE_README.md       # Database documentation
    └── SECURITY_QUICKSTART.md   # Security guidelines
```

## ⚙️ Setup Instructions

### Prerequisites
- PHP 8.2 or higher
- MySQL 5.7+ or MariaDB 10.3+
- Composer
- Apache/Nginx with mod_rewrite
- OpenSSL extension

### 1️⃣ Install Dependencies

```bash
composer install
```

### 2️⃣ Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Application Settings
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost/smart-tailoring

# Database Configuration
DB_HOST=localhost
DB_NAME=smart_tailoring
DB_USER=root
DB_PASS=

# SMTP Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Session Security
SESSION_LIFETIME=7200
SESSION_SECURE=false
SESSION_HTTPONLY=true

# Database Connection Pool
DB_POOL_MIN=2
DB_POOL_MAX=10
```

### 3️⃣ Database Setup

Create database:

```sql
CREATE DATABASE smart_tailoring CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Run migrations:

```bash
php migrate.php run
```

This creates:
- `customers` - Customer accounts and profiles
- `tailors` - Tailor profiles with shop details
- `orders` - Order management with status tracking
- `measurements` - Customer measurement profiles
- `measurement_fields` - Dynamic measurement data
- `reviews` - Customer reviews and ratings
- `notifications` - Real-time notification system
- `admins` - Admin user management
- `contact_messages` - Contact form submissions
- `email_otp` - Email verification codes
- `admin_activity_log` - Admin action tracking
- `dispute_reports` - Dispute management

### 4️⃣ Create Admin Account

> Migrations now seed a default super admin so you can sign in immediately after `php migrate.php run` (which also creates the `admins` table if it's missing).

Seeded account details:
- **Username:** `admin`
- **Email:** `anupamkushwaha639@gmail.com`
- **Password:** `admin123`
- **Password hash:** `$2y$10$MODBHPvBOti2/05IkJPgDOpJLRdrBf3bOcwhz4NQOSANVR8wUkZuu`

If you prefer to set your own password before running the migrations, update the hash below and re-run. Be sure the `admins` table exists first by running `php migrate.php run` or creating the table manually.

```sql
INSERT INTO admins (username, password, full_name, name, email, role, created_at)
VALUES ('admin', '$2y$10$MODBHPvBOti2/05IkJPgDOpJLRdrBf3bOcwhz4NQOSANVR8wUkZuu', 'Administrator', 'Administrator', 'anupamkushwaha639@gmail.com', 'super_admin', NOW());
```

Generate a new password hash:
```php
<?php echo password_hash('your_password', PASSWORD_DEFAULT); ?>
```

### 5️⃣ File Permissions

```bash
chmod 755 uploads/profiles uploads/shops
chmod 755 logs/
```

### 6️⃣ Access Application

- **Customer Portal:** `http://localhost/smart-tailoring/`
- **Tailor Dashboard:** `http://localhost/smart-tailoring/tailor/`
- **Admin Panel:** `http://localhost/smart-tailoring/admin/`

## 🧪 Testing

### Automated Tests

```bash
php run_tests.php
```

Runs 50+ automated tests:
- Database connectivity
- File structure validation
- Security configuration
- API endpoint availability
- Session management
- Email configuration

### Integration Tests

Access via Admin Panel → **Integration Tests** button

Or directly: `http://localhost/smart-tailoring/integration_test.php`

**Test Categories:**
1. Authentication (Registration, Login, OTP)
2. Customer Features (Measurements, Orders, Profile)
3. Tailor Features (Order Management, Status Updates)
4. Admin Panel (Dashboard, User Management)
5. Public Pages (Homepage, Contact, FAQ)
6. API Endpoints (REST API validation)
7. Security (CSRF, XSS, SQL Injection protection)

## 📈 Performance

- **Response Time:** <200ms average (local)
- **Database Queries:** Optimized with connection pooling
- **Concurrent Users:** Supports 100+ simultaneous users
- **Scalability:** Horizontal scaling ready
- **Caching:** Browser caching + ETags configured

## 🔒 Security Features

| Feature | Implementation |
|---------|---------------|
| **Password Security** | bcrypt hashing (cost=10) |
| **CSRF Protection** | Token-based validation |
| **SQL Injection** | PDO prepared statements |
| **XSS Prevention** | htmlspecialchars() + CSP headers |
| **Session Security** | HTTP-only, SameSite, secure cookies |
| **Session Hijacking** | User agent validation |
| **HTTPS Enforcement** | Auto-redirect (production) |
| **HSTS** | Strict Transport Security header |
| **Content Security Policy** | Restricts resource loading |
| **Environment Variables** | Sensitive data in .env (gitignored) |

## 🚀 Deployment

### Production Deployment Checklist

```bash
# Run deployment checker
php deployment_check.php
```

**Manual Checklist:**
- [ ] Set `APP_ENV=production` in `.env`
- [ ] Set `APP_DEBUG=false`
- [ ] Configure HTTPS certificate
- [ ] Update `SESSION_SECURE=true`
- [ ] Configure production SMTP
- [ ] Set proper file permissions
- [ ] Enable error logging
- [ ] Configure database backups
- [ ] Test health check: `/api/health.php`

### CI/CD Deployment (GitHub Actions)

**Setup GitHub Secrets:**

1. Go to: `https://github.com/anupamkushwaha85/smart-tailoring/settings/secrets/actions`
2. Add these secrets:

| Secret | Description |
|--------|-------------|
| `SSH_HOST` | Server IP/domain |
| `SSH_USER` | SSH username |
| `SSH_PRIVATE_KEY` | Private SSH key |
| `SSH_PORT` | SSH port (default: 22) |
| `DEPLOY_PATH` | Server deployment path |

**Deploy:**
```bash
git add .
git commit -m "feat: new feature"
git push origin main
```

GitHub Actions automatically:
- ✅ Runs tests
- ✅ Backs up production database
- ✅ Deploys via SSH
- ✅ Runs migrations
- ✅ Performs health check
- ✅ Rollback on failure

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [Database Architecture](database/DATABASE_ARCHITECTURE_GUIDE.md) - Schema documentation
- [Security Guide](SECURITY_QUICKSTART.md) - Security best practices
- [CI/CD Setup](CICD_SETUP.md) - GitHub Actions configuration
- [API Reference](API_REFERENCE.md) - REST API documentation

## 🎯 Future Enhancements

- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] SMS notifications via Twilio
- [ ] Mobile app (React Native)
- [ ] AI-powered measurement recommendations
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] WebSocket for real-time chat
- [ ] Progressive Web App (PWA)
- [ ] Docker containerization
- [ ] Kubernetes deployment

## 🤝 Contributing

**⚠️ IMPORTANT: Read Before Contributing**

This repository is connected to a **production deployment server**. Please follow these guidelines:

### ✅ How to Contribute

1. **Create an Issue** - Describe the bug/feature
2. **Fork the Repository** - For development only (not public deployment)
3. **Create Feature Branch** - `git checkout -b feature/amazing-feature`
4. **Commit Changes** - `git commit -m 'feat: Add amazing feature'`
5. **Push to Branch** - `git push origin feature/amazing-feature`
6. **Open Pull Request** - Submit for review

### ❌ Prohibited Actions

- Do NOT redistribute with minor changes
- Do NOT deploy modified versions publicly
- Do NOT remove author attribution
- Do NOT claim authorship

See [LICENSE](LICENSE) for complete terms.

## 👤 Author

**Anupam Kushwaha**

- 📧 Email: [anupamkushwaha639@gmail.com](mailto:anupamkushwaha639@gmail.com)
- 💼 LinkedIn: [linkedin.com/in/anupamkushwaha85](https://linkedin.com/in/anupamkushwaha85)
- 🐙 GitHub: [@anupamkushwaha85](https://github.com/anupamkushwaha85)

## 📄 License

This project is licensed under the **MIT License with Additional Restrictions**.

**Key Points:**
- ✅ Use for learning and education
- ✅ Contribute via issues and pull requests
- ❌ No redistribution with cosmetic changes
- ❌ No public deployment of modified versions

See [LICENSE](LICENSE) file for complete terms.

## 🙏 Acknowledgments

- Inspired by modern SaaS platforms
- Built using industry-standard security practices
- MapLibre GL for beautiful map integration
- PHPMailer for reliable email delivery
- OpenStreetMap for geolocation services

---

**Built with ❤️ by Anupam Kushwaha**

⭐ **If you find this project helpful, please give it a star!**

**Note:** This is a production-ready system. For commercial use or custom deployment, please contact the author.

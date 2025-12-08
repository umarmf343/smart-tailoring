<?php

/**
 * API: Upload Profile/Shop Image
 * POST /api/profile/upload_image.php
 * Uploads and processes profile/shop images
 */

session_start();

// Set JSON response header
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['logged_in'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Please login.'
    ]);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

// Include dependencies
define('DB_ACCESS', true);

// Load environment variables
if (file_exists('../../vendor/autoload.php')) {
    require_once '../../vendor/autoload.php';
    if (file_exists('../../.env.cloud')) {
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../..', '.env.cloud');
        $dotenv->load();
    } elseif (file_exists('../../.env')) {
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../..');
        $dotenv->load();
    }
}

// Use cloud database if SSL is enabled
$use_cloud = filter_var(getenv('DB_USE_SSL') ?: ($_ENV['DB_USE_SSL'] ?? 'false'), FILTER_VALIDATE_BOOLEAN);
require_once $use_cloud ? '../../config/db_cloud.php' : '../../config/db.php';

// Use cloud storage if configured
$use_cloudinary = !empty(getenv('CLOUDINARY_CLOUD_NAME') ?: ($_ENV['CLOUDINARY_CLOUD_NAME'] ?? ''));
if ($use_cloudinary) {
    require_once '../../utils/cloudinary_helper.php';
} else {
    require_once '../../utils/ImageUpload.php';
}

require_once '../../repositories/CustomerRepository.php';
require_once '../../repositories/TailorRepository.php';

try {
    $user_id = $_SESSION['user_id'];
    $user_type = $_SESSION['user_type'];

    // Check if file was uploaded
    if (!isset($_FILES['profile_image']) || $_FILES['profile_image']['error'] === UPLOAD_ERR_NO_FILE) {
        throw new Exception('No file uploaded');
    }

    if ($user_type === 'customer') {
        // Customer profile image upload

        if ($use_cloudinary) {
            // Upload to Cloudinary (Cloud)
            $result = handleImageUpload($_FILES['profile_image'], 'profiles/customers');

            if ($result['success']) {
                $customerRepo = new CustomerRepository($conn);
                $image_url = $result['url'];

                // Update database with Cloudinary URL
                if ($customerRepo->updateProfileImage($user_id, $image_url)) {
                    echo json_encode([
                        'success' => true,
                        'message' => 'Profile image updated successfully!',
                        'filename' => basename($image_url),
                        'image_url' => $image_url
                    ]);
                } else {
                    throw new Exception('Failed to update database');
                }
            } else {
                throw new Exception($result['error']);
            }
        } else {
            // Upload to local storage (Local development)
            $upload_path = '../../uploads/profiles/';
            $imageUpload = new ImageUpload($upload_path);

            $result = $imageUpload->upload($_FILES['profile_image'], 'customer_');

            if ($result['success']) {
                $customerRepo = new CustomerRepository($conn);

                // Get old image to delete
                $customer = $customerRepo->findById($user_id);
                $old_image = $customer['profile_image'] ?? null;

                // Update database
                if ($customerRepo->updateProfileImage($user_id, $result['filename'])) {
                    // Delete old image if exists
                    if ($old_image && file_exists($upload_path . $old_image)) {
                        $imageUpload->delete($old_image);
                    }

                    echo json_encode([
                        'success' => true,
                        'message' => 'Profile image updated successfully!',
                        'filename' => $result['filename'],
                        'image_url' => '../../uploads/profiles/' . $result['filename']
                    ]);
                } else {
                    // Delete uploaded file if database update fails
                    $imageUpload->delete($result['filename']);
                    throw new Exception('Failed to update database');
                }
            } else {
                throw new Exception($result['message']);
            }
        }
    } else if ($user_type === 'tailor') {
        // Tailor shop image upload

        if ($use_cloudinary) {
            // Upload to Cloudinary (Cloud)
            $result = handleImageUpload($_FILES['profile_image'], 'profiles/tailors');

            if ($result['success']) {
                $tailorRepo = new TailorRepository($conn);
                $image_url = $result['url'];

                // Update database with Cloudinary URL
                if ($tailorRepo->updateShopImage($user_id, $image_url)) {
                    echo json_encode([
                        'success' => true,
                        'message' => 'Shop image updated successfully!',
                        'filename' => basename($image_url),
                        'image_url' => $image_url
                    ]);
                } else {
                    throw new Exception('Failed to update database');
                }
            } else {
                throw new Exception($result['error']);
            }
        } else {
            // Upload to local storage (Local development)
            $upload_path = '../../uploads/shops/';
            $imageUpload = new ImageUpload($upload_path);

            $result = $imageUpload->upload($_FILES['profile_image'], 'shop_');

            if ($result['success']) {
                $tailorRepo = new TailorRepository($conn);

                // Get old image to delete
                $tailor = $tailorRepo->findById($user_id);
                $old_image = $tailor['shop_image'] ?? null;

                // Update database
                if ($tailorRepo->updateShopImage($user_id, $result['filename'])) {
                    // Delete old image if exists
                    if ($old_image && file_exists($upload_path . $old_image)) {
                        $imageUpload->delete($old_image);
                    }

                    echo json_encode([
                        'success' => true,
                        'message' => 'Shop image updated successfully!',
                        'filename' => $result['filename'],
                        'image_url' => '../../uploads/shops/' . $result['filename']
                    ]);
                } else {
                    // Delete uploaded file if database update fails
                    $imageUpload->delete($result['filename']);
                    throw new Exception('Failed to update database');
                }
            } else {
                throw new Exception($result['message']);
            }
        }
    } else {
        throw new Exception('Invalid user type');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

// Close database connection
db_close();

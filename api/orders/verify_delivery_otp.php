<?php

/**
 * API: Verify Delivery OTP
 * POST /api/orders/verify_delivery_otp.php
 */

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['logged_in']) || $_SESSION['user_type'] !== 'tailor') {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

define('DB_ACCESS', true);
require_once '../../config/db.php';
require_once '../../services/OrderService.php';

try {
    $order_id = $_POST['order_id'] ?? null;
    $otp = $_POST['otp'] ?? null;
    $tailor_id = $_SESSION['user_id'];

    if (!$order_id || !$otp) {
        throw new Exception('Order ID and OTP are required');
    }

    $orderService = new OrderService($conn);
    $result = $orderService->verifyDeliveryOtp($order_id, $otp, $tailor_id);

    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

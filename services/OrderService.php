<?php
/**
 * OrderService
 * Business Logic Layer for Order operations
 * (Similar to @Service in Spring Boot)
 */

require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../repositories/OrderRepository.php';

class OrderService {
    private $orderRepository;
    
    public function __construct($connection) {
        $this->orderRepository = new OrderRepository($connection);
    }
    
    /**
     * Create new order with validation
     * @param array $orderData
     * @return array Response with success status and message
     */
    public function createOrder($orderData) {
        try {
            // Validate required fields
            $validation = $this->validateOrderData($orderData);
            if (!$validation['valid']) {
                return [
                    'success' => false,
                    'message' => $validation['message']
                ];
            }
            
            // Create Order object
            $order = new Order();
            $order->setOrderNumber($this->orderRepository->generateOrderNumber());
            $order->setCustomerId($orderData['customer_id']);
            $order->setTailorId($orderData['tailor_id']);
            $order->setServiceType($orderData['service_type']);
            $order->setGarmentType($orderData['garment_type'] ?? 'General');
            $order->setQuantity($orderData['quantity'] ?? 1);
            $order->setMeasurements($orderData['measurements'] ?? '');
            $order->setSpecialInstructions($orderData['special_instructions'] ?? '');
            $order->setEstimatedPrice($orderData['estimated_price'] ?? 0);
            $order->setDeliveryDate($orderData['delivery_date'] ?? null);
            
            // Validate Order object
            if (!$order->isValid()) {
                return [
                    'success' => false,
                    'message' => 'Invalid order data'
                ];
            }
            
            // Save to database
            $orderId = $this->orderRepository->create($order);
            
            if ($orderId) {
                return [
                    'success' => true,
                    'message' => 'Order placed successfully!',
                    'order_id' => $orderId,
                    'order_number' => $order->getOrderNumber()
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Failed to create order. Please try again.'
                ];
            }
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'An error occurred: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Validate order data
     * @param array $data
     * @return array
     */
    private function validateOrderData($data) {
        // Check required fields
        if (empty($data['customer_id'])) {
            return ['valid' => false, 'message' => 'Customer ID is required'];
        }
        
        if (empty($data['tailor_id'])) {
            return ['valid' => false, 'message' => 'Tailor ID is required'];
        }
        
        if (empty($data['service_type'])) {
            return ['valid' => false, 'message' => 'Service type is required'];
        }
        
        // Validate service type
        $validServices = ['Stitching', 'Alteration', 'Embroidery', 'Repair', 'Designer Work'];
        if (!in_array($data['service_type'], $validServices)) {
            return ['valid' => false, 'message' => 'Invalid service type'];
        }
        
        // Validate quantity
        if (isset($data['quantity']) && $data['quantity'] < 1) {
            return ['valid' => false, 'message' => 'Quantity must be at least 1'];
        }
        
        // Validate estimated price
        if (isset($data['estimated_price']) && $data['estimated_price'] < 0) {
            return ['valid' => false, 'message' => 'Price cannot be negative'];
        }
        
        return ['valid' => true];
    }
    
    /**
     * Get customer's orders
     * @param int $customer_id
     * @return array
     */
    public function getCustomerOrders($customer_id) {
        try {
            $orders = $this->orderRepository->findByCustomerId($customer_id);
            
            return [
                'success' => true,
                'orders' => $orders,
                'count' => count($orders)
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to fetch orders',
                'orders' => []
            ];
        }
    }
    
    /**
     * Get tailor's orders
     * @param int $tailor_id
     * @return array
     */
    public function getTailorOrders($tailor_id) {
        try {
            $orders = $this->orderRepository->findByTailorId($tailor_id);
            
            return [
                'success' => true,
                'orders' => $orders,
                'count' => count($orders)
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to fetch orders',
                'orders' => []
            ];
        }
    }
    
    /**
     * Get single order details
     * @param int $order_id
     * @return array
     */
    public function getOrderDetails($order_id) {
        try {
            $order = $this->orderRepository->findById($order_id);
            
            if ($order) {
                return [
                    'success' => true,
                    'order' => $order->toArray()
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Order not found'
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to fetch order details'
            ];
        }
    }
    
   /**
 * Update order status (with authorization check)
 * @param int $order_id
 * @param string $new_status
 * @param int $user_id
 * @param string $user_type
 * @return array
 */
public function updateOrderStatus($order_id, $new_status, $user_id, $user_type) {
    try {
        // Get order
        $order = $this->orderRepository->findById($order_id);
        
        if (!$order) {
            return [
                'success' => false,
                'message' => 'Order not found'
            ];
        }
        
        // Get order as array for easier access
        $orderData = $order->toArray();
        
        // Authorization check
        if ($user_type === 'customer') {
            if ($orderData['customer_id'] != $user_id) {
                return [
                    'success' => false,
                    'message' => 'Unauthorized: This is not your order'
                ];
            }
        } else if ($user_type === 'tailor') {
            if ($orderData['tailor_id'] != $user_id) {
                return [
                    'success' => false,
                    'message' => 'Unauthorized: This order was not placed to your shop (Order tailor_id: ' . $orderData['tailor_id'] . ', Your ID: ' . $user_id . ')'
                ];
            }
        }
        
        // Validate status transition
        $validTransition = $this->isValidStatusTransition(
            $orderData['order_status'], 
            $new_status, 
            $user_type
        );
        
        if (!$validTransition) {
            return [
                'success' => false,
                'message' => 'Invalid status transition from ' . $orderData['order_status'] . ' to ' . $new_status
            ];
        }
        
        // Update status
        if ($new_status === 'completed') {
            $result = $this->orderRepository->complete($order_id);
        } else if ($new_status === 'cancelled') {
            $result = $this->orderRepository->cancel($order_id);
        } else {
            $result = $this->orderRepository->updateStatus($order_id, $new_status);
        }
        
        if ($result) {
            return [
                'success' => true,
                'message' => 'Order status updated successfully'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Failed to update order status'
            ];
        }
        
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'An error occurred: ' . $e->getMessage()
        ];
    }
}

    
    /**
     * Validate status transition based on user role
     * @param string $current_status
     * @param string $new_status
     * @param string $user_type
     * @return bool
     */
    private function isValidStatusTransition($current_status, $new_status, $user_type) {
        // Status flow: pending -> accepted -> in_progress -> ready -> completed
        
        $allowedTransitions = [
            'customer' => [
                'pending' => ['cancelled'],
                'accepted' => ['cancelled'],
                'ready' => ['completed'] // Customer confirms completion
            ],
            'tailor' => [
                'pending' => ['accepted', 'cancelled'],
                'accepted' => ['in_progress', 'cancelled'],
                'in_progress' => ['ready', 'cancelled'],
                'ready' => ['completed']
            ]
        ];
        
        if (!isset($allowedTransitions[$user_type][$current_status])) {
            return false;
        }
        
        return in_array($new_status, $allowedTransitions[$user_type][$current_status]);
    }
    
    /**
     * Cancel order
     * @param int $order_id
     * @param int $user_id
     * @param string $user_type
     * @return array
     */
    public function cancelOrder($order_id, $user_id, $user_type) {
        return $this->updateOrderStatus($order_id, 'cancelled', $user_id, $user_type);
    }
    
    /**
     * Get order statistics for dashboard
     * @param int $tailor_id
     * @return array
     */
    public function getTailorOrderStats($tailor_id) {
        try {
            $stats = $this->orderRepository->getOrderCountsByStatus($tailor_id);
            
            return [
                'success' => true,
                'stats' => $stats
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'stats' => []
            ];
        }
    }
}
?>

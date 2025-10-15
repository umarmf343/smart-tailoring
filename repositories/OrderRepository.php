<?php
/**
 * OrderRepository
 * Data Access Layer for Order operations
 * (Similar to JpaRepository in Spring Boot)
 */

require_once __DIR__ . '/../models/Order.php';

class OrderRepository {
    private $conn;
    
    public function __construct($connection) {
        $this->conn = $connection;
    }
    
    /**
     * Create new order
     * @param Order $order
     * @return int|false Order ID or false on failure
     */
    public function create(Order $order) {
        $query = "INSERT INTO orders 
                  (order_number, customer_id, tailor_id, service_type, garment_type, 
                   quantity, measurements, special_instructions, estimated_price, 
                   order_status, payment_status, delivery_date) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'unpaid', ?)";
        
        $stmt = $this->conn->prepare($query);
        
        if (!$stmt) {
            return false;
        }
        
        $order_number = $order->getOrderNumber();
        $customer_id = $order->getCustomerId();
        $tailor_id = $order->getTailorId();
        $service_type = $order->getServiceType();
        $garment_type = $order->getGarmentType();
        $quantity = $order->getQuantity();
        $measurements = $order->getMeasurements();
        $special_instructions = $order->getSpecialInstructions();
        $estimated_price = $order->getEstimatedPrice();
        $delivery_date = $order->getDeliveryDate();
        
        $stmt->bind_param("siisssisss", 
            $order_number, $customer_id, $tailor_id, $service_type, $garment_type,
            $quantity, $measurements, $special_instructions, $estimated_price, $delivery_date
        );
        
        if ($stmt->execute()) {
            return $this->conn->insert_id;
        }
        
        return false;
    }
    
    /**
     * Find order by ID
     * @param int $id
     * @return Order|null
     */
    public function findById($id) {
        $query = "SELECT * FROM orders WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        
        if (!$stmt) {
            return null;
        }
        
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($row = $result->fetch_assoc()) {
            return new Order($row);
        }
        
        return null;
    }
    
    /**
     * Find all orders by customer ID
     * @param int $customer_id
     * @return array Array of Order objects
     */
    public function findByCustomerId($customer_id) {
        $query = "SELECT o.*, 
                         t.shop_name, t.owner_name, t.phone as tailor_phone, t.area
                  FROM orders o
                  LEFT JOIN tailors t ON o.tailor_id = t.id
                  WHERE o.customer_id = ?
                  ORDER BY o.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        
        if (!$stmt) {
            return [];
        }
        
        $stmt->bind_param("i", $customer_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $orders = [];
        while ($row = $result->fetch_assoc()) {
            $order = new Order($row);
            // Add tailor info
            $row['tailor_info'] = [
                'shop_name' => $row['shop_name'],
                'owner_name' => $row['owner_name'],
                'phone' => $row['tailor_phone'],
                'area' => $row['area']
            ];
            $orders[] = $row; // Return as array for now (can be Order object)
        }
        
        return $orders;
    }
    
    /**
     * Find all orders by tailor ID
     * @param int $tailor_id
     * @return array Array of Order objects
     */
    public function findByTailorId($tailor_id) {
        $query = "SELECT o.*, 
                         c.full_name as customer_name, c.phone as customer_phone, c.address as customer_address
                  FROM orders o
                  LEFT JOIN customers c ON o.customer_id = c.id
                  WHERE o.tailor_id = ?
                  ORDER BY o.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        
        if (!$stmt) {
            return [];
        }
        
        $stmt->bind_param("i", $tailor_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $orders = [];
        while ($row = $result->fetch_assoc()) {
            // Add customer info
            $row['customer_info'] = [
                'name' => $row['customer_name'],
                'phone' => $row['customer_phone'],
                'address' => $row['customer_address']
            ];
            $orders[] = $row;
        }
        
        return $orders;
    }
    
    /**
     * Update order status
     * @param int $order_id
     * @param string $status
     * @return bool
     */
    public function updateStatus($order_id, $status) {
        $query = "UPDATE orders SET order_status = ?, updated_at = NOW() WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        
        if (!$stmt) {
            return false;
        }
        
        $stmt->bind_param("si", $status, $order_id);
        return $stmt->execute();
    }
    
    /**
     * Update payment status
     * @param int $order_id
     * @param string $payment_status
     * @return bool
     */
    public function updatePaymentStatus($order_id, $payment_status) {
        $query = "UPDATE orders SET payment_status = ?, updated_at = NOW() WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        
        if (!$stmt) {
            return false;
        }
        
        $stmt->bind_param("si", $payment_status, $order_id);
        return $stmt->execute();
    }
    
    /**
     * Update final price
     * @param int $order_id
     * @param float $price
     * @return bool
     */
    public function updateFinalPrice($order_id, $price) {
        $query = "UPDATE orders SET final_price = ?, updated_at = NOW() WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        
        if (!$stmt) {
            return false;
        }
        
        $stmt->bind_param("di", $price, $order_id);
        return $stmt->execute();
    }
    
    /**
     * Cancel order
     * @param int $order_id
     * @return bool
     */
    public function cancel($order_id) {
        return $this->updateStatus($order_id, 'cancelled');
    }
    
    /**
     * Complete order
     * @param int $order_id
     * @return bool
     */
    public function complete($order_id) {
        $query = "UPDATE orders 
                  SET order_status = 'completed', 
                      completed_at = NOW(), 
                      updated_at = NOW() 
                  WHERE id = ?";
        
        $stmt = $this->conn->prepare($query);
        
        if (!$stmt) {
            return false;
        }
        
        $stmt->bind_param("i", $order_id);
        return $stmt->execute();
    }
    
    /**
     * Get order counts by status for a tailor
     * @param int $tailor_id
     * @return array
     */
    public function getOrderCountsByStatus($tailor_id) {
        $query = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN order_status = 'pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN order_status = 'accepted' THEN 1 ELSE 0 END) as accepted,
                    SUM(CASE WHEN order_status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
                    SUM(CASE WHEN order_status = 'completed' THEN 1 ELSE 0 END) as completed,
                    SUM(CASE WHEN order_status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
                  FROM orders 
                  WHERE tailor_id = ?";
        
        $stmt = $this->conn->prepare($query);
        
        if (!$stmt) {
            return ['total' => 0, 'pending' => 0, 'accepted' => 0, 'in_progress' => 0, 'completed' => 0, 'cancelled' => 0];
        }
        
        $stmt->bind_param("i", $tailor_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        return $result->fetch_assoc();
    }
    
    /**
     * Generate unique order number
     * @return string
     */
    public function generateOrderNumber() {
        return 'ORD' . date('Ymd') . rand(1000, 9999);
    }
}
?>

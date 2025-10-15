<?php
/**
 * Order Model
 * Represents an order entity with all its properties
 * (Similar to Entity class in Spring Boot)
 */

class Order {
    // Properties
    private $id;
    private $order_number;
    private $customer_id;
    private $tailor_id;
    private $service_type;
    private $garment_type;
    private $quantity;
    private $measurements;
    private $special_instructions;
    private $estimated_price;
    private $final_price;
    private $order_status;
    private $payment_status;
    private $order_date;
    private $delivery_date;
    private $created_at;
    private $updated_at;
    
    // Constructor
    public function __construct($data = []) {
        if (!empty($data)) {
            $this->hydrate($data);
        }
    }
    
    // Hydrate object from array (like @Autowired in Spring)
   public function hydrate($data) {
    foreach ($data as $key => $value) {
        // Handle both snake_case and camelCase
        $camelKey = lcfirst(str_replace('_', '', ucwords($key, '_')));
        
        // Try direct property access first
        if (property_exists($this, $key)) {
            $this->$key = $value;
        }
        // Try camelCase property
        else if (property_exists($this, $camelKey)) {
            $this->$camelKey = $value;
        }
    }
}

    
    // Getters
    public function getId() { return $this->id; }
    public function getOrderNumber() { return $this->order_number; }
    public function getCustomerId() { return $this->customer_id; }
    public function getTailorId() { return $this->tailor_id; }
    public function getServiceType() { return $this->service_type; }
    public function getGarmentType() { return $this->garment_type; }
    public function getQuantity() { return $this->quantity; }
    public function getMeasurements() { return $this->measurements; }
    public function getSpecialInstructions() { return $this->special_instructions; }
    public function getEstimatedPrice() { return $this->estimated_price; }
    public function getFinalPrice() { return $this->final_price; }
    public function getOrderStatus() { return $this->order_status; }
    public function getPaymentStatus() { return $this->payment_status; }
    public function getOrderDate() { return $this->order_date; }
    public function getDeliveryDate() { return $this->delivery_date; }
    public function getCreatedAt() { return $this->created_at; }
    public function getUpdatedAt() { return $this->updated_at; }
    
    // Setters
    public function setId($id) { $this->id = $id; }
    public function setOrderNumber($order_number) { $this->order_number = $order_number; }
    public function setCustomerId($customer_id) { $this->customer_id = $customer_id; }
    public function setTailorId($tailor_id) { $this->tailor_id = $tailor_id; }
    public function setServiceType($service_type) { $this->service_type = $service_type; }
    public function setGarmentType($garment_type) { $this->garment_type = $garment_type; }
    public function setQuantity($quantity) { $this->quantity = $quantity; }
    public function setMeasurements($measurements) { $this->measurements = $measurements; }
    public function setSpecialInstructions($special_instructions) { $this->special_instructions = $special_instructions; }
    public function setEstimatedPrice($estimated_price) { $this->estimated_price = $estimated_price; }
    public function setFinalPrice($final_price) { $this->final_price = $final_price; }
    public function setOrderStatus($order_status) { $this->order_status = $order_status; }
    public function setPaymentStatus($payment_status) { $this->payment_status = $payment_status; }
    public function setOrderDate($order_date) { $this->order_date = $order_date; }
    public function setDeliveryDate($delivery_date) { $this->delivery_date = $delivery_date; }
    public function setCreatedAt($created_at) { $this->created_at = $created_at; }
    public function setUpdatedAt($updated_at) { $this->updated_at = $updated_at; }
    
    // Business methods
    public function toArray() {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'customer_id' => $this->customer_id,
            'tailor_id' => $this->tailor_id,
            'service_type' => $this->service_type,
            'garment_type' => $this->garment_type,
            'quantity' => $this->quantity,
            'measurements' => $this->measurements,
            'special_instructions' => $this->special_instructions,
            'estimated_price' => $this->estimated_price,
            'final_price' => $this->final_price,
            'order_status' => $this->order_status,
            'payment_status' => $this->payment_status,
            'order_date' => $this->order_date,
            'delivery_date' => $this->delivery_date,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
    
    public function isValid() {
        return !empty($this->customer_id) && 
               !empty($this->tailor_id) && 
               !empty($this->service_type);
    }
    
    public function isPending() {
        return $this->order_status === 'pending';
    }
    
    public function isCompleted() {
        return $this->order_status === 'completed';
    }
    
    public function isCancelled() {
        return $this->order_status === 'cancelled';
    }
}
?>

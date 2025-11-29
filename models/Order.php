<?php

/**
 * Order Model
 * Represents an order entity with all its properties
 * (Similar to Entity class in Spring Boot)
 */

class Order
{
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

    // New properties for enhanced tailoring workflow
    private $fabric_type;
    private $fabric_color;
    private $design_specifications; // JSON string
    private $measurements_snapshot; // JSON string
    private $measurement_id;
    private $deadline;
    private $first_fitting_date;
    private $final_fitting_date;
    private $deposit_amount;
    private $deposit_paid_at;
    private $balance_due;
    private $alteration_notes;
    private $alteration_count;
    private $source_order_id;

    // Constructor
    public function __construct($data = [])
    {
        if (!empty($data)) {
            $this->hydrate($data);
        }
    }

    // Hydrate object from array (like @Autowired in Spring)
    public function hydrate($data)
    {
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
    public function getId()
    {
        return $this->id;
    }
    public function getOrderNumber()
    {
        return $this->order_number;
    }
    public function getCustomerId()
    {
        return $this->customer_id;
    }
    public function getTailorId()
    {
        return $this->tailor_id;
    }
    public function getServiceType()
    {
        return $this->service_type;
    }
    public function getGarmentType()
    {
        return $this->garment_type;
    }
    public function getQuantity()
    {
        return $this->quantity;
    }
    public function getMeasurements()
    {
        return $this->measurements;
    }
    public function getSpecialInstructions()
    {
        return $this->special_instructions;
    }
    public function getEstimatedPrice()
    {
        return $this->estimated_price;
    }
    public function getFinalPrice()
    {
        return $this->final_price;
    }
    public function getOrderStatus()
    {
        return $this->order_status;
    }
    public function getPaymentStatus()
    {
        return $this->payment_status;
    }
    public function getOrderDate()
    {
        return $this->order_date;
    }
    public function getDeliveryDate()
    {
        return $this->delivery_date;
    }
    public function getCreatedAt()
    {
        return $this->created_at;
    }
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    // New getters
    public function getFabricType()
    {
        return $this->fabric_type;
    }
    public function getFabricColor()
    {
        return $this->fabric_color;
    }
    public function getDesignSpecifications()
    {
        return $this->design_specifications;
    }
    public function getMeasurementsSnapshot()
    {
        return $this->measurements_snapshot;
    }
    public function getMeasurementId()
    {
        return $this->measurement_id;
    }
    public function getDeadline()
    {
        return $this->deadline;
    }
    public function getFirstFittingDate()
    {
        return $this->first_fitting_date;
    }
    public function getFinalFittingDate()
    {
        return $this->final_fitting_date;
    }
    public function getDepositAmount()
    {
        return $this->deposit_amount;
    }
    public function getDepositPaidAt()
    {
        return $this->deposit_paid_at;
    }
    public function getBalanceDue()
    {
        return $this->balance_due;
    }
    public function getAlterationNotes()
    {
        return $this->alteration_notes;
    }
    public function getAlterationCount()
    {
        return $this->alteration_count;
    }
    public function getSourceOrderId()
    {
        return $this->source_order_id;
    }

    // Setters
    public function setId($id)
    {
        $this->id = $id;
    }
    public function setOrderNumber($order_number)
    {
        $this->order_number = $order_number;
    }
    public function setCustomerId($customer_id)
    {
        $this->customer_id = $customer_id;
    }
    public function setTailorId($tailor_id)
    {
        $this->tailor_id = $tailor_id;
    }
    public function setServiceType($service_type)
    {
        $this->service_type = $service_type;
    }
    public function setGarmentType($garment_type)
    {
        $this->garment_type = $garment_type;
    }
    public function setQuantity($quantity)
    {
        $this->quantity = $quantity;
    }
    public function setMeasurements($measurements)
    {
        $this->measurements = $measurements;
    }
    public function setSpecialInstructions($special_instructions)
    {
        $this->special_instructions = $special_instructions;
    }
    public function setEstimatedPrice($estimated_price)
    {
        $this->estimated_price = $estimated_price;
    }
    public function setFinalPrice($final_price)
    {
        $this->final_price = $final_price;
    }
    public function setOrderStatus($order_status)
    {
        $this->order_status = $order_status;
    }
    public function setPaymentStatus($payment_status)
    {
        $this->payment_status = $payment_status;
    }
    public function setOrderDate($order_date)
    {
        $this->order_date = $order_date;
    }
    public function setDeliveryDate($delivery_date)
    {
        $this->delivery_date = $delivery_date;
    }
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
    }
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
    }

    // New setters
    public function setFabricType($fabric_type)
    {
        $this->fabric_type = $fabric_type;
    }
    public function setFabricColor($fabric_color)
    {
        $this->fabric_color = $fabric_color;
    }
    public function setDesignSpecifications($design_specifications)
    {
        $this->design_specifications = $design_specifications;
    }
    public function setMeasurementsSnapshot($measurements_snapshot)
    {
        $this->measurements_snapshot = $measurements_snapshot;
    }
    public function setMeasurementId($measurement_id)
    {
        $this->measurement_id = $measurement_id;
    }
    public function setDeadline($deadline)
    {
        $this->deadline = $deadline;
    }
    public function setFirstFittingDate($first_fitting_date)
    {
        $this->first_fitting_date = $first_fitting_date;
    }
    public function setFinalFittingDate($final_fitting_date)
    {
        $this->final_fitting_date = $final_fitting_date;
    }
    public function setDepositAmount($deposit_amount)
    {
        $this->deposit_amount = $deposit_amount;
    }
    public function setDepositPaidAt($deposit_paid_at)
    {
        $this->deposit_paid_at = $deposit_paid_at;
    }
    public function setBalanceDue($balance_due)
    {
        $this->balance_due = $balance_due;
    }
    public function setAlterationNotes($alteration_notes)
    {
        $this->alteration_notes = $alteration_notes;
    }
    public function setAlterationCount($alteration_count)
    {
        $this->alteration_count = $alteration_count;
    }
    public function setSourceOrderId($source_order_id)
    {
        $this->source_order_id = $source_order_id;
    }

    // Business methods
    public function toArray()
    {
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
            'updated_at' => $this->updated_at,
            // New fields
            'fabric_type' => $this->fabric_type,
            'fabric_color' => $this->fabric_color,
            'design_specifications' => $this->design_specifications,
            'measurements_snapshot' => $this->measurements_snapshot,
            'measurement_id' => $this->measurement_id,
            'deadline' => $this->deadline,
            'first_fitting_date' => $this->first_fitting_date,
            'final_fitting_date' => $this->final_fitting_date,
            'deposit_amount' => $this->deposit_amount,
            'deposit_paid_at' => $this->deposit_paid_at,
            'balance_due' => $this->balance_due,
            'alteration_notes' => $this->alteration_notes,
            'alteration_count' => $this->alteration_count,
            'source_order_id' => $this->source_order_id
        ];
    }

    public function isValid()
    {
        return !empty($this->customer_id) &&
            !empty($this->tailor_id) &&
            !empty($this->service_type);
    }

    public function isPending()
    {
        return $this->order_status === 'pending';
    }

    public function isBooked()
    {
        return $this->order_status === 'booked';
    }

    public function isInProduction()
    {
        $production_statuses = ['cutting', 'stitching'];
        return in_array($this->order_status, $production_statuses);
    }

    public function requiresFitting()
    {
        $fitting_statuses = ['first_fitting', 'final_fitting'];
        return in_array($this->order_status, $fitting_statuses);
    }

    public function needsAlterations()
    {
        return $this->order_status === 'alterations';
    }

    public function isReadyForPickup()
    {
        return $this->order_status === 'ready_for_pickup';
    }

    public function isDelivered()
    {
        return $this->order_status === 'delivered';
    }

    public function isCompleted()
    {
        return $this->order_status === 'completed';
    }

    public function isCancelled()
    {
        return $this->order_status === 'cancelled';
    }

    public function isReorder()
    {
        return !empty($this->source_order_id);
    }

    public function hasDeposit()
    {
        return !empty($this->deposit_amount) && $this->deposit_amount > 0;
    }

    public function isDepositPaid()
    {
        return !empty($this->deposit_paid_at);
    }

    public function getDesignSpecificationsArray()
    {
        if (empty($this->design_specifications)) {
            return null;
        }
        return json_decode($this->design_specifications, true);
    }

    public function getMeasurementsSnapshotArray()
    {
        if (empty($this->measurements_snapshot)) {
            return null;
        }
        return json_decode($this->measurements_snapshot, true);
    }
}

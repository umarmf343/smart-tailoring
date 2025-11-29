<?php

/**
 * Measurement Model
 * Represents a customer measurement entity
 * Stores body measurements for tailoring orders
 */

class Measurement
{
    // Properties
    private $id;
    private $customer_id;
    private $label;
    private $garment_context;
    private $measurements_data; // JSON string
    private $is_default;
    private $notes;
    private $created_at;
    private $updated_at;

    // Constructor
    public function __construct($data = [])
    {
        if (!empty($data)) {
            $this->hydrate($data);
        }
    }

    // Hydrate object from array
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
    public function getCustomerId()
    {
        return $this->customer_id;
    }
    public function getLabel()
    {
        return $this->label;
    }
    public function getGarmentContext()
    {
        return $this->garment_context;
    }
    public function getMeasurementsData()
    {
        return $this->measurements_data;
    }
    public function getIsDefault()
    {
        return $this->is_default;
    }
    public function getNotes()
    {
        return $this->notes;
    }
    public function getCreatedAt()
    {
        return $this->created_at;
    }
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    // Setters
    public function setId($id)
    {
        $this->id = $id;
    }
    public function setCustomerId($customer_id)
    {
        $this->customer_id = $customer_id;
    }
    public function setLabel($label)
    {
        $this->label = $label;
    }
    public function setGarmentContext($garment_context)
    {
        $this->garment_context = $garment_context;
    }
    public function setMeasurementsData($measurements_data)
    {
        $this->measurements_data = $measurements_data;
    }
    public function setIsDefault($is_default)
    {
        $this->is_default = $is_default;
    }
    public function setNotes($notes)
    {
        $this->notes = $notes;
    }
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
    }
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;
    }

    // Business methods
    public function toArray()
    {
        return [
            'id' => $this->id,
            'customer_id' => $this->customer_id,
            'label' => $this->label,
            'garment_context' => $this->garment_context,
            'measurements_data' => $this->measurements_data,
            'is_default' => $this->is_default,
            'notes' => $this->notes,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }

    /**
     * Get measurements as parsed JSON array
     * @return array|null
     */
    public function getMeasurementsArray()
    {
        if (empty($this->measurements_data)) {
            return null;
        }

        $decoded = json_decode($this->measurements_data, true);
        return $decoded ?: null;
    }

    /**
     * Set measurements from array (converts to JSON)
     * @param array $measurements
     */
    public function setMeasurementsFromArray($measurements)
    {
        $this->measurements_data = json_encode($measurements);
    }

    /**
     * Validate measurement data
     * @return bool
     */
    public function isValid()
    {
        // Required fields
        if (empty($this->customer_id)) {
            return false;
        }

        if (empty($this->measurements_data)) {
            return false;
        }

        // Validate JSON
        $data = $this->getMeasurementsArray();
        if ($data === null) {
            return false;
        }

        // Must have at least one measurement value
        return count($data) > 0;
    }

    /**
     * Get display label (generates if empty)
     * @return string
     */
    public function getDisplayLabel()
    {
        if (!empty($this->label)) {
            return $this->label;
        }

        // Generate label from context and date
        $context = ucfirst($this->garment_context ?: 'General');
        $date = $this->created_at ? date('M Y', strtotime($this->created_at)) : date('M Y');

        return $context . ' - ' . $date;
    }

    /**
     * Check if this is a shirt measurement
     * @return bool
     */
    public function isShirtMeasurement()
    {
        return $this->garment_context === 'shirt';
    }

    /**
     * Check if this is a pants measurement
     * @return bool
     */
    public function isPantsMeasurement()
    {
        return $this->garment_context === 'pants';
    }

    /**
     * Check if this is a full body measurement
     * @return bool
     */
    public function isFullMeasurement()
    {
        return $this->garment_context === 'full';
    }
}

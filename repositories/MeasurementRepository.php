<?php

/**
 * MeasurementRepository
 * Data access layer for measurements table
 */

require_once __DIR__ . '/../models/Measurement.php';

class MeasurementRepository
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Save a measurement (insert or update)
     * @param Measurement $measurement
     * @return int|bool Measurement ID on success, false on failure
     */
    public function save($measurement)
    {
        if (!$measurement->isValid()) {
            return false;
        }

        if ($measurement->getId()) {
            return $this->update($measurement);
        } else {
            return $this->create($measurement);
        }
    }

    /**
     * Create a new measurement
     * @param Measurement $measurement
     * @return int|bool Measurement ID on success, false on failure
     */
    private function create($measurement)
    {
        $query = "INSERT INTO measurements (
            customer_id,
            label,
            garment_context,
            measurements_data,
            is_default,
            notes
        ) VALUES (?, ?, ?, ?, ?, ?)";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            return false;
        }

        $customer_id = $measurement->getCustomerId();
        $label = $measurement->getLabel();
        $garment_context = $measurement->getGarmentContext();
        $measurements_data = $measurement->getMeasurementsData();
        $is_default = $measurement->getIsDefault() ? 1 : 0;
        $notes = $measurement->getNotes();

        $stmt->bind_param(
            "isssis",
            $customer_id,
            $label,
            $garment_context,
            $measurements_data,
            $is_default,
            $notes
        );

        if ($stmt->execute()) {
            $measurement_id = $this->conn->insert_id;

            // If this is set as default, unset other defaults for the same customer and context
            if ($is_default) {
                $this->unsetOtherDefaults($customer_id, $garment_context, $measurement_id);
            }

            return $measurement_id;
        }

        return false;
    }

    /**
     * Update an existing measurement
     * @param Measurement $measurement
     * @return bool
     */
    private function update($measurement)
    {
        $query = "UPDATE measurements SET
            customer_id = ?,
            label = ?,
            garment_context = ?,
            measurements_data = ?,
            is_default = ?,
            notes = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            return false;
        }

        $customer_id = $measurement->getCustomerId();
        $label = $measurement->getLabel();
        $garment_context = $measurement->getGarmentContext();
        $measurements_data = $measurement->getMeasurementsData();
        $is_default = $measurement->getIsDefault() ? 1 : 0;
        $notes = $measurement->getNotes();
        $id = $measurement->getId();

        $stmt->bind_param(
            "issssii",
            $customer_id,
            $label,
            $garment_context,
            $measurements_data,
            $is_default,
            $notes,
            $id
        );

        $result = $stmt->execute();

        // If this is set as default, unset other defaults
        if ($result && $is_default) {
            $this->unsetOtherDefaults($customer_id, $garment_context, $id);
        }

        return $result;
    }

    /**
     * Find measurement by ID
     * @param int $id
     * @return Measurement|null
     */
    public function findById($id)
    {
        $query = "SELECT * FROM measurements WHERE id = ?";
        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            return null;
        }

        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            return new Measurement($row);
        }

        return null;
    }

    /**
     * Find all measurements for a customer
     * @param int $customer_id
     * @param string $garment_context Optional filter by garment type
     * @return array Array of Measurement objects
     */
    public function findByCustomerId($customer_id, $garment_context = null)
    {
        $query = "SELECT * FROM measurements WHERE customer_id = ?";

        if ($garment_context) {
            $query .= " AND garment_context = ?";
        }

        $query .= " ORDER BY is_default DESC, updated_at DESC";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            return [];
        }

        if ($garment_context) {
            $stmt->bind_param("is", $customer_id, $garment_context);
        } else {
            $stmt->bind_param("i", $customer_id);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        $measurements = [];
        while ($row = $result->fetch_assoc()) {
            $measurements[] = new Measurement($row);
        }

        return $measurements;
    }

    /**
     * Find default measurement for a customer and context
     * @param int $customer_id
     * @param string $garment_context
     * @return Measurement|null
     */
    public function findDefaultByContext($customer_id, $garment_context)
    {
        $query = "SELECT * FROM measurements 
                  WHERE customer_id = ? 
                  AND garment_context = ? 
                  AND is_default = 1 
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            return null;
        }

        $stmt->bind_param("is", $customer_id, $garment_context);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            return new Measurement($row);
        }

        return null;
    }

    /**
     * Set a measurement as default
     * @param int $measurement_id
     * @return bool
     */
    public function setAsDefault($measurement_id)
    {
        // First get the measurement to know customer_id and garment_context
        $measurement = $this->findById($measurement_id);

        if (!$measurement) {
            return false;
        }

        // Start transaction
        $this->conn->begin_transaction();

        try {
            // Unset all defaults for this customer and context
            $this->unsetOtherDefaults(
                $measurement->getCustomerId(),
                $measurement->getGarmentContext(),
                $measurement_id
            );

            // Set this one as default
            $query = "UPDATE measurements SET is_default = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bind_param("i", $measurement_id);
            $result = $stmt->execute();

            $this->conn->commit();
            return $result;
        } catch (Exception $e) {
            $this->conn->rollback();
            return false;
        }
    }

    /**
     * Unset default flag for other measurements
     * @param int $customer_id
     * @param string $garment_context
     * @param int $except_id
     * @return bool
     */
    private function unsetOtherDefaults($customer_id, $garment_context, $except_id)
    {
        $query = "UPDATE measurements 
                  SET is_default = 0, updated_at = CURRENT_TIMESTAMP 
                  WHERE customer_id = ? 
                  AND garment_context = ? 
                  AND id != ?";

        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            return false;
        }

        $stmt->bind_param("isi", $customer_id, $garment_context, $except_id);
        return $stmt->execute();
    }

    /**
     * Delete a measurement
     * @param int $measurement_id
     * @return bool
     */
    public function delete($measurement_id)
    {
        $query = "DELETE FROM measurements WHERE id = ?";
        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            return false;
        }

        $stmt->bind_param("i", $measurement_id);
        return $stmt->execute();
    }

    /**
     * Get measurement count for a customer
     * @param int $customer_id
     * @return int
     */
    public function getCountByCustomerId($customer_id)
    {
        $query = "SELECT COUNT(*) as count FROM measurements WHERE customer_id = ?";
        $stmt = $this->conn->prepare($query);

        if (!$stmt) {
            return 0;
        }

        $stmt->bind_param("i", $customer_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            return (int)$row['count'];
        }

        return 0;
    }
}

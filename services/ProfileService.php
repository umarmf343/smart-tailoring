<?php
/**
 * ProfileService
 * Business Logic Layer for Profile operations
 */

require_once __DIR__ . '/../repositories/CustomerRepository.php';
require_once __DIR__ . '/../repositories/TailorRepository.php';

class ProfileService {
    private $customerRepo;
    private $tailorRepo;
    
    public function __construct($connection) {
        $this->customerRepo = new CustomerRepository($connection);
        $this->tailorRepo = new TailorRepository($connection);
    }
    
    /**
     * Update customer profile
     * @param int $customer_id
     * @param array $data
     * @return array
     */
    public function updateCustomerProfile($customer_id, $data) {
        try {
            // Validate required fields
            if (empty($data['full_name']) || empty($data['email']) || empty($data['phone'])) {
                return [
                    'success' => false,
                    'message' => 'Please fill in all required fields'
                ];
            }
            
            // Validate email format
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                return [
                    'success' => false,
                    'message' => 'Invalid email format'
                ];
            }
            
            // Validate phone (10 digits)
            if (!preg_match('/^[0-9]{10}$/', $data['phone'])) {
                return [
                    'success' => false,
                    'message' => 'Phone number must be 10 digits'
                ];
            }
            
            // Check if email already exists (excluding current user)
            if ($this->customerRepo->emailExists($data['email'], $customer_id)) {
                return [
                    'success' => false,
                    'message' => 'Email already registered with another account'
                ];
            }
            
            // Update profile
            $result = $this->customerRepo->updateProfile($customer_id, $data);
            
            if ($result) {
                // Update session data
                $_SESSION['user_name'] = $data['full_name'];
                
                return [
                    'success' => true,
                    'message' => 'Profile updated successfully!'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Failed to update profile. Please try again.'
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
     * Update tailor profile
     * @param int $tailor_id
     * @param array $data
     * @return array
     */
    public function updateTailorProfile($tailor_id, $data) {
        try {
            // Validate required fields
            $required = ['shop_name', 'owner_name', 'email', 'phone', 'shop_address', 'area'];
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    return [
                        'success' => false,
                        'message' => 'Please fill in all required fields'
                    ];
                }
            }
            
            // Validate email format
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                return [
                    'success' => false,
                    'message' => 'Invalid email format'
                ];
            }
            
            // Validate phone (10 digits)
            if (!preg_match('/^[0-9]{10}$/', $data['phone'])) {
                return [
                    'success' => false,
                    'message' => 'Phone number must be 10 digits'
                ];
            }
            
            // Validate experience years (must be numeric)
            if (isset($data['experience_years']) && !is_numeric($data['experience_years'])) {
                return [
                    'success' => false,
                    'message' => 'Experience years must be a number'
                ];
            }
            
            // Check if email already exists (excluding current user)
            if ($this->tailorRepo->emailExists($data['email'], $tailor_id)) {
                return [
                    'success' => false,
                    'message' => 'Email already registered with another account'
                ];
            }
            
            // Update profile
            $result = $this->tailorRepo->updateProfile($tailor_id, $data);
            
            if ($result) {
                // Update session data
                $_SESSION['user_name'] = $data['owner_name'];
                $_SESSION['shop_name'] = $data['shop_name'];
                
                return [
                    'success' => true,
                    'message' => 'Profile updated successfully!'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Failed to update profile. Please try again.'
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
     * Change customer password
     * @param int $customer_id
     * @param string $current_password
     * @param string $new_password
     * @param string $confirm_password
     * @return array
     */
    public function changeCustomerPassword($customer_id, $current_password, $new_password, $confirm_password) {
        try {
            // Validate inputs
            if (empty($current_password) || empty($new_password) || empty($confirm_password)) {
                return [
                    'success' => false,
                    'message' => 'All fields are required'
                ];
            }
            
            // Check if new passwords match
            if ($new_password !== $confirm_password) {
                return [
                    'success' => false,
                    'message' => 'New passwords do not match'
                ];
            }
            
            // Validate new password length
            if (strlen($new_password) < 6) {
                return [
                    'success' => false,
                    'message' => 'New password must be at least 6 characters'
                ];
            }
            
            // Verify current password
            if (!$this->customerRepo->verifyPassword($customer_id, $current_password)) {
                return [
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ];
            }
            
            // Hash new password
            $new_password_hash = password_hash($new_password, PASSWORD_BCRYPT);
            
            // Update password
            $result = $this->customerRepo->updatePassword($customer_id, $new_password_hash);
            
            if ($result) {
                return [
                    'success' => true,
                    'message' => 'Password changed successfully!'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Failed to change password. Please try again.'
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
     * Change tailor password
     * @param int $tailor_id
     * @param string $current_password
     * @param string $new_password
     * @param string $confirm_password
     * @return array
     */
    public function changeTailorPassword($tailor_id, $current_password, $new_password, $confirm_password) {
        try {
            // Validate inputs
            if (empty($current_password) || empty($new_password) || empty($confirm_password)) {
                return [
                    'success' => false,
                    'message' => 'All fields are required'
                ];
            }
            
            // Check if new passwords match
            if ($new_password !== $confirm_password) {
                return [
                    'success' => false,
                    'message' => 'New passwords do not match'
                ];
            }
            
            // Validate new password length
            if (strlen($new_password) < 6) {
                return [
                    'success' => false,
                    'message' => 'New password must be at least 6 characters'
                ];
            }
            
            // Verify current password
            if (!$this->tailorRepo->verifyPassword($tailor_id, $current_password)) {
                return [
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ];
            }
            
            // Hash new password
            $new_password_hash = password_hash($new_password, PASSWORD_BCRYPT);
            
            // Update password
            $result = $this->tailorRepo->updatePassword($tailor_id, $new_password_hash);
            
            if ($result) {
                return [
                    'success' => true,
                    'message' => 'Password changed successfully!'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Failed to change password. Please try again.'
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
     * Get customer profile data
     * @param int $customer_id
     * @return array
     */
    public function getCustomerProfile($customer_id) {
        try {
            $customer = $this->customerRepo->findById($customer_id);
            
            if ($customer) {
                // Remove password from response
                unset($customer['password']);
                
                return [
                    'success' => true,
                    'data' => $customer
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Customer not found'
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
     * Get tailor profile data
     * @param int $tailor_id
     * @return array
     */
    public function getTailorProfile($tailor_id) {
        try {
            $tailor = $this->tailorRepo->findById($tailor_id);
            
            if ($tailor) {
                // Remove password from response
                unset($tailor['password']);
                
                return [
                    'success' => true,
                    'data' => $tailor
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Tailor not found'
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'An error occurred: ' . $e->getMessage()
            ];
        }
    }
}
?>

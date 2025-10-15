<?php
/**
 * ImageUpload Helper Class
 * Handles image uploads, validation, and resizing
 */

class ImageUpload {
    
    private $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    private $max_size = 5242880; // 5MB in bytes
    private $upload_path;
    
    public function __construct($upload_path) {
        $this->upload_path = rtrim($upload_path, '/') . '/';
        
        // Create directory if it doesn't exist
        if (!file_exists($this->upload_path)) {
            mkdir($this->upload_path, 0755, true);
        }
    }
    
    /**
     * Upload and process image
     * @param array $file - $_FILES['field_name']
     * @param string $prefix - filename prefix (e.g., 'customer_', 'shop_')
     * @return array - ['success' => bool, 'filename' => string, 'message' => string]
     */
    public function upload($file, $prefix = '') {
        // Check if file was uploaded
        if (!isset($file['tmp_name']) || empty($file['tmp_name'])) {
            return [
                'success' => false,
                'message' => 'No file uploaded'
            ];
        }
        
        // Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return [
                'success' => false,
                'message' => 'Upload error: ' . $this->getUploadError($file['error'])
            ];
        }
        
        // Validate file type
        $file_type = mime_content_type($file['tmp_name']);
        if (!in_array($file_type, $this->allowed_types)) {
            return [
                'success' => false,
                'message' => 'Invalid file type. Only JPG, PNG, and GIF allowed'
            ];
        }
        
        // Validate file size
        if ($file['size'] > $this->max_size) {
            return [
                'success' => false,
                'message' => 'File too large. Maximum size is 5MB'
            ];
        }
        
        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = $prefix . uniqid() . '_' . time() . '.' . $extension;
        $filepath = $this->upload_path . $filename;
        
        // Resize and save image
        $resize_result = $this->resizeImage($file['tmp_name'], $filepath, 500, 500);
        
        if ($resize_result) {
            return [
                'success' => true,
                'filename' => $filename,
                'message' => 'Image uploaded successfully'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Failed to process image'
            ];
        }
    }
    
    /**
     * Resize image maintaining aspect ratio
     * @param string $source - source file path
     * @param string $destination - destination file path
     * @param int $max_width - maximum width
     * @param int $max_height - maximum height
     * @return bool
     */
    private function resizeImage($source, $destination, $max_width, $max_height) {
        // Get image info
        $image_info = getimagesize($source);
        if (!$image_info) {
            return false;
        }
        
        list($orig_width, $orig_height, $image_type) = $image_info;
        
        // Calculate new dimensions maintaining aspect ratio
        $ratio = min($max_width / $orig_width, $max_height / $orig_height);
        $new_width = round($orig_width * $ratio);
        $new_height = round($orig_height * $ratio);
        
        // Create image resource based on type
        switch ($image_type) {
            case IMAGETYPE_JPEG:
                $source_image = imagecreatefromjpeg($source);
                break;
            case IMAGETYPE_PNG:
                $source_image = imagecreatefrompng($source);
                break;
            case IMAGETYPE_GIF:
                $source_image = imagecreatefromgif($source);
                break;
            default:
                return false;
        }
        
        if (!$source_image) {
            return false;
        }
        
        // Create new image
        $new_image = imagecreatetruecolor($new_width, $new_height);
        
        // Preserve transparency for PNG and GIF
        if ($image_type == IMAGETYPE_PNG || $image_type == IMAGETYPE_GIF) {
            imagealphablending($new_image, false);
            imagesavealpha($new_image, true);
            $transparent = imagecolorallocatealpha($new_image, 255, 255, 255, 127);
            imagefilledrectangle($new_image, 0, 0, $new_width, $new_height, $transparent);
        }
        
        // Resize
        imagecopyresampled(
            $new_image, $source_image,
            0, 0, 0, 0,
            $new_width, $new_height,
            $orig_width, $orig_height
        );
        
        // Save based on type
        $result = false;
        switch ($image_type) {
            case IMAGETYPE_JPEG:
                $result = imagejpeg($new_image, $destination, 90);
                break;
            case IMAGETYPE_PNG:
                $result = imagepng($new_image, $destination, 9);
                break;
            case IMAGETYPE_GIF:
                $result = imagegif($new_image, $destination);
                break;
        }
        
        // Free memory
        imagedestroy($source_image);
        imagedestroy($new_image);
        
        return $result;
    }
    
    /**
     * Delete image file
     * @param string $filename
     * @return bool
     */
    public function delete($filename) {
        if (empty($filename)) {
            return false;
        }
        
        $filepath = $this->upload_path . $filename;
        
        if (file_exists($filepath)) {
            return unlink($filepath);
        }
        
        return false;
    }
    
    /**
     * Get upload error message
     * @param int $error_code
     * @return string
     */
    private function getUploadError($error_code) {
        switch ($error_code) {
            case UPLOAD_ERR_INI_SIZE:
                return 'File exceeds upload_max_filesize in php.ini';
            case UPLOAD_ERR_FORM_SIZE:
                return 'File exceeds MAX_FILE_SIZE in HTML form';
            case UPLOAD_ERR_PARTIAL:
                return 'File was only partially uploaded';
            case UPLOAD_ERR_NO_FILE:
                return 'No file was uploaded';
            case UPLOAD_ERR_NO_TMP_DIR:
                return 'Missing temporary folder';
            case UPLOAD_ERR_CANT_WRITE:
                return 'Failed to write file to disk';
            case UPLOAD_ERR_EXTENSION:
                return 'Upload stopped by extension';
            default:
                return 'Unknown upload error';
        }
    }
}
?>

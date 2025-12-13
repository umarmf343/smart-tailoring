ALTER TABLE `orders` 
ADD COLUMN `start_otp` VARCHAR(6) DEFAULT NULL AFTER `order_status`,
ADD COLUMN `start_otp_verified_at` DATETIME DEFAULT NULL AFTER `start_otp`,
ADD COLUMN `delivery_otp` VARCHAR(6) DEFAULT NULL AFTER `start_otp_verified_at`,
ADD COLUMN `delivery_otp_verified_at` DATETIME DEFAULT NULL AFTER `delivery_otp`;

# OTP Verification System Implementation Summary

## Overview
A "Rapido-style" secure handover protocol has been implemented to ensure trust between customers and tailors. This system requires a 4-digit OTP verification for two critical stages of the order lifecycle:
1. **Start Work**: When the customer drops off the cloth/measurements.
2. **Delivery**: When the customer picks up the finished garment.

## Changes Made

### Database
- Added 4 new columns to the `orders` table:
    - `start_otp` (VARCHAR 4)
    - `start_otp_verified_at` (DATETIME)
    - `delivery_otp` (VARCHAR 4)
    - `delivery_otp_verified_at` (DATETIME)

### Backend Logic
- **Repository (`repositories/OrderRepository.php`)**:
    - Added `generateStartOtp` and `generateDeliveryOtp`.
    - Added `verifyStartOtp` (updates status to `in_progress`).
    - Added `verifyDeliveryOtp` (updates status to `delivered`).
    - Updated `updateStatus` to automatically generate the relevant OTP when status changes to `accepted` or `ready_for_pickup`.
- **Service (`services/OrderService.php`)**:
    - Added `verifyStartOtp` and `verifyDeliveryOtp` methods to handle business logic and validation.
- **API**:
    - Created `api/orders/verify_start_otp.php`.
    - Created `api/orders/verify_delivery_otp.php`.

### Frontend

#### Customer Dashboard (`customer/orders.php`)
- Updated the UI to display the **Start Code** when the order is `accepted`.
- Updated the UI to display the **Delivery Code** when the order is `ready_for_pickup`.
- Added visual cues (icons and colors) to make the codes prominent.

#### Tailor Dashboard (`tailor/orders.php`)
- **Start Work**: Replaced the "Start Cutting" button with a "Verify Start Code" button for `accepted` orders.
- **Delivery**: Replaced the "Mark as Delivered" button with a "Verify Delivery Code" button for `ready_for_pickup` orders.
- **Interaction**: Clicking these buttons prompts the tailor to enter the 4-digit code provided by the customer.
- **Validation**: The system validates the code against the database via the API. If correct, the status updates automatically.

## Workflow
1. **Order Acceptance**: Tailor accepts order -> System generates **Start OTP**.
2. **Drop-off**: Customer visits tailor -> Shows **Start OTP** on their phone.
3. **Verification**: Tailor clicks "Verify Start Code" -> Enters code -> System validates -> Status becomes `in_progress`.
4. **Completion**: Tailor finishes work -> Marks as `ready_for_pickup` -> System generates **Delivery OTP**.
5. **Pickup**: Customer visits tailor -> Shows **Delivery OTP**.
6. **Handover**: Tailor clicks "Verify Delivery Code" -> Enters code -> System validates -> Status becomes `delivered`.

## Testing
- Create a new order as a customer.
- Log in as a tailor and accept the order.
- Check customer dashboard for Start OTP.
- Use "Verify Start Code" on tailor dashboard.
- Complete the work flow until "Ready for Pickup".
- Check customer dashboard for Delivery OTP.
- Use "Verify Delivery Code" on tailor dashboard.

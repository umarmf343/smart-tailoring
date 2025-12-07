/**
 * Tailor Order Enhancements JavaScript
 * Handles enhanced order workflow features for tailors
 * 
 * DEPENDENCIES: order-utils.js must be loaded first
 */

// Use shared order statuses from order-utils.js
const orderStatuses = ORDER_STATUSES;

// Show tailor order details modal
function showTailorOrderDetailsModal(orderId) {
    showOrderModal(orderId, loadTailorOrderDetails);
}

// Load order details for tailor
function loadTailorOrderDetails(orderId) {
    Promise.all([
        fetch(`../api/orders/get_orders.php`).then(r => r.json()),
        fetch(`../api/orders/get_order_history.php?order_id=${orderId}`).then(r => r.json())
    ])
        .then(([ordersData, historyData]) => {
            if (!ordersData.success) {
                throw new Error(ordersData.message || 'Failed to load orders');
            }

            const order = ordersData.orders?.find(o => o.id == orderId);
            if (!order) {
                throw new Error('Order not found');
            }

            const history = historyData.success ? historyData.history : [];
            displayTailorOrderDetails(order, history);
        })
        .catch(error => {
            console.error('Error loading order details:', error);
            document.getElementById('orderDetailsContent').innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ef4444;"></i>
                    <p style="color: #ef4444; font-weight: 600; margin-top: 1rem;">Failed to load order details</p>
                    <p style="color: #6b7280;">${error.message}</p>
                </div>
            `;
        });
}

// Display order details (tailor view)
function displayTailorOrderDetails(order, history) {
    const statusConfig = orderStatuses[order.order_status] || orderStatuses.pending;

    const html = `
        <div class="order-details-container">
            <!-- Order Header -->
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="margin: 0; font-size: 1.5rem;">${order.order_number}</h3>
                        <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Placed on ${formatDateTime(order.created_at)}</p>
                    </div>
                    <div style="background: white; color: ${statusConfig.color}; padding: 0.75rem 1.5rem; border-radius: 50px; font-weight: 700;">
                        <i class="fas fa-${statusConfig.icon}"></i> ${statusConfig.label}
                    </div>
                </div>
            </div>
            
            <!-- Order Status Timeline -->
            <div style="margin-bottom: 2rem;">
                <h3><i class="fas fa-route"></i> Order Progress</h3>
                ${createStatusTimeline(order.order_status)}
            </div>
            
            <!-- Order Information Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                <!-- Order Details -->
                <div>
                    <h3><i class="fas fa-info-circle"></i> Order Information</h3>
                    <div style="background: #f9fafb; padding: 1rem; border-radius: 8px;">
                        ${createDetailRow('Service Type', order.service_type)}
                        ${createDetailRow('Garment Type', order.garment_type)}
                        ${createDetailRow('Quantity', order.quantity)}
                        ${order.measurements ? createDetailRow('Measurements', order.measurements) : ''}
                        
                        ${order.measurements_snapshot ? `
                            <div style="background: #dbeafe; border-left: 3px solid #2563eb; padding: 0.75rem; margin: 0.5rem 0; border-radius: 4px;">
                                <strong style="color: #1e3a8a;"><i class="fas fa-ruler-combined"></i> Customer Provided Measurements:</strong>
                                <div style="margin-top: 0.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                                    ${formatMeasurementsSnapshot(order.measurements_snapshot)}
                                </div>
                            </div>
                        ` : ''}
                        
                        ${order.measurement_notes ? `
                            <div style="background: #e0f2fe; border-left: 3px solid #0284c7; padding: 0.75rem; margin: 0.5rem 0; border-radius: 4px;">
                                <strong style="color: #075985;"><i class="fas fa-sticky-note"></i> Measurement Notes:</strong>
                                <p style="margin: 0.25rem 0 0 0; color: #0c4a6e; font-style: italic;">${order.measurement_notes}</p>
                            </div>
                        ` : ''}
                        
                        ${createDetailRow('Estimated Price', '₹' + (order.estimated_price || 'TBD'))}
                        ${order.final_price ? createDetailRow('Final Price', '₹' + order.final_price) : ''}
                        ${order.delivery_date ? createDetailRow('Expected Delivery', formatDate(order.delivery_date)) : ''}
                        ${order.deadline ? createDetailRow('Deadline', formatDate(order.deadline)) : ''}
                        ${order.first_fitting_date ? createDetailRow('First Fitting Date', formatDate(order.first_fitting_date)) : ''}
                        ${order.final_fitting_date ? createDetailRow('Final Fitting Date', formatDate(order.final_fitting_date)) : ''}
                        ${order.fabric_type ? createDetailRow('Fabric Type', order.fabric_type) : ''}
                        ${order.fabric_color ? createDetailRow('Fabric Color', `${order.fabric_color} <span style="display: inline-block; width: 20px; height: 20px; background-color: ${order.fabric_color}; border: 1px solid #ccc; border-radius: 3px; margin-left: 8px; vertical-align: middle;"></span>`) : ''}
                        ${order.deposit_amount && order.deposit_amount > 0 ? createDetailRow('Deposit', '₹' + order.deposit_amount) : ''}
                        ${order.balance_due && order.balance_due > 0 ? createDetailRow('Balance Due', '₹' + order.balance_due) : ''}
                        ${order.payment_status ? createDetailRow('Payment Status', order.payment_status.toUpperCase()) : ''}
                    </div>
                </div>
                
                <!-- Customer Details -->
                <div>
                    <h3><i class="fas fa-user"></i> Customer Information</h3>
                    <div style="background: #f9fafb; padding: 1rem; border-radius: 8px;">
                        ${createDetailRow('Customer Name', order.customer_name)}
                        ${createDetailRow('Contact', order.customer_phone)}
                        ${order.customer_address ? createDetailRow('Address', order.customer_address) : ''}
                        ${order.customer_email ? createDetailRow('Email', order.customer_email) : ''}
                    </div>
                    
                    ${order.special_instructions ? `
                        <div style="margin-top: 1rem;">
                            <h4><i class="fas fa-sticky-note"></i> Special Instructions</h4>
                            <div style="background: #fffbeb; border-left: 3px solid #f59e0b; padding: 1rem; border-radius: 4px;">
                                <p style="margin: 0; color: #78350f;">${order.special_instructions}</p>
                            </div>
                        </div>
                    ` : ''}
                    
                    ${order.deadline ? `
                        <div style="margin-top: 1rem; background: #fee2e2; border-left: 3px solid #ef4444; padding: 1rem; border-radius: 4px;">
                            <p style="margin: 0; color: #991b1b; font-weight: 600;">
                                <i class="fas fa-exclamation-triangle"></i> Deadline: ${formatDate(order.deadline)}
                            </p>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Order History -->
            <div style="margin-bottom: 2rem;">
                <h3><i class="fas fa-history"></i> Order History</h3>
                <div style="background: #f9fafb; padding: 1rem; border-radius: 8px;">
                    ${createHistoryTimeline(history)}
                </div>
            </div>
            
            <!-- Action Buttons (Tailor-specific) -->
            <div style="margin-bottom: 1.5rem;">
                <h3><i class="fas fa-tasks"></i> Update Status</h3>
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                    ${canUpdateToStatus(order.order_status, 'booked') ? `
                        <button onclick="updateTailorOrderStatus(${order.id}, 'booked')" class="status-btn">
                            <i class="fas fa-check-circle"></i> Accept Order
                        </button>
                    ` : ''}
                    
                    ${canUpdateToStatus(order.order_status, 'cutting') ? `
                        <button onclick="updateTailorOrderStatus(${order.id}, 'cutting')" class="status-btn">
                            <i class="fas fa-cut"></i> Start Cutting
                        </button>
                    ` : ''}
                    
                    ${canUpdateToStatus(order.order_status, 'stitching') ? `
                        <button onclick="updateTailorOrderStatus(${order.id}, 'stitching')" class="status-btn">
                            <i class="fas fa-sewing-machine"></i> Start Stitching
                        </button>
                    ` : ''}
                    
                    ${canUpdateToStatus(order.order_status, 'first_fitting') ? `
                        <button onclick="updateTailorOrderStatus(${order.id}, 'first_fitting')" class="status-btn">
                            <i class="fas fa-user-check"></i> First Fitting
                        </button>
                    ` : ''}
                    
                    ${canUpdateToStatus(order.order_status, 'alterations') ? `
                        <button onclick="updateTailorOrderStatus(${order.id}, 'alterations')" class="status-btn">
                            <i class="fas fa-tools"></i> Alterations
                        </button>
                    ` : ''}
                    
                    ${canUpdateToStatus(order.order_status, 'final_fitting') ? `
                        <button onclick="updateTailorOrderStatus(${order.id}, 'final_fitting')" class="status-btn">
                            <i class="fas fa-user-tie"></i> Final Fitting
                        </button>
                    ` : ''}
                    
                    ${canUpdateToStatus(order.order_status, 'ready_for_pickup') ? `
                        <button onclick="updateTailorOrderStatus(${order.id}, 'ready_for_pickup')" class="status-btn">
                            <i class="fas fa-box-open"></i> Ready for Pickup
                        </button>
                    ` : ''}
                    
                    ${canUpdateToStatus(order.order_status, 'delivered') ? `
                        <button onclick="updateTailorOrderStatus(${order.id}, 'delivered')" class="status-btn">
                            <i class="fas fa-truck"></i> Mark Delivered
                        </button>
                    ` : ''}
                    
                    ${canCancelOrder(order.order_status) ? `
                        <button onclick="cancelTailorOrder(${order.id})" style="
                            background: linear-gradient(135deg, #ef4444, #dc2626);
                            color: white;
                            border: none;
                            padding: 0.75rem 1.5rem;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                        ">
                            <i class="fas fa-times-circle"></i> Cancel Order
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
        
        <style>
            .status-btn {
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            .status-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
            }
        </style>
    `;

    document.getElementById('orderDetailsContent').innerHTML = html;
}

// Tailor-specific functions

// Check if tailor can update to a specific status
function canUpdateToStatus(currentStatus, targetStatus) {
    const statusOrder = {
        'pending': 1,
        'booked': 2,
        'cutting': 3,
        'stitching': 4,
        'first_fitting': 5,
        'alterations': 6,
        'final_fitting': 7,
        'ready_for_pickup': 8,
        'delivered': 9,
        'completed': 10,
        'cancelled': 11
    };

    const current = statusOrder[currentStatus];
    const target = statusOrder[targetStatus];

    // Can't update cancelled or completed orders
    if (currentStatus === 'cancelled' || currentStatus === 'completed') {
        return false;
    }

    // Can only move forward in the workflow
    return target === current + 1;
}

// Update order status (tailor action)
function updateTailorOrderStatus(orderId, newStatus) {
    const formData = new FormData();
    formData.append('order_id', orderId);
    formData.append('status', newStatus);

    fetch('../api/orders/update_status.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Order status updated successfully!');
                closeOrderDetailsModal();
                if (typeof loadTailorOrders === 'function') loadTailorOrders();
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to update order status');
        });
}

// Cancel order (tailor action)
function cancelTailorOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order? The customer will be notified.')) return;

    const formData = new FormData();
    formData.append('order_id', orderId);
    formData.append('status', 'cancelled');

    fetch('../api/orders/update_status.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Order cancelled successfully');
                closeOrderDetailsModal();
                if (typeof loadTailorOrders === 'function') loadTailorOrders();
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to cancel order');
        });
}

// Wrapper function for compatibility
function viewTailorOrderDetails(orderId) {
    showTailorOrderDetailsModal(orderId);
}

// Format measurements snapshot JSON into readable display
function formatMeasurementsSnapshot(snapshotData) {
    try {
        const measurements = typeof snapshotData === 'string' ? JSON.parse(snapshotData) : snapshotData;

        return Object.entries(measurements)
            .map(([key, value]) => {
                const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                return `<div style="color: #1e40af;"><strong>${label}:</strong> ${value}"</div>`;
            })
            .join('');
    } catch (e) {
        return `<div style="color: #1e40af;">${snapshotData}</div>`;
    }
}

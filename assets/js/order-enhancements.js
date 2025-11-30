/**
 * Order Enhancements JavaScript - Customer View
 * Handles enhanced order workflow features for customers
 * 
 * DEPENDENCIES: order-utils.js must be loaded first
 */

// Use shared order statuses from order-utils.js
const orderStatuses = ORDER_STATUSES;

// Show order details modal with enhanced features
function showOrderDetailsModal(orderId) {
    showOrderModal(orderId, loadCustomerOrderDetails);
}

// Load order details for customer
function loadCustomerOrderDetails(orderId) {
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
            displayCustomerOrderDetails(order, history);
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

// Display order details (customer view)
function displayCustomerOrderDetails(order, history) {
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
                        ${createDetailRow('Estimated Price', '₹' + (order.estimated_price || 'TBD'))}
                        ${order.final_price ? createDetailRow('Final Price', '₹' + order.final_price) : ''}
                        ${order.fabric_type ? createDetailRow('Fabric Type', order.fabric_type) : ''}
                        ${order.fabric_color ? createDetailRow('Fabric Color', `${order.fabric_color} <span style="display: inline-block; width: 20px; height: 20px; background-color: ${order.fabric_color}; border: 1px solid #ccc; border-radius: 3px; margin-left: 8px; vertical-align: middle;"></span>`) : ''}
                        ${order.deadline ? createDetailRow('Deadline', formatDate(order.deadline)) : ''}
                        ${order.deposit_amount ? createDetailRow('Deposit', '₹' + order.deposit_amount) : ''}
                        ${order.balance_due ? createDetailRow('Balance Due', '₹' + order.balance_due) : ''}
                    </div>
                </div>
                
                <!-- Tailor Details -->
                <div>
                    <h3><i class="fas fa-user-tie"></i> Tailor Information</h3>
                    <div style="background: #f9fafb; padding: 1rem; border-radius: 8px;">
                        ${createDetailRow('Shop Name', order.tailor_shop_name || order.tailor_name)}
                        ${createDetailRow('Contact', order.tailor_phone)}
                        ${order.tailor_email ? createDetailRow('Email', order.tailor_email) : ''}
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
                        <div style="margin-top: 1rem; background: #dbeafe; border-left: 3px solid #3b82f6; padding: 1rem; border-radius: 4px;">
                            <p style="margin: 0; color: #1e40af; font-weight: 600;">
                                <i class="fas fa-clock"></i> Expected by: ${formatDate(order.deadline)}
                            </p>
                            <p style="margin: 0.5rem 0 0 0; color: #1e3a8a; font-size: 0.875rem;">
                                <i class="fas fa-info-circle"></i> <strong>Note:</strong> Please contact the tailor before this date if you need any changes to your garment.
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
            
            <!-- Action Buttons -->
            <div style="display: flex; gap: 1rem; justify-content: flex-end; flex-wrap: wrap;">
                ${canCancelOrder(order.order_status) ? `
                    <button onclick="cancelOrderFromModal(${order.id})" style="
                        background: linear-gradient(135deg, #ef4444, #dc2626);
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.3s ease;
                    ">
                        <i class="fas fa-times-circle"></i> Cancel Order
                    </button>
                ` : ''}
                
                ${canConfirmDelivery(order.order_status) ? `
                    <button onclick="confirmDelivery(${order.id})" style="
                        background: linear-gradient(135deg, #10b981, #059669);
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.3s ease;
                    ">
                        <i class="fas fa-check-circle"></i> Confirm Receipt
                    </button>
                ` : ''}
                
                ${canMarkComplete(order.order_status) ? `
                    <button onclick="markOrderComplete(${order.id})" style="
                        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.3s ease;
                    ">
                        <i class="fas fa-star"></i> Mark as Complete
                    </button>
                ` : ''}
                
                ${canReorder(order.order_status) ? `
                    <button onclick="reorderFromModal(${order.id})" style="
                        background: linear-gradient(135deg, #3b82f6, #2563eb);
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.3s ease;
                    ">
                        <i class="fas fa-redo"></i> Reorder
                    </button>
                ` : ''}
            </div>
        </div>
    `;

    document.getElementById('orderDetailsContent').innerHTML = html;
}

// Customer-specific action functions
function cancelOrderFromModal(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) return;

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
                if (typeof loadOrders === 'function') loadOrders();
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to cancel order');
        });
}

function confirmDelivery(orderId) {
    const formData = new FormData();
    formData.append('order_id', orderId);
    formData.append('status', 'delivered');

    fetch('../api/orders/update_status.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Delivery confirmed!');
                closeOrderDetailsModal();
                if (typeof loadOrders === 'function') loadOrders();
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to confirm delivery');
        });
}

function markOrderComplete(orderId) {
    const formData = new FormData();
    formData.append('order_id', orderId);
    formData.append('status', 'completed');

    fetch('../api/orders/update_status.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Order marked as completed!');
                closeOrderDetailsModal();
                if (typeof loadOrders === 'function') loadOrders();
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to mark order as complete');
        });
}

function reorderFromModal(orderId) {
    // Placeholder for reorder functionality
    alert('Reorder functionality coming soon!');
}

// Update the viewOrderDetails function in orders.php
function viewOrderDetails(orderId) {
    showOrderDetailsModal(orderId);
}

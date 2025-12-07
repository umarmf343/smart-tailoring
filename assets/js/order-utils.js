/**
 * Order Utilities - Shared Functions
 * Common order-related functions used across customer and tailor interfaces
 */

// Order status configurations (shared)
const ORDER_STATUSES = {
    'pending': { label: 'Pending', icon: 'clock', color: '#fbbf24', order: 1 },
    'booked': { label: 'Booked', icon: 'check-circle', color: '#60a5fa', order: 2 },
    'cutting': { label: 'Cutting', icon: 'cut', color: '#a78bfa', order: 3 },
    'stitching': { label: 'Stitching', icon: 'sewing-machine', color: '#8b5cf6', order: 4 },
    'first_fitting': { label: 'First Fitting', icon: 'user-check', color: '#ec4899', order: 5 },
    'alterations': { label: 'Alterations', icon: 'tools', color: '#f97316', order: 6 },
    'final_fitting': { label: 'Final Fitting', icon: 'user-tie', color: '#06b6d4', order: 7 },
    'ready_for_pickup': { label: 'Ready for Pickup', icon: 'box-open', color: '#10b981', order: 8 },
    'delivered': { label: 'Delivered', icon: 'truck', color: '#059669', order: 9 },
    'completed': { label: 'Completed', icon: 'check-double', color: '#22c55e', order: 10 },
    'cancelled': { label: 'Cancelled', icon: 'times-circle', color: '#ef4444', order: 11 }
};

/**
 * Get mobile responsive styles for order modal
 */
function getOrderModalStyles() {
    return `
        <style>
            @media (max-width: 768px) {
                #orderDetailsModal {
                    padding: 0.5rem !important;
                }
                
                #orderDetailsModal .modal-content {
                    width: 100% !important;
                    max-width: 100% !important;
                    border-radius: 8px !important;
                    max-height: 95vh !important;
                }
                
                #orderDetailsModal .modal-header {
                    padding: 1rem !important;
                }
                
                #orderDetailsModal .modal-header h2 {
                    font-size: 1.2rem !important;
                    padding-right: 2rem;
                }
                
                #orderDetailsModal .modal-header .close-modal {
                    width: 32px !important;
                    height: 32px !important;
                    right: 1rem !important;
                    top: 1rem !important;
                    font-size: 1.2rem !important;
                }
                
                #orderDetailsContent {
                    padding: 1rem !important;
                }
                
                .order-details-container > div[style*="grid-template-columns: 1fr 1fr"] {
                    grid-template-columns: 1fr !important;
                    gap: 1rem !important;
                }
                
                .order-details-container > div[style*="display: flex"] > div:first-child {
                    flex-direction: column !important;
                    gap: 1rem !important;
                }
                
                .order-details-container > div[style*="display: flex"] > div > div:last-child {
                    width: 100% !important;
                    text-align: center !important;
                    padding: 0.5rem 1rem !important;
                    font-size: 0.9rem !important;
                }
                
                .order-details-container h3 {
                    font-size: 1rem !important;
                    margin-bottom: 0.75rem !important;
                }
                
                .order-details-container > div[style*="display: flex; justify-content: space-between; align-items: center"] {
                    overflow-x: auto !important;
                    -webkit-overflow-scrolling: touch !important;
                    padding-bottom: 0.5rem !important;
                }
                
                .order-details-container > div[style*="display: flex; justify-content: space-between; align-items: center"] > div {
                    min-width: 60px !important;
                }
                
                .order-details-container > div[style*="display: flex; justify-content: space-between; align-items: center"] > div > div:first-child {
                    width: 32px !important;
                    height: 32px !important;
                    font-size: 0.85rem !important;
                }
                
                .order-details-container > div[style*="display: flex; justify-content: space-between; align-items: center"] > div > span {
                    font-size: 0.65rem !important;
                }
                
                .order-details-container > div[style*="display: flex; justify-content: space-between; align-items: center"] > div[style*="flex: 1"] {
                    margin: 0 0.25rem 1.5rem 0.25rem !important;
                }
                
                .order-details-container > div:last-child[style*="display: flex"] {
                    flex-direction: column !important;
                    gap: 0.75rem !important;
                }
                
                .order-details-container > div:last-child[style*="display: flex"] > button {
                    width: 100% !important;
                    margin: 0 !important;
                }
            }
        </style>
    `;
}

/**
 * Create modal container HTML
 */
function createOrderModalHTML() {
    return `
        <div id="orderDetailsModal" style="
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            overflow-y: auto;
            padding: 2rem;
        ">
            <div class="modal-content" style="
                background: white;
                max-width: 900px;
                margin: 0 auto;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                position: relative;
                max-height: 90vh;
                overflow-y: auto;
            ">
                <div class="modal-header" style="
                    background: linear-gradient(135deg, #58d1f9, #4ba282);
                    color: white;
                    padding: 1.5rem;
                    border-radius: 12px 12px 0 0;
                    position: sticky;
                    top: 0;
                    z-index: 1;
                ">
                    <h2 style="margin: 0; font-size: 1.5rem;">Order Details</h2>
                    <button class="close-modal" onclick="closeOrderDetailsModal()" style="
                        position: absolute;
                        right: 1.5rem;
                        top: 1.5rem;
                        background: rgba(255, 255, 255, 0.2);
                        border: none;
                        color: white;
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 1.5rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.3s ease;
                    ">×</button>
                </div>
                <div id="orderDetailsContent" style="padding: 2rem;">
                    <div style="text-align: center; padding: 2rem;">
                        <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary-color);"></i>
                        <p style="margin-top: 1rem; color: var(--text-light);">Loading order details...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create detail row HTML
 */
function createDetailRow(label, value) {
    return `
        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f0f0f0;">
            <span style="color: #6b7280; font-weight: 500;">${label}:</span>
            <span style="color: #111827; font-weight: 600;">${value}</span>
        </div>
    `;
}

/**
 * Format status with badge
 */
function formatStatus(status) {
    const statusConfig = ORDER_STATUSES[status] || ORDER_STATUSES['pending'];
    return `
        <span style="
            background: ${statusConfig.color}20;
            color: ${statusConfig.color};
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        ">
            <i class="fas fa-${statusConfig.icon}"></i>
            ${statusConfig.label}
        </span>
    `;
}

/**
 * Format date
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format date and time
 */
function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Create status timeline
 */
function createStatusTimeline(currentStatus) {
    const statuses = Object.entries(ORDER_STATUSES)
        .filter(([key]) => key !== 'cancelled')
        .sort((a, b) => a[1].order - b[1].order);

    const currentOrder = ORDER_STATUSES[currentStatus]?.order || 0;

    let html = '<div style="display: flex; justify-content: space-between; align-items: center; margin: 2rem 0; position: relative;">';

    statuses.forEach(([key, config], index) => {
        const isActive = config.order <= currentOrder;
        const isCurrent = key === currentStatus;

        html += `
            <div style="text-align: center; position: relative; z-index: 2;">
                <div style="
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: ${isActive ? config.color : '#e5e7eb'};
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 0.5rem;
                    font-size: 1.1rem;
                    ${isCurrent ? 'box-shadow: 0 0 0 4px ' + config.color + '30;' : ''}
                ">
                    <i class="fas fa-${config.icon}"></i>
                </div>
                <span style="
                    font-size: 0.75rem;
                    color: ${isActive ? config.color : '#9ca3af'};
                    font-weight: ${isCurrent ? '700' : '500'};
                    display: block;
                ">${config.label}</span>
            </div>
        `;

        if (index < statuses.length - 1) {
            const nextActive = ORDER_STATUSES[statuses[index + 1][0]]?.order <= currentOrder;
            html += `
                <div style="
                    flex: 1;
                    height: 2px;
                    background: ${nextActive ? config.color : '#e5e7eb'};
                    margin: 0 0.5rem 1.5rem 0.5rem;
                    position: relative;
                    top: -20px;
                "></div>
            `;
        }
    });

    html += '</div>';
    return html;
}

/**
 * Create history timeline
 */
function createHistoryTimeline(history) {
    if (!history || history.length === 0) {
        return '<p style="color: #9ca3af; text-align: center; padding: 1rem;">No status history available</p>';
    }

    let html = '<div style="margin-top: 1rem;">';

    history.forEach((entry, index) => {
        const statusConfig = ORDER_STATUSES[entry.status] || ORDER_STATUSES['pending'];
        const isLast = index === history.length - 1;

        html += `
            <div style="display: flex; gap: 1rem; position: relative; padding-bottom: ${isLast ? '0' : '1.5rem'};">
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        background: ${statusConfig.color};
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.9rem;
                    ">
                        <i class="fas fa-${statusConfig.icon}"></i>
                    </div>
                    ${!isLast ? `
                        <div style="
                            flex: 1;
                            width: 2px;
                            background: #e5e7eb;
                            margin-top: 0.5rem;
                            min-height: 30px;
                        "></div>
                    ` : ''}
                </div>
                <div style="flex: 1; padding-bottom: 0.5rem;">
                    <div style="
                        background: ${statusConfig.color}10;
                        border-left: 3px solid ${statusConfig.color};
                        padding: 1rem;
                        border-radius: 0 8px 8px 0;
                    ">
                        <div style="font-weight: 600; color: ${statusConfig.color}; margin-bottom: 0.25rem;">
                            ${statusConfig.label}
                        </div>
                        <div style="font-size: 0.875rem; color: #6b7280;">
                            ${formatDateTime(entry.changed_at)}
                        </div>
                        ${entry.notes ? `
                            <div style="margin-top: 0.5rem; font-size: 0.875rem; color: #4b5563;">
                                <i class="fas fa-comment-dots"></i> ${entry.notes}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    return html;
}

/**
 * Check if order can be cancelled
 */
function canCancelOrder(status) {
    return ['pending', 'booked'].includes(status);
}

/**
 * Check if order can be reordered
 */
function canReorder(status) {
    return ['completed', 'cancelled'].includes(status);
}

/**
 * Check if delivery can be confirmed
 */
function canConfirmDelivery(status) {
    return status === 'ready_for_pickup' || status === 'delivered';
}

/**
 * Check if order can be marked complete
 */
function canMarkComplete(status) {
    return status === 'delivered';
}

/**
 * Close order details modal
 */
function closeOrderDetailsModal() {
    const modal = document.getElementById('orderDetailsModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * Show order details modal (base function)
 */
function showOrderModal(orderId, loadFunction) {
    // Check if modal exists, if not create it
    let modal = document.getElementById('orderDetailsModal');
    if (!modal) {
        document.body.insertAdjacentHTML('beforeend', getOrderModalStyles() + createOrderModalHTML());
        modal = document.getElementById('orderDetailsModal');
    }

    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Load order details
    loadFunction(orderId);
}

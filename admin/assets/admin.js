// Admin Panel JavaScript
// Smart Tailoring Service

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Confirm actions
function confirmAction(message = 'Are you sure you want to perform this action?') {
    return confirm(message);
}

// Show toast notification
function showToast(message, type = 'info') {
    // Simple alert for now - can be enhanced with a toast library
    alert(message);
}

// Format currency
function formatCurrency(amount) {
    return '₹' + parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Console log for debugging
console.log('Admin panel initialized');

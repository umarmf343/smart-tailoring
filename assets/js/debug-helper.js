/**
 * Debug Helper
 * Conditional logging based on environment
 */

// Check if we're in development mode
const isDevelopment = () => {
    return window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('local');
};

// Development-only console.log
window.devLog = (...args) => {
    if (isDevelopment()) {
        console.log(...args);
    }
};

// Development-only console.error  
window.devError = (...args) => {
    if (isDevelopment()) {
        console.error(...args);
    }
};

// Always log errors in production (but don't expose details)
window.logError = (message, error) => {
    if (isDevelopment()) {
        console.error(message, error);
    } else {
        // In production, just log the message
        console.error(message);
        // Optionally send to error tracking service
        // sendToErrorTracker(message, error);
    }
};

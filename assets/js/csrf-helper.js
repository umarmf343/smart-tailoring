// Global CSRF Token Helper
// Include this in pages that make AJAX requests

/**
 * Get CSRF token from meta tag or generate new one
 */
function getCSRFToken() {
    // Try to get from meta tag first
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
        return metaTag.getAttribute('content');
    }

    // Try to get from hidden input
    const hiddenInput = document.querySelector('input[name="csrf_token"]');
    if (hiddenInput) {
        return hiddenInput.value;
    }

    // Try to get from PHP variable
    if (typeof window.csrfToken !== 'undefined') {
        return window.csrfToken;
    }

    return null;
}

/**
 * Add CSRF token to FormData
 */
function addCSRFToFormData(formData) {
    const token = getCSRFToken();
    if (token) {
        formData.append('csrf_token', token);
    }
    return formData;
}

/**
 * Add CSRF token to fetch headers
 */
function getSecureFetchOptions(options = {}) {
    const token = getCSRFToken();

    if (!options.headers) {
        options.headers = {};
    }

    if (token) {
        options.headers['X-CSRF-Token'] = token;
    }

    return options;
}

/**
 * Secure fetch wrapper with CSRF token
 */
function secureFetch(url, options = {}) {
    return fetch(url, getSecureFetchOptions(options));
}

/**
 * Initialize CSRF protection for all forms
 */
document.addEventListener('DOMContentLoaded', function () {
    // Add CSRF token to all AJAX form submissions
    const forms = document.querySelectorAll('form[data-ajax="true"]');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            addCSRFToFormData(formData);

            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
            }

            fetch(this.action, {
                method: this.method || 'POST',
                body: formData,
                headers: {
                    'X-CSRF-Token': getCSRFToken()
                }
            })
                .then(response => response.json())
                .then(data => {
                    // Handle response
                    if (data.success) {
                        if (this.dataset.successCallback) {
                            window[this.dataset.successCallback](data);
                        }
                    } else {
                        if (this.dataset.errorCallback) {
                            window[this.dataset.errorCallback](data);
                        }
                    }
                })
                .catch(error => {
                    console.error('Form submission error:', error);
                })
                .finally(() => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                    }
                });
        });
    });
});

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCSRFToken,
        addCSRFToFormData,
        getSecureFetchOptions,
        secureFetch
    };
}

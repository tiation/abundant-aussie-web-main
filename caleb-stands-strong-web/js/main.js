// Main JavaScript for Caleb Stands Strong Website
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeContactForm();
    initializeScheduleButtons();
    initializeEmergencyModal();
    initializeSmoothScrolling();
    showToast('Welcome! If you need immediate help, emergency support is available 24/7.', 'info', 5000);
});

// Navigation functionality
function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('show');
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
            }
        });
    }
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(contactForm);
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    message: formData.get('message'),
                    timestamp: new Date().toISOString(),
                    source: 'calebstandsstrong.com.au'
                };
                
                // For now, simulate form submission (replace with actual endpoint)
                await simulateFormSubmission(data);
                
                // Success
                showToast('Thank you! Your message has been sent. Caleb will get back to you soon.', 'success');
                contactForm.reset();
                
                // Send confirmation email (if service is available)
                await sendConfirmationEmail(data.email, data.name);
                
            } catch (error) {
                console.error('Form submission error:', error);
                showToast('Sorry, there was an error sending your message. Please try calling directly.', 'error');
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Schedule call buttons functionality
function initializeScheduleButtons() {
    const scheduleButtons = document.querySelectorAll('#schedule-call-btn, #schedule-call-main, button:contains("Schedule Call")');
    
    scheduleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Open scheduling modal or redirect to booking system
            openSchedulingModal();
        });
    });
}

function openSchedulingModal() {
    // Create and show scheduling modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 class="text-xl font-bold mb-4 text-blue-600">Schedule a Call with Caleb</h3>
            <p class="mb-4 text-gray-600">Choose how you'd like to schedule your call:</p>
            <div class="space-y-3">
                <a href="tel:+61400000000" class="block bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    <i class="fas fa-phone mr-2"></i>Call Now: 0400 000 000
                </a>
                <a href="mailto:caleb@calebstandsstrong.com.au?subject=Schedule%20Call%20Request&body=Hi%20Caleb,%0A%0AI'd%20like%20to%20schedule%20a%20call.%20My%20preferred%20times%20are:%0A%0A-%20[Please%20list%20your%20preferred%20times]%0A%0AThank%20you!" 
                   class="block bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition-colors">
                    <i class="fas fa-envelope mr-2"></i>Email to Schedule
                </a>
                <button onclick="window.open('https://calendly.com/caleb-stands-strong', '_blank')" 
                        class="block w-full bg-purple-600 text-white text-center py-3 rounded-lg hover:bg-purple-700 transition-colors">
                    <i class="fas fa-calendar mr-2"></i>Online Booking
                </button>
            </div>
            <button id="close-schedule-modal" class="w-full mt-4 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('#close-schedule-modal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Emergency modal functionality
function initializeEmergencyModal() {
    // Auto-show emergency modal for high-risk indicators
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('emergency') === 'true' || 
        urlParams.get('crisis') === 'true' || 
        document.referrer.includes('crisis') ||
        document.referrer.includes('suicide')) {
        showEmergencyModal();
    }
    
    // Add emergency trigger keywords
    const emergencyKeywords = ['crisis', 'emergency', 'suicide', 'harm', 'danger'];
    
    // Monitor for emergency-related activity
    document.addEventListener('keyup', function(e) {
        const value = e.target.value ? e.target.value.toLowerCase() : '';
        if (emergencyKeywords.some(keyword => value.includes(keyword))) {
            showEmergencyBanner();
        }
    });
}

function showEmergencyModal() {
    const modal = document.getElementById('emergency-modal');
    if (modal) {
        modal.classList.remove('hidden');
        
        const closeBtn = document.getElementById('close-emergency-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }
}

function showEmergencyBanner() {
    const banner = document.getElementById('emergency-banner');
    if (banner) {
        banner.style.animation = 'pulse-red 1s infinite';
        banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = 120; // Account for fixed header
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility functions
async function simulateFormSubmission(data) {
    try {
        // Create mailto link for contact form submission
        const subject = encodeURIComponent(`Contact Form Submission from ${data.name}`);
        const body = encodeURIComponent(
            `Name: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Phone: ${data.phone || 'Not provided'}\n\n` +
            `Message:\n${data.message}\n\n` +
            `Submitted: ${data.timestamp}\n` +
            `Source: ${data.source}`
        );
        
        const mailtoLink = `mailto:caleb@calebstandsstrong.com.au?subject=${subject}&body=${body}`;
        
        // Try to open email client
        window.open(mailtoLink);
        
        console.log('Contact form data:', data);

        return { success: true, method: 'email' };
    } catch (error) {
        console.error('Contact form submission error:', error);
        throw error;
    }
}

async function sendConfirmationEmail(email, name) {
    try {
        // In production, call your email service
        console.log(`Sending confirmation email to ${email} for ${name}`);
        return { sent: true };
    } catch (error) {
        console.error('Failed to send confirmation email:', error);
        return { sent: false };
    }
}

function showToast(message, type = 'info', duration = 4000) {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : type === 'success' ? '' : 'bg-blue-600'}`;
    
    // Add appropriate icon
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle mr-2"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-triangle mr-2"></i>';
            break;
        case 'info':
            icon = '<i class="fas fa-info-circle mr-2"></i>';
            toast.className = toast.className.replace('error', '') + ' bg-blue-600';
            break;
    }
    
    toast.innerHTML = `
        <div class="flex items-center">
            ${icon}
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);
    }
}

// Privacy and compliance functions
function trackUserConsent() {
    const consent = localStorage.getItem('user-consent');
    if (!consent) {
        showConsentBanner();
    }
}

function showConsentBanner() {
    const banner = document.createElement('div');
    banner.className = 'fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-40';
    banner.innerHTML = `
        <div class="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-sm">
                We use cookies and collect minimal data to improve your experience and provide better support. 
                <a href="#privacy" class="underline hover:text-gray-300">Learn more</a>
            </p>
            <div class="flex gap-2">
                <button id="accept-consent" class="bg-blue-600 px-4 py-2 rounded text-sm hover:bg-blue-700">
                    Accept
                </button>
                <button id="decline-consent" class="bg-gray-600 px-4 py-2 rounded text-sm hover:bg-gray-700">
                    Decline
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(banner);
    
    document.getElementById('accept-consent').addEventListener('click', () => {
        localStorage.setItem('user-consent', JSON.stringify({
            accepted: true,
            timestamp: new Date().toISOString()
        }));
        banner.remove();
    });
    
    document.getElementById('decline-consent').addEventListener('click', () => {
        localStorage.setItem('user-consent', JSON.stringify({
            accepted: false,
            timestamp: new Date().toISOString()
        }));
        banner.remove();
    });
}

// Error handling and monitoring
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    
    // In production, send to monitoring service
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            description: event.error?.message || 'Unknown error',
            fatal: false
        });
    }
});

// Performance monitoring
window.addEventListener('load', function() {
    // Measure page load time
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    
    // Track core web vitals (if supported)
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log(`${entry.name}: ${entry.value}`);
                }
            });
            observer.observe({ entryTypes: ['measure', 'navigation'] });
        } catch (e) {
            console.log('Performance observer not supported');
        }
    }
});

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Escape key closes modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.fixed.inset-0:not(.hidden)');
        modals.forEach(modal => {
            if (modal.id === 'emergency-modal') {
                modal.classList.add('hidden');
            } else if (modal.parentElement) {
                modal.remove();
            }
        });
    }
});

// Initialize consent tracking
setTimeout(trackUserConsent, 2000);

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showToast,
        openSchedulingModal,
        showEmergencyModal,
        simulateFormSubmission
    };
}

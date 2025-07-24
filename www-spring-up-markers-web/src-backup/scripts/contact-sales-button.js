/**
 * Enhanced Contact Sales Button JavaScript
 * Enterprise-grade functionality with improved user engagement
 */

class ContactSalesButton {
  constructor() {
    this.floatingButton = null;
    this.scrollThreshold = 300;
    this.isVisible = false;
    this.clickTrackingEnabled = true;
    
    this.init();
  }

  init() {
    this.createFloatingButton();
    this.attachEventListeners();
    this.handleScrollVisibility();
    this.addPulseAnimation();
  }

  /**
   * Create floating contact sales button
   */
  createFloatingButton() {
    // Check if floating button already exists
    if (document.querySelector('.contact-sales-floating')) return;

    const floatingBtn = document.createElement('a');
    floatingBtn.href = '#contact-sales';
    floatingBtn.className = 'contact-sales-btn contact-sales-floating contact-sales-btn--with-icon contact-sales-btn--pulse';
    floatingBtn.innerHTML = 'Contact Sales';
    floatingBtn.setAttribute('aria-label', 'Contact our sales team');
    floatingBtn.setAttribute('data-action', 'floating-contact-sales');

    // Initially hide the button
    floatingBtn.style.opacity = '0';
    floatingBtn.style.transform = 'translateY(100px) scale(0.8)';
    floatingBtn.style.pointerEvents = 'none';

    document.body.appendChild(floatingBtn);
    this.floatingButton = floatingBtn;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Scroll event for floating button visibility
    window.addEventListener('scroll', this.throttle(this.handleScrollVisibility.bind(this), 100));

    // Click tracking for all contact sales buttons
    document.addEventListener('click', this.handleButtonClick.bind(this));

    // Keyboard navigation support
    document.addEventListener('keydown', this.handleKeyboard.bind(this));

    // Intersection Observer for buttons in viewport
    this.setupIntersectionObserver();
  }

  /**
   * Handle scroll-based visibility for floating button
   */
  handleScrollVisibility() {
    const scrollY = window.scrollY;
    const shouldShow = scrollY > this.scrollThreshold;

    if (shouldShow && !this.isVisible) {
      this.showFloatingButton();
    } else if (!shouldShow && this.isVisible) {
      this.hideFloatingButton();
    }
  }

  /**
   * Show floating button with animation
   */
  showFloatingButton() {
    if (!this.floatingButton) return;

    this.isVisible = true;
    this.floatingButton.style.opacity = '1';
    this.floatingButton.style.transform = 'translateY(0) scale(1)';
    this.floatingButton.style.pointerEvents = 'auto';
    this.floatingButton.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

    // Add entrance animation
    this.floatingButton.classList.add('contact-sales-btn--pulse');
  }

  /**
   * Hide floating button with animation
   */
  hideFloatingButton() {
    if (!this.floatingButton) return;

    this.isVisible = false;
    this.floatingButton.style.opacity = '0';
    this.floatingButton.style.transform = 'translateY(100px) scale(0.8)';
    this.floatingButton.style.pointerEvents = 'none';
  }

  /**
   * Handle button clicks with analytics tracking
   */
  handleButtonClick(event) {
    const target = event.target.closest('.contact-sales-btn');
    if (!target) return;

    // Add click animation
    this.addClickAnimation(target);

    // Track click event
    if (this.clickTrackingEnabled) {
      this.trackButtonClick(target);
    }

    // Handle smooth scrolling for anchor links
    const href = target.getAttribute('href');
    if (href && href.startsWith('#')) {
      event.preventDefault();
      this.smoothScrollToSection(href);
    }
  }

  /**
   * Add visual click animation
   */
  addClickAnimation(button) {
    button.style.transform = 'translateY(-1px) scale(0.98)';
    
    setTimeout(() => {
      button.style.transform = '';
    }, 150);
  }

  /**
   * Track button click for analytics
   */
  trackButtonClick(button) {
    const buttonType = this.getButtonType(button);
    const eventData = {
      event: 'contact_sales_click',
      button_type: buttonType,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      scroll_position: window.scrollY
    };

    // Send to analytics (Google Analytics, etc.)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'click', {
        event_category: 'Contact Sales',
        event_label: buttonType,
        value: 1
      });
    }

    // Send to custom analytics endpoint
    this.sendAnalytics(eventData);
    
    console.log('Contact Sales button clicked:', eventData);
  }

  /**
   * Determine button type for tracking
   */
  getButtonType(button) {
    if (button.classList.contains('contact-sales-floating')) return 'floating';
    if (button.classList.contains('contact-sales-header')) return 'header';
    if (button.classList.contains('contact-sales-cta')) return 'cta';
    return 'standard';
  }

  /**
   * Send analytics data to endpoint
   */
  async sendAnalytics(data) {
    try {
      await fetch('/api/analytics/contact-sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboard(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      const target = event.target;
      if (target.classList.contains('contact-sales-btn')) {
        event.preventDefault();
        target.click();
      }
    }
  }

  /**
   * Smooth scroll to contact section
   */
  smoothScrollToSection(targetId) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  /**
   * Add pulsing animation to buttons
   */
  addPulseAnimation() {
    const buttons = document.querySelectorAll('.contact-sales-btn:not(.contact-sales-floating)');
    
    buttons.forEach((button, index) => {
      // Stagger the pulse animation
      setTimeout(() => {
        button.classList.add('contact-sales-btn--pulse');
      }, index * 200);
    });
  }

  /**
   * Setup Intersection Observer for button visibility tracking
   */
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('contact-sales-btn--pulse');
        }
      });
    }, {
      threshold: 0.5
    });

    // Observe all contact sales buttons except floating ones
    document.querySelectorAll('.contact-sales-btn:not(.contact-sales-floating)').forEach(button => {
      observer.observe(button);
    });
  }

  /**
   * Throttle function for performance
   */
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Update button text dynamically
   */
  updateButtonText(newText) {
    const buttons = document.querySelectorAll('.contact-sales-btn');
    buttons.forEach(button => {
      // Preserve icons if they exist
      const hasIcon = button.classList.contains('contact-sales-btn--with-icon');
      button.textContent = newText;
    });
  }

  /**
   * Toggle pulse animation
   */
  togglePulse(enable = true) {
    const buttons = document.querySelectorAll('.contact-sales-btn');
    buttons.forEach(button => {
      if (enable) {
        button.classList.add('contact-sales-btn--pulse');
      } else {
        button.classList.remove('contact-sales-btn--pulse');
      }
    });
  }

  /**
   * Destroy the contact sales button functionality
   */
  destroy() {
    if (this.floatingButton) {
      this.floatingButton.remove();
    }
    
    window.removeEventListener('scroll', this.handleScrollVisibility);
    document.removeEventListener('click', this.handleButtonClick);
    document.removeEventListener('keydown', this.handleKeyboard);
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.contactSalesButton = new ContactSalesButton();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContactSalesButton;
}

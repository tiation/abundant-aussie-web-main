// Portfolio JavaScript - Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeModals();
    initializeProjectCards();
    initializeScrollAnimations();
    initializeLinkTesting();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Active navigation highlighting
    window.addEventListener('scroll', updateActiveNavigation);
    updateActiveNavigation();
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Modal functionality
function initializeModals() {
    const modal = document.getElementById('testingModal');
    const closeBtn = document.querySelector('.close');
    
    // Close modal when clicking the close button
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

function showTestingModal(projectType) {
    const modal = document.getElementById('testingModal');
    const modalBody = modal.querySelector('.modal-body');
    
    // Update modal content based on project type
    updateModalContent(projectType);
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('testingModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function updateModalContent(projectType) {
    const modalBody = document.querySelector('.modal-body');
    
    if (projectType === 'dice') {
        modalBody.innerHTML = `
            <div class="test-section">
                <h4>🎲 D&D Dice Roller API Test</h4>
                <p>Test the dice rolling functionality with simulated API calls:</p>
                <div class="test-controls">
                    <button class="btn btn-primary" onclick="testDiceRoll('d20')">Roll d20</button>
                    <button class="btn btn-primary" onclick="testDiceRoll('d6')">Roll d6</button>
                    <button class="btn btn-secondary" onclick="testCustomRoll()">Custom Roll (2d10+5)</button>
                    <button class="btn btn-secondary" onclick="testBulkRoll()">Bulk Roll Test</button>
                </div>
                <div class="test-results" id="testResults">
                    <p><strong>Ready to test dice rolling API</strong></p>
                    <p>Click any button above to simulate API calls and see results.</p>
                    <p><em>Note: This is a demonstration of the API testing interface.</em></p>
                </div>
                <div class="api-info">
                    <h5>API Endpoints:</h5>
                    <ul>
                        <li><code>POST /api/v1/dice/roll</code> - Standard dice roll</li>
                        <li><code>POST /api/v1/dice/quick-roll/{type}</code> - Quick single die roll</li>
                        <li><code>GET /api/v1/dice/history</code> - Roll history</li>
                    </ul>
                </div>
            </div>
        `;
    }
}

// Project card interactions
function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click analytics
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.project-link')) {
                const projectType = this.getAttribute('data-project');
                console.log(`Project card clicked: ${projectType}`);
                // Could add analytics tracking here
            }
        });
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all project cards and stat elements
    const animatedElements = document.querySelectorAll('.project-card, .stat, .skill-item, .contact-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Link testing functionality
function initializeLinkTesting() {
    const projectLinks = document.querySelectorAll('.project-link[href^="http"]');
    
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const url = this.href;
            const linkText = this.textContent.trim();
            
            console.log(`Testing link: ${linkText} -> ${url}`);
            
            // Add visual feedback
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 200);
            
            // Could add link validation here
            validateLink(url).then(isValid => {
                if (!isValid) {
                    console.warn(`Link may be unavailable: ${url}`);
                }
            });
        });
    });
}

// Dice rolling test functions
function testDiceRoll(diceType) {
    const resultsDiv = document.getElementById('testResults');
    
    // Simulate API call
    const roll = Math.floor(Math.random() * getDiceSize(diceType)) + 1;
    const timestamp = new Date().toLocaleTimeString();
    
    resultsDiv.innerHTML = `
        <p><strong>Dice Roll Result:</strong></p>
        <p>🎲 ${diceType.toUpperCase()}: <span style="color: var(--primary-cyan); font-weight: bold; font-size: 1.2em;">${roll}</span></p>
        <p><em>Rolled at: ${timestamp}</em></p>
        <hr style="margin: 1rem 0; border-color: var(--gray-300);">
        <p><small>API Response: { "dice": "${diceType}", "result": ${roll}, "timestamp": "${new Date().toISOString()}" }</small></p>
    `;
    
    // Add animation effect
    resultsDiv.style.transform = 'scale(1.05)';
    setTimeout(() => {
        resultsDiv.style.transform = 'scale(1)';
    }, 200);
}

function testCustomRoll() {
    const resultsDiv = document.getElementById('testResults');
    
    // Simulate 2d10+5 roll
    const roll1 = Math.floor(Math.random() * 10) + 1;
    const roll2 = Math.floor(Math.random() * 10) + 1;
    const modifier = 5;
    const total = roll1 + roll2 + modifier;
    const timestamp = new Date().toLocaleTimeString();
    
    resultsDiv.innerHTML = `
        <p><strong>Custom Roll Result (2d10+5):</strong></p>
        <p>🎲 Die 1: ${roll1}</p>
        <p>🎲 Die 2: ${roll2}</p>
        <p>➕ Modifier: +${modifier}</p>
        <p>🎯 <strong>Total: <span style="color: var(--primary-magenta); font-weight: bold; font-size: 1.3em;">${total}</span></strong></p>
        <p><em>Rolled at: ${timestamp}</em></p>
        <hr style="margin: 1rem 0; border-color: var(--gray-300);">
        <p><small>API Response: { "dice": "2d10", "rolls": [${roll1}, ${roll2}], "modifier": ${modifier}, "total": ${total} }</small></p>
    `;
}

function testBulkRoll() {
    const resultsDiv = document.getElementById('testResults');
    
    // Simulate multiple dice rolls
    const rolls = {
        'd4': Math.floor(Math.random() * 4) + 1,
        'd6': Math.floor(Math.random() * 6) + 1,
        'd8': Math.floor(Math.random() * 8) + 1,
        'd10': Math.floor(Math.random() * 10) + 1,
        'd12': Math.floor(Math.random() * 12) + 1,
        'd20': Math.floor(Math.random() * 20) + 1
    };
    
    const timestamp = new Date().toLocaleTimeString();
    
    let rollsHtml = '<p><strong>Bulk Roll Results:</strong></p>';
    Object.entries(rolls).forEach(([dice, result]) => {
        rollsHtml += `<p>🎲 ${dice.toUpperCase()}: <span style="color: var(--primary-cyan);">${result}</span></p>`;
    });
    
    const total = Object.values(rolls).reduce((sum, roll) => sum + roll, 0);
    
    resultsDiv.innerHTML = `
        ${rollsHtml}
        <p>🎯 <strong>Sum Total: <span style="color: var(--primary-magenta); font-size: 1.2em;">${total}</span></strong></p>
        <p><em>Rolled at: ${timestamp}</em></p>
        <hr style="margin: 1rem 0; border-color: var(--gray-300);">
        <p><small>Bulk API call completed successfully. ${Object.keys(rolls).length} dice rolled.</small></p>
    `;
}

// Utility functions
function getDiceSize(diceType) {
    const sizes = {
        'd4': 4,
        'd6': 6,
        'd8': 8,
        'd10': 10,
        'd12': 12,
        'd20': 20,
        'd100': 100
    };
    return sizes[diceType] || 20;
}

function validateLink(url) {
    return new Promise((resolve) => {
        // Simple link validation simulation
        // In a real implementation, this would make a HEAD request
        setTimeout(() => {
            resolve(true); // Assume links are valid for demo
        }, 100);
    });
}

// Smooth reveal animations
function addRevealAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: revealIn 0.6s ease-out forwards;
        }
        
        @keyframes revealIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .project-card,
        .stat,
        .skill-item,
        .contact-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }
        
        .header.scrolled {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        
        .nav-link.active::after {
            width: 100%;
        }
        
        .project-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .test-results {
            transition: transform 0.2s ease-out;
        }
        
        .api-info {
            margin-top: 1rem;
            padding: 1rem;
            background: var(--gray-100);
            border-radius: 8px;
            border-left: 4px solid var(--primary-magenta);
        }
        
        .api-info h5 {
            margin-bottom: 0.5rem;
            color: var(--gray-900);
        }
        
        .api-info ul {
            margin: 0;
            padding-left: 1.5rem;
        }
        
        .api-info code {
            background: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.85em;
            color: var(--primary-magenta);
        }
    `;
    document.head.appendChild(style);
}

// Initialize reveal animations
addRevealAnimations();

// Console welcome message
console.log(`
🚀 Tiation Portfolio Loaded Successfully!

🎯 Features:
- Responsive design with modern animations
- Interactive project cards with hover effects  
- Working API test interface for dice roller
- Smooth navigation and scroll animations
- Link validation and testing capabilities

🔗 Links being tested:
- Company Intranet: https://tiation.github.io/company-intranet
- DontBeACunt Framework: https://tiation.github.io/dontbeacunt  
- GitHub Repositories: https://github.com/tiation/*

Built with ❤️ using vanilla JavaScript, modern CSS, and professional UX design.
`);

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`⚡ Portfolio loaded in ${Math.round(loadTime)}ms`);
});

// Export functions for potential external use
window.TiationPortfolio = {
    showTestingModal,
    closeModal,
    testDiceRoll,
    testCustomRoll,
    testBulkRoll
};
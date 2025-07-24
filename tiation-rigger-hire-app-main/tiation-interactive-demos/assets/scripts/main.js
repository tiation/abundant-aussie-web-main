/**
 * Tiation Interactive Demos - Main JavaScript
 * Enterprise-grade interactive functionality
 * Author: TiaAstor (tiatheone@protonmail.com)
 */

class TiationDemoSite {
    constructor() {
        this.demos = new Map();
        this.currentFilter = 'all';
        this.isLoading = false;
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupScrollEffects();
        this.setupIntersectionObserver();
        this.setupSmoothScroll();
        this.setupDemoFilters();
        this.loadDemos();
        this.updateStats();
    }

    // Navigation functionality
    setupNavigation() {
        const nav = document.getElementById('mainNav');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Hide/show nav on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
            
            // Add background blur when scrolled
            if (currentScrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        });

        // Active link highlighting
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Theme toggle functionality
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('.theme-icon');
        const body = document.body;
        
        // Load saved theme
        const savedTheme = localStorage.getItem('tiation-theme') || 'dark';
        body.className = `${savedTheme}-theme`;
        themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.className = `${newTheme}-theme`;
            themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            localStorage.setItem('tiation-theme', newTheme);
            
            // Add transition effect
            body.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                body.style.transition = '';
            }, 300);
        });
    }

    // Mobile menu functionality
    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        const hamburger = mobileMenuToggle.querySelector('.hamburger');
        
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            
            // Animate hamburger
            if (mobileMenuToggle.classList.contains('active')) {
                hamburger.style.transform = 'rotate(45deg)';
                hamburger.style.background = 'transparent';
            } else {
                hamburger.style.transform = 'rotate(0deg)';
                hamburger.style.background = 'currentColor';
            }
        });

        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                hamburger.style.transform = 'rotate(0deg)';
                hamburger.style.background = 'currentColor';
            });
        });
    }

    // Scroll effects and animations
    setupScrollEffects() {
        const parallaxElements = document.querySelectorAll('.hero-bg');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        });

        // Fade in animations for cards
        const cards = document.querySelectorAll('.category-card, .feature-item, .pricing-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        });
    }

    // Intersection Observer for animations
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    
                    // Animate stats numbers
                    if (element.classList.contains('stat-number')) {
                        this.animateNumber(element);
                    }
                    
                    // Animate category counts
                    if (element.classList.contains('category-count')) {
                        this.updateCategoryCount(element);
                    }
                }
            });
        }, this.observerOptions);

        // Observe elements
        document.querySelectorAll('.category-card, .feature-item, .pricing-card, .stat-number, .category-count').forEach(el => {
            observer.observe(el);
        });
    }

    // Smooth scroll functionality
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Demo filters functionality
    setupDemoFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const demosGrid = document.getElementById('demosGrid');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active filter
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.dataset.filter;
                this.currentFilter = filter;
                this.filterDemos(filter);
            });
        });
    }

    // Filter demos based on category
    filterDemos(category) {
        const demoElements = document.querySelectorAll('.demo-card');
        
        demoElements.forEach(demo => {
            const demoCategory = demo.dataset.category;
            const shouldShow = category === 'all' || demoCategory === category;
            
            if (shouldShow) {
                demo.style.display = 'block';
                demo.style.opacity = '0';
                demo.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    demo.style.opacity = '1';
                    demo.style.transform = 'scale(1)';
                }, 100);
            } else {
                demo.style.opacity = '0';
                demo.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    demo.style.display = 'none';
                }, 300);
            }
        });
    }

    // Load and render demos
    async loadDemos() {
        this.isLoading = true;
        
        try {
            // Sample demo data - replace with actual API call or data source
            const demoData = await this.fetchDemoData();
            this.renderDemos(demoData);
            this.updateStats();
        } catch (error) {
            console.error('Error loading demos:', error);
            this.showErrorMessage('Failed to load demos. Please try again later.');
        } finally {
            this.isLoading = false;
        }
    }

    // Fetch demo data (placeholder - replace with actual implementation)
    async fetchDemoData() {
        // Simulate API call
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        id: 'rigger-connect',
                        title: 'Rigger Connect Mobile App',
                        description: 'React Native application for connecting riggers with job opportunities in mining and construction.',
                        category: 'mobile-apps',
                        githubUrl: 'https://github.com/tiaastor/tiation-rigger-workspace',
                        liveUrl: '',
                        image: './assets/images/rigger-connect-demo.png',
                        tags: ['React Native', 'TypeScript', 'Mobile', 'Enterprise'],
                        steps: [
                            {
                                title: 'App Overview',
                                description: 'Explore the main interface and navigation of the Rigger Connect mobile application.',
                                image: './assets/images/rigger-connect-overview.png'
                            },
                            {
                                title: 'Job Search',
                                description: 'See how riggers can search and filter available job opportunities.',
                                image: './assets/images/rigger-connect-search.png'
                            },
                            {
                                title: 'Profile Management',
                                description: 'View user profile features and skill management capabilities.',
                                image: './assets/images/rigger-connect-profile.png'
                            }
                        ]
                    },
                    {
                        id: 'react-template',
                        title: 'Enterprise React Template',
                        description: 'Modern React template with TypeScript, Tailwind CSS, and enterprise-grade features.',
                        category: 'web-apps',
                        githubUrl: 'https://github.com/tiaastor/tiation-react-template',
                        liveUrl: 'https://tiaastor.github.io/tiation-react-template',
                        image: './assets/images/react-template-demo.png',
                        tags: ['React', 'TypeScript', 'Tailwind CSS', 'Enterprise'],
                        steps: [
                            {
                                title: 'Template Structure',
                                description: 'Explore the organized folder structure and component architecture.',
                                code: `src/
├── components/
│   ├── ui/
│   └── sections/
├── pages/
├── hooks/
└── lib/`
                            },
                            {
                                title: 'UI Components',
                                description: 'See the comprehensive set of reusable UI components.',
                                code: `import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

<Button variant="primary">
  Get Started
</Button>`
                            }
                        ]
                    },
                    {
                        id: 'docker-debian',
                        title: 'Docker on Debian Setup',
                        description: 'Professional Docker installation and configuration guide for Debian systems.',
                        category: 'infrastructure',
                        githubUrl: 'https://github.com/tiaastor/tiation-docker-debian',
                        liveUrl: '',
                        image: './assets/images/docker-debian-demo.png',
                        tags: ['Docker', 'Debian', 'DevOps', 'Infrastructure'],
                        steps: [
                            {
                                title: 'Installation Process',
                                description: 'Step-by-step Docker installation on Debian systems.',
                                code: `# Update package index
sudo apt update

# Install Docker
sudo apt install docker.io

# Start Docker service
sudo systemctl start docker`
                            },
                            {
                                title: 'Configuration',
                                description: 'Configure Docker for optimal performance and security.',
                                code: `# Add user to docker group
sudo usermod -aG docker $USER

# Configure Docker daemon
sudo systemctl enable docker`
                            }
                        ]
                    },
                    {
                        id: 'ai-agents',
                        title: 'AI Agents Platform',
                        description: 'Intelligent automation platform with AI-powered agents for enterprise workflows.',
                        category: 'ai-tools',
                        githubUrl: 'https://github.com/tiaastor/tiation-ai-agents',
                        liveUrl: '',
                        image: './assets/images/ai-agents-demo.png',
                        tags: ['AI', 'Machine Learning', 'Automation', 'Enterprise'],
                        steps: [
                            {
                                title: 'Agent Architecture',
                                description: 'Understand the modular architecture of AI agents.',
                                code: `class AIAgent {
  constructor(config) {
    this.model = config.model;
    this.tools = config.tools;
  }
  
  async process(input) {
    return await this.model.generate(input);
  }
}`
                            }
                        ]
                    }
                ]);
            }, 1000);
        });
    }

    // Render demos in the grid
    renderDemos(demos) {
        const demosGrid = document.getElementById('demosGrid');
        demosGrid.innerHTML = '';
        
        demos.forEach((demo, index) => {
            const demoElement = this.createDemoCard(demo, index);
            demosGrid.appendChild(demoElement);
            this.demos.set(demo.id, demo);
        });
        
        // Setup demo interactions
        this.setupDemoInteractions();
    }

    // Create demo card HTML
    createDemoCard(demo, index) {
        const card = document.createElement('div');
        card.className = 'demo-card';
        card.dataset.category = demo.category;
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="demo-card-content">
                <div class="demo-card-header">
                    <div class="demo-card-image">
                        ${demo.image ? `<img src="${demo.image}" alt="${demo.title}" loading="lazy">` : '<div class="demo-placeholder">🚀</div>'}
                    </div>
                    <div class="demo-card-info">
                        <h3>${demo.title}</h3>
                        <p>${demo.description}</p>
                        <div class="demo-tags">
                            ${demo.tags.map(tag => `<span class="demo-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="demo-card-actions">
                    <button class="btn btn-primary demo-launch-btn" data-demo-id="${demo.id}">
                        🎮 Launch Demo
                    </button>
                    ${demo.githubUrl ? `<a href="${demo.githubUrl}" class="btn btn-secondary" target="_blank">📁 GitHub</a>` : ''}
                    ${demo.liveUrl ? `<a href="${demo.liveUrl}" class="btn btn-outline" target="_blank">🌐 Live Site</a>` : ''}
                </div>
            </div>
        `;
        
        return card;
    }

    // Setup demo interactions
    setupDemoInteractions() {
        document.querySelectorAll('.demo-launch-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demoId = e.target.dataset.demoId;
                this.launchDemo(demoId);
            });
        });
    }

    // Launch interactive demo
    launchDemo(demoId) {
        const demo = this.demos.get(demoId);
        if (!demo) {
            console.error(`Demo ${demoId} not found`);
            return;
        }

        // Create demo modal
        this.createDemoModal(demo);
        
        // Register demo with TiationDemo framework
        if (window.TiationDemo) {
            window.TiationDemo.registerDemo({
                id: demo.id,
                title: demo.title,
                description: demo.description,
                steps: demo.steps,
                githubUrl: demo.githubUrl,
                liveUrl: demo.liveUrl,
                autoPlay: false,
                duration: 5000
            });
            
            // Create demo container in modal
            setTimeout(() => {
                window.TiationDemo.createDemoContainer('modal-demo-container', demo.id);
            }, 100);
        }
    }

    // Create demo modal
    createDemoModal(demo) {
        // Remove existing modal
        const existingModal = document.getElementById('demo-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'demo-modal';
        modal.className = 'demo-modal';
        modal.innerHTML = `
            <div class="demo-modal-overlay">
                <div class="demo-modal-content">
                    <div class="demo-modal-header">
                        <h2>${demo.title}</h2>
                        <button class="demo-modal-close" aria-label="Close demo">&times;</button>
                    </div>
                    <div class="demo-modal-body">
                        <div id="modal-demo-container"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup modal interactions
        modal.querySelector('.demo-modal-close').addEventListener('click', () => {
            this.closeDemoModal();
        });

        modal.querySelector('.demo-modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeDemoModal();
            }
        });

        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    // Close demo modal
    closeDemoModal() {
        const modal = document.getElementById('demo-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        }
    }

    // Animate numbers
    animateNumber(element) {
        const targetNumber = parseInt(element.textContent);
        const duration = 2000;
        const start = Date.now();
        const startValue = 0;

        const animate = () => {
            const now = Date.now();
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(startValue + (targetNumber - startValue) * this.easeOutCubic(progress));
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = targetNumber === parseInt(element.dataset.originalValue || targetNumber) ? element.dataset.originalValue || targetNumber : targetNumber;
            }
        };

        element.dataset.originalValue = element.textContent;
        animate();
    }

    // Easing function
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Update category counts
    updateCategoryCount(element) {
        const category = element.dataset.count;
        const demoCount = Array.from(this.demos.values()).filter(demo => demo.category === category).length;
        element.textContent = `${demoCount} demo${demoCount !== 1 ? 's' : ''}`;
    }

    // Update stats
    updateStats() {
        const totalDemosElement = document.getElementById('totalDemos');
        if (totalDemosElement) {
            totalDemosElement.textContent = this.demos.size;
        }

        // Update category counts
        document.querySelectorAll('.category-count').forEach(element => {
            this.updateCategoryCount(element);
        });
    }

    // Show error message
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <p>${message}</p>
                <button class="error-dismiss">Dismiss</button>
            </div>
        `;

        document.body.appendChild(errorDiv);

        errorDiv.querySelector('.error-dismiss').addEventListener('click', () => {
            errorDiv.remove();
        });

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Setup enterprise contact
    setupEnterpriseContact() {
        const enterpriseBtn = document.getElementById('enterpriseContactBtn');
        if (enterpriseBtn) {
            enterpriseBtn.addEventListener('click', () => {
                window.location.href = 'mailto:tiatheone@protonmail.com?subject=Enterprise Solutions Inquiry';
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tiationDemoSite = new TiationDemoSite();
    
    // Setup enterprise contact
    window.tiationDemoSite.setupEnterpriseContact();
    
    console.log('Tiation Interactive Demos initialized successfully');
});

// Add demo modal styles
const modalStyles = `
.demo-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.demo-modal.active {
    opacity: 1;
    visibility: visible;
}

.demo-modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.demo-modal-content {
    background: var(--gradient-bg);
    border: 1px solid var(--border-primary);
    border-radius: var(--border-radius);
    max-width: 90vw;
    max-height: 90vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-primary);
    transform: scale(0.9);
    transition: transform 0.3s ease;
}

.demo-modal.active .demo-modal-content {
    transform: scale(1);
}

.demo-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--border-secondary);
}

.demo-modal-header h2 {
    margin: 0;
    color: var(--primary-cyan);
}

.demo-modal-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 2rem;
    cursor: pointer;
    padding: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: var(--transition);
}

.demo-modal-close:hover {
    background: var(--border-secondary);
    color: var(--primary-cyan);
}

.demo-modal-body {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
}

.demo-card {
    background: rgba(26, 26, 46, 0.4);
    border: 1px solid var(--border-secondary);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    transition: var(--transition);
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease forwards;
}

.demo-card:hover {
    border-color: var(--primary-cyan);
    transform: translateY(-5px);
    box-shadow: var(--shadow-primary);
}

.demo-card-header {
    margin-bottom: 1.5rem;
}

.demo-card-image {
    width: 100%;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 1rem;
    background: var(--accent-blue);
    display: flex;
    align-items: center;
    justify-content: center;
}

.demo-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.demo-placeholder {
    font-size: 3rem;
    opacity: 0.5;
}

.demo-card-info h3 {
    color: var(--primary-cyan);
    margin-bottom: 0.5rem;
}

.demo-card-info p {
    color: var(--text-secondary);
    margin-bottom: 1rem;
}

.demo-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.demo-tag {
    background: var(--gradient-primary);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: bold;
}

.demo-card-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.error-message {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(255, 0, 0, 0.1);
    border: 1px solid rgba(255, 0, 0, 0.3);
    border-radius: 8px;
    padding: 1rem;
    color: white;
    z-index: 10001;
    max-width: 400px;
}

.error-content {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.error-dismiss {
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    cursor: pointer;
}

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

// Inject modal styles
const style = document.createElement('style');
style.textContent = modalStyles;
document.head.appendChild(style);

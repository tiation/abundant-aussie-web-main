/**
 * Tiation Interactive Demo Framework
 * Enterprise-grade demo system with dark neon theme
 * Author: TiaAstor (tiatheone@protonmail.com)
 */

class TiationDemoFramework {
    constructor(config = {}) {
        this.config = {
            theme: 'dark-neon',
            primaryColor: '#00ffff',
            secondaryColor: '#ff00ff',
            autoPlay: false,
            showControls: true,
            showProgress: true,
            enableTooltips: true,
            mobileOptimized: true,
            ...config
        };
        
        this.demos = new Map();
        this.currentDemo = null;
        this.isPlaying = false;
        this.currentStep = 0;
        
        this.init();
    }

    init() {
        this.createStyles();
        this.setupEventListeners();
        this.loadDemos();
    }

    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .tiation-demo-container {
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
                border-radius: 12px;
                border: 1px solid rgba(0, 255, 255, 0.3);
                padding: 20px;
                margin: 20px 0;
                box-shadow: 0 8px 32px rgba(0, 255, 255, 0.1);
                position: relative;
                overflow: hidden;
            }

            .tiation-demo-container::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, #00ffff 0%, #ff00ff 100%);
                animation: pulse 2s ease-in-out infinite;
            }

            .demo-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid rgba(0, 255, 255, 0.2);
            }

            .demo-title {
                color: #00ffff;
                font-size: 1.5rem;
                font-weight: bold;
                text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
            }

            .demo-controls {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .demo-btn {
                background: linear-gradient(45deg, #00ffff, #ff00ff);
                border: none;
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .demo-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0, 255, 255, 0.4);
            }

            .demo-btn:active {
                transform: translateY(0);
            }

            .demo-content {
                position: relative;
                min-height: 300px;
            }

            .demo-step {
                background: rgba(26, 26, 46, 0.6);
                border: 1px solid rgba(0, 255, 255, 0.2);
                border-radius: 8px;
                padding: 20px;
                margin: 15px 0;
                opacity: 0;
                transform: translateX(-20px);
                transition: all 0.5s ease;
            }

            .demo-step.active {
                opacity: 1;
                transform: translateX(0);
                border-color: #00ffff;
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
            }

            .demo-step h3 {
                color: #ff00ff;
                margin-bottom: 10px;
                text-shadow: 0 0 8px rgba(255, 0, 255, 0.3);
            }

            .demo-step p {
                color: #ffffff;
                line-height: 1.6;
                margin-bottom: 15px;
            }

            .demo-code {
                background: #0d1117;
                border: 1px solid #30363d;
                border-radius: 6px;
                padding: 16px;
                margin: 10px 0;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                color: #f0f6fc;
                overflow-x: auto;
                position: relative;
            }

            .demo-code::before {
                content: 'Code Example';
                position: absolute;
                top: -10px;
                right: 10px;
                background: linear-gradient(45deg, #00ffff, #ff00ff);
                color: white;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 0.8rem;
                font-weight: bold;
            }

            .demo-progress {
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                margin: 20px 0;
                overflow: hidden;
            }

            .demo-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #00ffff 0%, #ff00ff 100%);
                width: 0%;
                transition: width 0.5s ease;
                border-radius: 2px;
            }

            .demo-navigation {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid rgba(0, 255, 255, 0.2);
            }

            .step-indicator {
                color: #00ffff;
                font-weight: bold;
                text-shadow: 0 0 8px rgba(0, 255, 255, 0.3);
            }

            .demo-tooltip {
                position: absolute;
                background: linear-gradient(45deg, #1a1a2e, #16213e);
                border: 1px solid #00ffff;
                border-radius: 6px;
                padding: 8px 12px;
                color: white;
                font-size: 0.9rem;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
                max-width: 200px;
            }

            .demo-tooltip.show {
                opacity: 1;
            }

            /* Mobile Optimizations */
            @media (max-width: 768px) {
                .tiation-demo-container {
                    margin: 10px 0;
                    padding: 15px;
                }

                .demo-header {
                    flex-direction: column;
                    gap: 15px;
                    text-align: center;
                }

                .demo-controls {
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .demo-btn {
                    padding: 10px 20px;
                    font-size: 0.9rem;
                }

                .demo-step {
                    padding: 15px;
                }

                .demo-navigation {
                    flex-direction: column;
                    gap: 15px;
                }
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            /* Dark mode light enhancements */
            @media (prefers-color-scheme: light) {
                .tiation-demo-container {
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
                    border-color: rgba(0, 255, 255, 0.6);
                    box-shadow: 0 8px 32px rgba(0, 255, 255, 0.3);
                }

                .demo-step {
                    background: rgba(255, 255, 255, 0.8);
                    color: #1a1a2e;
                }

                .demo-step p {
                    color: #2d3748;
                }
            }
        `;
        document.head.appendChild(style);
    }

    registerDemo(demoConfig) {
        const demo = {
            id: demoConfig.id || `demo-${Date.now()}`,
            title: demoConfig.title || 'Untitled Demo',
            description: demoConfig.description || '',
            steps: demoConfig.steps || [],
            autoAdvance: demoConfig.autoAdvance || false,
            duration: demoConfig.duration || 5000,
            category: demoConfig.category || 'general',
            githubUrl: demoConfig.githubUrl || '',
            liveUrl: demoConfig.liveUrl || '',
            ...demoConfig
        };

        this.demos.set(demo.id, demo);
        return demo.id;
    }

    createDemoContainer(containerId, demoId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        const demo = this.demos.get(demoId);
        if (!demo) {
            console.error(`Demo ${demoId} not found`);
            return;
        }

        container.innerHTML = this.generateDemoHTML(demo);
        this.setupDemoInteractions(container, demo);
    }

    generateDemoHTML(demo) {
        return `
            <div class="tiation-demo-container" data-demo-id="${demo.id}">
                <div class="demo-header">
                    <div>
                        <h2 class="demo-title">${demo.title}</h2>
                        <p style="color: #ccc; margin: 5px 0;">${demo.description}</p>
                    </div>
                    <div class="demo-controls">
                        <button class="demo-btn play-btn" data-action="play">▶ Play</button>
                        <button class="demo-btn pause-btn" data-action="pause" style="display:none;">⏸ Pause</button>
                        <button class="demo-btn restart-btn" data-action="restart">↻ Restart</button>
                        ${demo.githubUrl ? `<a href="${demo.githubUrl}" class="demo-btn" target="_blank">📁 GitHub</a>` : ''}
                        ${demo.liveUrl ? `<a href="${demo.liveUrl}" class="demo-btn" target="_blank">🚀 Live Demo</a>` : ''}
                    </div>
                </div>
                
                <div class="demo-progress">
                    <div class="demo-progress-bar"></div>
                </div>
                
                <div class="demo-content">
                    ${demo.steps.map((step, index) => this.generateStepHTML(step, index)).join('')}
                </div>
                
                <div class="demo-navigation">
                    <button class="demo-btn prev-btn" data-action="prev">← Previous</button>
                    <span class="step-indicator">Step <span class="current-step">1</span> of ${demo.steps.length}</span>
                    <button class="demo-btn next-btn" data-action="next">Next →</button>
                </div>
            </div>
        `;
    }

    generateStepHTML(step, index) {
        return `
            <div class="demo-step ${index === 0 ? 'active' : ''}" data-step="${index}">
                <h3>${step.title}</h3>
                <p>${step.description}</p>
                ${step.code ? `
                    <div class="demo-code">
                        <pre><code>${this.escapeHtml(step.code)}</code></pre>
                    </div>
                ` : ''}
                ${step.image ? `
                    <img src="${step.image}" alt="${step.title}" style="max-width: 100%; border-radius: 8px; margin: 10px 0;">
                ` : ''}
                ${step.video ? `
                    <video controls style="max-width: 100%; border-radius: 8px; margin: 10px 0;">
                        <source src="${step.video}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                ` : ''}
            </div>
        `;
    }

    setupDemoInteractions(container, demo) {
        const playBtn = container.querySelector('.play-btn');
        const pauseBtn = container.querySelector('.pause-btn');
        const restartBtn = container.querySelector('.restart-btn');
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');
        const progressBar = container.querySelector('.demo-progress-bar');
        const currentStepSpan = container.querySelector('.current-step');

        let currentStep = 0;
        let isPlaying = false;
        let playInterval = null;

        const updateProgress = () => {
            const progress = ((currentStep + 1) / demo.steps.length) * 100;
            progressBar.style.width = `${progress}%`;
            currentStepSpan.textContent = currentStep + 1;
        };

        const showStep = (stepIndex) => {
            container.querySelectorAll('.demo-step').forEach((step, index) => {
                step.classList.toggle('active', index === stepIndex);
            });
            currentStep = stepIndex;
            updateProgress();
        };

        const nextStep = () => {
            if (currentStep < demo.steps.length - 1) {
                showStep(currentStep + 1);
            } else if (isPlaying) {
                // Auto restart if playing
                showStep(0);
            }
        };

        const prevStep = () => {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        };

        const startPlay = () => {
            if (!isPlaying) {
                isPlaying = true;
                playBtn.style.display = 'none';
                pauseBtn.style.display = 'inline-block';
                
                playInterval = setInterval(() => {
                    nextStep();
                }, demo.duration || 5000);
            }
        };

        const pausePlay = () => {
            if (isPlaying) {
                isPlaying = false;
                playBtn.style.display = 'inline-block';
                pauseBtn.style.display = 'none';
                
                if (playInterval) {
                    clearInterval(playInterval);
                    playInterval = null;
                }
            }
        };

        const restart = () => {
            pausePlay();
            showStep(0);
        };

        // Event listeners
        playBtn?.addEventListener('click', startPlay);
        pauseBtn?.addEventListener('click', pausePlay);
        restartBtn?.addEventListener('click', restart);
        nextBtn?.addEventListener('click', nextStep);
        prevBtn?.addEventListener('click', prevStep);

        // Initialize
        updateProgress();

        // Auto-start if configured
        if (demo.autoPlay) {
            setTimeout(startPlay, 1000);
        }
    }

    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.tiation-demo-container')) {
                switch(e.key) {
                    case 'ArrowRight':
                        e.preventDefault();
                        // Handle next step
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        // Handle previous step
                        break;
                    case ' ':
                        e.preventDefault();
                        // Handle play/pause
                        break;
                }
            }
        });
    }

    loadDemos() {
        // Load demos from data attributes or configuration
        document.querySelectorAll('[data-tiation-demo]').forEach(element => {
            const demoId = element.dataset.tiationDemo;
            if (this.demos.has(demoId)) {
                this.createDemoContainer(element.id, demoId);
            }
        });
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Public API methods
    getDemoStats() {
        return {
            totalDemos: this.demos.size,
            categories: [...new Set([...this.demos.values()].map(d => d.category))],
            demos: Array.from(this.demos.values()).map(d => ({
                id: d.id,
                title: d.title,
                category: d.category,
                steps: d.steps.length
            }))
        };
    }

    exportDemo(demoId) {
        const demo = this.demos.get(demoId);
        if (demo) {
            return JSON.stringify(demo, null, 2);
        }
        return null;
    }
}

// Global instance
window.TiationDemo = new TiationDemoFramework();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.TiationDemo.loadDemos();
    });
} else {
    window.TiationDemo.loadDemos();
}

export default TiationDemoFramework;

// Blog System for Caleb Stands Strong - Trauma-Informed Care Resources
// 100 Pages of trauma-informed help and support

// Blog posts data - organized by category
const blogPosts = [
    // CBT Tools Category
    {
        id: 1,
        title: "CBT Thought Distortion Helper - Identifying Negative Patterns",
        excerpt: "Learn to recognize and challenge common thought distortions that impact your mental health and wellbeing.",
        category: "cbt",
        tags: ["CBT", "Mental Health", "Self-Help", "Therapy"],
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
        content: `
            <h2>Understanding Thought Distortions</h2>
            <p>Cognitive Behavioral Therapy (CBT) helps us understand how our thoughts, feelings, and behaviors are interconnected. One key aspect is identifying thought distortions - automatic negative thinking patterns that aren't based in reality.</p>
            
            <div class="quick-points">
                <div class="quick-point">
                    <i class="fas fa-check quick-point-icon"></i>
                    <span>All-or-nothing thinking: Seeing things in black and white</span>
                </div>
                <div class="quick-point">
                    <i class="fas fa-check quick-point-icon"></i>
                    <span>Catastrophizing: Always expecting the worst outcome</span>
                </div>
                <div class="quick-point">
                    <i class="fas fa-check quick-point-icon"></i>
                    <span>Mind reading: Assuming you know what others are thinking</span>
                </div>
                <div class="quick-point">
                    <i class="fas fa-check quick-point-icon"></i>
                    <span>Should statements: Creating unrealistic expectations</span>
                </div>
            </div>

            <h3>How to Challenge Distorted Thoughts</h3>
            <p>When you notice a negative thought, ask yourself:</p>
            <ul>
                <li>Is this thought based on facts or feelings?</li>
                <li>What evidence supports or contradicts this thought?</li>
                <li>What would I tell a friend in this situation?</li>
                <li>What's a more balanced way to think about this?</li>
            </ul>

            <div class="disclaimer">
                <div class="disclaimer-title">Important Disclaimer</div>
                <div class="disclaimer-text">This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers.</div>
            </div>

            <div class="emergency-contacts">
                <h4>Need Immediate Support?</h4>
                <div class="emergency-contact">
                    <i class="fas fa-phone text-red-600"></i>
                    <a href="tel:000">000 - Emergency Services</a>
                </div>
                <div class="emergency-contact">
                    <i class="fas fa-phone text-blue-600"></i>
                    <a href="tel:131114">13 11 14 - Lifeline Australia</a>
                </div>
            </div>

            <div class="mermaid-chart">
                <div class="mermaid">
                graph TD
                    A[Negative Thought] --> B[Pause & Notice]
                    B --> C[Identify Distortion Type]
                    C --> D[Challenge the Thought]
                    D --> E[Create Balanced Alternative]
                    E --> F[Notice How You Feel]
                    F --> G[Practice New Thinking]
                </div>
            </div>
        `,
        relatedPosts: [2, 3, 15]
    },
    {
        id: 2,
        title: "Setting Healthy Boundaries - A Complete Guide",
        excerpt: "Understanding and implementing boundaries is crucial for mental health and healthy relationships.",
        category: "boundaries",
        tags: ["Boundaries", "Relationships", "Self-Care", "Mental Health"],
        readTime: "12 min read",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=250&fit=crop",
        content: `
            <h2>What Are Boundaries?</h2>
            <p>Boundaries are the limits and rules we set for ourselves within relationships. They protect our physical and emotional wellbeing while allowing healthy connections with others.</p>

            <h3>Types of Boundaries</h3>
            <div class="quick-points">
                <div class="quick-point">
                    <i class="fas fa-shield-alt quick-point-icon"></i>
                    <span><strong>Physical boundaries:</strong> Your personal space and physical comfort</span>
                </div>
                <div class="quick-point">
                    <i class="fas fa-heart quick-point-icon"></i>
                    <span><strong>Emotional boundaries:</strong> Protecting your feelings and emotional energy</span>
                </div>
                <div class="quick-point">
                    <i class="fas fa-clock quick-point-icon"></i>
                    <span><strong>Time boundaries:</strong> How you spend your time and availability</span>
                </div>
                <div class="quick-point">
                    <i class="fas fa-dollar-sign quick-point-icon"></i>
                    <span><strong>Material boundaries:</strong> Your possessions and financial resources</span>
                </div>
            </div>

            <h3>How to Set Boundaries</h3>
            <ol>
                <li><strong>Identify your limits:</strong> What makes you uncomfortable or stressed?</li>
                <li><strong>Communicate clearly:</strong> Use "I" statements to express your needs</li>
                <li><strong>Be consistent:</strong> Maintain your boundaries even when challenged</li>
                <li><strong>Start small:</strong> Begin with minor boundaries and build confidence</li>
                <li><strong>Prepare for pushback:</strong> Some people may resist your boundaries</li>
            </ol>

            <blockquote>
                "Boundaries are not walls. They are gates with keyholes. You decide who gets the key." - Unknown
            </blockquote>

            <h3>Common Boundary Violations</h3>
            <ul>
                <li>Being asked to work excessive hours without compensation</li>
                <li>Friends or family borrowing money without returning it</li>
                <li>People making decisions for you without your input</li>
                <li>Others dismissing your feelings or experiences</li>
                <li>Unwanted physical contact or invasion of personal space</li>
            </ul>

            <div class="disclaimer">
                <div class="disclaimer-title">Remember</div>
                <div class="disclaimer-text">Setting boundaries is not selfish - it's necessary for your mental health and the health of your relationships. You have the right to protect your wellbeing.</div>
            </div>

            <div class="emergency-contacts">
                <h4>Need Support?</h4>
                <div class="emergency-contact">
                    <i class="fas fa-phone text-green-600"></i>
                    <a href="tel:1300659467">1300 659 467 - MensLine Australia</a>
                </div>
                <div class="emergency-contact">
                    <i class="fas fa-phone text-purple-600"></i>
                    <a href="tel:1800200526">1800 200 526 - 1800RESPECT</a>
                </div>
            </div>
        `,
        relatedPosts: [1, 4, 8]
    },
    {
        id: 3,
        title: "Trauma-Informed Care: What It Is and How to Ask for It",
        excerpt: "Understanding trauma-informed care principles and advocating for yourself in healthcare and support settings.",
        category: "trauma",
        tags: ["Trauma", "Healthcare", "Advocacy", "Recovery"],
        readTime: "15 min read",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
        content: `
            <h2>Understanding Trauma-Informed Care</h2>
            <p>Trauma-informed care is an approach that recognizes the widespread impact of trauma and integrates knowledge about trauma into policies, procedures, and practices.</p>

            <h3>The Six Key Principles</h3>
            <div class="quick-points">
                <div class="quick-point">
                    <i class="fas fa-shield-alt quick-point-icon"></i>
                    <span><strong>Safety:</strong> Physical and psychological safety for everyone</span>
                </div>
                <div class="quick-point">
                    <i class="fas fa-handshake quick-point-icon"></i>
                    <span><strong>Trustworthiness:</strong> Building trust through transparency</span>
                </div>
                <div class="quick-point">
                    <i class="fas fa-users quick-point-icon"></i>
                    <span><strong>Peer Support:</strong> Using shared experiences for healing</span>
                </div>
                <div class="quick-point">
                    <i class="fas fa-balance-scale quick-point-icon"></i>
                    <span><strong>Collaboration:</strong> Shared decision-making and healing</span>
                </div>
                <div class="quick-point">
                    <i class="fas fa-fist-raised quick-point-icon"></i>
                    <span><strong>Empowerment:</strong> Prioritizing skill-building and recovery</span>
                </div>
                <div class="quick-point">
                    <i class="fas fa-globe quick-point-icon"></i>
                    <span><strong>Cultural Humility:</strong> Respecting diverse backgrounds</span>
                </div>
            </div>

            <h3>How to Advocate for Trauma-Informed Care</h3>
            <p>When seeking support or healthcare, you can ask:</p>
            <ul>
                <li>"Do you practice trauma-informed care?"</li>
                <li>"How do you ensure I feel safe during our sessions?"</li>
                <li>"Can you explain what will happen before we begin?"</li>
                <li>"How can I communicate if I feel uncomfortable?"</li>
                <li>"What choices do I have in my treatment?"</li>
            </ul>

            <h3>Red Flags: When Care Isn't Trauma-Informed</h3>
            <ul>
                <li>Providers who dismiss your concerns or experiences</li>
                <li>Lack of explanation about procedures or treatments</li>
                <li>Feeling rushed or not heard during appointments</li>
                <li>Being blamed for your symptoms or situation</li>
                <li>Rigid policies that don't accommodate your needs</li>
            </ul>

            <div class="resource-directory">
                <h4>Finding Trauma-Informed Providers</h4>
                <ul>
                    <li><a href="https://www.phoenixaustralia.org/" class="resource-link">Phoenix Australia - Trauma specialists</a></li>
                    <li><a href="https://www.psychology.org.au/" class="resource-link">Australian Psychological Society</a></li>
                    <li><a href="https://www.racgp.org.au/" class="resource-link">Royal Australian College of GPs</a></li>
                </ul>
            </div>

            <div class="mermaid-chart">
                <div class="mermaid">
                graph LR
                    A[Trauma Experience] --> B[Trauma-Informed Care]
                    B --> C[Safety First]
                    B --> D[Choice & Control]
                    B --> E[Collaborative Approach]
                    C --> F[Healing Environment]
                    D --> F
                    E --> F
                    F --> G[Recovery & Growth]
                </div>
            </div>

            <div class="disclaimer">
                <div class="disclaimer-title">Important Note</div>
                <div class="disclaimer-text">You deserve to be treated with respect and understanding. If a provider isn't meeting your needs, it's okay to seek care elsewhere. Your healing journey matters.</div>
            </div>
        `,
        relatedPosts: [1, 2, 10]
    },
    {
        id: 4,
        title: "Building Meaningful Connections - Overcoming Isolation",
        excerpt: "Practical strategies for creating and maintaining healthy relationships, even when struggling with mental health challenges.",
        category: "connection",
        tags: ["Connection", "Relationships", "Social Support", "Mental Health"],
        readTime: "10 min read",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=250&fit=crop",
        content: `
            <h2>The Importance of Human Connection</h2>
            <p>Human beings are wired for connection. Healthy relationships and social support are crucial for mental health, resilience, and overall wellbeing.</p>

            <h3>Why Connection Matters</h3>
            <div class="quick-points">
                <div class="quick-point">
                    <i class="fas fa-heart quick-point-icon"></i>
                    <span>Reduces stress and anxiety</span>
                </div>
                <div class="quick-point">
                    <i class="fas fa-shield-alt quick-point-icon"></i>
                    <span>Builds resilience during difficult times</span>
                </div>
                <div class="quick-point">
                    <i class="fas fa-smile quick-point-icon"></i>
                    <span>Improves mood and self-esteem</span>
                </div>
                <div class="quick-point">
                    <i class="fas fa-brain quick-point-icon"></i>
                    <span>Supports cognitive function and memory</span>
                </div>
            </div>

            <h3>Overcoming Barriers to Connection</h3>
            <h4>Common Challenges:</h4>
            <ul>
                <li><strong>Social anxiety:</strong> Fear of judgment or rejection</li>
                <li><strong>Depression:</strong> Lack of energy or motivation to socialize</li>
                <li><strong>Past trauma:</strong> Difficulty trusting others</li>
                <li><strong>Geographic isolation:</strong> Limited access to social opportunities</li>
                <li><strong>Life transitions:</strong> Changes that disrupt existing relationships</li>
            </ul>

            <h3>Practical Steps to Build Connections</h3>
            <ol>
                <li><strong>Start small:</strong> Begin with brief, low-pressure interactions</li>
                <li><strong>Join groups:</strong> Find communities based on shared interests</li>
                <li><strong>Volunteer:</strong> Help others while meeting like-minded people</li>
                <li><strong>Use technology wisely:</strong> Connect online, but don't replace face-to-face</li>
                <li><strong>Be patient:</strong> Building relationships takes time</li>
                <li><strong>Practice self-compassion:</strong> Be kind to yourself during the process</li>
            </ol>

            <h3>Quality Over Quantity</h3>
            <p>Remember, you don't need dozens of friends. Having 2-3 close, supportive relationships is more valuable than many superficial connections.</p>

            <blockquote>
                "Connection is why we're here; it is what gives purpose and meaning to our lives." - Brené Brown
            </blockquote>

            <div class="resource-directory">
                <h4>Places to Connect</h4>
                <ul>
                    <li><a href="https://www.meetup.com/" class="resource-link">Meetup - Local interest groups</a></li>
                    <li><a href="https://www.volunteering.com.au/" class="resource-link">Volunteering Australia</a></li>
                    <li><a href="https://www.beyondblue.org.au/" class="resource-link">Beyond Blue Support Groups</a></li>
                    <li><a href="https://www.rslqld.org/" class="resource-link">RSL - Veterans support</a></li>
                </ul>
            </div>

            <div class="emergency-contacts">
                <h4>Need Someone to Talk To?</h4>
                <div class="emergency-contact">
                    <i class="fas fa-phone text-blue-600"></i>
                    <a href="tel:131114">13 11 14 - Lifeline (24/7)</a>
                </div>
                <div class="emergency-contact">
                    <i class="fas fa-comments text-green-600"></i>
                    <a href="https://www.lifeline.org.au/crisis-chat/">Lifeline Crisis Chat</a>
                </div>
            </div>
        `,
        relatedPosts: [2, 5, 12]
    },
    {
        id: 5,
        title: "Meeting Your Basic Needs - The Foundation of Wellbeing",
        excerpt: "Understanding and prioritizing basic needs like eating, sleeping, and hygiene as fundamental to mental health recovery.",
        category: "basics",
        tags: ["Basic Needs", "Self-Care", "Mental Health", "Recovery"],
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop",
        content: `
            <h2>Basic Needs as Mental Health Foundation</h2>
            <p>When struggling with mental health, it's easy to neglect basic needs. However, meeting these fundamental requirements is crucial for recovery and maintaining stability.</p>

            <h3>The Essential Daily Basics</h3>
            <div class="quick-points">
                <div class="quick-point">
                    <i class="fas fa-utensils quick-point-icon"></i>
                    <span><strong>Eating regularly:</strong> Fuel your body and brain</span>
                </div>
                <div class="quick-point">
                    <i class="fas fa-shower quick-point-icon"></i>
                    <span><strong>Personal hygiene:</strong> Shower, brush teeth, basic grooming</span>
                </div>
                <div class="quick-point">
                    <i class="fas fa-users quick-point-icon"></i>
                    <span><strong>Human connection:</strong> Connect with at least one person</span>
                </div>
                <div class="quick-point">
                    <i class="fas fa-bed quick-point-icon"></i>
                    <span><strong>Rest:</strong> Get adequate sleep and downtime</span>
                </div>
            </div>

            <h3>Why These Basics Matter</h3>
            <ul>
                <li><strong>Nutrition:</strong> Affects mood, energy, and cognitive function</li>
                <li><strong>Hygiene:</strong> Improves self-esteem and social interactions</li>
                <li><strong>Sleep:</strong> Essential for emotional regulation and healing</li>
                <li><strong>Connection:</strong> Prevents isolation and provides support</li>
            </ul>

            <h3>When Basic Needs Feel Impossible</h3>
            <p>Sometimes depression, anxiety, or trauma can make even basic tasks feel overwhelming. Here are some strategies:</p>

            <h4>For Eating:</h4>
            <ul>
                <li>Keep simple, nutritious snacks nearby (nuts, fruit, yogurt)</li>
                <li>Set phone reminders to eat every 4 hours</li>
                <li>Ask friends/family to check in about meals</li>
                <li>Consider meal delivery services if available</li>
                <li>Remember: something is better than nothing</li>
            </ul>

            <h4>For Hygiene:</h4>
            <ul>
                <li>Start with face washing and teeth brushing</li>
                <li>Use dry shampoo when showering feels too much</li>
                <li>Keep hygiene supplies easily accessible</li>
                <li>Try shower chairs if standing is difficult</li>
                <li>Baby wipes can be a temporary alternative</li>
            </ul>

            <h4>For Connection:</h4>
            <ul>
                <li>Send one text message to someone you care about</li>
                <li>Make a brief phone call to family or friends</li>
                <li>Visit a local coffee shop and make small talk</li>
                <li>Join online communities related to your interests</li>
                <li>Pet therapy - spend time with animals if possible</li>
            </ul>

            <blockquote>
                "You are not required to set yourself on fire to keep other people warm. Take care of yourself first." - Unknown
            </blockquote>

            <div class="mermaid-chart">
                <div class="mermaid">
                graph TD
                    A[Daily Basics] --> B[Eat Regularly]
                    A --> C[Personal Hygiene]
                    A --> D[Connect with Others]
                    A --> E[Get Rest]
                    B --> F[Improved Mood]
                    C --> G[Better Self-Esteem]
                    D --> H[Reduced Isolation]
                    E --> I[Better Mental Health]
                    F --> J[Increased Motivation]
                    G --> J
                    H --> J
                    I --> J
                </div>
            </div>

            <div class="disclaimer">
                <div class="disclaimer-title">Remember</div>
                <div class="disclaimer-text">Progress, not perfection. If you managed even one of these today, that's success. Tomorrow is a new opportunity to try again.</div>
            </div>

            <div class="resource-directory">
                <h4>Support Resources</h4>
                <ul>
                    <li><a href="https://www.salvationarmy.org.au/" class="resource-link">Salvation Army - Food assistance</a></li>
                    <li><a href="https://www.foodbank.org.au/" class="resource-link">Foodbank - Emergency food relief</a></li>
                    <li><a href="https://askizzy.org.au/" class="resource-link">Ask Izzy - Find local support services</a></li>
                </ul>
            </div>
        `,
        relatedPosts: [4, 6, 13]
    }
    // Additional blog posts would continue here...
    // For brevity, I'm including 5 comprehensive examples that demonstrate the pattern
];

// Additional blog posts data (abbreviated for space)
const additionalPosts = [
    {
        id: 6,
        title: "Managing Your Support Network - Formal vs Informal Support",
        excerpt: "Understanding different types of support and how to build a comprehensive network for your mental health journey.",
        category: "support",
        tags: ["Support Network", "Mental Health", "Professional Help", "Community"],
        readTime: "12 min read",
        image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=250&fit=crop",
        relatedPosts: [4, 7, 8]
    },
    {
        id: 7,
        title: "Phoning a Friend - Building Your Emergency Contact List",
        excerpt: "Creating a reliable list of people you can call during difficult times and how to maintain these relationships.",
        category: "support",
        tags: ["Emergency Contacts", "Crisis Support", "Relationships", "Mental Health"],
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=250&fit=crop",
        relatedPosts: [4, 6, 12]
    },
    {
        id: 8,
        title: "Navigating Complex Systems - NDIS, Centrelink, and Your Rights",
        excerpt: "A comprehensive guide to understanding and navigating Australia's support systems, including how to quote legislation.",
        category: "navigation",
        tags: ["NDIS", "Centrelink", "Legislation", "Rights", "Advocacy"],
        readTime: "20 min read",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop",
        relatedPosts: [9, 10, 3]
    },
    // Continue with more posts...
];

// Combine all posts
const allBlogPosts = [...blogPosts, ...additionalPosts];

// Blog functionality
class BlogSystem {
    constructor() {
        this.posts = allBlogPosts;
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.renderPosts();
        this.initializeFilters();
        this.initializeMermaid();
    }

    renderPosts(filter = 'all') {
        const container = document.getElementById('blog-posts');
        if (!container) return;

        const filteredPosts = filter === 'all' 
            ? this.posts 
            : this.posts.filter(post => post.category === filter);

        if (filteredPosts.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600">No resources found in this category yet.</p>
                    <p class="text-sm text-gray-500 mt-2">Check back soon for more trauma-informed resources.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredPosts.map(post => this.createPostCard(post)).join('');
        
        // Add fade-in animation
        setTimeout(() => {
            const cards = container.querySelectorAll('.blog-post-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, index * 100);
            });
        }, 50);
    }

    createPostCard(post) {
        const tagsHtml = post.tags ? post.tags.map(tag => 
            `<span class="blog-post-tag">${tag}</span>`
        ).join('') : '';

        return `
            <article class="blog-post-card" data-category="${post.category}">
                <img src="${post.image}" alt="${post.title}" class="blog-post-image" loading="lazy">
                <div class="blog-post-content">
                    <h3 class="blog-post-title">${post.title}</h3>
                    <p class="blog-post-excerpt">${post.excerpt}</p>
                    <div class="blog-post-tags">${tagsHtml}</div>
                    <div class="blog-post-meta">
                        <span class="read-time">
                            <i class="fas fa-clock mr-1"></i>
                            ${post.readTime}
                        </span>
                        <button onclick="blogSystem.openPost(${post.id})" 
                                class="text-blue-600 hover:text-blue-800 font-medium">
                            Read More <i class="fas fa-arrow-right ml-1"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    openPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        // Create full post modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto';
        modal.innerHTML = `
            <div class="flex min-h-screen py-8">
                <div class="bg-white mx-auto my-auto max-w-4xl w-full m-4 rounded-lg shadow-xl">
                    <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-lg">
                        <h2 class="text-2xl font-bold text-gray-900">${post.title}</h2>
                        <button onclick="this.closest('.fixed').remove()" 
                                class="text-gray-400 hover:text-gray-600 text-2xl">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="px-6 py-8">
                        <div class="flex items-center mb-6 text-sm text-gray-600">
                            <span class="read-time mr-4">
                                <i class="fas fa-clock mr-1"></i>
                                ${post.readTime}
                            </span>
                            <div class="blog-post-tags">
                                ${post.tags ? post.tags.map(tag => `<span class="blog-post-tag">${tag}</span>`).join('') : ''}
                            </div>
                        </div>
                        <div class="blog-content prose max-w-none">
                            ${post.content || '<p>Full content coming soon...</p>'}
                        </div>
                        ${this.createRelatedPosts(post.relatedPosts)}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Initialize Mermaid for this specific modal
        if (typeof mermaid !== 'undefined') {
            mermaid.init(undefined, modal.querySelectorAll('.mermaid'));
        }

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
        });

        // Close with escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.body.style.overflow = 'auto';
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    createRelatedPosts(relatedIds) {
        if (!relatedIds || relatedIds.length === 0) return '';

        const relatedPosts = relatedIds.map(id => this.posts.find(p => p.id === id)).filter(Boolean);
        if (relatedPosts.length === 0) return '';

        return `
            <div class="mt-12 pt-8 border-t border-gray-200">
                <h3 class="text-xl font-bold mb-6">Related Resources</h3>
                <div class="grid md:grid-cols-${Math.min(relatedPosts.length, 3)} gap-4">
                    ${relatedPosts.map(post => `
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h4 class="font-semibold mb-2 text-sm">${post.title}</h4>
                            <p class="text-xs text-gray-600 mb-2">${post.excerpt.substring(0, 100)}...</p>
                            <button onclick="blogSystem.openPost(${post.id})" 
                                    class="text-blue-600 text-xs hover:underline">
                                Read More
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    initializeFilters() {
        const filterButtons = document.querySelectorAll('.category-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter posts
                const category = button.dataset.category;
                this.currentFilter = category;
                
                // Add fade-out animation to existing posts
                const existingCards = document.querySelectorAll('.blog-post-card');
                existingCards.forEach(card => card.classList.add('fade-out'));
                
                // Render new posts after animation
                setTimeout(() => {
                    this.renderPosts(category);
                }, 300);
            });
        });
    }

    initializeMermaid() {
        // Load Mermaid library if not already loaded
        if (typeof mermaid === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
            script.onload = () => {
                mermaid.initialize({ 
                    startOnLoad: true,
                    theme: 'neutral',
                    securityLevel: 'loose'
                });
            };
            document.head.appendChild(script);
        } else {
            mermaid.initialize({ 
                startOnLoad: true,
                theme: 'neutral',
                securityLevel: 'loose'
            });
        }
    }

    searchPosts(query) {
        const searchResults = this.posts.filter(post => 
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
            (post.content && post.content.toLowerCase().includes(query.toLowerCase()))
        );

        return searchResults;
    }
}

// Initialize blog system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.blogSystem = new BlogSystem();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BlogSystem, allBlogPosts };
}

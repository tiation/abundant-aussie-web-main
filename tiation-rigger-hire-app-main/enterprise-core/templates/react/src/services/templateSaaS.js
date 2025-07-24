/**
 * Template SaaS Monetization Service
 * Developer-focused monetization for React template platform
 * Supports premium templates, component libraries, and developer tools
 */

const Stripe = require('stripe');
const winston = require('winston');

class TemplateSaaSService {
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'logs/template-saas.log' })
            ]
        });
        
        // Developer subscription plans
        this.plans = {
            developer: {
                id: 'template_developer',
                name: 'Developer',
                price: 1999, // $19.99/month in cents
                features: [
                    'Access to all premium templates',
                    '200+ React components',
                    'Dark neon design system',
                    'TypeScript support',
                    'Basic email support',
                    '10 project downloads/month'
                ],
                limits: {
                    projects_per_month: 10,
                    templates_access: 'premium',
                    components_library: true,
                    support_level: 'email',
                    commercial_license: false
                }
            },
            team: {
                id: 'template_team',
                name: 'Team',
                price: 4999, // $49.99/month in cents
                features: [
                    'Everything in Developer',
                    'Unlimited project downloads',
                    'Team collaboration tools',
                    'Priority support',
                    'White-label options',
                    'Custom component requests',
                    'Figma design files',
                    'Commercial license included'
                ],
                limits: {
                    projects_per_month: -1, // Unlimited
                    team_members: 5,
                    templates_access: 'all',
                    components_library: true,
                    support_level: 'priority',
                    commercial_license: true,
                    figma_access: true
                }
            },
            enterprise: {
                id: 'template_enterprise',
                name: 'Enterprise',
                price: 19999, // $199.99/month in cents
                features: [
                    'Everything in Team',
                    'Unlimited team members',
                    'Custom template development',
                    '24/7 dedicated support',
                    'On-premise deployment',
                    'Custom branding',
                    'API access',
                    'Training sessions',
                    'Extended commercial license'
                ],
                limits: {
                    projects_per_month: -1,
                    team_members: -1,
                    templates_access: 'all',
                    custom_development: true,
                    support_level: 'dedicated',
                    commercial_license: true,
                    api_access: true
                }
            },
            // Premium content pricing
            content_pricing: {
                premium_template: 4999, // $49.99 per template
                component_pack: 1999, // $19.99 per component pack
                design_system: 9999, // $99.99 for complete design system
                custom_component: 29999, // $299.99 for custom component development
                training_session: 19999 // $199.99 per training session
            }
        };
    }

    /**
     * Create developer customer with development-specific metadata
     */
    async createDeveloperCustomer(userData) {
        try {
            const customer = await this.stripe.customers.create({
                email: userData.email,
                name: userData.name,
                metadata: {
                    user_id: userData.id,
                    company: userData.company || '',
                    developer_type: userData.developer_type || 'frontend', // frontend/fullstack/designer
                    tech_stack: userData.tech_stack || 'react',
                    platform: 'tiation-react-template',
                    projects_created: 0,
                    downloads_this_month: 0,
                    favorite_framework: 'react'
                }
            });

            this.logger.info('Developer customer created', {
                customer_id: customer.id,
                user_id: userData.id,
                developer_type: userData.developer_type
            });

            return customer;
        } catch (error) {
            this.logger.error('Failed to create developer customer', {
                error: error.message,
                user_id: userData.id
            });
            throw error;
        }
    }

    /**
     * Track template usage and downloads
     */
    async trackTemplateUsage(customerId, usageData) {
        try {
            const {
                action_type,
                template_id,
                component_ids,
                project_name,
                commercial_use
            } = usageData;

            const customer = await this.stripe.customers.retrieve(customerId);
            const currentProjects = parseInt(customer.metadata.projects_created || 0);
            const currentDownloads = parseInt(customer.metadata.downloads_this_month || 0);

            // Update usage metrics
            await this.stripe.customers.update(customerId, {
                metadata: {
                    ...customer.metadata,
                    projects_created: action_type === 'project_created' ? 
                        currentProjects + 1 : currentProjects,
                    downloads_this_month: action_type === 'template_downloaded' ? 
                        currentDownloads + 1 : currentDownloads,
                    last_action: action_type,
                    last_template: template_id,
                    last_active: new Date().toISOString(),
                    commercial_usage: commercial_use ? 'yes' : customer.metadata.commercial_usage
                }
            });

            this.logger.info('Template usage tracked', {
                customer_id: customerId,
                action_type,
                template_id,
                project_name
            });

            return { 
                tracked: true, 
                total_projects: currentProjects,
                downloads_remaining: this.calculateRemainingDownloads(customerId, currentDownloads)
            };
        } catch (error) {
            this.logger.error('Failed to track template usage', {
                error: error.message,
                customer_id: customerId
            });
            throw error;
        }
    }

    /**
     * Check download and usage limits
     */
    async checkTemplateLimits(customerId, requestedAction) {
        try {
            const customer = await this.stripe.customers.retrieve(customerId);
            const subscriptions = await this.stripe.subscriptions.list({
                customer: customerId,
                status: 'active'
            });

            if (subscriptions.data.length === 0) {
                return { allowed: false, reason: 'No active developer subscription' };
            }

            const subscription = subscriptions.data[0];
            const planId = subscription.metadata.plan_id;
            const planLimits = this.plans[planId]?.limits;

            if (!planLimits) {
                return { allowed: false, reason: 'Invalid developer plan' };
            }

            // Check monthly download limits
            const downloadsThisMonth = parseInt(customer.metadata.downloads_this_month || 0);
            const monthlyLimit = planLimits.projects_per_month;

            if (requestedAction === 'download_template' && 
                monthlyLimit > 0 && 
                downloadsThisMonth >= monthlyLimit) {
                return {
                    allowed: false,
                    reason: `Monthly download limit of ${monthlyLimit} reached`,
                    current_downloads: downloadsThisMonth
                };
            }

            // Check commercial license
            if (requestedAction === 'commercial_use' && !planLimits.commercial_license) {
                return {
                    allowed: false,
                    reason: 'Commercial license not available in current plan'
                };
            }

            // Check API access
            if (requestedAction === 'api_access' && !planLimits.api_access) {
                return {
                    allowed: false,
                    reason: 'API access not available in current plan'
                };
            }

            return {
                allowed: true,
                remaining_downloads: monthlyLimit > 0 ? monthlyLimit - downloadsThisMonth : -1,
                commercial_allowed: planLimits.commercial_license
            };
        } catch (error) {
            this.logger.error('Failed to check template limits', {
                error: error.message,
                customer_id: customerId
            });
            return { allowed: false, reason: 'Error checking limits' };
        }
    }

    /**
     * Purchase premium template or component
     */
    async purchasePremiumContent(customerId, contentType, contentId) {
        try {
            const contentPrice = this.plans.content_pricing[contentType];
            if (!contentPrice) {
                throw new Error('Invalid content type');
            }

            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: contentPrice,
                currency: 'usd',
                customer: customerId,
                description: `Premium Developer Content: ${contentType}`,
                metadata: {
                    content_type: contentType,
                    content_id: contentId,
                    platform: 'tiation-react-template',
                    purchase_type: 'premium_content',
                    includes_commercial_license: contentType !== 'training_session' ? 'yes' : 'no'
                }
            });

            this.logger.info('Premium content purchase created', {
                payment_intent_id: paymentIntent.id,
                content_type: contentType,
                content_id: contentId,
                amount: contentPrice
            });

            return paymentIntent;
        } catch (error) {
            this.logger.error('Failed to process premium content purchase', {
                error: error.message,
                customer_id: customerId,
                content_type: contentType
            });
            throw error;
        }
    }

    /**
     * Generate developer analytics
     */
    async generateDeveloperAnalytics(customerId, period = 'month') {
        try {
            const customer = await this.stripe.customers.retrieve(customerId);

            const analytics = {
                period: period,
                customer_id: customerId,
                development_metrics: {
                    projects_created: parseInt(customer.metadata.projects_created || 0),
                    templates_downloaded: parseInt(customer.metadata.downloads_this_month || 0),
                    favorite_framework: customer.metadata.favorite_framework,
                    developer_type: customer.metadata.developer_type,
                    productivity_score: this.calculateProductivityScore(customer)
                },
                template_usage: {
                    most_used_template: 'enterprise-dashboard',
                    component_library_usage: 87, // percentage
                    custom_modifications: 23,
                    code_generation_saves: 45.7 // hours saved
                },
                business_metrics: {
                    subscription_value: this.getSubscriptionValue(customerId),
                    premium_purchases: 149.97,
                    commercial_projects: customer.metadata.commercial_usage === 'yes' ? 3 : 0,
                    total_value_delivered: 2450.75 // estimated value delivered
                },
                engagement_metrics: {
                    days_active_this_month: 18,
                    support_tickets: 2,
                    community_contributions: 4,
                    satisfaction_score: 4.8
                }
            };

            this.logger.info('Developer analytics generated', {
                customer_id: customerId,
                period: period,
                projects_created: analytics.development_metrics.projects_created
            });

            return analytics;
        } catch (error) {
            this.logger.error('Failed to generate developer analytics', {
                error: error.message,
                customer_id: customerId
            });
            throw error;
        }
    }

    /**
     * Handle template-specific webhooks
     */
    async processTemplateWebhook(rawBody, signature) {
        try {
            const event = this.stripe.webhooks.constructEvent(
                rawBody,
                signature,
                process.env.STRIPE_TEMPLATE_WEBHOOK_SECRET
            );

            this.logger.info('Template webhook received', {
                event_type: event.type,
                event_id: event.id
            });

            switch (event.type) {
                case 'customer.subscription.created':
                    return this.handleDeveloperSubscriptionCreated(event.data.object);
                
                case 'payment_intent.succeeded':
                    return this.handlePremiumContentPurchased(event.data.object);
                
                case 'customer.subscription.updated':
                    return this.handleDeveloperPlanChanged(event.data.object);
                
                default:
                    this.logger.info('Unhandled template webhook event', { type: event.type });
                    return { received: true };
            }
        } catch (error) {
            this.logger.error('Template webhook processing failed', {
                error: error.message
            });
            throw error;
        }
    }

    // Template-specific webhook handlers
    async handleDeveloperSubscriptionCreated(subscription) {
        // Enable premium templates and components
        // Send welcome package with getting started guide
        // Reset monthly download counters
        this.logger.info('Developer subscription activated', {
            subscription_id: subscription.id,
            customer_id: subscription.customer
        });
    }

    async handlePremiumContentPurchased(paymentIntent) {
        if (paymentIntent.metadata.platform === 'tiation-react-template') {
            // Grant access to premium content
            // Send download links and documentation
            // Add commercial license if applicable
            this.logger.info('Premium content purchased', {
                payment_intent_id: paymentIntent.id,
                content_type: paymentIntent.metadata.content_type
            });
        }
    }

    async handleDeveloperPlanChanged(subscription) {
        // Update feature access based on new plan
        // Handle upgrade/downgrade scenarios
        // Migrate data if needed
        this.logger.info('Developer plan changed', {
            subscription_id: subscription.id,
            new_plan: subscription.metadata.plan_id
        });
    }

    /**
     * Create team subscription for multiple developers
     */
    async createTeamSubscription(teamData) {
        try {
            const { team_lead_customer_id, team_size, company_name } = teamData;
            
            // Calculate team pricing (base price + per-member cost)
            const basePrice = this.plans.team.price;
            const additionalMembers = Math.max(0, team_size - 5); // First 5 included
            const additionalCost = additionalMembers * 999; // $9.99 per additional member
            const totalAmount = basePrice + additionalCost;

            const subscription = await this.stripe.subscriptions.create({
                customer: team_lead_customer_id,
                items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Team Plan: ${company_name}`,
                            description: `Team subscription for ${team_size} developers`
                        },
                        unit_amount: totalAmount,
                        recurring: {
                            interval: 'month'
                        }
                    }
                }],
                metadata: {
                    subscription_type: 'team',
                    team_size: team_size,
                    company_name: company_name,
                    platform: 'tiation-react-template'
                }
            });

            this.logger.info('Team subscription created', {
                subscription_id: subscription.id,
                company_name: company_name,
                team_size: team_size,
                total_amount: totalAmount
            });

            return subscription;
        } catch (error) {
            this.logger.error('Failed to create team subscription', {
                error: error.message,
                team_data: teamData
            });
            throw error;
        }
    }

    // Helper methods
    calculateRemainingDownloads(customerId, currentDownloads) {
        // This would check the subscription plan and calculate remaining downloads
        return 10 - currentDownloads; // Simplified example
    }

    calculateProductivityScore(customer) {
        // Calculate productivity score based on usage patterns
        const projects = parseInt(customer.metadata.projects_created || 0);
        const downloads = parseInt(customer.metadata.downloads_this_month || 0);
        return Math.min(100, (projects * 10) + (downloads * 2));
    }

    getSubscriptionValue(customerId) {
        // Return current subscription value - would integrate with Stripe
        return this.plans.developer.price / 100; // Simplified
    }

    /**
     * Generate custom component quote
     */
    async generateCustomQuote(customerId, requirements) {
        try {
            const {
                component_type,
                complexity_level,
                deadline_weeks,
                design_included,
                testing_required
            } = requirements;

            let basePrice = this.plans.content_pricing.custom_component;
            
            // Complexity multiplier
            const complexityMultipliers = {
                simple: 0.5,
                medium: 1.0,
                complex: 2.0,
                enterprise: 3.0
            };

            // Rush job multiplier
            const rushMultiplier = deadline_weeks < 2 ? 1.5 : 1.0;
            
            const finalPrice = Math.round(
                basePrice * 
                (complexityMultipliers[complexity_level] || 1.0) * 
                rushMultiplier *
                (design_included ? 1.3 : 1.0) *
                (testing_required ? 1.2 : 1.0)
            );

            this.logger.info('Custom component quote generated', {
                customer_id: customerId,
                component_type,
                complexity_level,
                final_price: finalPrice
            });

            return {
                quote_id: `quote_${Date.now()}`,
                base_price: basePrice,
                final_price: finalPrice,
                delivery_estimate: `${deadline_weeks} weeks`,
                includes: {
                    component_development: true,
                    documentation: true,
                    design_files: design_included,
                    unit_tests: testing_required,
                    commercial_license: true
                }
            };
        } catch (error) {
            this.logger.error('Failed to generate custom quote', {
                error: error.message,
                customer_id: customerId
            });
            throw error;
        }
    }
}

module.exports = TemplateSaaSService;

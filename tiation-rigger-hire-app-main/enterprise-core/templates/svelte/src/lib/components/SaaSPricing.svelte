<script lang="ts">
	import { onMount } from 'svelte';
	
	interface PricingPlan {
		name: string;
		price: number;
		interval: 'month' | 'year';
		features: string[];
		highlighted?: boolean;
		stripePriceId?: string;
	}

	export let plans: PricingPlan[] = [
		{
			name: 'Starter',
			price: 9,
			interval: 'month',
			features: ['Up to 5 users', 'Basic analytics', 'Email support', 'Mobile access'],
			stripePriceId: 'price_starter_monthly'
		},
		{
			name: 'Professional',
			price: 29,
			interval: 'month',
			features: ['Up to 25 users', 'Advanced analytics', 'Priority support', 'API access', 'Custom integrations'],
			highlighted: true,
			stripePriceId: 'price_professional_monthly'
		},
		{
			name: 'Enterprise',
			price: 99,
			interval: 'month',
			features: ['Unlimited users', 'Custom analytics', 'Dedicated support', 'White-label options', 'SLA guarantee'],
			stripePriceId: 'price_enterprise_monthly'
		}
	];

	let loading = false;

	async function handleSubscribe(plan: PricingPlan) {
		loading = true;
		try {
			// Integration with Supabase and Stripe
			const response = await fetch('/api/create-subscription', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					priceId: plan.stripePriceId,
					planName: plan.name
				})
			});

			const { checkoutUrl } = await response.json();
			
			if (checkoutUrl) {
				window.location.href = checkoutUrl;
			}
		} catch (error) {
			console.error('Subscription error:', error);
		} finally {
			loading = false;
		}
	}
</script>

<div class="pricing-section py-16 px-4">
	<div class="max-w-7xl mx-auto">
		<div class="text-center mb-12">
			<h2 class="text-4xl font-bold mb-4 tiation-gradient-text">
				Choose Your Plan
			</h2>
			<p class="text-xl text-gray-300 max-w-3xl mx-auto">
				Scale your business with our enterprise-grade {{PROJECT_NAME}} platform. 
				All plans include mobile optimization and dark neon theme.
			</p>
		</div>

		<div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
			{#each plans as plan}
				<div class="pricing-card tiation-glass p-8 rounded-xl relative tiation-card-hover
					{plan.highlighted ? 'tiation-neon-border scale-105' : 'border border-gray-600'}">
					
					{#if plan.highlighted}
						<div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
							<span class="bg-gradient-to-r from-tiation-cyan to-tiation-magenta px-4 py-1 rounded-full text-sm font-semibold text-black">
								Most Popular
							</span>
						</div>
					{/if}

					<div class="text-center mb-8">
						<h3 class="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
						<div class="mb-4">
							<span class="text-5xl font-bold text-tiation-cyan">${plan.price}</span>
							<span class="text-gray-300">/{plan.interval}</span>
						</div>
					</div>

					<ul class="space-y-4 mb-8">
						{#each plan.features as feature}
							<li class="flex items-center text-gray-300">
								<svg class="w-5 h-5 text-tiation-cyan mr-3" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
								{feature}
							</li>
						{/each}
					</ul>

					<button 
						class="w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300
						{plan.highlighted 
							? 'bg-gradient-to-r from-tiation-cyan to-tiation-magenta text-black hover:shadow-neon-gradient' 
							: 'bg-transparent border-2 border-tiation-cyan text-tiation-cyan hover:bg-tiation-cyan hover:text-black'
						} 
						{loading ? 'opacity-50 cursor-not-allowed' : ''}"
						disabled={loading}
						on:click={() => handleSubscribe(plan)}
					>
						{loading ? 'Processing...' : 'Get Started'}
					</button>
				</div>
			{/each}
		</div>

		<div class="text-center mt-12">
			<p class="text-gray-400 mb-4">
				All plans include 14-day free trial • No setup fees • Cancel anytime
			</p>
			<div class="flex justify-center space-x-8 text-sm text-gray-500">
				<span>✓ Mobile Optimized</span>
				<span>✓ Enterprise Security</span>
				<span>✓ 99.9% Uptime SLA</span>
				<span>✓ 24/7 Support</span>
			</div>
		</div>
	</div>
</div>

<style>
	.pricing-card {
		transition: all 0.3s ease;
	}
	
	.pricing-card:hover {
		transform: translateY(-4px);
	}
	
	.pricing-section {
		background: linear-gradient(135deg, rgba(0, 255, 255, 0.05) 0%, rgba(255, 0, 255, 0.05) 100%);
	}
</style>

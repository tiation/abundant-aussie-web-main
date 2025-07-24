// Tiation AI Agents - Stripe Integration Template
// This template provides a complete Stripe integration for SaaS subscriptions

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Pricing Configuration
const PRICING_PLANS = {
  starter: {
    priceId: 'price_starter_monthly',
    name: 'Starter',
    price: 9900, // $99.00 in cents
    features: [
      'Up to 5 AI agents',
      'Basic automation workflows',
      'Email support',
      'Community access'
    ],
    limits: {
      agents: 5,
      workflows: 10,
      apiCalls: 1000
    }
  },
  professional: {
    priceId: 'price_professional_monthly',
    name: 'Professional',
    price: 29900, // $299.00 in cents
    features: [
      'Up to 25 AI agents',
      'Advanced workflow builder',
      'API access',
      'Priority support',
      'Custom integrations'
    ],
    limits: {
      agents: 25,
      workflows: 100,
      apiCalls: 10000
    }
  },
  enterprise: {
    priceId: 'price_enterprise_monthly',
    name: 'Enterprise',
    price: 99900, // $999.00 in cents
    features: [
      'Unlimited AI agents',
      'White-label options',
      'Dedicated support',
      'Custom development',
      'SLA guarantees'
    ],
    limits: {
      agents: -1, // unlimited
      workflows: -1,
      apiCalls: -1
    }
  }
};

// Create Stripe Customer
async function createCustomer(email, name, organizationName) {
  try {
    const customer = await stripe.customers.create({
      email: email,
      name: name,
      metadata: {
        organization: organizationName,
        platform: 'tiation-ai-agents'
      }
    });
    return customer;
  } catch (error) {
    throw new Error(`Failed to create customer: ${error.message}`);
  }
}

// Create Subscription
async function createSubscription(customerId, priceId, trialDays = 14) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      trial_period_days: trialDays,
      metadata: {
        platform: 'tiation-ai-agents',
        plan: getPlanByPriceId(priceId)
      }
    });
    return subscription;
  } catch (error) {
    throw new Error(`Failed to create subscription: ${error.message}`);
  }
}

// Create Checkout Session
async function createCheckoutSession(customerId, priceId, successUrl, cancelUrl) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      trial_period_days: 14,
      metadata: {
        platform: 'tiation-ai-agents'
      }
    });
    return session;
  } catch (error) {
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
}

// Create Customer Portal Session
async function createPortalSession(customerId, returnUrl) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session;
  } catch (error) {
    throw new Error(`Failed to create portal session: ${error.message}`);
  }
}

// Usage-based billing for API calls
async function recordUsage(subscriptionItemId, quantity, timestamp) {
  try {
    const usageRecord = await stripe.subscriptionItems.createUsageRecord(
      subscriptionItemId,
      {
        quantity: quantity,
        timestamp: timestamp,
        action: 'increment'
      }
    );
    return usageRecord;
  } catch (error) {
    throw new Error(`Failed to record usage: ${error.message}`);
  }
}

// Get plan details by price ID
function getPlanByPriceId(priceId) {
  return Object.keys(PRICING_PLANS).find(plan => 
    PRICING_PLANS[plan].priceId === priceId
  );
}

// Webhook handler for Stripe events
async function handleWebhook(event) {
  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Webhook error:', error);
    throw error;
  }
}

// Handle subscription created
async function handleSubscriptionCreated(subscription) {
  // Update user's subscription status in your database
  const customerId = subscription.customer;
  const planName = subscription.metadata.plan;
  
  // Update user record
  await updateUserSubscription(customerId, {
    status: 'active',
    plan: planName,
    subscriptionId: subscription.id,
    currentPeriodEnd: subscription.current_period_end
  });
  
  // Send welcome email
  await sendWelcomeEmail(customerId, planName);
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription) {
  const customerId = subscription.customer;
  const planName = subscription.metadata.plan;
  
  await updateUserSubscription(customerId, {
    status: subscription.status,
    plan: planName,
    currentPeriodEnd: subscription.current_period_end
  });
}

// Handle subscription deleted
async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer;
  
  await updateUserSubscription(customerId, {
    status: 'cancelled',
    plan: null,
    subscriptionId: null
  });
  
  // Send cancellation email
  await sendCancellationEmail(customerId);
}

// Handle payment succeeded
async function handlePaymentSucceeded(invoice) {
  const customerId = invoice.customer;
  const amount = invoice.amount_paid;
  
  // Record payment in your database
  await recordPayment(customerId, amount);
  
  // Send receipt email
  await sendReceiptEmail(customerId, amount);
}

// Handle payment failed
async function handlePaymentFailed(invoice) {
  const customerId = invoice.customer;
  
  // Update user's payment status
  await updateUserPaymentStatus(customerId, 'failed');
  
  // Send payment failure email
  await sendPaymentFailureEmail(customerId);
}

// Utility functions (implement these based on your database)
async function updateUserSubscription(customerId, updates) {
  // Implement database update logic
  console.log(`Updating subscription for customer ${customerId}:`, updates);
}

async function recordPayment(customerId, amount) {
  // Implement payment recording logic
  console.log(`Recording payment for customer ${customerId}: $${amount / 100}`);
}

async function updateUserPaymentStatus(customerId, status) {
  // Implement payment status update logic
  console.log(`Updating payment status for customer ${customerId}: ${status}`);
}

// Email functions (implement with your email service)
async function sendWelcomeEmail(customerId, planName) {
  console.log(`Sending welcome email to customer ${customerId} for plan ${planName}`);
}

async function sendCancellationEmail(customerId) {
  console.log(`Sending cancellation email to customer ${customerId}`);
}

async function sendReceiptEmail(customerId, amount) {
  console.log(`Sending receipt email to customer ${customerId} for $${amount / 100}`);
}

async function sendPaymentFailureEmail(customerId) {
  console.log(`Sending payment failure email to customer ${customerId}`);
}

// Export functions
module.exports = {
  PRICING_PLANS,
  createCustomer,
  createSubscription,
  createCheckoutSession,
  createPortalSession,
  recordUsage,
  getPlanByPriceId,
  handleWebhook
};

// Usage example:
/*
const stripe = require('./stripe-integration');

// Create a new customer and subscription
async function signUpUser(email, name, organizationName, planId) {
  try {
    // Create Stripe customer
    const customer = await stripe.createCustomer(email, name, organizationName);
    
    // Get price ID for the selected plan
    const priceId = stripe.PRICING_PLANS[planId].priceId;
    
    // Create subscription with 14-day trial
    const subscription = await stripe.createSubscription(customer.id, priceId, 14);
    
    // Save customer and subscription info to your database
    await saveUserToDatabase({
      email,
      name,
      organizationName,
      stripeCustomerId: customer.id,
      subscriptionId: subscription.id,
      plan: planId,
      status: 'trial'
    });
    
    return { customer, subscription };
  } catch (error) {
    console.error('Sign up failed:', error);
    throw error;
  }
}
*/

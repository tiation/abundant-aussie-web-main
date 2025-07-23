import { createClient } from '../supabase/client';
import { SUBSCRIPTION_PLANS, SubscriptionTier } from '@/config/subscriptionPlans';
import { Business, SubscriptionFeature } from '@/lib/types';

export class SubscriptionManager {
  private supabase = createClient();

  async getBusinessSubscription(businessId: string): Promise<{
    tier: SubscriptionTier;
    status: string;
    features: string[];
  }> {
    const { data: business, error } = await this.supabase
      .from('businesses')
      .select('subscription_tier, subscription_status')
      .eq('id', businessId)
      .single();

    if (error) throw error;

    const { data: features } = await this.supabase
      .from('subscription_features')
      .select('feature_key, feature_value')
      .eq('tier', business.subscription_tier);

    return {
      tier: business.subscription_tier,
      status: business.subscription_status,
      features: features?.map(f => f.feature_key) || [],
    };
  }

  async checkFeatureAccess(
    businessId: string,
    featureKey: string
  ): Promise<boolean> {
    const { data, error } = await this.supabase
      .rpc('check_subscription_features', {
        business_id: businessId,
        feature_key: featureKey,
      });

    if (error) throw error;
    return data;
  }

  async getActiveSubscriptionLimits(businessId: string): Promise<{
    maxJobPostings: number;
    maxUsers: number;
    maxStorageGB: number;
    apiRequestsPerMonth: number;
  }> {
    const { tier } = await this.getBusinessSubscription(businessId);
    
    const limits = {
      FREE: {
        maxJobPostings: 3,
        maxUsers: 2,
        maxStorageGB: 1,
        apiRequestsPerMonth: 1000,
      },
      PREMIUM: {
        maxJobPostings: 10,
        maxUsers: 5,
        maxStorageGB: 5,
        apiRequestsPerMonth: 10000,
      },
      ENTERPRISE: {
        maxJobPostings: Infinity,
        maxUsers: Infinity,
        maxStorageGB: 50,
        apiRequestsPerMonth: 100000,
      },
    };

    return limits[tier];
  }

  async checkUsageLimits(businessId: string, metric: keyof ReturnType<typeof this.getActiveSubscriptionLimits>): Promise<{
    current: number;
    limit: number;
    isWithinLimit: boolean;
  }> {
    const limits = await this.getActiveSubscriptionLimits(businessId);
    const limit = limits[metric];

    // Get current usage from relevant table
    const current = await this.getCurrentUsage(businessId, metric);

    return {
      current,
      limit,
      isWithinLimit: current < limit,
    };
  }

  private async getCurrentUsage(businessId: string, metric: string): Promise<number> {
    switch (metric) {
      case 'maxJobPostings':
        const { count: jobCount } = await this.supabase
          .from('jobs')
          .select('*', { count: 'exact' })
          .eq('business_id', businessId)
          .eq('status', 'active');
        return jobCount || 0;

      case 'maxUsers':
        const { count: userCount } = await this.supabase
          .from('business_members')
          .select('*', { count: 'exact' })
          .eq('business_id', businessId);
        return userCount || 0;

      case 'maxStorageGB':
        const { data: storage } = await this.supabase
          .from('business_storage')
          .select('used_bytes')
          .eq('business_id', businessId)
          .single();
        return (storage?.used_bytes || 0) / (1024 * 1024 * 1024); // Convert bytes to GB

      case 'apiRequestsPerMonth':
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const { count: requestCount } = await this.supabase
          .from('api_requests')
          .select('*', { count: 'exact' })
          .eq('business_id', businessId)
          .gte('created_at', startOfMonth.toISOString());
        return requestCount || 0;

      default:
        return 0;
    }
  }
}

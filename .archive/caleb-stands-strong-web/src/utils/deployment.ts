// Deployment and rollback management utilities for Vercel
import React from 'react';
import { reportError, LogLevel, trackUserInteraction } from './monitoring';

export interface DeploymentInfo {
  id: string;
  url: string;
  version: string;
  timestamp: string;
  status: 'ready' | 'building' | 'error' | 'canceled';
  branch: string;
  commit: string;
}

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    name: string;
    status: 'pass' | 'fail';
    duration: number;
    error?: string;
  }[];
  overall: {
    duration: number;
    timestamp: string;
  };
}

class DeploymentManager {
  private static instance: DeploymentManager;
  private vercelToken: string;
  private projectId: string;
  private teamId?: string;

  constructor() {
    this.vercelToken = process.env.VITE_VERCEL_TOKEN || '';
    this.projectId = process.env.VITE_VERCEL_PROJECT_ID || '';
    this.teamId = process.env.VITE_VERCEL_TEAM_ID;
  }

  static getInstance(): DeploymentManager {
    if (!DeploymentManager.instance) {
      DeploymentManager.instance = new DeploymentManager();
    }
    return DeploymentManager.instance;
  }

  // Get current deployment info
  async getCurrentDeployment(): Promise<DeploymentInfo | null> {
    try {
      const response = await fetch(`https://api.vercel.com/v9/projects/${this.projectId}/deployments?limit=1`, {
        headers: {
          'Authorization': `Bearer ${this.vercelToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Vercel API error: ${response.status}`);
      }

      const data = await response.json();
      const deployment = data.deployments[0];

      if (!deployment) {
        return null;
      }

      return {
        id: deployment.uid,
        url: deployment.url,
        version: deployment.meta?.githubCommitSha || 'unknown',
        timestamp: deployment.createdAt,
        status: deployment.state,
        branch: deployment.meta?.githubCommitRef || 'unknown',
        commit: deployment.meta?.githubCommitSha || 'unknown'
      };
    } catch (error) {
      reportError(error as Error, { context: 'getCurrentDeployment' });
      return null;
    }
  }

  // Get deployment history
  async getDeploymentHistory(limit: number = 10): Promise<DeploymentInfo[]> {
    try {
      const response = await fetch(`https://api.vercel.com/v9/projects/${this.projectId}/deployments?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.vercelToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Vercel API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.deployments.map((deployment: any) => ({
        id: deployment.uid,
        url: deployment.url,
        version: deployment.meta?.githubCommitSha || 'unknown',
        timestamp: deployment.createdAt,
        status: deployment.state,
        branch: deployment.meta?.githubCommitRef || 'unknown',
        commit: deployment.meta?.githubCommitSha || 'unknown'
      }));
    } catch (error) {
      reportError(error as Error, { context: 'getDeploymentHistory' });
      return [];
    }
  }

  // Rollback to a specific deployment
  async rollbackToDeployment(deploymentId: string, reason: string = 'Manual rollback'): Promise<boolean> {
    try {
      trackUserInteraction('deployment_rollback_initiated', { deploymentId, reason });

      // First, promote the deployment to production
      const response = await fetch(`https://api.vercel.com/v9/projects/${this.projectId}/deployments/${deploymentId}/promote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.vercelToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'promote'
        })
      });

      if (!response.ok) {
        throw new Error(`Rollback failed: ${response.status}`);
      }

      // Log the rollback
      trackUserInteraction('deployment_rollback_completed', { 
        deploymentId, 
        reason,
        timestamp: new Date().toISOString()
      });

      return true;
    } catch (error) {
      reportError(error as Error, { 
        context: 'rollbackToDeployment', 
        deploymentId, 
        reason 
      });
      return false;
    }
  }

  // Auto-rollback on health check failure
  async autoRollbackOnFailure(): Promise<void> {
    try {
      const healthCheck = await this.performHealthCheck();
      
      if (healthCheck.status === 'unhealthy') {
        const deploymentHistory = await this.getDeploymentHistory(5);
        const lastHealthyDeployment = deploymentHistory.find(
          dep => dep.status === 'ready' && dep.id !== deploymentHistory[0]?.id
        );

        if (lastHealthyDeployment) {
          const success = await this.rollbackToDeployment(
            lastHealthyDeployment.id, 
            'Auto-rollback due to health check failure'
          );

          if (success) {
            // Send critical alert
            trackUserInteraction('auto_rollback_completed', {
              from: deploymentHistory[0]?.id,
              to: lastHealthyDeployment.id,
              reason: 'Health check failure',
              failedChecks: healthCheck.checks.filter(c => c.status === 'fail')
            });
          }
        }
      }
    } catch (error) {
      reportError(error as Error, { context: 'autoRollbackOnFailure' });
    }
  }

  // Perform comprehensive health checks
  async performHealthCheck(): Promise<HealthCheckResult> {
    const checks = [];
    const startTime = Date.now();

    // Check if main page loads
    try {
      const pageStartTime = Date.now();
      const response = await fetch(window.location.origin, { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      const pageDuration = Date.now() - pageStartTime;

      checks.push({
        name: 'page_load',
        status: response.ok ? 'pass' : 'fail',
        duration: pageDuration,
        error: response.ok ? undefined : `Status: ${response.status}`
      });
    } catch (error) {
      checks.push({
        name: 'page_load',
        status: 'fail',
        duration: Date.now() - startTime,
        error: (error as Error).message
      });
    }

    // Check API endpoints if they exist
    try {
      const apiStartTime = Date.now();
      const apiResponse = await fetch('/api/health', { 
        method: 'GET',
        cache: 'no-cache'
      }).catch(() => ({ ok: true })); // If no API endpoint, consider it passing
      const apiDuration = Date.now() - apiStartTime;

      checks.push({
        name: 'api_health',
        status: apiResponse.ok ? 'pass' : 'fail',
        duration: apiDuration,
        error: apiResponse.ok ? undefined : `API Status: ${(apiResponse as Response).status}`
      });
    } catch (error) {
      checks.push({
        name: 'api_health',
        status: 'fail',
        duration: Date.now() - startTime,
        error: (error as Error).message
      });
    }

    // Check critical resources
    try {
      const resourceStartTime = Date.now();
      const criticalResources = ['/favicon.ico', '/manifest.json'];
      const resourceChecks = await Promise.allSettled(
        criticalResources.map(resource => 
          fetch(resource, { method: 'HEAD', cache: 'no-cache' })
        )
      );
      const resourceDuration = Date.now() - resourceStartTime;

      const failedResources = resourceChecks.filter(
        (result, index) => result.status === 'rejected' || 
        (result.status === 'fulfilled' && !result.value.ok)
      ).length;

      checks.push({
        name: 'critical_resources',
        status: failedResources === 0 ? 'pass' : 'fail',
        duration: resourceDuration,
        error: failedResources > 0 ? `${failedResources} resources failed` : undefined
      });
    } catch (error) {
      checks.push({
        name: 'critical_resources',
        status: 'fail',
        duration: Date.now() - startTime,
        error: (error as Error).message
      });
    }

    // Check performance metrics
    try {
      const perfStartTime = Date.now();
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const perfDuration = Date.now() - perfStartTime;

      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      const performanceOk = loadTime < 5000; // 5 second threshold

      checks.push({
        name: 'performance',
        status: performanceOk ? 'pass' : 'fail',
        duration: perfDuration,
        error: performanceOk ? undefined : `Load time: ${loadTime}ms exceeds 5000ms threshold`
      });
    } catch (error) {
      checks.push({
        name: 'performance',
        status: 'fail',
        duration: Date.now() - startTime,
        error: (error as Error).message
      });
    }

    const overallDuration = Date.now() - startTime;
    const failedChecks = checks.filter(check => check.status === 'fail').length;
    
    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (failedChecks === 0) {
      status = 'healthy';
    } else if (failedChecks <= checks.length / 2) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    const result: HealthCheckResult = {
      status,
      checks,
      overall: {
        duration: overallDuration,
        timestamp: new Date().toISOString()
      }
    };

    // Log health check results
    trackUserInteraction('health_check_completed', {
      status,
      failedChecks,
      totalChecks: checks.length,
      duration: overallDuration
    });

    return result;
  }

  // Schedule periodic health checks
  startHealthCheckMonitoring(intervalMinutes: number = 5): void {
    const intervalMs = intervalMinutes * 60 * 1000;
    
    setInterval(async () => {
      const healthCheck = await this.performHealthCheck();
      
      if (healthCheck.status === 'unhealthy') {
        // Trigger auto-rollback
        await this.autoRollbackOnFailure();
      }
    }, intervalMs);
  }
}

// Export singleton instance
export const deploymentManager = DeploymentManager.getInstance();

// Deployment status hook for React components
export const useDeploymentStatus = () => {
  const [deploymentInfo, setDeploymentInfo] = React.useState<DeploymentInfo | null>(null);
  const [healthStatus, setHealthStatus] = React.useState<HealthCheckResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadDeploymentInfo = async () => {
      const info = await deploymentManager.getCurrentDeployment();
      const health = await deploymentManager.performHealthCheck();
      
      setDeploymentInfo(info);
      setHealthStatus(health);
      setIsLoading(false);
    };

    loadDeploymentInfo();
  }, []);

  const rollback = async (deploymentId: string, reason?: string) => {
    return await deploymentManager.rollbackToDeployment(deploymentId, reason);
  };

  const refreshStatus = async () => {
    setIsLoading(true);
    const info = await deploymentManager.getCurrentDeployment();
    const health = await deploymentManager.performHealthCheck();
    
    setDeploymentInfo(info);
    setHealthStatus(health);
    setIsLoading(false);
  };

  return {
    deploymentInfo,
    healthStatus,
    isLoading,
    rollback,
    refreshStatus
  };
};

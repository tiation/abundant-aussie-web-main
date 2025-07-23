import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  GitBranch, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Undo2,
  ExternalLink,
  Activity
} from 'lucide-react';
import { 
  useDeploymentStatus, 
  DeploymentInfo, 
  HealthCheckResult 
} from '@/utils/deployment';
import { trackUserInteraction } from '@/utils/monitoring';

interface DeploymentDashboardProps {
  showFullHistory?: boolean;
  onRollback?: (deploymentId: string) => void;
}

const DeploymentDashboard: React.FC<DeploymentDashboardProps> = ({ 
  showFullHistory = false,
  onRollback
}) => {
  const { 
    deploymentInfo, 
    healthStatus, 
    isLoading, 
    rollback, 
    refreshStatus 
  } = useDeploymentStatus();
  
  const [rollbackLoading, setRollbackLoading] = useState<string | null>(null);

  const handleRollback = async (deploymentId: string, reason?: string) => {
    setRollbackLoading(deploymentId);
    trackUserInteraction('manual_rollback_initiated', { deploymentId, reason });
    
    try {
      const success = await rollback(deploymentId, reason);
      if (success) {
        await refreshStatus();
        onRollback?.(deploymentId);
      }
    } catch (error) {
      console.error('Rollback failed:', error);
    } finally {
      setRollbackLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'success';
      case 'building': return 'warning';
      case 'error': return 'destructive';
      case 'canceled': return 'secondary';
      default: return 'secondary';
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'degraded': return 'warning';
      case 'unhealthy': return 'destructive';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Deployment Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading deployment information...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Deployment Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Current Deployment
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshStatus}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {deploymentInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(deploymentInfo.status)}>
                    {deploymentInfo.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Status
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  <span className="text-sm">{deploymentInfo.branch}</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {deploymentInfo.commit.substring(0, 7)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(deploymentInfo.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <a 
                  href={`https://${deploymentInfo.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Deployment
                </a>
                
                <div className="text-xs text-muted-foreground">
                  ID: {deploymentInfo.id}
                </div>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                No deployment information available
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Health Status */}
      {healthStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {healthStatus.status === 'healthy' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : healthStatus.status === 'degraded' ? (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              Application Health
            </CardTitle>
            <CardDescription>
              Last checked: {new Date(healthStatus.overall.timestamp).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Overall Status</span>
                <Badge variant={getHealthStatusColor(healthStatus.status)}>
                  {healthStatus.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {healthStatus.checks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {check.status === 'pass' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="capitalize">
                        {check.name.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {check.duration}ms
                      </span>
                      {check.error && (
                        <span className="text-red-600 text-xs" title={check.error}>
                          Error
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {healthStatus.status === 'unhealthy' && (
                <Alert variant="destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    Application is unhealthy. Consider rolling back to a previous deployment.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Rollback Actions */}
      {deploymentInfo && healthStatus?.status === 'unhealthy' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Undo2 className="w-5 h-5" />
              Emergency Actions
            </CardTitle>
            <CardDescription>
              Quick actions for critical issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                variant="destructive"
                onClick={() => handleRollback(deploymentInfo.id, 'Emergency rollback due to health check failure')}
                disabled={rollbackLoading === deploymentInfo.id}
              >
                {rollbackLoading === deploymentInfo.id ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Undo2 className="w-4 h-4 mr-2" />
                )}
                Emergency Rollback
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Hard Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      {healthStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">
                  {healthStatus.overall.duration}ms
                </div>
                <div className="text-sm text-muted-foreground">
                  Health Check Duration
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {healthStatus.checks.filter(c => c.status === 'pass').length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Passing Checks
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {healthStatus.checks.filter(c => c.status === 'fail').length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Failed Checks
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold">
                  {Math.round((healthStatus.checks.filter(c => c.status === 'pass').length / healthStatus.checks.length) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Success Rate
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeploymentDashboard;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Server,
  Database,
  Wifi,
  Clock
} from 'lucide-react';

interface SystemMetrics {
  uptime: number;
  responseTime: number;
  errorRate: number;
  activeUsers: number;
  revenue: number;
  conversions: number;
}

interface HealthCheck {
  service: string;
  status: 'healthy' | 'warning' | 'critical';
  responseTime: number;
  lastChecked: Date;
}

export const LaunchMonitoring: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    uptime: 99.9,
    responseTime: 120,
    errorRate: 0.01,
    activeUsers: 1247,
    revenue: 15680,
    conversions: 23
  });

  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([
    {
      service: 'API Gateway',
      status: 'healthy',
      responseTime: 85,
      lastChecked: new Date()
    },
    {
      service: 'Database',
      status: 'healthy',
      responseTime: 45,
      lastChecked: new Date()
    },
    {
      service: 'CDN',
      status: 'warning',
      responseTime: 250,
      lastChecked: new Date()
    },
    {
      service: '3D Rendering',
      status: 'healthy',
      responseTime: 180,
      lastChecked: new Date()
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time metrics updates
      setMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        responseTime: Math.max(50, prev.responseTime + Math.floor(Math.random() * 20 - 10)),
        revenue: prev.revenue + Math.floor(Math.random() * 100)
      }));

      // Update health checks
      setHealthChecks(prev => prev.map(check => ({
        ...check,
        responseTime: Math.max(30, check.responseTime + Math.floor(Math.random() * 40 - 20)),
        lastChecked: new Date(),
        status: check.responseTime > 200 ? 'warning' : 'healthy'
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatUptime = (uptime: number) => {
    return uptime.toFixed(2) + '%';
  };

  return (
    <div className="p-6 space-y-6 bg-crd-darkest min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Launch Monitoring</h1>
        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500">
          <CheckCircle className="w-4 h-4 mr-2" />
          System Operational
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-crd-dark border-crd-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatUptime(metrics.uptime)}</div>
            <p className="text-xs text-gray-400">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-gray-400">Currently online</p>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${metrics.revenue.toLocaleString()}</div>
            <p className="text-xs text-gray-400">Today</p>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.responseTime}ms</div>
            <p className="text-xs text-gray-400">Average</p>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-crd-dark border-crd-border">
          <CardHeader>
            <CardTitle className="text-white">System Health</CardTitle>
            <CardDescription className="text-gray-400">
              Real-time status of core services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {healthChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-crd-darkest">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(check.status)}`} />
                  <span className="text-white font-medium">{check.service}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white">{check.responseTime}ms</div>
                  <div className="text-xs text-gray-400">
                    {check.lastChecked.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <Button className="w-full bg-crd-primary hover:bg-crd-primary/80">
              Run Full Health Check
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-border">
          <CardHeader>
            <CardTitle className="text-white">Performance Metrics</CardTitle>
            <CardDescription className="text-gray-400">
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">CPU Usage</span>
                <span className="text-white">68%</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Memory Usage</span>
                <span className="text-white">42%</span>
              </div>
              <Progress value={42} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Database Load</span>
                <span className="text-white">31%</span>
              </div>
              <Progress value={31} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">Network I/O</span>
                <span className="text-white">55%</span>
              </div>
              <Progress value={55} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <Card className="bg-crd-dark border-crd-border">
        <CardHeader>
          <CardTitle className="text-white">System Alerts</CardTitle>
          <CardDescription className="text-gray-400">
            Recent system events and notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert className="border-yellow-500/20 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-200">
              CDN response time elevated. Monitoring for improvement.
            </AlertDescription>
          </Alert>
          
          <Alert className="border-green-500/20 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-200">
              Database optimization completed successfully.
            </AlertDescription>
          </Alert>
          
          <Alert className="border-blue-500/20 bg-blue-500/10">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-200">
              User engagement up 15% since launch.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

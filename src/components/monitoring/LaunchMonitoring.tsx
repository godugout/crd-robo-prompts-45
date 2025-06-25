
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Users, 
  Zap,
  Server,
  Globe,
  Database,
  Shield,
  Rocket
} from 'lucide-react';

interface SystemMetric {
  name: string;
  value: string;
  status: 'healthy' | 'warning' | 'critical';
  change?: string;
  threshold?: string;
}

interface LaunchGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  status: 'on-track' | 'at-risk' | 'achieved';
}

export const LaunchMonitoring: React.FC = () => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    { name: 'Response Time', value: '145ms', status: 'healthy', change: '-12ms', threshold: '< 200ms' },
    { name: 'Error Rate', value: '0.02%', status: 'healthy', change: '-0.01%', threshold: '< 0.1%' },
    { name: 'CPU Usage', value: '45%', status: 'healthy', change: '+5%', threshold: '< 80%' },
    { name: 'Memory Usage', value: '62%', status: 'warning', change: '+8%', threshold: '< 75%' },
    { name: 'Database Connections', value: '156/500', status: 'healthy', change: '+12', threshold: '< 400' },
    { name: 'CDN Hit Rate', value: '94.2%', status: 'healthy', change: '+1.2%', threshold: '> 90%' },
  ]);

  const [launchGoals] = useState<LaunchGoal[]>([
    {
      id: '1',
      title: 'Daily Active Users',
      target: 5000,
      current: 4250,
      unit: 'users',
      deadline: '2024-02-01',
      status: 'on-track'
    },
    {
      id: '2',
      title: 'Cards Created',
      target: 50000,
      current: 47800,
      unit: 'cards',
      deadline: '2024-02-15',
      status: 'achieved'
    },
    {
      id: '3',
      title: 'Premium Conversions',
      target: 500,
      current: 320,
      unit: 'conversions',
      deadline: '2024-01-31',
      status: 'at-risk'
    },
    {
      id: '4',
      title: 'System Uptime',
      target: 99.9,
      current: 99.95,
      unit: '%',
      deadline: 'Ongoing',
      status: 'achieved'
    }
  ];

  const [alerts] = useState([
    {
      id: '1',
      type: 'warning',
      message: 'Memory usage approaching threshold on server-2',
      timestamp: '2024-01-20T10:30:00Z',
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      message: 'New deployment completed successfully',
      timestamp: '2024-01-20T09:15:00Z',
      resolved: true
    },
    {
      id: '3',
      type: 'success',
      message: 'Daily user target exceeded',
      timestamp: '2024-01-20T08:00:00Z',
      resolved: true
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => 
        prev.map(metric => ({
          ...metric,
          value: metric.name === 'Response Time' 
            ? `${Math.floor(Math.random() * 50) + 120}ms`
            : metric.value
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-crd-green';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-400';
      default: return 'text-crd-lightGray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return Clock;
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'default';
      case 'on-track': return 'secondary';
      case 'at-risk': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Rocket className="w-8 h-8 text-crd-green" />
            Launch Monitoring
          </h1>
          <p className="text-crd-lightGray">Real-time platform health and launch success metrics</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <Activity className="w-4 h-4 mr-2" />
            Live Dashboard
          </Button>
          <Button>
            <TrendingUp className="w-4 h-4 mr-2" />
            Launch Report
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {systemMetrics.map((metric) => {
          const StatusIcon = getStatusIcon(metric.status);
          return (
            <Card key={metric.name} className="bg-crd-dark border-crd-mediumGray">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-medium text-crd-lightGray">
                    {metric.name}
                  </CardTitle>
                  <StatusIcon className={`h-3 w-3 ${getStatusColor(metric.status)}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-white">{metric.value}</div>
                {metric.change && (
                  <p className="text-xs text-crd-lightGray">
                    {metric.change} from last hour
                  </p>
                )}
                {metric.threshold && (
                  <p className="text-xs text-crd-lightGray mt-1">
                    Target: {metric.threshold}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alerts */}
      {alerts.filter(alert => !alert.resolved).length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Active Alerts</h2>
          {alerts
            .filter(alert => !alert.resolved)
            .map(alert => (
              <Alert key={alert.id} className={
                alert.type === 'warning' ? 'border-yellow-500' : 
                alert.type === 'critical' ? 'border-red-500' : 'border-crd-mediumGray'
              }>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex justify-between items-center">
                  <span>{alert.message}</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </Badge>
                    <Button size="sm" variant="outline">Resolve</Button>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="goals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-crd-dark border-crd-mediumGray">
          <TabsTrigger value="goals">Launch Goals</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {launchGoals.map(goal => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <Card key={goal.id} className="bg-crd-dark border-crd-mediumGray">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">{goal.title}</CardTitle>
                        <CardDescription>Deadline: {goal.deadline}</CardDescription>
                      </div>
                      <Badge variant={getGoalStatusColor(goal.status)}>
                        {goal.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-white">
                          {goal.current.toLocaleString()}
                        </span>
                        <span className="text-crd-lightGray">
                          / {goal.target.toLocaleString()} {goal.unit}
                        </span>
                      </div>
                      
                      <div className="w-full bg-crd-mediumGray rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            progress >= 100 ? 'bg-crd-green' :
                            progress >= 80 ? 'bg-crd-green' :
                            progress >= 60 ? 'bg-yellow-500' : 'bg-red-400'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-crd-lightGray">
                          {progress.toFixed(1)}% complete
                        </span>
                        {progress >= 100 && (
                          <span className="text-crd-green flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Goal Achieved
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-crd-green" />
                  Core Web Vitals
                </CardTitle>
                <CardDescription>User experience metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">Largest Contentful Paint</span>
                  <div className="text-right">
                    <div className="text-lg font-bold text-crd-green">1.2s</div>
                    <div className="text-xs text-crd-lightGray">Good</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">First Input Delay</span>
                  <div className="text-right">
                    <div className="text-lg font-bold text-crd-green">85ms</div>
                    <div className="text-xs text-crd-lightGray">Good</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">Cumulative Layout Shift</span>
                  <div className="text-right">
                    <div className="text-lg font-bold text-yellow-500">0.15</div>
                    <div className="text-xs text-crd-lightGray">Needs Improvement</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-crd-green" />
                  User Engagement
                </CardTitle>
                <CardDescription>Real-time user activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">Active Users</span>
                  <span className="text-lg font-bold text-white">2,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">Avg. Session Duration</span>
                  <span className="text-lg font-bold text-white">14m 32s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">Bounce Rate</span>
                  <span className="text-lg font-bold text-white">23.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">Cards Created (Today)</span>
                  <span className="text-lg font-bold text-crd-green">1,247</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-crd-green" />
                  Server Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">Web Server 1</span>
                  <Badge variant="default">Healthy</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">Web Server 2</span>
                  <Badge variant="secondary">Warning</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">API Server</span>
                  <Badge variant="default">Healthy</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">Load Balancer</span>
                  <Badge variant="default">Healthy</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-crd-green" />
                  Database Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">Primary DB</span>
                  <Badge variant="default">Healthy</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">Read Replica 1</span>
                  <Badge variant="default">Healthy</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">Redis Cache</span>
                  <Badge variant="default">Healthy</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">Connection Pool</span>
                  <span className="text-sm text-crd-lightGray">156/500</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-crd-green" />
                  Global CDN
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">US East</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">US West</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">Europe</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-crd-lightGray">Hit Rate</span>
                  <span className="text-sm font-medium text-crd-green">94.2%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-crd-green" />
                Security Monitoring
              </CardTitle>
              <CardDescription>Real-time security status and threat detection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 border border-crd-mediumGray rounded-lg">
                  <div className="text-2xl font-bold text-crd-green mb-2">0</div>
                  <p className="text-sm text-crd-lightGray">Security Threats</p>
                </div>
                <div className="text-center p-4 border border-crd-mediumGray rounded-lg">
                  <div className="text-2xl font-bold text-crd-green mb-2">A+</div>
                  <p className="text-sm text-crd-lightGray">SSL Rating</p>
                </div>
                <div className="text-center p-4 border border-crd-mediumGray rounded-lg">
                  <div className="text-2xl font-bold text-crd-green mb-2">✓</div>
                  <p className="text-sm text-crd-lightGray">GDPR Compliant</p>
                </div>
                <div className="text-center p-4 border border-crd-mediumGray rounded-lg">
                  <div className="text-2xl font-bold text-crd-green mb-2">99.9%</div>
                  <p className="text-sm text-crd-lightGray">Uptime SLA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

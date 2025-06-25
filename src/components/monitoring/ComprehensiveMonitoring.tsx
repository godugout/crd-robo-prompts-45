
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Wifi, 
  Monitor, 
  CreditCard, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';
import { usePerformanceAnalytics } from '@/hooks/usePerformanceAnalytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export const ComprehensiveMonitoring: React.FC = () => {
  const { metrics, alerts, trackDatabaseQuery, trackRenderingMetrics } = usePerformanceAnalytics();
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');

  // Mock chart data - in production, this would come from actual metrics
  const chartData = Array.from({ length: 20 }, (_, i) => ({
    time: `${i * 3}m`,
    fps: Math.random() * 20 + 40,
    queries: Math.random() * 100 + 50,
    memory: Math.random() * 500 + 200,
    payments: Math.random() * 10 + 5,
    users: Math.random() * 50 + 100
  }));

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-400';
    if (value >= thresholds.warning) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusBadge = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return <Badge className="bg-green-500/20 text-green-400">Healthy</Badge>;
    if (value >= thresholds.warning) return <Badge className="bg-yellow-500/20 text-yellow-400">Warning</Badge>;
    return <Badge className="bg-red-500/20 text-red-400">Critical</Badge>;
  };

  return (
    <div className="p-6 space-y-6 bg-crd-darkest min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Performance Monitoring</h1>
        <div className="flex items-center gap-4">
          <select 
            value={selectedTimeRange} 
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="bg-crd-dark border border-crd-border rounded px-3 py-1 text-white"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500">
            <Activity className="w-4 h-4 mr-2" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.slice(0, 3).map((alert, index) => (
            <Alert key={index} className={`border-${alert.type === 'error' ? 'red' : alert.type === 'warning' ? 'yellow' : 'blue'}-500/20 bg-${alert.type === 'error' ? 'red' : alert.type === 'warning' ? 'yellow' : 'blue'}-500/10`}>
              <AlertTriangle className={`h-4 w-4 text-${alert.type === 'error' ? 'red' : alert.type === 'warning' ? 'yellow' : 'blue'}-400`} />
              <AlertDescription className={`text-${alert.type === 'error' ? 'red' : alert.type === 'warning' ? 'yellow' : 'blue'}-200`}>
                <strong>{alert.category}:</strong> {alert.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-crd-dark border-crd-border">
          <TabsTrigger value="overview" className="data-[state=active]:bg-crd-primary">Overview</TabsTrigger>
          <TabsTrigger value="database" className="data-[state=active]:bg-crd-primary">Database</TabsTrigger>
          <TabsTrigger value="realtime" className="data-[state=active]:bg-crd-primary">Real-time</TabsTrigger>
          <TabsTrigger value="rendering" className="data-[state=active]:bg-crd-primary">3D Rendering</TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-crd-primary">Payments</TabsTrigger>
          <TabsTrigger value="engagement" className="data-[state=active]:bg-crd-primary">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Database Health</CardTitle>
                <Database className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.database.avgQueryTime.toFixed(0)}ms</div>
                <p className="text-xs text-gray-400">Avg Query Time</p>
                {getStatusBadge(100 - metrics.database.avgQueryTime / 10, { good: 90, warning: 70 })}
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Real-time Connections</CardTitle>
                <Wifi className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.realtime.activeConnections}</div>
                <p className="text-xs text-gray-400">Active Connections</p>
                {getStatusBadge(metrics.realtime.activeConnections, { good: 50, warning: 20 })}
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">3D Performance</CardTitle>
                <Monitor className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.rendering.fps.toFixed(0)} FPS</div>
                <p className="text-xs text-gray-400">Rendering Performance</p>
                {getStatusBadge(metrics.rendering.fps, { good: 50, warning: 30 })}
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Payment Success</CardTitle>
                <CreditCard className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.payments.successRate.toFixed(1)}%</div>
                <p className="text-xs text-gray-400">Success Rate</p>
                {getStatusBadge(metrics.payments.successRate, { good: 95, warning: 90 })}
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.engagement.activeUsers}</div>
                <p className="text-xs text-gray-400">Currently Online</p>
                <Badge variant="outline" className="text-blue-400 border-blue-400">+12% vs yesterday</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">System Performance Trends</CardTitle>
                <CardDescription className="text-gray-400">
                  Key metrics over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="time" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        borderRadius: '6px'
                      }}
                    />
                    <Line type="monotone" dataKey="fps" stroke="#8b5cf6" strokeWidth={2} name="FPS" />
                    <Line type="monotone" dataKey="queries" stroke="#06b6d4" strokeWidth={2} name="Queries/min" />
                    <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} name="Active Users" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">Memory & Resource Usage</CardTitle>
                <CardDescription className="text-gray-400">
                  System resource consumption
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="time" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        borderRadius: '6px'
                      }}
                    />
                    <Area type="monotone" dataKey="memory" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name="Memory (MB)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          {/* Database-specific monitoring content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Query Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Average Query Time</span>
                    <span className={`font-semibold ${getStatusColor(100 - metrics.database.avgQueryTime / 10, { good: 90, warning: 70 })}`}>
                      {metrics.database.avgQueryTime.toFixed(0)}ms
                    </span>
                  </div>
                  <Progress value={Math.min(100, metrics.database.avgQueryTime / 10)} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Slow Queries</span>
                    <span className="text-red-400">{metrics.database.slowQueries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Queries</span>
                    <span className="text-white">{metrics.database.queryCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Error Rate</span>
                    <span className="text-yellow-400">{metrics.database.errorRate.toFixed(2)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">Connection Pool</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Active Connections</span>
                    <span className="text-green-400">{metrics.database.connectionCount}</span>
                  </div>
                  <Progress value={(metrics.database.connectionCount / 100) * 100} className="h-2" />
                </div>
                <div className="text-sm text-gray-400">
                  Pool utilization: {((metrics.database.connectionCount / 100) * 100).toFixed(1)}%
                </div>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">Top Slow Queries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">SELECT * FROM cards WHERE...</span>
                    <span className="text-red-400">2.1s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">UPDATE marketplace_listings...</span>
                    <span className="text-yellow-400">1.8s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">JOIN collections c ON...</span>
                    <span className="text-yellow-400">1.5s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          {/* Real-time monitoring content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Active Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.realtime.activeConnections}</div>
                <p className="text-xs text-gray-400">Real-time subscribers</p>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Message Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.realtime.messageRate.toFixed(0)}/sec</div>
                <p className="text-xs text-gray-400">Messages per second</p>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Latency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.realtime.latency.toFixed(0)}ms</div>
                <p className="text-xs text-gray-400">Average latency</p>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.realtime.subscriptionCount}</div>
                <p className="text-xs text-gray-400">Active subscriptions</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rendering" className="space-y-6">
          {/* 3D rendering monitoring content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Frame Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.rendering.fps.toFixed(1)} FPS</div>
                <p className="text-xs text-gray-400">Current frame rate</p>
                {getStatusBadge(metrics.rendering.fps, { good: 50, warning: 30 })}
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Memory Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{(metrics.rendering.memoryUsage / 1024 / 1024).toFixed(0)}MB</div>
                <p className="text-xs text-gray-400">GPU memory used</p>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Frame Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.rendering.frameTime.toFixed(1)}ms</div>
                <p className="text-xs text-gray-400">Time per frame</p>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Render Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.rendering.renderErrors}</div>
                <p className="text-xs text-gray-400">WebGL errors</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          {/* Payment monitoring content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.payments.successRate.toFixed(1)}%</div>
                <p className="text-xs text-gray-400">Payment success rate</p>
                {getStatusBadge(metrics.payments.successRate, { good: 95, warning: 90 })}
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.payments.processingTime.toFixed(0)}ms</div>
                <p className="text-xs text-gray-400">Average processing time</p>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.payments.totalTransactions}</div>
                <p className="text-xs text-gray-400">Processed today</p>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Failed Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.payments.errorCount}</div>
                <p className="text-xs text-gray-400">Errors today</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          {/* User engagement monitoring content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.engagement.activeUsers}</div>
                <p className="text-xs text-gray-400">Currently online</p>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{Math.floor(metrics.engagement.sessionDuration / 60)}m</div>
                <p className="text-xs text-gray-400">Average session</p>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.engagement.conversionRate.toFixed(1)}%</div>
                <p className="text-xs text-gray-400">Visitor to user</p>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Bounce Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.engagement.bounceRate.toFixed(1)}%</div>
                <p className="text-xs text-gray-400">Single page visits</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

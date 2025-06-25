
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Eye,
  Target,
  Zap,
  Globe,
  Calendar
} from 'lucide-react';

interface BusinessMetrics {
  revenue: {
    total: number;
    growth: number;
    forecast: number[];
  };
  users: {
    total: number;
    active: number;
    growth: number;
    segments: { name: string; value: number; color: string }[];
  };
  content: {
    cards_created: number;
    templates_sold: number;
    engagement_rate: number;
  };
  marketplace: {
    transactions: number;
    conversion_rate: number;
    avg_order_value: number;
  };
}

export const BusinessIntelligence: React.FC = () => {
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    revenue: {
      total: 125000,
      growth: 23.5,
      forecast: [95000, 108000, 125000, 142000, 165000, 190000]
    },
    users: {
      total: 15420,
      active: 8230,
      growth: 18.2,
      segments: [
        { name: 'Free Users', value: 65, color: '#8B5CF6' },
        { name: 'Premium', value: 25, color: '#10B981' },
        { name: 'Enterprise', value: 10, color: '#F59E0B' }
      ]
    },
    content: {
      cards_created: 45680,
      templates_sold: 2340,
      engagement_rate: 72.5
    },
    marketplace: {
      transactions: 1250,
      conversion_rate: 3.8,
      avg_order_value: 24.50
    }
  });

  const revenueData = [
    { month: 'Jan', revenue: 95000, forecast: 98000 },
    { month: 'Feb', revenue: 108000, forecast: 112000 },
    { month: 'Mar', revenue: 125000, forecast: 128000 },
    { month: 'Apr', revenue: 142000, forecast: 145000 },
    { month: 'May', revenue: 165000, forecast: 168000 },
    { month: 'Jun', revenue: 190000, forecast: 195000 }
  ];

  const userGrowthData = [
    { week: 'W1', users: 12500, active: 6200 },
    { week: 'W2', users: 13100, active: 6800 },
    { week: 'W3', users: 14200, active: 7400 },
    { week: 'W4', users: 15420, active: 8230 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="p-6 space-y-6 bg-crd-darkest min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Business Intelligence</h1>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500">
            Live Data
          </Badge>
          <Button variant="outline" className="border-crd-border text-white">
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-crd-dark border-crd-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatCurrency(metrics.revenue.total)}</div>
            <div className="flex items-center text-xs text-green-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{metrics.revenue.growth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(metrics.users.active)}</div>
            <div className="flex items-center text-xs text-blue-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{metrics.users.growth}% growth
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Cards Created</CardTitle>
            <Eye className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(metrics.content.cards_created)}</div>
            <div className="text-xs text-gray-400">
              {metrics.content.engagement_rate}% engagement rate
            </div>
          </CardContent>
        </Card>

        <Card className="bg-crd-dark border-crd-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.marketplace.conversion_rate}%</div>
            <div className="text-xs text-gray-400">
              AOV: {formatCurrency(metrics.marketplace.avg_order_value)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="bg-crd-dark border border-crd-border">
          <TabsTrigger value="revenue" className="data-[state=active]:bg-crd-primary">Revenue</TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-crd-primary">Users</TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-crd-primary">Content</TabsTrigger>
          <TabsTrigger value="marketplace" className="data-[state=active]:bg-crd-primary">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">Revenue Trends</CardTitle>
                <CardDescription className="text-gray-400">
                  Monthly revenue vs forecast
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#10B981" name="Actual Revenue" />
                    <Bar dataKey="forecast" fill="#6B7280" name="Forecast" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">Revenue Breakdown</CardTitle>
                <CardDescription className="text-gray-400">
                  Revenue sources this month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Premium Subscriptions</span>
                    <span className="text-white font-medium">{formatCurrency(75000)}</span>
                  </div>
                  <Progress value={60} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Template Sales</span>
                    <span className="text-white font-medium">{formatCurrency(35000)}</span>
                  </div>
                  <Progress value={28} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Enterprise Licenses</span>
                    <span className="text-white font-medium">{formatCurrency(15000)}</span>
                  </div>
                  <Progress value={12} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">User Growth</CardTitle>
                <CardDescription className="text-gray-400">
                  Total and active users over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="week" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#8B5CF6" name="Total Users" />
                    <Line type="monotone" dataKey="active" stroke="#10B981" name="Active Users" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">User Segments</CardTitle>
                <CardDescription className="text-gray-400">
                  Distribution by subscription type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={metrics.users.segments}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {metrics.users.segments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">Content Creation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-white">{formatNumber(metrics.content.cards_created)}</div>
                <p className="text-gray-400">Total cards created</p>
                <div className="text-sm text-green-400">+1,240 this week</div>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">Template Sales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-white">{formatNumber(metrics.content.templates_sold)}</div>
                <p className="text-gray-400">Templates purchased</p>
                <div className="text-sm text-green-400">+180 this week</div>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-white">{metrics.content.engagement_rate}%</div>
                <p className="text-gray-400">Average engagement</p>
                <div className="text-sm text-green-400">+2.3% improvement</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{formatNumber(metrics.marketplace.transactions)}</div>
                <p className="text-gray-400 text-sm">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metrics.marketplace.conversion_rate}%</div>
                <p className="text-gray-400 text-sm">Visitor to buyer</p>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">Avg Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{formatCurrency(metrics.marketplace.avg_order_value)}</div>
                <p className="text-gray-400 text-sm">Per transaction</p>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">Revenue Share</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">70/30</div>
                <p className="text-gray-400 text-sm">Creator/Platform</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

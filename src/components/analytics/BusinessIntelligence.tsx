
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Activity,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Area,
  AreaChart
} from 'recharts';

interface RevenueData {
  month: string;
  revenue: number;
  subscriptions: number;
  templates: number;
}

interface UserGrowthData {
  date: string;
  users: number;
  activeUsers: number;
}

interface MarketData {
  category: string;
  value: number;
  growth: number;
}

export const BusinessIntelligence: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);

  useEffect(() => {
    // Mock data - in production, fetch from analytics API
    setRevenueData([
      { month: 'Jan', revenue: 12500, subscriptions: 8500, templates: 4000 },
      { month: 'Feb', revenue: 15200, subscriptions: 10200, templates: 5000 },
      { month: 'Mar', revenue: 18900, subscriptions: 12400, templates: 6500 },
      { month: 'Apr', revenue: 22100, subscriptions: 14600, templates: 7500 },
      { month: 'May', revenue: 25800, subscriptions: 17200, templates: 8600 },
      { month: 'Jun', revenue: 28400, subscriptions: 19100, templates: 9300 }
    ]);

    setUserGrowthData([
      { date: '2024-01', users: 1250, activeUsers: 875 },
      { date: '2024-02', users: 1890, activeUsers: 1323 },
      { date: '2024-03', users: 2540, activeUsers: 1778 },
      { date: '2024-04', users: 3200, activeUsers: 2240 },
      { date: '2024-05', users: 4100, activeUsers: 2870 },
      { date: '2024-06', users: 5250, activeUsers: 3675 }
    ]);

    setMarketData([
      { category: 'Premium Templates', value: 45, growth: 12.5 },
      { category: 'Custom Cards', value: 30, growth: 8.2 },
      { category: 'Subscriptions', value: 20, growth: 15.8 },
      { category: 'Enterprise', value: 5, growth: 25.4 }
    ]);
  }, [timeRange]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalUsers = userGrowthData[userGrowthData.length - 1]?.users || 0;
  const totalActiveUsers = userGrowthData[userGrowthData.length - 1]?.activeUsers || 0;

  return (
    <div className="min-h-screen bg-crd-darkest p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Business Intelligence</h1>
            <p className="text-gray-400 mt-1">Advanced analytics and market insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-crd-dark rounded-lg p-1">
              {['7d', '30d', '90d', '1y'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeRange(range as any)}
                  className={timeRange === range ? 'bg-crd-primary' : 'text-gray-400'}
                >
                  {range}
                </Button>
              ))}
            </div>
            <Button variant="outline" className="bg-crd-dark border-crd-border text-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-crd-dark border-crd-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +23.4% vs last period
              </p>
            </CardContent>
          </Card>

          <Card className="bg-crd-dark border-crd-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalUsers.toLocaleString()}</div>
              <p className="text-xs text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +18.2% growth rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-crd-dark border-crd-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalActiveUsers.toLocaleString()}</div>
              <p className="text-xs text-gray-400">
                {((totalActiveUsers / totalUsers) * 100).toFixed(1)}% engagement rate
              </p>
            </Content>
          </Card>

          <Card className="bg-crd-dark border-crd-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Conversion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">12.8%</div>
              <p className="text-xs text-green-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2.1% improvement
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="bg-crd-dark border-crd-border">
            <TabsTrigger value="revenue" className="text-gray-300 data-[state=active]:text-white">
              Revenue Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="text-gray-300 data-[state=active]:text-white">
              User Growth
            </TabsTrigger>
            <TabsTrigger value="market" className="text-gray-300 data-[state=active]:text-white">
              Market Analysis
            </TabsTrigger>
            <TabsTrigger value="forecasting" className="text-gray-300 data-[state=active]:text-white">
              Forecasting
            </TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-crd-dark border-crd-border">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Trends</CardTitle>
                  <CardDescription className="text-gray-400">
                    Monthly revenue breakdown by source
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
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
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stackId="1"
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="subscriptions" 
                        stackId="1"
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="templates" 
                        stackId="1"
                        stroke="#F59E0B" 
                        fill="#F59E0B" 
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-crd-dark border-crd-border">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Distribution</CardTitle>
                  <CardDescription className="text-gray-400">
                    Current month revenue by category
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={marketData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ category, value }) => `${category}: ${value}%`}
                      >
                        {marketData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">User Growth Analytics</CardTitle>
                <CardDescription className="text-gray-400">
                  Total users vs active users over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="Total Users"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="activeUsers" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      name="Active Users"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-crd-dark border-crd-border">
                <CardHeader>
                  <CardTitle className="text-white">Market Segments</CardTitle>
                  <CardDescription className="text-gray-400">
                    Performance by business segment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {marketData.map((segment, index) => (
                    <div key={segment.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{segment.category}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white">{segment.value}%</span>
                          <Badge 
                            variant="outline" 
                            className={segment.growth > 0 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}
                          >
                            {segment.growth > 0 ? '+' : ''}{segment.growth}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={segment.value} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-crd-dark border-crd-border">
                <CardHeader>
                  <CardTitle className="text-white">Competitive Analysis</CardTitle>
                  <CardDescription className="text-gray-400">
                    Market position and opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-crd-darkest">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">Market Share</span>
                        <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          Leading
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold text-white">23.5%</p>
                      <p className="text-xs text-gray-400">In digital card creation tools</p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-crd-darkest">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">Growth Rate</span>
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                          Above Average
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold text-white">127%</p>
                      <p className="text-xs text-gray-400">Year-over-year growth</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="forecasting" className="space-y-6">
            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">Revenue Forecasting</CardTitle>
                <CardDescription className="text-gray-400">
                  Predictive analytics and growth projections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <LineChart className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Advanced forecasting models coming soon</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Based on current growth trends, we project 300% revenue increase by Q4
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

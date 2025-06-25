
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

const COLORS = ['#00FF94', '#FF6B35', '#004E89', '#F77F00', '#FCBF49'];

const revenueData = [
  { month: 'Jan', revenue: 45000, users: 1200, cards: 8500 },
  { month: 'Feb', revenue: 52000, users: 1450, cards: 9200 },
  { month: 'Mar', revenue: 48000, users: 1380, cards: 8800 },
  { month: 'Apr', revenue: 61000, users: 1650, cards: 10500 },
  { month: 'May', revenue: 72000, users: 1890, cards: 12200 },
  { month: 'Jun', revenue: 68000, users: 1750, cards: 11800 },
];

const userSegmentData = [
  { name: 'Free Users', value: 65, count: 8450 },
  { name: 'Premium', value: 25, count: 3250 },
  { name: 'Creator', value: 8, count: 1040 },
  { name: 'Enterprise', value: 2, count: 260 },
];

const marketTrendData = [
  { category: 'Sports Cards', growth: 45, volume: 15600 },
  { category: 'Gaming Cards', growth: 32, volume: 12400 },
  { category: 'Art Cards', growth: 28, volume: 8900 },
  { category: 'Collectibles', growth: 22, volume: 6700 },
  { category: 'NFT Cards', growth: 18, volume: 4300 },
];

export const BusinessIntelligence: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6m');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const kpiData = [
    {
      title: 'Total Revenue',
      value: '$346,000',
      change: '+24%',
      trend: 'up',
      icon: DollarSign,
      description: 'vs. last period'
    },
    {
      title: 'Active Users',
      value: '13,830',
      change: '+18%',
      trend: 'up',
      icon: Users,
      description: 'monthly active users'
    },
    {
      title: 'Cards Created',
      value: '71,200',
      change: '+35%',
      trend: 'up',
      icon: ShoppingCart,
      description: 'total cards this period'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-0.3%',
      trend: 'down',
      icon: Target,
      description: 'free to premium'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Business Intelligence</h1>
          <p className="text-crd-lightGray">Advanced analytics and market insights</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="bg-crd-dark border-crd-mediumGray">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-crd-lightGray">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-crd-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{kpi.value}</div>
              <div className="flex items-center space-x-2 text-xs">
                <span className={`flex items-center ${kpi.trend === 'up' ? 'text-crd-green' : 'text-red-400'}`}>
                  {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {kpi.change}
                </span>
                <span className="text-crd-lightGray">{kpi.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-crd-dark border-crd-mediumGray">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="competitive">Competitive</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-white">Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a', 
                        border: '1px solid #333',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#00FF94" strokeWidth={3} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-white">Revenue Breakdown</CardTitle>
                <CardDescription>By subscription tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-crd-lightGray">Premium Subscriptions</span>
                    <div className="text-right">
                      <div className="text-white font-medium">$198,450</div>
                      <div className="text-sm text-crd-green">57.3%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-crd-lightGray">Creator Subscriptions</span>
                    <div className="text-right">
                      <div className="text-white font-medium">$89,230</div>
                      <div className="text-sm text-crd-green">25.8%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-crd-lightGray">Enterprise Contracts</span>
                    <div className="text-right">
                      <div className="text-white font-medium">$45,670</div>
                      <div className="text-sm text-crd-green">13.2%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-crd-lightGray">Marketplace Commissions</span>
                    <div className="text-right">
                      <div className="text-white font-medium">$12,650</div>
                      <div className="text-sm text-crd-green">3.7%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-white">User Segmentation</CardTitle>
                <CardDescription>Distribution by subscription type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={userSegmentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {userSegmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-white">User Behavior Analysis</CardTitle>
                <CardDescription>Key engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border border-crd-mediumGray rounded-lg">
                    <div>
                      <p className="font-medium text-white">Avg. Session Duration</p>
                      <p className="text-sm text-crd-lightGray">Time spent per visit</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-crd-green">14m 32s</div>
                      <Badge variant="default" className="text-xs">+12%</Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border border-crd-mediumGray rounded-lg">
                    <div>
                      <p className="font-medium text-white">Cards per User</p>
                      <p className="text-sm text-crd-lightGray">Average monthly creation</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-crd-green">5.2</div>
                      <Badge variant="default" className="text-xs">+8%</Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 border border-crd-mediumGray rounded-lg">
                    <div>
                      <p className="font-medium text-white">Feature Adoption</p>
                      <p className="text-sm text-crd-lightGray">3D effects usage</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-crd-green">67%</div>
                      <Badge variant="default" className="text-xs">+15%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader>
              <CardTitle className="text-white">Market Intelligence</CardTitle>
              <CardDescription>Category trends and growth analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={marketTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="category" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid #333',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="growth" fill="#00FF94" />
                  <Bar dataKey="volume" fill="#FF6B35" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-white">Revenue Forecasting</CardTitle>
                <CardDescription>Predicted growth for next 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-crd-lightGray">Q3 2024 Projection</span>
                    <span className="text-xl font-bold text-crd-green">$425,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-crd-lightGray">Q4 2024 Projection</span>
                    <span className="text-xl font-bold text-crd-green">$510,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-crd-lightGray">2025 Annual Target</span>
                    <span className="text-xl font-bold text-crd-green">$2.4M</span>
                  </div>
                  <div className="pt-4 border-t border-crd-mediumGray">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">Confidence Level</span>
                      <Badge variant="default">87%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-white">Growth Drivers</CardTitle>
                <CardDescription>Key factors influencing growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-crd-lightGray">Premium Feature Adoption</span>
                    <span className="text-crd-green font-medium">High Impact</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-crd-lightGray">Enterprise Expansion</span>
                    <span className="text-crd-green font-medium">High Impact</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-crd-lightGray">Marketplace Growth</span>
                    <span className="text-yellow-500 font-medium">Medium Impact</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-crd-lightGray">Mobile App Launch</span>
                    <span className="text-yellow-500 font-medium">Medium Impact</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competitive" className="space-y-6">
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader>
              <CardTitle className="text-white">Competitive Analysis</CardTitle>
              <CardDescription>Market position and competitor insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border border-crd-mediumGray rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-2">Market Share</h3>
                  <div className="text-3xl font-bold text-crd-green mb-2">23.4%</div>
                  <p className="text-sm text-crd-lightGray">Digital card creation market</p>
                </div>
                
                <div className="text-center p-4 border border-crd-mediumGray rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-2">Competitive Rank</h3>
                  <div className="text-3xl font-bold text-crd-green mb-2">#2</div>
                  <p className="text-sm text-crd-lightGray">In premium features</p>
                </div>
                
                <div className="text-center p-4 border border-crd-mediumGray rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-2">Unique Advantage</h3>
                  <div className="text-3xl font-bold text-crd-green mb-2">3D</div>
                  <p className="text-sm text-crd-lightGray">Premium 3D capabilities</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCreatorProfile } from '@/hooks/creator/useCreatorProfile';
import { useCreatorEarnings } from '@/hooks/creator/useCreatorEarnings';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, Star, Target, Award } from 'lucide-react';

export const CreatorAnalytics: React.FC = () => {
  const { profile } = useCreatorProfile();
  const { monthlyStats, earnings } = useCreatorEarnings();

  // Mock data for demonstration
  const performanceData = [
    { month: 'Jan', templates: 5, earnings: 250, views: 1200 },
    { month: 'Feb', templates: 8, earnings: 420, views: 1800 },
    { month: 'Mar', templates: 12, earnings: 680, views: 2400 },
    { month: 'Apr', templates: 15, earnings: 950, views: 3200 },
    { month: 'May', templates: 18, earnings: 1250, views: 4100 },
    { month: 'Jun', templates: 22, earnings: 1580, views: 5200 },
  ];

  const categoryData = [
    { name: 'Sports Cards', value: 35, color: '#00ff88' },
    { name: 'Trading Cards', value: 28, color: '#0088ff' },
    { name: 'Fantasy Art', value: 20, color: '#ff8800' },
    { name: 'Abstract', value: 17, color: '#ff0088' },
  ];

  const revenueData = [
    { source: 'Template Sales', amount: 1580, percentage: 65 },
    { source: 'Commissions', amount: 420, percentage: 17 },
    { source: 'Courses', amount: 280, percentage: 12 },
    { source: 'Collaborations', amount: 150, percentage: 6 },
  ];

  const stats = [
    {
      title: 'Total Earnings',
      value: `$${profile?.total_earnings.toFixed(2) || '0.00'}`,
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Templates Created',
      value: profile?.cards_created.toString() || '0',
      change: '+5',
      changeType: 'positive',
      icon: Target,
    },
    {
      title: 'Average Rating',
      value: `${profile?.avg_rating.toFixed(1) || '0.0'} ★`,
      change: '+0.2',
      changeType: 'positive',
      icon: Star,
    },
    {
      title: 'Followers',
      value: '1,247',
      change: '+23',
      changeType: 'positive',
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Creator Analytics</h2>
        <p className="text-crd-lightGray">
          Track your performance, understand your audience, and optimize your content strategy
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-crd-dark border-crd-mediumGray">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-crd-mediumGray rounded-lg">
                    <Icon className="w-5 h-5 text-crd-green" />
                  </div>
                  <Badge 
                    className={`${
                      stat.changeType === 'positive' ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}
                  >
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-crd-lightGray">{stat.title}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Trend */}
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardHeader>
            <CardTitle className="text-white">Earnings Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#00ff88" 
                  strokeWidth={2}
                  dot={{ fill: '#00ff88', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Template Performance */}
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardHeader>
            <CardTitle className="text-white">Template Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="templates" fill="#0088ff" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown and Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Sources */}
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardHeader>
            <CardTitle className="text-white">Revenue Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {revenueData.map((item) => (
              <div key={item.source} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm">{item.source}</span>
                    <span className="text-crd-green font-semibold">${item.amount}</span>
                  </div>
                  <div className="w-full bg-crd-mediumGray rounded-full h-2">
                    <div 
                      className="bg-crd-green h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardHeader>
            <CardTitle className="text-white">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-crd-lightGray">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-crd-green" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-crd-mediumGray rounded-lg">
            <h4 className="text-white font-medium mb-1">Expand to New Categories</h4>
            <p className="text-crd-lightGray text-sm">
              Consider creating templates in the "Vintage" category - it's trending with 45% growth this month.
            </p>
          </div>
          <div className="p-3 bg-crd-mediumGray rounded-lg">
            <h4 className="text-white font-medium mb-1">Optimize Pricing</h4>
            <p className="text-crd-lightGray text-sm">
              Your premium templates are performing well. Consider increasing prices by 10-15% for new releases.
            </p>
          </div>
          <div className="p-3 bg-crd-mediumGray rounded-lg">
            <h4 className="text-white font-medium mb-1">Collaborate More</h4>
            <p className="text-crd-lightGray text-sm">
              Creators who collaborate earn 2.3x more on average. Consider partnering with complementary creators.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

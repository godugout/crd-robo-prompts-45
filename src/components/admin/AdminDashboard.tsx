
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Shield, 
  AlertTriangle,
  Download,
  Filter,
  Search,
  BarChart3,
  Settings,
  Database,
  Globe
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AdminDashboardProps {
  isEnterprise?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isEnterprise = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  // Platform Analytics Query
  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics', selectedTimeframe],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_analytics')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
      
      if (error) throw error;
      return data;
    }
  });

  // User Management Query
  const { data: users } = useQuery({
    queryKey: ['admin-users', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          id, username, email, created_at, last_sign_in_at,
          subscription_status, plan_type, total_cards_created
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const handleExportData = async (type: string) => {
    // Implement data export functionality
    console.log(`Exporting ${type} data...`);
  };

  const handleBulkAction = async (action: string, userIds: string[]) => {
    // Implement bulk user actions
    console.log(`Performing ${action} on users:`, userIds);
  };

  return (
    <div className="min-h-screen bg-crd-darkest p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-crd-lightGray">
              {isEnterprise ? 'Enterprise Platform Management' : 'Platform Overview & Management'}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handleExportData('all')}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-crd-lightGray">Total Users</CardTitle>
              <Users className="h-4 w-4 text-crd-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">12,847</div>
              <p className="text-xs text-crd-lightGray">
                <span className="text-crd-green">+18%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-crd-lightGray">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-crd-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$89,432</div>
              <p className="text-xs text-crd-lightGray">
                <span className="text-crd-green">+24%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-crd-lightGray">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-crd-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">2,847</div>
              <p className="text-xs text-crd-lightGray">
                <span className="text-red-400">-5%</span> from last hour
              </p>
            </CardContent>
          </Card>

          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-crd-lightGray">System Health</CardTitle>
              <Shield className="h-4 w-4 text-crd-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-crd-green">99.9%</div>
              <p className="text-xs text-crd-lightGray">Uptime this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-crd-dark border-crd-mediumGray">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            {isEnterprise && <TabsTrigger value="enterprise">Enterprise</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-crd-dark border-crd-mediumGray">
                <CardHeader>
                  <CardTitle className="text-white">Platform Analytics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-crd-lightGray">Cards Created Today</span>
                      <Badge variant="secondary">1,247</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-crd-lightGray">Template Downloads</span>
                      <Badge variant="secondary">847</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-crd-lightGray">Creator Earnings</span>
                      <Badge variant="secondary">$12,487</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-crd-lightGray">Support Tickets</span>
                      <Badge variant="destructive">23</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-crd-dark border-crd-mediumGray">
                <CardHeader>
                  <CardTitle className="text-white">System Alerts</CardTitle>
                  <CardDescription>Critical system notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <div>
                        <p className="text-sm font-medium text-white">High CPU Usage</p>
                        <p className="text-xs text-crd-lightGray">Server load at 85%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <Database className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-white">Backup Completed</p>
                        <p className="text-xs text-crd-lightGray">Daily backup successful</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">User Management</CardTitle>
                    <CardDescription>Manage platform users and permissions</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                    <Button variant="outline" size="icon">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users?.slice(0, 10).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-crd-mediumGray rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-crd-green rounded-full flex items-center justify-center">
                          <span className="text-black font-bold">
                            {user.username?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.username || 'Unknown User'}</p>
                          <p className="text-sm text-crd-lightGray">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={user.subscription_status === 'active' ? 'default' : 'secondary'}>
                          {user.plan_type || 'Free'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isEnterprise && (
            <TabsContent value="enterprise" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-crd-dark border-crd-mediumGray">
                  <CardHeader>
                    <CardTitle className="text-white">White-Label Solutions</CardTitle>
                    <CardDescription>Manage enterprise client configurations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 border border-crd-mediumGray rounded-lg">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-crd-green" />
                          <div>
                            <p className="font-medium text-white">SportsCorp</p>
                            <p className="text-sm text-crd-lightGray">custom.sportscorp.com</p>
                          </div>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border border-crd-mediumGray rounded-lg">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-crd-green" />
                          <div>
                            <p className="font-medium text-white">TradingCards Inc</p>
                            <p className="text-sm text-crd-lightGray">cards.tradingco.com</p>
                          </div>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-crd-dark border-crd-mediumGray">
                  <CardHeader>
                    <CardTitle className="text-white">Enterprise Analytics</CardTitle>
                    <CardDescription>Advanced business intelligence</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-crd-lightGray">Total Enterprise Revenue</span>
                        <span className="text-xl font-bold text-crd-green">$247,892</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-crd-lightGray">Active Enterprise Clients</span>
                        <span className="text-xl font-bold text-white">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-crd-lightGray">White-Label Deployments</span>
                        <span className="text-xl font-bold text-white">8</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Search,
  Filter,
  Download,
  Settings,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PlatformMetrics {
  totalUsers: number;
  activeUsers: number;
  revenue: number;
  cardsGenerated: number;
  templatesCreated: number;
}

interface UserData {
  id: string;
  username: string;
  display_name: string;
  created_at: string;
  avatar_url?: string;
  creator_verified: boolean;
}

interface AdminDashboardProps {
  isEnterprise?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isEnterprise = false }) => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<PlatformMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    revenue: 0,
    cardsGenerated: 0,
    templatesCreated: 0
  });
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatformMetrics();
    fetchUsers();
  }, []);

  const fetchPlatformMetrics = async () => {
    try {
      // Get user count from profiles
      const { data: profilesData } = await supabase
        .from('crd_profiles')
        .select('id', { count: 'exact' });

      // Get cards count
      const { data: cardsData } = await supabase
        .from('crd_cards')
        .select('id', { count: 'exact' });

      // Get templates count
      const { data: templatesData } = await supabase
        .from('crd_templates')
        .select('id', { count: 'exact' });

      setMetrics({
        totalUsers: profilesData?.length || 0,
        activeUsers: Math.floor((profilesData?.length || 0) * 0.7), // Estimate 70% active
        revenue: 12500, // Mock data
        cardsGenerated: cardsData?.length || 0,
        templatesCreated: templatesData?.length || 0
      });
    } catch (error) {
      console.error('Error fetching platform metrics:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('crd_profiles')
        .select(`
          id,
          username,
          display_name,
          created_at,
          avatar_url,
          creator_verified
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-crd-darkest">
        <div className="text-white">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crd-darkest p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">
              {isEnterprise ? 'Enterprise Platform Management' : 'Platform Overview & Management'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="bg-crd-dark border-crd-border text-white">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button className="bg-crd-primary hover:bg-crd-primary/80">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-crd-dark border-crd-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-gray-400">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-crd-dark border-crd-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-gray-400">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="bg-crd-dark border-crd-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${metrics.revenue.toLocaleString()}</div>
              <p className="text-xs text-gray-400">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-crd-dark border-crd-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Cards Generated</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.cardsGenerated.toLocaleString()}</div>
              <p className="text-xs text-gray-400">Total created</p>
            </CardContent>
          </Card>

          <Card className="bg-crd-dark border-crd-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Templates</CardTitle>
              <Activity className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.templatesCreated}</div>
              <p className="text-xs text-gray-400">Available</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-crd-dark border-crd-border">
            <TabsTrigger value="users" className="text-gray-300 data-[state=active]:text-white">
              User Management
            </TabsTrigger>
            <TabsTrigger value="content" className="text-gray-300 data-[state=active]:text-white">
              Content Moderation
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-gray-300 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="system" className="text-gray-300 data-[state=active]:text-white">
              System Health
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">User Management</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage user accounts, permissions, and activity
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="bg-crd-darkest border-crd-border text-white">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" className="bg-crd-darkest border-crd-border text-white">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-crd-darkest">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-crd-primary flex items-center justify-center">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.username} className="w-10 h-10 rounded-full" />
                          ) : (
                            <span className="text-white font-medium">
                              {(user.display_name || user.username)?.charAt(0)?.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{user.display_name || user.username}</span>
                            {user.creator_verified && (
                              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                Verified Creator
                              </Badge>
                            )}
                          </div>
                          <span className="text-gray-400 text-sm">@{user.username}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                        <Button variant="outline" size="sm" className="bg-crd-dark border-crd-border text-white">
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">Content Moderation Queue</CardTitle>
                <CardDescription className="text-gray-400">
                  Review and moderate user-generated content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No items in moderation queue</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">Platform Analytics</CardTitle>
                <CardDescription className="text-gray-400">
                  Detailed insights and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card className="bg-crd-dark border-crd-border">
              <CardHeader>
                <CardTitle className="text-white">System Health</CardTitle>
                <CardDescription className="text-gray-400">
                  Monitor system performance and health metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-crd-darkest">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Database</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                        Healthy
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-white">99.9%</p>
                    <p className="text-xs text-gray-400">Uptime</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-crd-darkest">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">API</span>
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                        Operational
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-white">150ms</p>
                    <p className="text-xs text-gray-400">Avg Response</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-crd-darkest">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Storage</span>
                      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        Warning
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-white">78%</p>
                    <p className="text-xs text-gray-400">Usage</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

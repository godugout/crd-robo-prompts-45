
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCreatorProfile } from '@/hooks/creator/useCreatorProfile';
import { useCreatorEarnings } from '@/hooks/creator/useCreatorEarnings';
import { useCardTemplates } from '@/hooks/creator/useCardTemplates';
import { CreatorEarningsChart } from './CreatorEarningsChart';
import { CreatorTemplateManager } from './CreatorTemplateManager';
import { CreatorProfileSetup } from './CreatorProfileSetup';
import { DollarSign, Package, Star, TrendingUp, Users, Eye, Heart } from 'lucide-react';

export const CreatorDashboard: React.FC = () => {
  const { profile, isLoading, isCreator, isVerified } = useCreatorProfile();
  const { monthlyStats, pendingPayouts, earnings } = useCreatorEarnings();
  const { myTemplates } = useCardTemplates();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-white">Loading creator dashboard...</div>
      </div>
    );
  }

  if (!isCreator) {
    return <CreatorProfileSetup />;
  }

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-crd-darkest p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Creator Dashboard</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={isVerified ? 'default' : 'secondary'} className="bg-crd-green text-black">
                {isVerified ? 'Verified Creator' : 'Pending Verification'}
              </Badge>
              {profile?.total_earnings > 0 && (
                <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                  Total Earned: {formatCurrency(profile.total_earnings)}
                </Badge>
              )}
            </div>
          </div>
          <Button className="bg-crd-green hover:bg-green-600 text-black">
            Create New Template
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-crd-lightGray">Monthly Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-crd-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(monthlyStats?.total || 0)}
              </div>
              <p className="text-xs text-crd-lightGray">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-crd-lightGray">Pending Payouts</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(pendingPayouts || 0)}
              </div>
              <p className="text-xs text-crd-lightGray">Ready for payout</p>
            </CardContent>
          </Card>

          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-crd-lightGray">Templates Created</CardTitle>
              <Package className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{myTemplates.length}</div>
              <p className="text-xs text-crd-lightGray">Active templates</p>
            </CardContent>
          </Card>

          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-crd-lightGray">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {profile?.avg_rating?.toFixed(1) || '0.0'}
              </div>
              <p className="text-xs text-crd-lightGray">
                {profile?.rating_count || 0} reviews
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="earnings" className="space-y-6">
          <TabsList className="bg-crd-dark border border-crd-mediumGray">
            <TabsTrigger value="earnings" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
              Earnings
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
              Templates
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="earnings" className="space-y-6">
            <CreatorEarningsChart earnings={earnings} />
            
            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader>
                <CardTitle className="text-white">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earnings.slice(0, 10).map((earning) => (
                    <div key={earning.id} className="flex items-center justify-between p-4 bg-crd-mediumGray rounded-lg">
                      <div>
                        <p className="text-white font-medium">
                          {earning.source_type.replace('_', ' ').toUpperCase()}
                        </p>
                        <p className="text-sm text-crd-lightGray">
                          {new Date(earning.transaction_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-crd-green font-bold">
                          +{formatCurrency(earning.net_amount)}
                        </p>
                        <Badge variant="outline" className={
                          earning.payout_status === 'paid' ? 'border-green-400 text-green-400' :
                          earning.payout_status === 'pending' ? 'border-yellow-400 text-yellow-400' :
                          'border-red-400 text-red-400'
                        }>
                          {earning.payout_status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <CreatorTemplateManager />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-crd-dark border-crd-mediumGray">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Template Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {myTemplates.reduce((sum, t) => sum + (t.sales_count * 10), 0)}
                  </div>
                  <p className="text-sm text-crd-lightGray">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-crd-dark border-crd-mediumGray">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Template Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {myTemplates.reduce((sum, t) => sum + t.sales_count, 0)}
                  </div>
                  <p className="text-sm text-crd-lightGray">Total sales</p>
                </CardContent>
              </Card>

              <Card className="bg-crd-dark border-crd-mediumGray">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Avg. Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {myTemplates.length > 0 
                      ? (myTemplates.reduce((sum, t) => sum + t.rating_average, 0) / myTemplates.length).toFixed(1)
                      : '0.0'
                    }
                  </div>
                  <p className="text-sm text-crd-lightGray">
                    {myTemplates.reduce((sum, t) => sum + t.rating_count, 0)} reviews
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

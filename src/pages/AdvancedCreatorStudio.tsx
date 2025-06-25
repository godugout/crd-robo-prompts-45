
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AutomationDashboard } from '@/components/creator/automation/AutomationDashboard';
import { DesignAssetsLibrary } from '@/components/creator/assets/DesignAssetsLibrary';
import { MarketplaceOptimizer } from '@/components/creator/marketplace/MarketplaceOptimizer';
import { BulkOperationsCenter } from '@/components/creator/bulk/BulkOperationsCenter';
import { CreatorAnalyticsDashboard } from '@/components/creator/analytics/CreatorAnalyticsDashboard';
import { Bot, Palette, TrendingUp, Package, BarChart3 } from 'lucide-react';

const AdvancedCreatorStudio: React.FC = () => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Advanced Creator Studio</h1>
          <p className="text-crd-lightGray">
            Professional tools for automation, optimization, and advanced card creation
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="automation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-crd-dark border-crd-mediumGray">
            <TabsTrigger value="automation" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
              <Bot className="w-4 h-4 mr-2" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="assets" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
              <Palette className="w-4 h-4 mr-2" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
              <TrendingUp className="w-4 h-4 mr-2" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="bulk" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
              <Package className="w-4 h-4 mr-2" />
              Bulk Ops
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="automation">
            <AutomationDashboard />
          </TabsContent>

          <TabsContent value="assets">
            <DesignAssetsLibrary />
          </TabsContent>

          <TabsContent value="marketplace">
            <MarketplaceOptimizer />
          </TabsContent>

          <TabsContent value="bulk">
            <BulkOperationsCenter />
          </TabsContent>

          <TabsContent value="analytics">
            <CreatorAnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvancedCreatorStudio;

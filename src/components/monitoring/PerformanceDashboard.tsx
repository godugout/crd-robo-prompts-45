
import React from 'react';
import { ComprehensiveMonitoring } from './ComprehensiveMonitoring';
import { LaunchMonitoring } from './LaunchMonitoring';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const PerformanceDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      <Tabs defaultValue="comprehensive" className="h-full">
        <div className="border-b border-crd-border bg-crd-dark px-6 py-4">
          <TabsList className="bg-crd-darkest border-crd-border">
            <TabsTrigger value="comprehensive" className="data-[state=active]:bg-crd-primary">
              Comprehensive Monitoring
            </TabsTrigger>
            <TabsTrigger value="launch" className="data-[state=active]:bg-crd-primary">
              Launch Monitoring
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="comprehensive" className="m-0 h-full">
          <ComprehensiveMonitoring />
        </TabsContent>
        
        <TabsContent value="launch" className="m-0 h-full">
          <LaunchMonitoring />
        </TabsContent>
      </Tabs>
    </div>
  );
};

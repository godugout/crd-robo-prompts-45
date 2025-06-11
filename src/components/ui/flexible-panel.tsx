
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export interface FlexiblePanelTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface FlexiblePanelProps {
  tabs: FlexiblePanelTab[];
  defaultTab?: string;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

export const FlexiblePanel: React.FC<FlexiblePanelProps> = ({
  tabs,
  defaultTab,
  className,
  orientation = 'horizontal',
  size = 'md'
}) => {
  const maxTabs = Math.min(tabs.length, 3);
  const visibleTabs = tabs.slice(0, maxTabs);

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <Tabs defaultValue={defaultTab || visibleTabs[0]?.id} className="flex flex-col h-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/20 border border-white/10">
          {visibleTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "flex items-center justify-center gap-2 text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/10",
                sizeClasses[size]
              )}
            >
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="flex-1 overflow-hidden">
          {visibleTabs.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="h-full mt-0 p-0 overflow-y-auto"
            >
              {tab.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};


import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

interface ResponsiveLayoutProps {
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  children: React.ReactNode;
  showLeftPanel?: boolean;
  showRightPanel?: boolean;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  leftPanel,
  rightPanel,
  children,
  showLeftPanel = false,
  showRightPanel = false
}) => {
  const isMobile = useIsMobile();

  // On mobile, don't use resizable panels - just stack everything
  if (isMobile) {
    return (
      <div className="flex flex-col h-full w-full relative">
        {/* Main content takes full space on mobile */}
        <div className="flex-1 relative">
          {children}
        </div>
        
        {/* Panels are handled as overlays/drawers on mobile */}
        {showLeftPanel && leftPanel}
        {showRightPanel && rightPanel}
      </div>
    );
  }

  // Desktop: Use resizable panels
  const panelCount = 1 + (showLeftPanel ? 1 : 0) + (showRightPanel ? 1 : 0);
  
  if (panelCount === 1) {
    return <div className="h-full w-full">{children}</div>;
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      {/* Left Panel */}
      {showLeftPanel && (
        <>
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            {leftPanel}
          </ResizablePanel>
          <ResizableHandle withHandle />
        </>
      )}
      
      {/* Main Content */}
      <ResizablePanel defaultSize={showLeftPanel && showRightPanel ? 50 : showLeftPanel || showRightPanel ? 75 : 100}>
        {children}
      </ResizablePanel>
      
      {/* Right Panel */}
      {showRightPanel && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            {rightPanel}
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};

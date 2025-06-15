
import React, { useState } from 'react';
import { FigmaToolbar } from './FigmaToolbar';
import { FigmaLeftPanel } from './FigmaLeftPanel';
import { FigmaRightPanel } from './FigmaRightPanel';
import { FigmaBottomPanel } from './FigmaBottomPanel';
import { FigmaCanvas } from './FigmaCanvas';
import { toast } from 'sonner';

interface FigmaStudioLayoutProps {
  children: React.ReactNode;
}

export const FigmaStudioLayout: React.FC<FigmaStudioLayoutProps> = ({ children }) => {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [bottomPanelOpen, setBottomPanelOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);

  const handleFrameSelect = (frameId: string) => {
    setSelectedFrame(frameId);
    toast.success(`Applied ${frameId} frame to card`);
    // Here you would apply the frame to the selected card
  };

  return (
    <div className="h-screen bg-[#1e1e1e] flex flex-col overflow-hidden">
      {/* Top Toolbar */}
      <FigmaToolbar 
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
        onToggleLeftPanel={() => setLeftPanelOpen(!leftPanelOpen)}
        onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
        onToggleBottomPanel={() => setBottomPanelOpen(!bottomPanelOpen)}
        leftPanelOpen={leftPanelOpen}
        rightPanelOpen={rightPanelOpen}
        bottomPanelOpen={bottomPanelOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <FigmaLeftPanel 
          isOpen={leftPanelOpen} 
          onClose={() => setLeftPanelOpen(false)}
        />

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          <FigmaCanvas>
            {children}
          </FigmaCanvas>
          
          {/* Bottom Panel */}
          <FigmaBottomPanel 
            isOpen={bottomPanelOpen}
            onClose={() => setBottomPanelOpen(false)}
            onFrameSelect={handleFrameSelect}
          />
        </div>

        {/* Right Panel */}
        <FigmaRightPanel 
          isOpen={rightPanelOpen}
          onClose={() => setRightPanelOpen(false)}
        />
      </div>
    </div>
  );
};

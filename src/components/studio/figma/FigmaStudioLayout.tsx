
import React, { useState } from 'react';
import { FigmaToolbar } from './FigmaToolbar';
import { FigmaLeftPanel } from './FigmaLeftPanel';
import { StudioPropertiesPanel } from '../StudioPropertiesPanel';
import { FigmaBottomPanel } from './FigmaBottomPanel';
import { FigmaCanvas } from './FigmaCanvas';
import { toast } from 'sonner';

interface FigmaStudioLayoutProps {
  children: React.ReactNode;
}

export const FigmaStudioLayout: React.FC<FigmaStudioLayoutProps> = ({ children }) => {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true); // Open by default now
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);

  const handleFrameSelect = (frameId: string) => {
    setSelectedFrame(frameId);
    toast.success(`Applied ${frameId} frame to card`);
    // Dispatch an event that the whiteboard can listen to
    window.dispatchEvent(new CustomEvent('frameSelected', { detail: { frameId } }));
  };

  return (
    <div className="dark h-screen bg-[#1e1e1e] flex flex-col overflow-hidden">
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
        <StudioPropertiesPanel
          isOpen={rightPanelOpen}
          onClose={() => setRightPanelOpen(false)}
        />
      </div>
    </div>
  );
};

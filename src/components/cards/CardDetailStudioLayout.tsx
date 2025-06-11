
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Info, X } from 'lucide-react';

interface CardDetailStudioLayoutProps {
  children: React.ReactNode;
  rightPanel: React.ReactNode;
  header?: React.ReactNode;
}

export const CardDetailStudioLayout: React.FC<CardDetailStudioLayoutProps> = ({
  children,
  rightPanel,
  header
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  return (
    <div className="h-screen w-full bg-crd-darkest overflow-hidden relative">
      {/* Header */}
      {header && (
        <div className="absolute top-0 left-0 right-0 z-50">
          {header}
        </div>
      )}

      {/* Main 3D Canvas Area */}
      <div className="h-full w-full relative">
        {children}
      </div>

      {/* Panel Toggle Button */}
      {!isPanelOpen && (
        <div className="absolute top-4 right-4 z-40">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPanelOpen(true)}
            className="bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white border border-white/10"
          >
            <Info className="w-4 h-4 mr-2" />
            Card Details
          </Button>
        </div>
      )}

      {/* Right Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-96 bg-editor-dark border-l border-crd-mediumGray/20 transition-transform duration-300 z-30 ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-crd-mediumGray/20">
          <h3 className="text-lg font-semibold text-white">Card Details</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPanelOpen(false)}
            className="text-crd-lightGray hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          {rightPanel}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isPanelOpen && (
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsPanelOpen(false)}
        />
      )}
    </div>
  );
};


import React from 'react';
import { Sparkles, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileHeaderProps {
  onOpenStudio: () => void;
  onClose?: () => void;
  showSettings?: boolean;
  onToggleSettings?: () => void;
  isStudioOpen?: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onOpenStudio,
  onClose,
  showSettings = false,
  onToggleSettings,
  isStudioOpen = false
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Sparkles className="w-4 h-4 text-crd-green" />
            <span className="text-white text-sm font-medium">CRD Studio</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {showSettings && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSettings}
              className="bg-white/10 hover:bg-white/20 text-white border-0 h-8 w-8 p-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenStudio}
            className={`bg-white/10 hover:bg-white/20 text-white border-0 h-8 px-3 ${
              isStudioOpen ? 'bg-crd-green/20' : ''
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </Button>
          
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white border-0 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

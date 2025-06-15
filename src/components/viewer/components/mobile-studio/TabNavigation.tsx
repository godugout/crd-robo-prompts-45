
import React from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

type TabType = 'styles' | 'environment' | 'preview';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onClose: () => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  onClose
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <div className="flex items-center space-x-1">
        <Button
          onClick={() => onTabChange('styles')}
          variant="ghost"
          size="sm"
          className={`px-4 py-2 rounded-full text-sm ${
            activeTab === 'styles' 
              ? 'bg-crd-green text-black font-medium' 
              : 'text-white hover:text-crd-green'
          }`}
        >
          ✨ Styles
        </Button>
        <Button
          onClick={() => onTabChange('environment')}
          variant="ghost"
          size="sm"
          className={`px-4 py-2 rounded-full text-sm ${
            activeTab === 'environment' 
              ? 'bg-crd-green text-black font-medium' 
              : 'text-white hover:text-crd-green'
          }`}
        >
          🌍 Environment
        </Button>
        <Button
          onClick={() => onTabChange('preview')}
          variant="ghost"
          size="sm"
          className={`px-4 py-2 rounded-full text-sm ${
            activeTab === 'preview' 
              ? 'bg-crd-green text-black font-medium' 
              : 'text-white hover:text-crd-green'
          }`}
        >
          👁️ Preview
        </Button>
      </div>
      <Button variant="ghost" size="sm" onClick={onClose} className="text-white">
        <ChevronUp className="w-5 h-5" />
      </Button>
    </div>
  );
};

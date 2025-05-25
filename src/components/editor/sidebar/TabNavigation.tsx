
import React from 'react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="flex border-b border-editor-border">
      <button 
        className={`flex-1 py-3 text-sm font-medium ${activeTab === 'upload' ? 'text-cardshow-white border-b-2 border-cardshow-blue' : 'text-cardshow-lightGray'}`}
        onClick={() => onTabChange('upload')}
      >
        Upload
      </button>
      <button 
        className={`flex-1 py-3 text-sm font-medium ${activeTab === 'templates' ? 'text-cardshow-white border-b-2 border-cardshow-blue' : 'text-cardshow-lightGray'}`}
        onClick={() => onTabChange('templates')}
      >
        Templates
      </button>
      <button 
        className={`flex-1 py-3 text-sm font-medium ${activeTab === 'assets' ? 'text-cardshow-white border-b-2 border-cardshow-blue' : 'text-cardshow-lightGray'}`}
        onClick={() => onTabChange('assets')}
      >
        Assets
      </button>
    </div>
  );
};

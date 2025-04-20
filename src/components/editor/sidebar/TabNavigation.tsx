
import React from 'react';

interface TabNavigationProps {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

export const TabNavigation = ({ selectedTab, onTabSelect }: TabNavigationProps) => {
  return (
    <div className="flex border-b border-editor-border">
      <button 
        className={`flex-1 py-3 text-sm font-medium ${selectedTab === 'upload' ? 'text-cardshow-white border-b-2 border-cardshow-blue' : 'text-cardshow-lightGray'}`}
        onClick={() => onTabSelect('upload')}
      >
        Upload
      </button>
      <button 
        className={`flex-1 py-3 text-sm font-medium ${selectedTab === 'templates' ? 'text-cardshow-white border-b-2 border-cardshow-blue' : 'text-cardshow-lightGray'}`}
        onClick={() => onTabSelect('templates')}
      >
        Templates
      </button>
      <button 
        className={`flex-1 py-3 text-sm font-medium ${selectedTab === 'assets' ? 'text-cardshow-white border-b-2 border-cardshow-blue' : 'text-cardshow-lightGray'}`}
        onClick={() => onTabSelect('assets')}
      >
        Assets
      </button>
    </div>
  );
};


import React from 'react';
import { Upload, Layout, FileImage } from 'lucide-react';

interface TabNavigationProps {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

export const TabNavigation = ({ selectedTab, onTabSelect }: TabNavigationProps) => {
  return (
    <div className="flex border-b border-editor-border bg-editor-darker">
      <TabButton 
        id="upload"
        label="Upload"
        icon={<Upload className="w-4 h-4" />}
        isSelected={selectedTab === 'upload'}
        onClick={() => onTabSelect('upload')}
      />
      <TabButton 
        id="templates"
        label="Templates"
        icon={<Layout className="w-4 h-4" />}
        isSelected={selectedTab === 'templates'}
        onClick={() => onTabSelect('templates')}
      />
      <TabButton 
        id="assets"
        label="Assets"
        icon={<FileImage className="w-4 h-4" />}
        isSelected={selectedTab === 'assets'}
        onClick={() => onTabSelect('assets')}
      />
    </div>
  );
};

interface TabButtonProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

const TabButton = ({ id, label, icon, isSelected, onClick }: TabButtonProps) => {
  return (
    <button 
      className={`
        flex-1 py-3 text-sm font-medium transition-colors duration-200
        flex flex-col items-center justify-center gap-1
        ${isSelected 
          ? 'text-cardshow-white border-b-2 border-cardshow-blue bg-editor-dark' 
          : 'text-cardshow-lightGray hover:text-white hover:bg-editor-dark/50'}
      `}
      onClick={onClick}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
};


import React, { useState } from 'react';
import { SearchBar } from './sidebar/SearchBar';
import { TabNavigation } from './sidebar/TabNavigation';
import { UploadSection } from './sidebar/UploadSection';
import { TemplatesSection } from './sidebar/TemplatesSection';
import { AssetsSection } from './sidebar/AssetsSection';
import { DesignElements } from './sidebar/DesignElements';
import { LayersPanel } from './sidebar/LayersPanel';
import { useCardEditor } from '@/hooks/useCardEditor';

interface LeftSidebarProps {
  selectedTemplate: string;
  onSelectTemplate: (template: string) => void;
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const LeftSidebar = ({ selectedTemplate, onSelectTemplate, cardEditor }: LeftSidebarProps) => {
  const [selectedTab, setSelectedTab] = useState('upload');
  const [searchQuery, setSearchQuery] = useState('');
  
  const templates = [
    { id: 'template1', name: 'Cardshow Nostalgia', color: 'bg-cardshow-green', category: 'featured' },
    { id: 'template2', name: 'Classic Cardboard', color: 'bg-cardshow-orange', category: 'featured' },
    { id: 'template3', name: 'Nifty Framework', color: 'bg-cardshow-purple', category: 'featured' },
    { id: 'template4', name: 'Synthwave Dreams', color: 'bg-pink-500', category: 'popular' },
    { id: 'template5', name: 'Minimal Clean', color: 'bg-gray-300', category: 'popular' },
    { id: 'template6', name: 'Pixel Perfect', color: 'bg-blue-500', category: 'popular' },
  ];
  
  const assets = [
    { id: 'asset1', name: 'Icon Pack', thumb: 'public/lovable-uploads/236a8721-7f3f-49da-8787-7696565ff342.png', category: 'stickers' },
    { id: 'asset2', name: 'Backgrounds', thumb: 'public/lovable-uploads/28723390-e5ca-4efe-b231-e1dd87f8639a.png', category: 'backgrounds' },
    { id: 'asset3', name: 'Textures', thumb: 'public/lovable-uploads/4267414c-44f6-420c-8d56-383691359ce6.png', category: 'textures' },
    { id: 'asset4', name: '3D Elements', thumb: 'public/lovable-uploads/4db063a6-f43a-42c6-8670-41f27f772be8.png', category: 'elements' },
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'upload':
        return <UploadSection cardEditor={cardEditor} />;
      case 'templates':
        return (
          <TemplatesSection
            templates={templates}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={onSelectTemplate}
            searchQuery={searchQuery}
          />
        );
      case 'assets':
        return (
          <AssetsSection
            assets={assets}
            searchQuery={searchQuery}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="w-80 h-full bg-editor-dark border-r border-editor-border overflow-y-auto">
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <TabNavigation selectedTab={selectedTab} onTabSelect={setSelectedTab} />
      <div className="p-6 space-y-6">
        {renderTabContent()}
      </div>
      <DesignElements />
      <LayersPanel />
    </div>
  );
};

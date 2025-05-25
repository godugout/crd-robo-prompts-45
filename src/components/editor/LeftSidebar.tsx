
import React, { useState } from 'react';
import { TabNavigation } from './sidebar/TabNavigation';
import { SearchBar } from './sidebar/SearchBar';
import { TemplatesSection } from './sidebar/TemplatesSection';
import { EnhancedAssetsSection } from './sidebar/EnhancedAssetsSection';
import { UploadSection } from './sidebar/UploadSection';
import { DesignElements } from './sidebar/DesignElements';
import { LayersPanel } from './sidebar/LayersPanel';
import { useCardEditor } from '@/hooks/useCardEditor';

interface LeftSidebarProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const LeftSidebar = ({ selectedTemplate, onSelectTemplate, cardEditor }: LeftSidebarProps) => {
  const [activeTab, setActiveTab] = useState('templates');
  const [searchQuery, setSearchQuery] = useState('');

  const mockAssets = [
    {
      id: 'local-1',
      name: 'Sample Asset',
      thumbnail: '/placeholder.svg',
      category: 'elements'
    }
  ];

  return (
    <div className="w-80 bg-editor-darker border-r border-editor-border flex flex-col">
      <div className="p-4 border-b border-editor-border">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="p-4 space-y-4 h-full">
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          
          <div className="flex-1 overflow-hidden">
            {activeTab === 'templates' && (
              <TemplatesSection 
                selectedTemplate={selectedTemplate}
                onSelectTemplate={onSelectTemplate}
                searchQuery={searchQuery}
              />
            )}
            
            {activeTab === 'assets' && (
              <EnhancedAssetsSection 
                assets={mockAssets}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}
            
            {activeTab === 'upload' && <UploadSection />}
            {activeTab === 'elements' && <DesignElements />}
            {activeTab === 'layers' && <LayersPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};

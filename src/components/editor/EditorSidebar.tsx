
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileImage, Upload, Layers, Grid } from 'lucide-react';
import { toast } from 'sonner';

interface EditorSidebarProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export const EditorSidebar = ({ selectedTemplate, onSelectTemplate }: EditorSidebarProps) => {
  const [activeTab, setActiveTab] = useState('templates');
  const [searchQuery, setSearchQuery] = useState('');

  const templates = [
    { id: 'template1', name: 'Cardshow Nostalgia', color: 'bg-crd-green' },
    { id: 'template2', name: 'Classic Cardboard', color: 'bg-crd-orange' },
    { id: 'template3', name: 'Nifty Framework', color: 'bg-crd-purple' },
    { id: 'template4', name: 'Synthwave Dreams', color: 'bg-pink-500' }
  ];

  const tabs = [
    { id: 'templates', label: 'Templates', icon: Grid },
    { id: 'assets', label: 'Assets', icon: FileImage },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'layers', label: 'Layers', icon: Layers }
  ];

  return (
    <div className="w-80 bg-editor-darker border-r border-editor-border flex flex-col">
      <div className="p-4 border-b border-editor-border">
        <div className="flex space-x-1 bg-editor-dark rounded-xl p-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                className={`flex-1 rounded-lg ${activeTab === tab.id ? 'bg-crd-green/20 text-crd-green' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="p-4 space-y-4 h-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-editor-dark border-editor-border text-white rounded-xl"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'templates' && (
              <div className="space-y-3">
                <h3 className="text-white font-medium text-sm uppercase tracking-wide">Card Templates</h3>
                {templates.map((template) => (
                  <div 
                    key={template.id}
                    className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-colors ${
                      selectedTemplate === template.id
                        ? 'bg-editor-tool border border-crd-green/30 shadow-lg' 
                        : 'hover:bg-editor-tool/50'
                    }`}
                    onClick={() => onSelectTemplate(template.id)}
                  >
                    <div className={`w-10 h-10 rounded-lg ${template.color}`}></div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{template.name}</p>
                    </div>
                    {selectedTemplate === template.id && (
                      <div className="w-4 h-4 bg-crd-green rounded-full shadow-lg"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'assets' && (
              <div className="space-y-3">
                <h3 className="text-white font-medium text-sm uppercase tracking-wide">Assets</h3>
                <p className="text-crd-lightGray text-sm">No assets available</p>
              </div>
            )}
            
            {activeTab === 'upload' && (
              <div className="space-y-3">
                <h3 className="text-white font-medium text-sm uppercase tracking-wide">Upload Files</h3>
                <div className="p-4 border-2 border-dashed border-editor-border rounded-xl text-center">
                  <Upload className="w-10 h-10 text-crd-lightGray mb-3 mx-auto" />
                  <p className="text-white font-medium">Upload Card Art</p>
                  <p className="text-xs text-crd-lightGray mt-1">
                    Drag or choose your file to upload
                  </p>
                  <Button className="mt-4 rounded-lg" variant="outline">
                    Browse Files
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'layers' && (
              <div className="space-y-3">
                <h3 className="text-white font-medium text-sm uppercase tracking-wide">Layers</h3>
                <p className="text-crd-lightGray text-sm">No layers available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

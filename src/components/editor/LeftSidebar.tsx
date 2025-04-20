
import React, { useState } from 'react';
import { SidebarSection } from './SidebarSection';
import { Upload, Image, Type, Plus, Square, LayoutGrid } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface TemplateProps {
  selectedTemplate: string;
  onSelectTemplate: (template: string) => void;
}

export const LeftSidebar = ({ selectedTemplate, onSelectTemplate }: TemplateProps) => {
  const [selectedTab, setSelectedTab] = useState('upload');
  
  const templates = [
    { id: 'template1', name: 'Cardshow Nostalgia', color: 'bg-cardshow-green' },
    { id: 'template2', name: 'Classic Cardboard', color: 'bg-cardshow-orange' },
    { id: 'template3', name: 'Nifty Framework', color: 'bg-cardshow-purple' },
  ];
  
  const assets = [
    { id: 'asset1', name: 'Icon Pack', thumb: 'public/lovable-uploads/236a8721-7f3f-49da-8787-7696565ff342.png' },
    { id: 'asset2', name: 'Backgrounds', thumb: 'public/lovable-uploads/28723390-e5ca-4efe-b231-e1dd87f8639a.png' },
    { id: 'asset3', name: 'Textures', thumb: 'public/lovable-uploads/4267414c-44f6-420c-8d56-383691359ce6.png' },
  ];
  
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'upload':
        return (
          <div className="p-4 border-2 border-dashed border-editor-border rounded-lg text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <Upload className="w-10 h-10 text-cardshow-lightGray mb-3" />
              <p className="text-cardshow-white font-medium">Upload Card Files</p>
              <p className="text-xs text-cardshow-lightGray mt-1">Drag or choose your file to upload</p>
              <button className="mt-4 px-4 py-2 bg-editor-dark border border-editor-border rounded-lg text-cardshow-white text-sm hover:bg-editor-tool">
                Browse Files
              </button>
            </div>
          </div>
        );
      case 'templates':
        return (
          <div className="space-y-4">
            {templates.map((template) => (
              <div 
                key={template.id}
                className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${
                  selectedTemplate === template.id 
                    ? 'bg-editor-tool border border-editor-border' 
                    : 'hover:bg-editor-tool/50'
                }`}
                onClick={() => onSelectTemplate(template.id)}
              >
                <div className={`w-10 h-10 rounded ${template.color}`}></div>
                <div className="flex-1">
                  <p className="text-cardshow-white font-medium">{template.name}</p>
                </div>
                {selectedTemplate === template.id && (
                  <div className="w-4 h-4 bg-cardshow-green rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        );
      case 'assets':
        return (
          <div className="space-y-4">
            {assets.map((asset) => (
              <div 
                key={asset.id}
                className="p-3 rounded-lg cursor-pointer flex items-center gap-3 hover:bg-editor-tool/50 transition-colors"
              >
                <img src={asset.thumb} alt={asset.name} className="w-10 h-10 rounded bg-editor-darker object-cover" />
                <div className="flex-1">
                  <p className="text-cardshow-white font-medium">{asset.name}</p>
                </div>
                <Plus className="w-4 h-4 text-cardshow-lightGray" />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="w-80 h-full bg-editor-dark border-r border-editor-border overflow-y-auto">
      {/* Tab navigation */}
      <div className="flex border-b border-editor-border">
        <button 
          className={`flex-1 py-3 text-sm font-medium ${selectedTab === 'upload' ? 'text-cardshow-white border-b-2 border-cardshow-blue' : 'text-cardshow-lightGray'}`}
          onClick={() => setSelectedTab('upload')}
        >
          Upload
        </button>
        <button 
          className={`flex-1 py-3 text-sm font-medium ${selectedTab === 'templates' ? 'text-cardshow-white border-b-2 border-cardshow-blue' : 'text-cardshow-lightGray'}`}
          onClick={() => setSelectedTab('templates')}
        >
          Templates
        </button>
        <button 
          className={`flex-1 py-3 text-sm font-medium ${selectedTab === 'assets' ? 'text-cardshow-white border-b-2 border-cardshow-blue' : 'text-cardshow-lightGray'}`}
          onClick={() => setSelectedTab('assets')}
        >
          Assets
        </button>
      </div>
      
      <div className="p-6 space-y-6">
        {renderTabContent()}
      </div>
      
      <SidebarSection title="Card Design Elements">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-cardshow-lightGray uppercase">Background</Label>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i}
                  className="aspect-square rounded bg-gradient-to-br from-editor-darker to-editor-tool cursor-pointer hover:ring-1 hover:ring-cardshow-blue"
                ></div>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-xs text-cardshow-lightGray uppercase">Elements</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="p-2 rounded bg-editor-darker hover:bg-editor-tool text-cardshow-lightGray">
                <Image size={20} />
              </button>
              <button className="p-2 rounded bg-editor-darker hover:bg-editor-tool text-cardshow-lightGray">
                <Type size={20} />
              </button>
              <button className="p-2 rounded bg-editor-darker hover:bg-editor-tool text-cardshow-lightGray">
                <Square size={20} />
              </button>
              <button className="p-2 rounded bg-editor-darker hover:bg-editor-tool text-cardshow-lightGray">
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>
        </div>
      </SidebarSection>
      
      {/* Layer section */}
      <SidebarSection title="Layers">
        <div className="space-y-2">
          <div className="p-2 rounded bg-editor-darker flex items-center justify-between">
            <span className="text-cardshow-white text-sm">Background</span>
            <div className="flex gap-1">
              <button className="text-cardshow-lightGray hover:text-cardshow-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5"/>
                  <path d="M5 12h14"/>
                </svg>
              </button>
              <button className="text-cardshow-lightGray hover:text-cardshow-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-2 rounded bg-editor-tool flex items-center justify-between">
            <span className="text-cardshow-white text-sm">Card Art</span>
            <div className="flex gap-1">
              <button className="text-cardshow-lightGray hover:text-cardshow-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5"/>
                  <path d="M5 12h14"/>
                </svg>
              </button>
              <button className="text-cardshow-lightGray hover:text-cardshow-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-2 rounded bg-editor-darker flex items-center justify-between">
            <span className="text-cardshow-white text-sm">Frame</span>
            <div className="flex gap-1">
              <button className="text-cardshow-lightGray hover:text-cardshow-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5"/>
                  <path d="M5 12h14"/>
                </svg>
              </button>
              <button className="text-cardshow-lightGray hover:text-cardshow-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </SidebarSection>
    </div>
  );
};

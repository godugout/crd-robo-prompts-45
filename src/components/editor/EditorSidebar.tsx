
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Grid, Shapes, Sparkles, Camera, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FramesTab } from './sidebar/FramesTab';
import { ElementsTab } from './sidebar/ElementsTab';
import { EffectsTab } from './sidebar/EffectsTab';
import { PhotoTab } from './sidebar/PhotoTab';
import { PreviewTab } from './sidebar/PreviewTab';

interface EditorSidebarProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  onAddElement?: (elementType: string, elementId: string) => void;
}

export const EditorSidebar = ({ 
  selectedTemplate, 
  onSelectTemplate, 
  onAddElement 
}: EditorSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStep, setCurrentStep] = useState<'frames' | 'elements' | 'preview' | 'effects' | 'photo'>('frames');

  return (
    <div className="w-80 bg-editor-darker border-r border-editor-border flex flex-col rounded-xl">
      {/* Search Bar */}
      <div className="p-4 border-b border-editor-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search design elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-editor-dark border-editor-border text-white rounded-xl"
          />
        </div>
      </div>

      {/* Workflow Steps Header */}
      <div className="px-4 py-3 border-b border-editor-border">
        <h3 className="text-white font-medium text-sm uppercase tracking-wide mb-2">Creation Workflow</h3>
        <div className="flex items-center space-x-1">
          {[
            { key: 'frames', label: '1', desc: 'Template' },
            { key: 'elements', label: '2', desc: 'Elements' },
            { key: 'preview', label: '3', desc: 'Preview' },
            { key: 'effects', label: '4', desc: 'Effects' },
            { key: 'photo', label: '5', desc: 'Photo' }
          ].map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep === step.key 
                    ? 'bg-crd-green text-black' 
                    : 'bg-editor-tool text-gray-400'
                }`}
              >
                {step.label}
              </div>
              {index < 4 && <div className="w-2 h-px bg-editor-border ml-1"></div>}
            </div>
          ))}
        </div>
      </div>
      
      {/* Tabbed Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={currentStep} onValueChange={(value) => setCurrentStep(value as any)} className="h-full flex flex-col">
          <TabsList className="mx-4 mt-4 bg-editor-dark grid grid-cols-5">
            <TabsTrigger value="frames" className="text-xs">
              <Grid className="w-3 h-3 mr-1" />
              Frames
            </TabsTrigger>
            <TabsTrigger value="elements" className="text-xs">
              <Shapes className="w-3 h-3 mr-1" />
              Elements
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">
              <Eye className="w-3 h-3 mr-1" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="effects" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Effects
            </TabsTrigger>
            <TabsTrigger value="photo" className="text-xs">
              <Camera className="w-3 h-3 mr-1" />
              Photo
            </TabsTrigger>
          </TabsList>

          {/* Frames Tab */}
          <TabsContent value="frames" className="flex-1 mt-4">
            <FramesTab 
              selectedTemplate={selectedTemplate}
              onSelectTemplate={(templateId) => {
                onSelectTemplate(templateId);
                setCurrentStep('elements'); // Auto-advance to next step
              }}
              searchQuery={searchQuery}
            />
          </TabsContent>

          {/* Elements Tab */}
          <TabsContent value="elements" className="flex-1 mt-4">
            <ElementsTab 
              searchQuery={searchQuery} 
              onAddElement={onAddElement}
              onElementsComplete={() => setCurrentStep('preview')} // Auto-advance to preview
            />
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="flex-1 mt-4">
            <PreviewTab 
              selectedTemplate={selectedTemplate}
              onContinueToEffects={() => setCurrentStep('effects')}
            />
          </TabsContent>

          {/* Effects Tab */}
          <TabsContent value="effects" className="flex-1 mt-4">
            <EffectsTab 
              searchQuery={searchQuery}
              onEffectsComplete={() => setCurrentStep('photo')} // Auto-advance to photo
            />
          </TabsContent>

          {/* Photo Tab */}
          <TabsContent value="photo" className="flex-1 mt-4">
            <PhotoTab 
              selectedTemplate={selectedTemplate}
              searchQuery={searchQuery}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

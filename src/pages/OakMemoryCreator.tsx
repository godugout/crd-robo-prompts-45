
import React, { useState } from 'react';
import { ArrowLeft, ZoomIn, ZoomOut, Maximize, Type, Palette, Sparkles, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemplateGallery } from '@/components/oak-creator/TemplateGallery';
import { TemplatePreviewModal } from '@/components/oak-creator/TemplatePreviewModal';
import { OakTemplate } from '@/types/oakTemplates';

export const OakMemoryCreator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<OakTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<OakTemplate | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [zoom, setZoom] = useState(100);

  const handleSelectTemplate = (template: OakTemplate) => {
    setSelectedTemplate(template);
  };

  const handlePreviewTemplate = (template: OakTemplate) => {
    setPreviewTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const handleFavoriteTemplate = (template: OakTemplate) => {
    // In a real app, this would update the database
    console.log('Toggle favorite for template:', template.id);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Top Header */}
      <header className="h-[60px] bg-[#0f4c3a] border-b border-[#0f4c3a]/20 flex items-center justify-between px-4 z-10">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-[#ffd700] hover:bg-[#0f4c3a]/80 hover:text-[#ffd700]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="w-8 h-8 rounded-full bg-[#ffd700] flex items-center justify-center">
            <span className="text-[#0f4c3a] font-bold text-sm">A</span>
          </div>
          
          <h1 className="text-[#ffd700] font-semibold text-lg hidden sm:block">
            Oakland A's Memory Creator
          </h1>
          <h1 className="text-[#ffd700] font-semibold text-sm sm:hidden">
            A's Memories
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="border-[#ffd700] text-[#ffd700] hover:bg-[#ffd700] hover:text-[#0f4c3a] hidden md:flex"
          >
            2D Preview
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-[#ffd700] text-[#ffd700] hover:bg-[#ffd700] hover:text-[#0f4c3a]"
          >
            <Share2 className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Share</span>
          </Button>
          <Button 
            size="sm"
            className="bg-[#ffd700] text-[#0f4c3a] hover:bg-[#ffd700]/90 font-medium"
          >
            <Download className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Save Memory</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar with Template Gallery */}
        <aside className="w-80 bg-[#1a1a1a] border-r border-gray-800 flex flex-col overflow-hidden">
          <TemplateGallery
            selectedTemplate={selectedTemplate?.id}
            onSelectTemplate={handleSelectTemplate}
          />
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 bg-gray-100 flex flex-col relative">
          {/* Canvas Container */}
          <div className="flex-1 flex items-center justify-center p-8 relative">
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-white rounded-lg shadow-lg p-2 z-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="hover:bg-gray-100"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[3rem] text-center">
                {zoom}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="hover:bg-gray-100"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <div className="w-px h-4 bg-gray-300 mx-1" />
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-gray-100"
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>

            {/* Canvas */}
            <div 
              className="bg-white rounded-lg shadow-2xl border-2 border-dashed border-gray-300 flex items-center justify-center canvas-zoom"
              style={{
                width: `${(400 * zoom) / 100}px`,
                height: `${(600 * zoom) / 100}px`,
                maxWidth: '90%',
                maxHeight: '80%',
              }}
            >
              {selectedTemplate ? (
                <div className="relative w-full h-full overflow-hidden rounded-lg">
                  <img
                    src={selectedTemplate.thumbnail}
                    alt={selectedTemplate.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-lg font-bold mb-2">{selectedTemplate.name}</h3>
                      <p className="text-sm opacity-90">Template loaded - ready to customize</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#0f4c3a] flex items-center justify-center mx-auto mb-4">
                    <span className="text-[#ffd700] font-bold text-2xl">A</span>
                  </div>
                  <p className="text-gray-500 text-lg font-medium">
                    Select a template to begin
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Choose from Oakland A's themed designs
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Toolbar */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center justify-center gap-6">
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto py-2 px-4 hover:bg-gray-100"
                disabled={!selectedTemplate}
              >
                <Type className="w-5 h-5" />
                <span className="text-xs">Text</span>
              </Button>
              
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto py-2 px-4 hover:bg-gray-100"
                disabled={!selectedTemplate}
              >
                <Palette className="w-5 h-5" />
                <span className="text-xs">Colors</span>
              </Button>
              
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto py-2 px-4 hover:bg-gray-100"
                disabled={!selectedTemplate}
              >
                <Sparkles className="w-5 h-5" />
                <span className="text-xs">Effects</span>
              </Button>
              
              <div className="w-px h-8 bg-gray-300" />
              
              <Button
                className="bg-[#0f4c3a] text-[#ffd700] hover:bg-[#0f4c3a]/90 px-6"
                disabled={!selectedTemplate}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        onFavorite={handleFavoriteTemplate}
      />
    </div>
  );
};

export default OakMemoryCreator;

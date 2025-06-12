
import React, { useState } from 'react';
import { OakMemoryHeader } from '@/components/oak-creator/OakMemoryHeader';
import { OakMemoryCanvas } from '@/components/oak-creator/OakMemoryCanvas';
import { OakMemoryToolbar } from '@/components/oak-creator/OakMemoryToolbar';
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

  const handleBack = () => {
    // Navigate back to main app
    console.log('Navigate back');
  };

  const handleShare = () => {
    console.log('Share memory');
  };

  const handleSave = () => {
    console.log('Save memory');
  };

  const handleExport = () => {
    console.log('Export memory');
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <OakMemoryHeader 
        onBack={handleBack}
        onShare={handleShare}
        onSave={handleSave}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar with Template Gallery */}
        <aside className="w-80 bg-[#1a1a1a] border-r border-gray-800 flex flex-col overflow-hidden">
          <TemplateGallery
            selectedTemplate={selectedTemplate?.id}
            onSelectTemplate={handleSelectTemplate}
          />
        </aside>

        <OakMemoryCanvas
          selectedTemplate={selectedTemplate}
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
      </div>

      <OakMemoryToolbar 
        selectedTemplate={selectedTemplate}
        onExport={handleExport}
      />

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

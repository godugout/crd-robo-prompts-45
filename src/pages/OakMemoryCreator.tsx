
import React, { useState } from 'react';
import { OakMemoryHeader } from '@/components/oak-creator/OakMemoryHeader';
import { TemplateGallery } from '@/components/oak-creator/TemplateGallery';
import { TemplatePreviewModal } from '@/components/oak-creator/TemplatePreviewModal';
import { OakStudioEditor } from '@/components/oak-creator/OakStudioEditor';
import { OakTemplate } from '@/types/oakTemplates';
import { useNavigate } from 'react-router-dom';

export const OakMemoryCreator: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<OakTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<OakTemplate | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [showStudioEditor, setShowStudioEditor] = useState(false);

  const handleSelectTemplate = (template: OakTemplate) => {
    setSelectedTemplate(template);
    setShowStudioEditor(true);
  };

  const handlePreviewTemplate = (template: OakTemplate) => {
    setPreviewTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const handleFavoriteTemplate = (template: OakTemplate) => {
    console.log('Toggle favorite for template:', template.id);
  };

  const handleBack = () => {
    if (showStudioEditor) {
      setShowStudioEditor(false);
      setSelectedTemplate(null);
    } else {
      navigate('/');
    }
  };

  const handleShare = () => {
    console.log('Share memory');
  };

  const handleSave = () => {
    console.log('Save memory');
  };

  // Show studio editor when template is selected
  if (showStudioEditor && selectedTemplate) {
    return (
      <OakStudioEditor
        selectedTemplate={selectedTemplate}
        onBack={handleBack}
      />
    );
  }

  // Show template selection interface
  return (
    <div className="h-screen bg-gradient-to-br from-[#0f4c3a] to-[#1a5c47] flex flex-col">
      <OakMemoryHeader 
        onBack={handleBack}
        onShare={handleShare}
        onSave={handleSave}
      />

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#ffd700] mb-4">
              Oakland A's Memory Creator Studio
            </h1>
            <p className="text-white/80 text-lg">
              Choose a template to start creating your professional Oakland A's memory card
            </p>
          </div>

          <TemplateGallery
            selectedTemplate={selectedTemplate?.id}
            onSelectTemplate={handleSelectTemplate}
          />
        </div>
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

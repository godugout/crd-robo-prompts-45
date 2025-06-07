
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Edit3, Maximize, RotateCcw, Eye, Camera } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import type { useCardEditor } from '@/hooks/useCardEditor';
import { DynamicTemplateRenderer } from './DynamicTemplateRenderer';

interface EnhancedInteractivePreviewProps {
  title: string;
  description: string;
  cardEditor?: ReturnType<typeof useCardEditor>;
  onElementSelect?: (elementId: string | null) => void;
  selectedElement?: string | null;
  currentPhoto?: string;
  cardState?: any;
}

export const EnhancedInteractivePreview = ({ 
  title, 
  description, 
  cardEditor,
  onElementSelect,
  selectedElement,
  currentPhoto
}: EnhancedInteractivePreviewProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardFrontRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  useEffect(() => {
    // Get selected template from wizard state or card editor
    const templateId = cardEditor?.cardData?.template_id;
    if (templateId) {
      // Find template data - this would come from the wizard config
      import('@/components/editor/wizard/wizardConfig').then(({ DEFAULT_TEMPLATES }) => {
        const template = DEFAULT_TEMPLATES.find(t => t.id === templateId);
        setSelectedTemplate(template);
      });
    }
  }, [cardEditor?.cardData?.template_id]);

  const handleExportCard = async () => {
    if (!cardFrontRef.current) {
      toast.error('Card not ready for export');
      return;
    }
    
    setIsExporting(true);
    try {
      // Capture the card front at high resolution
      const canvas = await html2canvas(cardFrontRef.current, {
        backgroundColor: 'transparent',
        scale: 3, // High resolution
        useCORS: true,
        allowTaint: true,
        removeContainer: true
      });
      
      // Add simple watermark
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#10B981'; // CRD green
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText('CRD', canvas.width - 15, 15);
        ctx.restore();
      }
      
      // Download the image
      const link = document.createElement('a');
      link.download = `${cardEditor?.cardData.title || 'card'}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      
      toast.success('Card exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export card');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePhotoUpload = () => {
    window.dispatchEvent(new CustomEvent('photoAction', { 
      detail: { action: 'upload' } 
    }));
  };

  const renderCard = () => {
    if (!selectedTemplate || !cardEditor) {
      return (
        <div 
          ref={cardFrontRef}
          className="w-80 h-112 bg-white rounded-lg shadow-lg border-2 border-gray-200 flex items-center justify-center"
        >
          <div className="text-center p-4">
            <div className="text-gray-400 mb-2">No template selected</div>
            <div className="text-sm text-gray-500">Choose a template to see your card preview</div>
          </div>
        </div>
      );
    }

    return (
      <div ref={cardFrontRef}>
        <DynamicTemplateRenderer
          template={selectedTemplate}
          cardData={cardEditor.cardData}
          currentPhoto={currentPhoto}
          scaleFactor={1}
          onPhotoUpload={handlePhotoUpload}
          onElementSelect={onElementSelect}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      {/* Card Preview */}
      <div className="flex flex-col items-center space-y-4">
        <div ref={cardRef} className="transform hover:scale-105 transition-transform duration-200">
          {renderCard()}
        </div>
        
        {/* Quick info */}
        <div className="text-center">
          <h3 className="text-white font-medium">{cardEditor?.cardData.title || 'Preview Mode'}</h3>
          <p className="text-crd-lightGray text-sm">
            {selectedTemplate ? `${selectedTemplate.name} Template` : 'Select a template to begin'}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap justify-center">
        <Button
          onClick={handlePhotoUpload}
          variant="outline"
          className="border-editor-border text-white hover:bg-editor-border"
        >
          <Camera className="w-4 h-4 mr-2" />
          {currentPhoto || cardEditor?.cardData.image_url ? 'Change Photo' : 'Add Photo'}
        </Button>
        
        <Button
          onClick={() => window.dispatchEvent(new CustomEvent('switchToCanvas'))}
          variant="outline"
          className="border-editor-border text-white hover:bg-editor-border"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Details
        </Button>
        
        <Button
          onClick={handleExportCard}
          disabled={isExporting}
          className="bg-crd-green hover:bg-crd-green/90 text-black"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Card'}
        </Button>
      </div>

      {/* Help text */}
      <div className="text-center text-crd-lightGray text-xs max-w-md">
        <p>
          Your card preview will update as you upload photos and select templates. 
          Click elements to edit them or use the sidebar tools for more options.
        </p>
      </div>
    </div>
  );
};

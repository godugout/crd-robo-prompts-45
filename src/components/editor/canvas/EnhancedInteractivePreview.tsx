
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Edit3, Maximize, RotateCcw, Eye, Camera } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import type { useCardEditor } from '@/hooks/useCardEditor';

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
  const cardFrontRef = useRef<HTMLDivElement>(null); // New ref for just the card front
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

  const addWatermarkToCanvas = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Properly position watermark in upper right corner
    const margin = 10;
    
    // Add CRD text watermark
    ctx.save();
    // Make it more visible
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = '#10B981'; // CRD green color
    
    // Calculate font size based on canvas width
    const fontSize = Math.max(Math.min(canvas.width * 0.05, 24), 12); // Between 12-24px
    
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('CRD', canvas.width - margin, margin);
    ctx.restore();

    return canvas;
  };

  const handleExportCard = async () => {
    if (!cardFrontRef.current) {
      toast.error('Card not ready for export');
      return;
    }
    
    setIsExporting(true);
    try {
      // Capture only the card front content, not the entire container
      const canvas = await html2canvas(cardFrontRef.current, {
        backgroundColor: 'transparent',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        removeContainer: true
      });
      
      // Add watermark to the exported canvas
      const watermarkedCanvas = addWatermarkToCanvas(canvas);
      
      const link = document.createElement('a');
      link.download = `${cardEditor?.cardData.title || 'card'}.png`;
      link.href = watermarkedCanvas.toDataURL('image/png', 1.0);
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
    const photoUrl = currentPhoto || cardEditor?.cardData.image_url;
    const cardTitle = cardEditor?.cardData.title || title || 'Card Title';
    const cardDescription = cardEditor?.cardData.description || description || 'Card description';
    
    if (!selectedTemplate) {
      return (
        <div 
          ref={cardFrontRef}
          className="w-80 h-112 bg-white rounded-lg shadow-lg border-2 border-gray-200 flex items-center justify-center"
          data-card-front="true" // Add data attribute for export targeting
        >
          <div className="text-center p-4">
            <div className="text-gray-400 mb-2">No template selected</div>
            <div className="text-sm text-gray-500">Choose a template to see your card preview</div>
          </div>
        </div>
      );
    }

    const { colors, regions } = selectedTemplate.template_data;
    const scaleFactor = 0.8; // Scale down for preview

    return (
      <div 
        ref={cardFrontRef}
        className="relative rounded-lg shadow-xl border-2 border-gray-300 overflow-hidden"
        style={{ 
          width: 300 * scaleFactor, 
          height: 420 * scaleFactor,
          backgroundColor: colors.background 
        }}
        data-card-front="true" // Add data attribute for export targeting
      >
        {/* Template-specific rendering */}
        {selectedTemplate.id === 'tcg-classic' && (
          <>
            {/* Title */}
            <div 
              className="absolute flex items-center justify-center text-white font-bold text-sm rounded"
              style={{
                left: regions.title.x * scaleFactor,
                top: regions.title.y * scaleFactor,
                width: regions.title.width * scaleFactor,
                height: regions.title.height * scaleFactor,
                backgroundColor: colors.primary
              }}
            >
              {cardTitle}
            </div>
            
            {/* Image */}
            <div 
              className="absolute overflow-hidden rounded border-2 border-gray-300"
              style={{
                left: regions.image.x * scaleFactor,
                top: regions.image.y * scaleFactor,
                width: regions.image.width * scaleFactor,
                height: regions.image.height * scaleFactor
              }}
            >
              {photoUrl ? (
                <img 
                  src={photoUrl} 
                  alt="Card" 
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => onElementSelect?.('image')}
                />
              ) : (
                <div 
                  className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={handlePhotoUpload}
                >
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500 text-center px-2">Click to add photo</span>
                </div>
              )}
            </div>
            
            {/* Stats area */}
            <div 
              className="absolute p-2 text-xs rounded"
              style={{
                left: regions.stats.x * scaleFactor,
                top: regions.stats.y * scaleFactor,
                width: regions.stats.width * scaleFactor,
                height: regions.stats.height * scaleFactor,
                backgroundColor: colors.secondary,
                color: colors.text === '#ffffff' ? '#000000' : colors.text
              }}
            >
              <div className="font-semibold mb-1">Description:</div>
              <div className="text-xs opacity-90">{cardDescription}</div>
              <div className="mt-2 text-xs">
                <div>Rarity: {cardEditor?.cardData.rarity || 'Common'}</div>
                <div>Type: {cardEditor?.cardData.type || 'Character'}</div>
              </div>
            </div>
          </>
        )}

        {selectedTemplate.id === 'sports-modern' && (
          <>
            {/* Player name header */}
            <div 
              className="absolute flex items-center text-white font-bold text-sm"
              style={{
                left: regions.playerName.x * scaleFactor,
                top: regions.playerName.y * scaleFactor,
                width: regions.playerName.width * scaleFactor,
                height: regions.playerName.height * scaleFactor,
                backgroundColor: colors.primary
              }}
            >
              <span className="ml-2">{cardTitle}</span>
            </div>
            
            {/* Action shot */}
            <div 
              className="absolute overflow-hidden rounded"
              style={{
                left: regions.image.x * scaleFactor,
                top: regions.image.y * scaleFactor,
                width: regions.image.width * scaleFactor,
                height: regions.image.height * scaleFactor
              }}
            >
              {photoUrl ? (
                <img 
                  src={photoUrl} 
                  alt="Player" 
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => onElementSelect?.('image')}
                />
              ) : (
                <div 
                  className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                  onClick={handlePhotoUpload}
                >
                  <Camera className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Action Shot</span>
                </div>
              )}
            </div>
            
            {/* Team and position */}
            <div 
              className="absolute flex justify-between items-center px-2 text-xs font-medium"
              style={{
                left: 0,
                bottom: 40 * scaleFactor,
                width: '100%',
                height: 30 * scaleFactor,
                backgroundColor: colors.accent,
                color: 'white'
              }}
            >
              <span>{cardEditor?.cardData.series || 'TEAM NAME'}</span>
              <span>{cardEditor?.cardData.type || 'POSITION'}</span>
            </div>
            
            {/* Stats footer */}
            <div 
              className="absolute p-2 text-xs"
              style={{
                left: 0,
                bottom: 0,
                width: '100%',
                height: 40 * scaleFactor,
                backgroundColor: colors.secondary,
                color: colors.text
              }}
            >
              {cardDescription}
            </div>
          </>
        )}

        {/* Add similar renders for other templates... */}
        {selectedTemplate.id === 'school-academic' && (
          <>
            <div 
              className="absolute flex items-center justify-center text-white font-bold text-sm"
              style={{
                left: regions.name.x * scaleFactor,
                top: regions.name.y * scaleFactor,
                width: regions.name.width * scaleFactor,
                height: regions.name.height * scaleFactor,
                backgroundColor: colors.primary
              }}
            >
              {cardTitle}
            </div>
            
            <div 
              className="absolute overflow-hidden rounded-full border-4"
              style={{
                left: regions.image.x * scaleFactor,
                top: regions.image.y * scaleFactor,
                width: regions.image.width * scaleFactor,
                height: regions.image.height * scaleFactor,
                borderColor: colors.primary
              }}
            >
              {photoUrl ? (
                <img src={photoUrl} alt="Portrait" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center cursor-pointer" onClick={handlePhotoUpload}>
                  <Camera className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
          </>
        )}

        {/* Rarity indicator */}
        {cardEditor?.cardData.rarity && (
          <div className="absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white rounded-full"
            style={{ backgroundColor: getRarityColor(cardEditor.cardData.rarity) }}>
            {cardEditor.cardData.rarity.toUpperCase()}
          </div>
        )}
      </div>
    );
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: '#6b7280',
      uncommon: '#10b981',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#f59e0b'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
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

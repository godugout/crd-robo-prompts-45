
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';
import { EnhancedImage } from '@/components/media/EnhancedImage';
import { 
  Layers, 
  Eye, 
  Sparkles, 
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface EnhancedPSDCardProps {
  psd: BulkPSDData;
  onSelect: (id: string) => void;
  onAnalyze: (id: string) => void;
  isSelected: boolean;
}

export const EnhancedPSDCard: React.FC<EnhancedPSDCardProps> = ({
  psd,
  onSelect,
  onAnalyze,
  isSelected
}) => {
  // Determine the best image to display
  const getPreviewImage = (): { url: string; isProcessing: boolean } => {
    const { enhancedProcessedPSD } = psd;
    
    // Check if we have a real flattened image (not placeholder)
    if (enhancedProcessedPSD.extractedImages?.flattenedImageUrl && 
        !enhancedProcessedPSD.extractedImages.flattenedImageUrl.includes('placeholder')) {
      console.log('✅ Using flattened image from extractedImages');
      return { 
        url: enhancedProcessedPSD.extractedImages.flattenedImageUrl, 
        isProcessing: false 
      };
    }
    
    // Check main flattened image URL
    if (enhancedProcessedPSD.flattenedImageUrl && 
        !enhancedProcessedPSD.flattenedImageUrl.includes('placeholder')) {
      console.log('✅ Using main flattened image URL');
      return { 
        url: enhancedProcessedPSD.flattenedImageUrl, 
        isProcessing: false 
      };
    }
    
    // Check if we have layer images to show
    if (enhancedProcessedPSD.extractedImages?.layerImages?.length > 0) {
      const firstLayerImage = enhancedProcessedPSD.extractedImages.layerImages[0];
      if (firstLayerImage.imageUrl && !firstLayerImage.imageUrl.includes('placeholder')) {
        console.log('✅ Using first layer image as fallback');
        return { 
          url: firstLayerImage.imageUrl, 
          isProcessing: false 
        };
      }
    }
    
    // Still processing if we only have placeholders
    console.log('⚠️ Still processing - only placeholder URLs available');
    return { 
      url: '', 
      isProcessing: true 
    };
  };

  const { url: previewImageUrl, isProcessing } = getPreviewImage();
  
  // Determine processing status
  const getProcessingStatus = () => {
    if (isProcessing) {
      return {
        status: 'processing',
        message: 'Rendering card...',
        icon: <Loader2 className="w-4 h-4 animate-spin" />
      };
    }
    
    if (previewImageUrl) {
      return {
        status: 'complete',
        message: 'Ready to view',
        icon: <CheckCircle className="w-4 h-4 text-green-500" />
      };
    }
    
    return {
      status: 'error',
      message: 'Processing failed',
      icon: <AlertCircle className="w-4 h-4 text-red-500" />
    };
  };

  const processingStatus = getProcessingStatus();

  return (
    <Card className={`bg-[#131316] border-slate-700 transition-all duration-200 hover:border-slate-600 ${
      isSelected ? 'ring-2 ring-crd-green border-crd-green' : ''
    }`}>
      {/* Preview Area */}
      <div className="aspect-[3/4] bg-slate-900 rounded-t-lg overflow-hidden relative">
        {isProcessing ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-crd-blue animate-spin mb-3" />
            <p className="text-sm text-slate-400 text-center px-4">
              Processing PSD layers...
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Card render in progress
            </p>
          </div>
        ) : previewImageUrl ? (
          <EnhancedImage
            src={previewImageUrl}
            alt={psd.fileName}
            className="w-full h-full object-contain"
            loading="lazy"
            onLoad={() => console.log('✅ Preview image loaded successfully')}
            onError={() => console.error('❌ Preview image failed to load')}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
            <p className="text-sm text-red-400 text-center px-4">
              Failed to process PSD
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Check console for details
            </p>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant={processingStatus.status === 'complete' ? 'default' : 'secondary'}
            className={`
              flex items-center gap-1 text-xs
              ${processingStatus.status === 'processing' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : ''}
              ${processingStatus.status === 'complete' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
              ${processingStatus.status === 'error' ? 'bg-red-500/20 text-red-400 border-red-500/30' : ''}
            `}
          >
            {processingStatus.icon}
            {processingStatus.message}
          </Badge>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div>
          <h3 className="text-white font-medium text-sm truncate mb-1">
            {psd.fileName.replace('.psd', '')}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{psd.enhancedProcessedPSD.width} × {psd.enhancedProcessedPSD.height}px</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" />
              {psd.enhancedProcessedPSD.layers.length} layers
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3" />
            <span>{new Date(psd.uploadedAt).toLocaleDateString()}</span>
          </div>
          
          {psd.enhancedProcessedPSD.extractedImages?.layerImages?.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {psd.enhancedProcessedPSD.extractedImages.layerImages.length} images
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect(psd.id)}
            className="flex-1 h-8 text-xs"
            disabled={isProcessing}
          >
            <Eye className="w-3 h-3 mr-1" />
            {isSelected ? 'Selected' : 'Select'}
          </Button>
          
          <Button
            size="sm"
            onClick={() => onAnalyze(psd.id)}
            className="flex-1 h-8 text-xs bg-crd-green text-black hover:bg-crd-green/90"
            disabled={isProcessing}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Analyze
          </Button>
        </div>
      </div>
    </Card>
  );
};

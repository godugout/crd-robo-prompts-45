
import React, { useState } from 'react';
import { ProcessedPSD } from '@/services/psdProcessor/psdProcessingService';
import { PSDCard } from '@/components/ui/design-system/PSDCard';
import { PSDButton } from '@/components/ui/design-system/PSDButton';
import { Badge } from '@/components/ui/badge';
import { Upload, Wand2, Download, Eye, EyeOff } from 'lucide-react';

interface CardLayout {
  border: { x: number; y: number; width: number; height: number; color: string };
  imageFrame: { x: number; y: number; width: number; height: number };
  titleBox: { x: number; y: number; width: number; height: number };
  textZones: Array<{ x: number; y: number; width: number; height: number; type: string }>;
}

interface CRDFrameBuilderProps {
  processedPSD?: ProcessedPSD;
  selectedLayerId?: string;
  onFrameGenerated?: (svgContent: string) => void;
}

export const CRDFrameBuilder: React.FC<CRDFrameBuilderProps> = ({
  processedPSD,
  selectedLayerId,
  onFrameGenerated
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>('');
  const [extractedLayout, setExtractedLayout] = useState<CardLayout | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(true);
  const [processingStep, setProcessingStep] = useState<'upload' | 'detect' | 'extract' | 'generate'>('upload');

  // Simulate card detection AI
  const runCardDetectionAI = async (imageUrl: string): Promise<{ url: string; bounds: any }> => {
    // This would call an actual AI service
    console.log('Running card detection AI on:', imageUrl);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      url: imageUrl, // In reality, this would be a cropped version
      bounds: { x: 10, y: 10, width: 280, height: 392 } // Standard card aspect ratio
    };
  };

  // Simulate layout analysis AI
  const runLayoutAnalysisAI = async (imageUrl: string): Promise<CardLayout> => {
    console.log('Running layout analysis AI on:', imageUrl);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock extracted layout based on common card designs
    return {
      border: { x: 0, y: 0, width: 300, height: 420, color: '#1a1a1a' },
      imageFrame: { x: 20, y: 20, width: 260, height: 280 },
      titleBox: { x: 20, y: 320, width: 260, height: 40 },
      textZones: [
        { x: 20, y: 370, width: 120, height: 30, type: 'stats' },
        { x: 160, y: 370, width: 120, height: 30, type: 'rarity' }
      ]
    };
  };

  // Generate SVG from extracted layout
  const buildSVGFromLayout = (layout: CardLayout): string => {
    return `
      <svg width="300" height="420" viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg">
        <!-- Border -->
        <rect x="${layout.border.x}" y="${layout.border.y}" 
              width="${layout.border.width}" height="${layout.border.height}" 
              fill="${layout.border.color}" stroke="#333" stroke-width="2" rx="8"/>
        
        <!-- Image Frame -->
        <rect x="${layout.imageFrame.x}" y="${layout.imageFrame.y}" 
              width="${layout.imageFrame.width}" height="${layout.imageFrame.height}" 
              fill="none" stroke="#666" stroke-width="1" stroke-dasharray="4,2" rx="4"/>
        
        <!-- Title Box -->
        <rect x="${layout.titleBox.x}" y="${layout.titleBox.y}" 
              width="${layout.titleBox.width}" height="${layout.titleBox.height}" 
              fill="#2a2a2a" stroke="#555" stroke-width="1" rx="4"/>
        
        <!-- Text Zones -->
        ${layout.textZones.map((zone, index) => `
          <rect x="${zone.x}" y="${zone.y}" width="${zone.width}" height="${zone.height}" 
                fill="#1e1e1e" stroke="#444" stroke-width="1" rx="2"/>
          <text x="${zone.x + zone.width/2}" y="${zone.y + zone.height/2 + 4}" 
                font-family="Arial, sans-serif" font-size="10" fill="#888" text-anchor="middle">
            ${zone.type.toUpperCase()}
          </text>
        `).join('')}
        
        <!-- Labels -->
        <text x="${layout.imageFrame.x + layout.imageFrame.width/2}" 
              y="${layout.imageFrame.y + layout.imageFrame.height/2}" 
              font-family="Arial, sans-serif" font-size="12" fill="#666" text-anchor="middle">
          IMAGE AREA
        </text>
        
        <text x="${layout.titleBox.x + layout.titleBox.width/2}" 
              y="${layout.titleBox.y + layout.titleBox.height/2 + 4}" 
              font-family="Arial, sans-serif" font-size="11" fill="#ccc" text-anchor="middle">
          TITLE AREA
        </text>
      </svg>
    `;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setCroppedImageUrl(url);
      setProcessingStep('detect');
    }
  };

  const handleProcessCard = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    
    try {
      // Step 1: Card Detection
      setProcessingStep('detect');
      const detectedCard = await runCardDetectionAI(croppedImageUrl);
      setCroppedImageUrl(detectedCard.url);
      
      // Step 2: Layout Extraction
      setProcessingStep('extract');
      const layout = await runLayoutAnalysisAI(detectedCard.url);
      setExtractedLayout(layout);
      
      // Step 3: SVG Generation
      setProcessingStep('generate');
      const svgContent = buildSVGFromLayout(layout);
      onFrameGenerated?.(svgContent);
      
    } catch (error) {
      console.error('Processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepStatus = (step: string) => {
    const steps = ['upload', 'detect', 'extract', 'generate'];
    const currentIndex = steps.indexOf(processingStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex && isProcessing) return 'active';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <PSDCard variant="elevated">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Wand2 className="w-6 h-6 text-crd-green" />
            <div>
              <h2 className="text-xl font-bold text-white">CRD Frame Builder</h2>
              <p className="text-sm text-slate-400">
                AI-powered frame extraction from existing cards
              </p>
            </div>
          </div>
          
          {extractedLayout && (
            <PSDButton
              variant="secondary"
              size="sm"
              onClick={() => setShowOriginal(!showOriginal)}
            >
              {showOriginal ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showOriginal ? 'Hide Original' : 'Show Original'}
            </PSDButton>
          )}
        </div>

        {/* Processing Steps */}
        <div className="flex items-center gap-4 mb-6">
          {['upload', 'detect', 'extract', 'generate'].map((step, index) => {
            const status = getStepStatus(step);
            const labels = {
              upload: 'Upload',
              detect: 'Detect Card',
              extract: 'Extract Layout',
              generate: 'Generate Frame'
            };
            
            return (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${status === 'completed' ? 'bg-crd-green text-black' : ''}
                  ${status === 'active' ? 'bg-crd-blue text-white animate-pulse' : ''}
                  ${status === 'current' ? 'bg-slate-600 text-white' : ''}
                  ${status === 'pending' ? 'bg-slate-800 text-slate-400' : ''}
                `}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  status === 'completed' || status === 'active' || status === 'current' 
                    ? 'text-white' : 'text-slate-400'
                }`}>
                  {labels[step as keyof typeof labels]}
                </span>
                {index < 3 && (
                  <div className={`w-8 h-px mx-2 ${
                    status === 'completed' ? 'bg-crd-green' : 'bg-slate-700'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Upload Section */}
        {!uploadedFile && (
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Upload Card Image</h3>
            <p className="text-slate-400 mb-4">
              Upload an existing card image to extract its frame design
            </p>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <PSDButton variant="primary">
                Choose Image
              </PSDButton>
            </label>
          </div>
        )}

        {/* Processing Section */}
        {uploadedFile && (
          <div className="space-y-6">
            {/* Original Image Preview */}
            {showOriginal && croppedImageUrl && (
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Original Image</h3>
                <div className="bg-slate-800 rounded-lg p-4 flex justify-center">
                  <img
                    src={croppedImageUrl}
                    alt="Original card"
                    className="max-w-xs max-h-64 object-contain rounded"
                  />
                </div>
              </div>
            )}

            {/* Process Button */}
            {!extractedLayout && (
              <div className="text-center">
                <PSDButton
                  variant="primary"
                  onClick={handleProcessCard}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Extract Frame Design
                    </>
                  )}
                </PSDButton>
              </div>
            )}

            {/* Generated Frame Preview */}
            {extractedLayout && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-white">Generated Frame Template</h3>
                  <Badge className="bg-crd-green text-black">
                    AI Generated
                  </Badge>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-6 flex justify-center">
                  <div 
                    className="bg-white rounded-lg p-4"
                    dangerouslySetInnerHTML={{ 
                      __html: buildSVGFromLayout(extractedLayout) 
                    }}
                  />
                </div>

                {/* Frame Actions */}
                <div className="flex gap-3 mt-4">
                  <PSDButton variant="secondary" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export SVG
                  </PSDButton>
                  <PSDButton variant="secondary" size="sm">
                    Save to Library
                  </PSDButton>
                  <PSDButton variant="primary" size="sm">
                    Use This Frame
                  </PSDButton>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PSDCard>
  );
};

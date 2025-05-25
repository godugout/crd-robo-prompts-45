
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Scissors, Download, ArrowLeft, Edit, Save, Trash2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { extractCardsFromImage, type ExtractedCard } from '@/services/cardExtractor';
import { enhancedCardDetection } from '@/services/cardExtractor/enhancedDetection';

interface EnhancedCardDetectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCardsExtracted: (cards: ExtractedCard[]) => void;
}

interface ManualRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isManual: boolean;
}

export const EnhancedCardDetectionDialog = ({ 
  isOpen, 
  onClose, 
  onCardsExtracted 
}: EnhancedCardDetectionDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'detect' | 'refine' | 'extract'>('upload');
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [detectedRegions, setDetectedRegions] = useState<ManualRegion[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());
  const [isEditMode, setIsEditMode] = useState(false);
  const [extractedCards, setExtractedCards] = useState<ExtractedCard[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    startX: number;
    startY: number;
    currentRegion?: ManualRegion;
  }>({ isDragging: false, startX: 0, startY: 0 });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsProcessing(true);
    try {
      // Load the image
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setCurrentStep('detect');
        handleEnhancedDetection(img, file);
      };
      img.src = URL.createObjectURL(file);
    } catch (error) {
      console.error('Error loading image:', error);
      toast.error('Failed to load image');
      setIsProcessing(false);
    }
  }, []);

  const handleEnhancedDetection = async (img: HTMLImageElement, file: File) => {
    try {
      toast.info('Running enhanced card detection...');
      
      // Use the enhanced detection system
      const regions = await enhancedCardDetection(img, file);
      
      const manualRegions: ManualRegion[] = regions.map((region, index) => ({
        id: `region-${index}`,
        x: region.x,
        y: region.y,
        width: region.width,
        height: region.height,
        isManual: false
      }));
      
      setDetectedRegions(manualRegions);
      setSelectedRegions(new Set(manualRegions.map(r => r.id)));
      setCurrentStep('refine');
      
      toast.success(`Detected ${regions.length} potential cards. You can now refine the boundaries.`);
    } catch (error) {
      console.error('Enhanced detection error:', error);
      toast.error('Detection failed. You can manually draw card regions.');
      setDetectedRegions([]);
      setCurrentStep('refine');
    } finally {
      setIsProcessing(false);
    }
  };

  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !originalImage) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    
    // Draw the original image
    ctx.drawImage(originalImage, 0, 0);
    
    // Draw regions
    detectedRegions.forEach(region => {
      const isSelected = selectedRegions.has(region.id);
      
      ctx.strokeStyle = isSelected ? '#10b981' : '#6b7280';
      ctx.lineWidth = 3;
      ctx.fillStyle = isSelected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)';
      
      ctx.fillRect(region.x, region.y, region.width, region.height);
      ctx.strokeRect(region.x, region.y, region.width, region.height);
      
      // Draw corner handles if in edit mode
      if (isEditMode && isSelected) {
        ctx.fillStyle = '#10b981';
        const handleSize = 8;
        
        // Corner handles
        ctx.fillRect(region.x - handleSize/2, region.y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(region.x + region.width - handleSize/2, region.y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(region.x - handleSize/2, region.y + region.height - handleSize/2, handleSize, handleSize);
        ctx.fillRect(region.x + region.width - handleSize/2, region.y + region.height - handleSize/2, handleSize, handleSize);
      }
      
      // Draw region label
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px sans-serif';
      ctx.fillText(
        region.isManual ? 'Manual' : `Card ${detectedRegions.indexOf(region) + 1}`,
        region.x + 5,
        region.y + 20
      );
    });
  }, [originalImage, detectedRegions, selectedRegions, isEditMode]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEditMode || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // Check if clicking on existing region
    const clickedRegion = detectedRegions.find(region => 
      x >= region.x && x <= region.x + region.width &&
      y >= region.y && y <= region.y + region.height
    );
    
    if (clickedRegion) {
      setSelectedRegions(new Set([clickedRegion.id]));
    } else {
      // Start drawing new region
      const newRegion: ManualRegion = {
        id: `manual-${Date.now()}`,
        x,
        y,
        width: 0,
        height: 0,
        isManual: true
      };
      
      setDragState({ 
        isDragging: true, 
        startX: x, 
        startY: y, 
        currentRegion: newRegion 
      });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragState.isDragging || !dragState.currentRegion || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;
    
    const updatedRegion = {
      ...dragState.currentRegion,
      width: Math.abs(currentX - dragState.startX),
      height: Math.abs(currentY - dragState.startY),
      x: Math.min(dragState.startX, currentX),
      y: Math.min(dragState.startY, currentY)
    };
    
    setDetectedRegions(prev => {
      const filtered = prev.filter(r => r.id !== updatedRegion.id);
      return [...filtered, updatedRegion];
    });
  };

  const handleCanvasMouseUp = () => {
    if (dragState.isDragging && dragState.currentRegion) {
      setSelectedRegions(new Set([dragState.currentRegion.id]));
    }
    setDragState({ isDragging: false, startX: 0, startY: 0 });
  };

  const deleteSelectedRegions = () => {
    setDetectedRegions(prev => prev.filter(region => !selectedRegions.has(region.id)));
    setSelectedRegions(new Set());
  };

  const handleExtractCards = async () => {
    if (!originalImage || selectedRegions.size === 0) return;
    
    setIsProcessing(true);
    setCurrentStep('extract');
    
    try {
      const selectedRegionData = detectedRegions.filter(region => 
        selectedRegions.has(region.id)
      );
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Cannot get canvas context');
      
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;
      ctx.drawImage(originalImage, 0, 0);
      
      const cards: ExtractedCard[] = [];
      
      for (const region of selectedRegionData) {
        // Extract card with perspective correction
        const cardCanvas = document.createElement('canvas');
        const cardCtx = cardCanvas.getContext('2d');
        if (!cardCtx) continue;
        
        // Standard card dimensions
        const cardWidth = 350;
        const cardHeight = 490;
        
        cardCanvas.width = cardWidth;
        cardCanvas.height = cardHeight;
        
        // Draw the extracted region and scale to standard size
        cardCtx.drawImage(
          canvas,
          region.x, region.y, region.width, region.height,
          0, 0, cardWidth, cardHeight
        );
        
        // Convert to blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          cardCanvas.toBlob(
            (blob) => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
            'image/jpeg',
            0.95
          );
        });
        
        cards.push({
          imageBlob: blob,
          confidence: region.isManual ? 1.0 : 0.8,
          bounds: region,
          originalImage: originalImage.src
        });
      }
      
      setExtractedCards(cards);
      toast.success(`Extracted ${cards.length} cards successfully!`);
    } catch (error) {
      console.error('Card extraction error:', error);
      toast.error('Failed to extract cards');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseCards = () => {
    onCardsExtracted(extractedCards);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep('upload');
    setOriginalImage(null);
    setProcessedImage(null);
    setDetectedRegions([]);
    setSelectedRegions(new Set());
    setExtractedCards([]);
    setIsEditMode(false);
    setIsProcessing(false);
    onClose();
  };

  const goBack = () => {
    if (currentStep === 'detect') setCurrentStep('upload');
    else if (currentStep === 'refine') setCurrentStep('detect');
    else if (currentStep === 'extract') setCurrentStep('refine');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 bg-gray-900 border-gray-700">
        <DialogHeader className="p-6 pb-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentStep !== 'upload' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  className="text-gray-300 hover:text-white p-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <DialogTitle className="text-white text-xl">
                {currentStep === 'upload' && 'Enhanced Card Detection'}
                {currentStep === 'detect' && 'Detecting Cards...'}
                {currentStep === 'refine' && `Refine Card Boundaries (${detectedRegions.length} regions)`}
                {currentStep === 'extract' && `Review Extracted Cards (${extractedCards.length})`}
              </DialogTitle>
            </div>
            
            {currentStep === 'refine' && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditMode(!isEditMode)}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Exit Edit' : 'Edit Mode'}
                </Button>
                {isEditMode && selectedRegions.size > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deleteSelectedRegions}
                    className="border-red-600 text-red-400 hover:bg-red-600/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
                <Button
                  onClick={handleExtractCards}
                  disabled={selectedRegions.size === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Scissors className="w-4 h-4 mr-2" />
                  Extract {selectedRegions.size} Cards
                </Button>
              </div>
            )}
            
            {currentStep === 'extract' && (
              <Button
                onClick={handleUseCards}
                disabled={extractedCards.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Use {extractedCards.length} Cards
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {currentStep === 'upload' && (
            <div className="h-full flex items-center justify-center p-8">
              <div className="max-w-2xl w-full">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-16 text-center transition-all cursor-pointer
                    ${isDragActive 
                      ? 'border-green-500 bg-green-500/10' 
                      : 'border-gray-600 hover:border-green-500/50 hover:bg-gray-800/50'
                    }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-6">
                    {isProcessing ? (
                      <>
                        <Scissors className="w-20 h-20 text-green-500 animate-pulse" />
                        <div className="text-white text-2xl font-medium">Processing Image...</div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-20 h-20 text-gray-400" />
                        <div className="text-white text-2xl font-medium">
                          {isDragActive ? 'Drop image here' : 'Enhanced Card Detection & Manual Refinement'}
                        </div>
                        <div className="text-gray-400 text-lg max-w-md">
                          Advanced detection with background removal, edge detection, and manual boundary refinement.
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {(currentStep === 'detect' || currentStep === 'refine') && originalImage && (
            <div className="h-full flex">
              <div className="flex-1 overflow-auto p-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  {isEditMode && (
                    <div className="mb-4 p-3 bg-blue-600/20 border border-blue-500 rounded-lg">
                      <p className="text-blue-300 text-sm">
                        <strong>Edit Mode:</strong> Click and drag to create new card regions. 
                        Click existing regions to select them. Use Delete button to remove selected regions.
                      </p>
                    </div>
                  )}
                  
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto border border-gray-600 rounded cursor-crosshair"
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                  />
                </div>
              </div>
              
              <div className="w-80 border-l border-gray-700 bg-gray-800 p-4">
                <h3 className="text-white font-medium mb-4">Detected Regions ({detectedRegions.length})</h3>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {detectedRegions.map((region, index) => (
                      <div
                        key={region.id}
                        className={`p-3 rounded border cursor-pointer transition-colors ${
                          selectedRegions.has(region.id)
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => {
                          const newSelected = new Set(selectedRegions);
                          if (newSelected.has(region.id)) {
                            newSelected.delete(region.id);
                          } else {
                            newSelected.add(region.id);
                          }
                          setSelectedRegions(newSelected);
                        }}
                      >
                        <div className="text-white text-sm font-medium">
                          {region.isManual ? 'Manual Region' : `Card ${index + 1}`}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {Math.round(region.width)} × {Math.round(region.height)}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="mt-4 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRegions(new Set(detectedRegions.map(r => r.id)))}
                    className="w-full border-gray-600 text-white hover:bg-gray-700"
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRegions(new Set())}
                    className="w-full border-gray-600 text-white hover:bg-gray-700"
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'extract' && (
            <div className="h-full p-6">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {extractedCards.map((card, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden border border-gray-600"
                    >
                      <img
                        src={URL.createObjectURL(card.imageBlob)}
                        alt={`Extracted card ${index + 1}`}
                        className="w-full aspect-[3/4] object-cover"
                      />
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                          Card {index + 1} • {Math.round(card.confidence * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

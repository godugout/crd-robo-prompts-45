
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Scissors, Download, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useEnhancedCardDetection } from './hooks/useEnhancedCardDetection';
import { EnhancedCanvasRegionEditor } from './components/EnhancedCanvasRegionEditor';
import { EnhancedExtractedCardsView } from './components/EnhancedExtractedCardsView';
import { CardDetectionUploadStep } from './components/CardDetectionUploadStep';
import type { ExtractedCard } from '@/services/cardExtractor';

interface EnhancedCardDetectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCardsExtracted: (cards: ExtractedCard[]) => void;
}

export const EnhancedCardDetectionDialog = ({ 
  isOpen, 
  onClose, 
  onCardsExtracted 
}: EnhancedCardDetectionDialogProps) => {
  const {
    isProcessing,
    currentStep,
    originalImage,
    detectedRegions,
    selectedRegions,
    isEditMode,
    extractedCards,
    dragState,
    handleImageDrop,
    handleExtractCards,
    handleUseCards,
    deleteSelectedRegions,
    goBack,
    resetDialog,
    setDetectedRegions,
    setSelectedRegions,
    setIsEditMode,
    setDragState
  } = useEnhancedCardDetection(onCardsExtracted);

  const handleClose = () => {
    resetDialog();
    onClose();
  };

  const handleUseCardsAndClose = () => {
    handleUseCards();
    handleClose();
  };

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEditMode || !originalImage) return;
    
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const clickedRegion = detectedRegions.find(region => 
      x >= region.x && x <= region.x + region.width &&
      y >= region.y && y <= region.y + region.height
    );
    
    if (clickedRegion) {
      setSelectedRegions(new Set([clickedRegion.id]));
    } else {
      const newRegion = {
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
  }, [isEditMode, originalImage, detectedRegions, setSelectedRegions, setDragState]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragState.isDragging || !dragState.currentRegion) return;
    
    const canvas = e.currentTarget;
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
  }, [dragState, setDetectedRegions]);

  const handleCanvasMouseUp = useCallback(() => {
    if (dragState.isDragging && dragState.currentRegion) {
      setSelectedRegions(new Set([dragState.currentRegion.id]));
    }
    setDragState({ isDragging: false, startX: 0, startY: 0 });
  }, [dragState, setSelectedRegions, setDragState]);

  const handleRegionToggle = useCallback((regionId: string) => {
    const newSelected = new Set(selectedRegions);
    if (newSelected.has(regionId)) {
      newSelected.delete(regionId);
    } else {
      newSelected.add(regionId);
    }
    setSelectedRegions(newSelected);
  }, [selectedRegions, setSelectedRegions]);

  const handleSelectAll = useCallback(() => {
    setSelectedRegions(new Set(detectedRegions.map(r => r.id)));
  }, [detectedRegions, setSelectedRegions]);

  const handleClearSelection = useCallback(() => {
    setSelectedRegions(new Set());
  }, [setSelectedRegions]);

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
                onClick={handleUseCardsAndClose}
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
            <CardDetectionUploadStep 
              isProcessing={isProcessing}
              onImageDrop={handleImageDrop}
            />
          )}

          {(currentStep === 'detect' || currentStep === 'refine') && originalImage && (
            <EnhancedCanvasRegionEditor
              originalImage={originalImage}
              detectedRegions={detectedRegions}
              selectedRegions={selectedRegions}
              isEditMode={isEditMode}
              dragState={dragState}
              onRegionSelect={(regionId) => setSelectedRegions(new Set([regionId]))}
              onRegionToggle={handleRegionToggle}
              onCanvasMouseDown={handleCanvasMouseDown}
              onCanvasMouseMove={handleCanvasMouseMove}
              onCanvasMouseUp={handleCanvasMouseUp}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
            />
          )}

          {currentStep === 'extract' && (
            <EnhancedExtractedCardsView extractedCards={extractedCards} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

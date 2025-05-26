
import { useCallback } from 'react';
import type { ManualRegion, DragState } from './types';

interface UseCanvasInteractionsProps {
  isEditMode: boolean;
  originalImage: HTMLImageElement | null;
  detectedRegions: ManualRegion[];
  dragState: DragState;
  setSelectedRegions: (regions: Set<string>) => void;
  setDetectedRegions: (regions: ManualRegion[]) => void;
  setDragState: (state: DragState) => void;
}

export const useCanvasInteractions = ({
  isEditMode,
  originalImage,
  detectedRegions,
  dragState,
  setSelectedRegions,
  setDetectedRegions,
  setDragState
}: UseCanvasInteractionsProps) => {
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
      const newRegion: ManualRegion = {
        id: `manual-${Date.now()}`,
        x,
        y,
        width: 0,
        height: 0,
        confidence: 1.0,
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
    
    const updatedRegion: ManualRegion = {
      ...dragState.currentRegion,
      width: Math.abs(currentX - dragState.startX),
      height: Math.abs(currentY - dragState.startY),
      x: Math.min(dragState.startX, currentX),
      y: Math.min(dragState.startY, currentY)
    };
    
    const filtered = detectedRegions.filter((r: ManualRegion) => r.id !== updatedRegion.id);
    const newRegions: ManualRegion[] = [...filtered, updatedRegion];
    setDetectedRegions(newRegions);
  }, [dragState, setDetectedRegions, detectedRegions]);

  const handleCanvasMouseUp = useCallback(() => {
    if (dragState.isDragging && dragState.currentRegion) {
      setSelectedRegions(new Set([dragState.currentRegion.id]));
    }
    setDragState({ isDragging: false, startX: 0, startY: 0 });
  }, [dragState, setSelectedRegions, setDragState]);

  return {
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp
  };
};

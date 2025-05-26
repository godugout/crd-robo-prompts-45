
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { enhancedCardDetection } from '@/services/cardExtractor/enhancedDetection';
import type { ManualRegion } from './types';

export const useImageProcessing = () => {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [detectedRegions, setDetectedRegions] = useState<ManualRegion[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());

  const processImageFile = useCallback(async (file: File): Promise<HTMLImageElement | null> => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return null;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error('Image file is too large. Please use an image smaller than 15MB.');
      return null;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => {
        toast.error('Failed to load image');
        reject(new Error('Failed to load image'));
      };
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const runEnhancedDetection = useCallback(async (img: HTMLImageElement, file: File) => {
    let detectionTimeout: NodeJS.Timeout | null = null;
    
    try {
      toast.info('Running enhanced card detection...');
      
      detectionTimeout = setTimeout(() => {
        toast.error('Detection is taking too long. Please try with a smaller image.');
      }, 20000);
      
      const regions = await enhancedCardDetection(img, file);
      
      if (detectionTimeout) {
        clearTimeout(detectionTimeout);
        detectionTimeout = null;
      }
      
      const manualRegions: ManualRegion[] = regions.map((region, index) => ({
        id: `region-${index}`,
        x: region.x,
        y: region.y,
        width: region.width,
        height: region.height,
        confidence: region.confidence,
        isManual: false
      }));
      
      setDetectedRegions(manualRegions);
      setSelectedRegions(new Set(manualRegions.map(r => r.id)));
      
      if (manualRegions.length > 0) {
        toast.success(`Detected ${regions.length} potential cards. You can now refine the boundaries.`);
      } else {
        toast.info('No cards detected automatically. You can manually draw card regions.');
      }
      
      return manualRegions;
    } catch (error) {
      if (detectionTimeout) {
        clearTimeout(detectionTimeout);
      }
      
      console.error('Enhanced detection error:', error);
      
      if (error instanceof Error && error.message.includes('timeout')) {
        toast.error('Detection timed out. Please try with a smaller or simpler image.');
      } else {
        toast.error('Detection failed. You can manually draw card regions.');
      }
      
      setDetectedRegions([]);
      return [];
    }
  }, []);

  return {
    originalImage,
    detectedRegions,
    selectedRegions,
    setOriginalImage,
    setDetectedRegions,
    setSelectedRegions,
    processImageFile,
    runEnhancedDetection
  };
};


import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface CropResult {
  croppedImageUrl: string;
  originalImageUrl: string;
  cropData: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const useImageCropper = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [croppedResults, setCroppedResults] = useState<CropResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadImage = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select a valid image file'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setOriginalImage(imageUrl);
        resolve(imageUrl);
      };
      reader.onerror = () => reject(new Error('Failed to load image'));
      reader.readAsDataURL(file);
    });
  }, []);

  const addCropResult = useCallback((croppedImageUrl: string, cropData?: any) => {
    if (!originalImage) return;

    const newResult: CropResult = {
      croppedImageUrl,
      originalImageUrl: originalImage,
      cropData: cropData || { x: 0, y: 0, width: 0, height: 0 }
    };

    setCroppedResults(prev => [...prev, newResult]);
    toast.success('Crop extracted successfully!');
  }, [originalImage]);

  const removeCropResult = useCallback((index: number) => {
    setCroppedResults(prev => {
      const newResults = [...prev];
      // Clean up the blob URL
      if (newResults[index]?.croppedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(newResults[index].croppedImageUrl);
      }
      newResults.splice(index, 1);
      return newResults;
    });
    toast.success('Crop removed');
  }, []);

  const clearAll = useCallback(() => {
    // Clean up all blob URLs
    croppedResults.forEach(result => {
      if (result.croppedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(result.croppedImageUrl);
      }
    });
    
    if (originalImage?.startsWith('blob:')) {
      URL.revokeObjectURL(originalImage);
    }

    setOriginalImage(null);
    setCroppedResults([]);
    setIsProcessing(false);
  }, [originalImage, croppedResults]);

  const downloadCrop = useCallback((result: CropResult, filename?: string) => {
    const link = document.createElement('a');
    link.href = result.croppedImageUrl;
    link.download = filename || `cropped_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started');
  }, []);

  const downloadAllCrops = useCallback(() => {
    croppedResults.forEach((result, index) => {
      setTimeout(() => {
        downloadCrop(result, `crop_${index + 1}_${Date.now()}.png`);
      }, index * 500); // Stagger downloads
    });
  }, [croppedResults, downloadCrop]);

  const saveCropAsCard = useCallback((result: CropResult, cardData: any) => {
    // This function can be used to integrate with card saving
    return {
      ...cardData,
      image_url: result.croppedImageUrl,
      thumbnail_url: result.croppedImageUrl,
      extraction_metadata: {
        original_image: result.originalImageUrl,
        crop_area: result.cropData,
        extracted_at: new Date().toISOString()
      }
    };
  }, []);

  return {
    originalImage,
    croppedResults,
    isProcessing,
    setIsProcessing,
    loadImage,
    addCropResult,
    removeCropResult,
    clearAll,
    downloadCrop,
    downloadAllCrops,
    saveCropAsCard
  };
};

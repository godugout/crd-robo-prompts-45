
import { ProcessedPSD, ProcessedPSDLayer, EnhancedProcessedPSD, ExtractedPSDImages } from '@/types/psdTypes';
import { extractRealPSDImages } from './realImageExtraction';

export const processEnhancedPSD = async (
  file: File,
  originalProcessedPSD: ProcessedPSD
): Promise<EnhancedProcessedPSD> => {
  try {
    console.log('Starting enhanced PSD processing for:', file.name);
    
    // Read file as ArrayBuffer for ag-psd processing
    const arrayBuffer = await file.arrayBuffer();
    
    // Extract real images from PSD
    const extractedImages = await extractRealPSDImages(arrayBuffer, file.name);
    
    // Create layer preview map
    const layerPreviews = new Map<string, string>();
    
    // Map extracted images to processed layers
    const enhancedLayers: ProcessedPSDLayer[] = originalProcessedPSD.layers.map((layer, index) => {
      const extractedLayer = extractedImages.layerImages[index];
      
      if (extractedLayer) {
        layerPreviews.set(layer.id, extractedLayer.thumbnailUrl);
        
        return {
          ...layer,
          imageUrl: extractedLayer.imageUrl,
          thumbnailUrl: extractedLayer.thumbnailUrl,
          hasRealImage: true
        };
      }
      
      return {
        ...layer,
        hasRealImage: false
      };
    });

    // Ensure the base ProcessedPSD has all required properties
    const enhancedBasePSD: ProcessedPSD = {
      ...originalProcessedPSD,
      layers: enhancedLayers,
      flattenedImageUrl: extractedImages.flattenedImageUrl,
      transparentFlattenedImageUrl: extractedImages.flattenedImageUrl,
      thumbnailUrl: extractedImages.thumbnailUrl,
      layerImages: extractedImages.layerImages
    };

    const enhancedPSD: EnhancedProcessedPSD = {
      ...enhancedBasePSD,
      extractedImages,
      layerPreviews
    };

    console.log('Enhanced PSD processing completed:', {
      totalLayers: enhancedLayers.length,
      layersWithImages: enhancedLayers.filter(l => l.hasRealImage).length,
      extractedImages: extractedImages.layerImages.length
    });

    return enhancedPSD;

  } catch (error) {
    console.error('Error in enhanced PSD processing:', error);
    
    // Return enhanced version with original data as fallback
    const fallbackPSD: ProcessedPSD = {
      ...originalProcessedPSD,
      layers: originalProcessedPSD.layers.map(layer => ({
        ...layer,
        hasRealImage: false
      })),
      flattenedImageUrl: '',
      transparentFlattenedImageUrl: '',
      thumbnailUrl: '',
      layerImages: []
    };

    return {
      ...fallbackPSD,
      extractedImages: {
        flattenedImageUrl: '',
        layerImages: [],
        thumbnailUrl: '',
        archiveUrls: { originalPsd: '', layerArchive: '' }
      },
      layerPreviews: new Map()
    };
  }
};

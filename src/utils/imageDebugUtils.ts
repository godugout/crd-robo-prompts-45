
import { EnhancedProcessedPSD, ProcessedPSDLayer } from '@/types/psdTypes';

export const debugImageUrls = (psd: EnhancedProcessedPSD) => {
  console.group(`🔍 Debugging images for PSD: ${psd.fileName}`);
  
  console.log('📊 PSD Overview:', {
    totalLayers: psd.layers.length,
    flattenedImageUrl: psd.flattenedImageUrl,
    extractedImagesCount: psd.extractedImages?.layerImages?.length || 0,
    layerImagesCount: psd.layerImages?.length || 0
  });

  console.log('🖼️ Flattened Images:');
  console.log('  Main:', psd.flattenedImageUrl || 'None');
  console.log('  Extracted:', psd.extractedImages?.flattenedImageUrl || 'None');
  console.log('  Thumbnail:', psd.thumbnailUrl || 'None');

  console.log('📋 Layer Analysis:');
  psd.layers.forEach((layer, index) => {
    const hasImage = layer.imageUrl && layer.imageUrl.startsWith('http');
    const hasRealImage = layer.hasRealImage;
    
    console.log(`  ${index + 1}. ${layer.name}:`, {
      hasRealImage,
      hasValidImageUrl: hasImage,
      imageUrl: layer.imageUrl || 'None',
      thumbnailUrl: layer.thumbnailUrl || 'None'
    });
  });

  const extractedImages = psd.extractedImages?.layerImages || [];
  if (extractedImages.length > 0) {
    console.log('📤 Extracted Images:');
    extractedImages.forEach((img, index) => {
      console.log(`  ${index + 1}. ${img.name}:`, {
        imageUrl: img.imageUrl,
        thumbnailUrl: img.thumbnailUrl,
        dimensions: `${img.width}x${img.height}`
      });
    });
  } else {
    console.log('📤 No extracted images found');
  }

  const layersWithImages = psd.layers.filter(l => 
    l.hasRealImage && l.imageUrl && l.imageUrl.startsWith('http')
  );
  
  console.log(`✅ Summary: ${layersWithImages.length} layers have valid images out of ${psd.layers.length} total`);
  
  console.groupEnd();
  
  return {
    totalLayers: psd.layers.length,
    layersWithImages: layersWithImages.length,
    extractedImages: extractedImages.length,
    hasFlattenedImage: !!(psd.flattenedImageUrl && psd.flattenedImageUrl.startsWith('http'))
  };
};

export const getLayerImageUrl = (layer: ProcessedPSDLayer, psd: EnhancedProcessedPSD): string | null => {
  // Priority 1: Direct layer imageUrl
  if (layer.imageUrl && layer.imageUrl.startsWith('http')) {
    return layer.imageUrl;
  }

  // Priority 2: Thumbnail URL
  if (layer.thumbnailUrl && layer.thumbnailUrl.startsWith('http')) {
    return layer.thumbnailUrl;
  }

  // Priority 3: Check extracted images by ID
  const extractedById = psd.extractedImages?.layerImages?.find(img => img.id === layer.id);
  if (extractedById?.imageUrl && extractedById.imageUrl.startsWith('http')) {
    return extractedById.imageUrl;
  }

  // Priority 4: Check extracted images by name
  const extractedByName = psd.extractedImages?.layerImages?.find(img => img.name === layer.name);
  if (extractedByName?.imageUrl && extractedByName.imageUrl.startsWith('http')) {
    return extractedByName.imageUrl;
  }

  return null;
};

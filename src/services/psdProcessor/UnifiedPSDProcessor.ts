
import { Psd } from 'ag-psd';
import { ProcessedPSDLayer, LayerBounds, LayerProperties, ProcessedPSD, EnhancedProcessedPSD } from '@/types/psdTypes';
import { MediaManager } from '@/lib/storage/MediaManager';

// Utility function to check if a layer name contains certain keywords
const containsKeyword = (layerName: string, keywords: string[]): boolean => {
  const lowerName = layerName.toLowerCase();
  return keywords.some(keyword => lowerName.includes(keyword));
};

// Heuristic function to infer semantic type based on layer properties
const inferLayerSemanticType = (layer: any): string => {
  if (!layer || !layer.name) return 'unknown';

  const layerName = layer.name.toLowerCase();

  if (containsKeyword(layerName, ['avatar', 'player', 'profile'])) {
    return 'player';
  }

  if (containsKeyword(layerName, ['background', 'backdrop', 'bg'])) {
    return 'background';
  }

  if (containsKeyword(layerName, ['logo', 'emblem', 'icon'])) {
    return 'logo';
  }

  if (containsKeyword(layerName, ['stats', 'score', 'timer'])) {
    return 'stats';
  }

  if (containsKeyword(layerName, ['button', 'cta', 'call-to-action'])) {
    return 'button';
  }

  if (containsKeyword(layerName, ['text', 'label', 'title'])) {
    return 'text';
  }

  if (containsKeyword(layerName, ['image', 'photo', 'picture'])) {
    return 'image';
  }

  return 'unknown';
};

export class UnifiedPSDProcessor {
  private psd: Psd;

  constructor(psd: Psd) {
    this.psd = psd;
    console.log('UnifiedPSDProcessor initialized with PSD:', {
      width: psd.width,
      height: psd.height,
      hasCanvas: !!psd.canvas,
      childrenCount: psd.children?.length || 0
    });
  }

  public static async processPSDFile(file: File): Promise<EnhancedProcessedPSD> {
    console.log('🔄 Starting PSD file processing for:', file.name);
    
    try {
      // Import ag-psd dynamically to handle the PSD parsing
      const { readPsd } = await import('ag-psd');
      
      // Read the file as array buffer
      const arrayBuffer = await file.arrayBuffer();
      console.log('📄 File read successfully, size:', arrayBuffer.byteLength);
      
      // Parse the PSD
      const psd = readPsd(arrayBuffer);
      console.log('📊 PSD parsed successfully:', {
        width: psd.width,
        height: psd.height,
        hasCanvas: !!psd.canvas,
        layerCount: psd.children?.length || 0
      });
      
      // Create a new processor instance with the parsed PSD
      const processor = new UnifiedPSDProcessor(psd);
      
      // Process the basic PSD structure
      const processedPSD = processor.process();
      console.log('🏗️ Basic PSD processing complete');
      
      // Generate all required images
      const imageResults = await processor.generateAllImages(file.name);
      console.log('🖼️ Image generation complete:', imageResults);
      
      // Create enhanced processed PSD with all images
      const enhancedPSD: EnhancedProcessedPSD = {
        ...processedPSD,
        flattenedImageUrl: imageResults.flattenedImageUrl || processedPSD.flattenedImageUrl,
        extractedImages: {
          flattenedImageUrl: imageResults.flattenedImageUrl || processedPSD.flattenedImageUrl,
          layerImages: imageResults.layerImages,
          thumbnailUrl: imageResults.thumbnailUrl || processedPSD.thumbnailUrl,
          archiveUrls: {
            originalPsd: 'url_to_original_psd',
            layerArchive: 'url_to_layer_archive'
          }
        },
        layerPreviews: new Map<string, string>()
      };

      // Generate layer previews map
      imageResults.layerImages.forEach(layerImage => {
        enhancedPSD.layerPreviews.set(layerImage.id, layerImage.imageUrl);
      });

      console.log('✅ PSD processing completed successfully');
      return enhancedPSD;
      
    } catch (error) {
      console.error('❌ PSD processing failed:', error);
      throw new Error(`PSD processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async generateAllImages(fileName: string): Promise<{
    flattenedImageUrl: string | null;
    thumbnailUrl: string | null;
    layerImages: any[];
  }> {
    console.log('🖼️ Starting image generation for all layers');
    
    const results = {
      flattenedImageUrl: null as string | null,
      thumbnailUrl: null as string | null,
      layerImages: [] as any[]
    };

    try {
      // Generate flattened image
      console.log('📸 Generating flattened image');
      results.flattenedImageUrl = await this.generateFlattenedImage(fileName);
      
      // Generate thumbnail from flattened image
      if (results.flattenedImageUrl) {
        console.log('🔍 Generating thumbnail');
        results.thumbnailUrl = await this.generateThumbnail(results.flattenedImageUrl, fileName);
      }

      // Generate individual layer images
      console.log('🎨 Generating individual layer images');
      results.layerImages = await this.generateLayerImages(fileName);

      console.log('✅ All image generation completed:', {
        flattenedImageUrl: !!results.flattenedImageUrl,
        thumbnailUrl: !!results.thumbnailUrl,
        layerImagesCount: results.layerImages.length
      });

    } catch (error) {
      console.error('❌ Image generation failed:', error);
    }

    return results;
  }

  private async generateFlattenedImage(fileName: string): Promise<string | null> {
    try {
      console.log('📸 Creating flattened image canvas');
      
      // Create a canvas to render the flattened PSD
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx || !this.psd.width || !this.psd.height) {
        console.warn('⚠️ Cannot create canvas context or PSD dimensions missing');
        return null;
      }

      canvas.width = this.psd.width;
      canvas.height = this.psd.height;

      // Clear canvas with transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // If PSD has a composite image, use it
      if (this.psd.canvas) {
        console.log('🖼️ Using PSD composite image');
        ctx.drawImage(this.psd.canvas, 0, 0);
      } else {
        console.log('🎨 Rendering layers manually');
        await this.renderLayersToCanvas(ctx);
      }

      // Convert canvas to blob and upload
      return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            console.error('❌ Failed to create blob from canvas');
            resolve(null);
            return;
          }

          try {
            console.log('📤 Uploading flattened image to storage');
            
            // Create file from blob
            const file = new File([blob], `${fileName.replace('.psd', '')}_flattened.png`, {
              type: 'image/png'
            });

            // Upload to storage
            const uploadResult = await MediaManager.uploadFile(file, {
              bucket: 'media',
              folder: 'psd-renders',
              optimize: true,
              generateThumbnail: false,
              tags: ['psd-render', 'flattened']
            });

            if (uploadResult?.metadata.publicUrl) {
              console.log('✅ Flattened image uploaded successfully');
              resolve(uploadResult.metadata.publicUrl);
            } else {
              console.error('❌ Upload failed - no public URL');
              resolve(null);
            }
          } catch (error) {
            console.error('❌ Failed to upload flattened image:', error);
            resolve(null);
          }
        }, 'image/png', 0.9);
      });
    } catch (error) {
      console.error('❌ Failed to generate flattened image:', error);
      return null;
    }
  }

  private async generateThumbnail(imageUrl: string, fileName: string): Promise<string | null> {
    try {
      console.log('🔍 Generating thumbnail from:', imageUrl);
      
      // Create a smaller canvas for thumbnail
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('❌ Cannot create thumbnail canvas context');
        return null;
      }

      // Set thumbnail dimensions (max 200px)
      const maxSize = 200;
      const aspectRatio = this.psd.width! / this.psd.height!;
      
      if (aspectRatio > 1) {
        canvas.width = maxSize;
        canvas.height = maxSize / aspectRatio;
      } else {
        canvas.width = maxSize * aspectRatio;
        canvas.height = maxSize;
      }

      // Load and draw the original image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      return new Promise((resolve) => {
        img.onload = async () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob(async (blob) => {
            if (!blob) {
              console.error('❌ Failed to create thumbnail blob');
              resolve(null);
              return;
            }

            try {
              const file = new File([blob], `${fileName.replace('.psd', '')}_thumb.png`, {
                type: 'image/png'
              });

              const uploadResult = await MediaManager.uploadFile(file, {
                bucket: 'media',
                folder: 'psd-renders/thumbnails',
                optimize: true,
                tags: ['psd-render', 'thumbnail']
              });

              resolve(uploadResult?.metadata.publicUrl || null);
            } catch (error) {
              console.error('❌ Failed to upload thumbnail:', error);
              resolve(null);
            }
          }, 'image/png', 0.8);
        };
        
        img.onerror = () => {
          console.error('❌ Failed to load image for thumbnail');
          resolve(null);
        };
        
        img.src = imageUrl;
      });
    } catch (error) {
      console.error('❌ Failed to generate thumbnail:', error);
      return null;
    }
  }

  private async generateLayerImages(fileName: string): Promise<any[]> {
    const layerImages: any[] = [];
    
    if (!this.psd.children) {
      console.log('⚠️ No layers found in PSD');
      return layerImages;
    }

    console.log(`🎨 Processing ${this.psd.children.length} layers for individual images`);

    for (let i = 0; i < this.psd.children.length; i++) {
      const layer = this.psd.children[i];
      
      if (!layer.canvas || layer.hidden === true) {
        console.log(`⏭️ Skipping layer ${i}: ${layer.name} (no canvas or hidden)`);
        continue;
      }

      try {
        console.log(`🖼️ Processing layer ${i}: ${layer.name}`);
        
        const layerImageUrl = await this.extractLayerImage(layer, i, fileName);
        
        if (layerImageUrl) {
          const layerImage = {
            id: `layer_${i}`,
            name: layer.name || `Layer ${i}`,
            imageUrl: layerImageUrl,
            thumbnailUrl: layerImageUrl, // Use same for now
            bounds: {
              left: layer.left || 0,
              top: layer.top || 0,
              right: layer.right || layer.left || 0,
              bottom: layer.bottom || layer.top || 0
            },
            width: (layer.right || 0) - (layer.left || 0),
            height: (layer.bottom || 0) - (layer.top || 0),
            properties: {
              opacity: (layer.opacity !== undefined ? layer.opacity : 255) / 255,
              blendMode: layer.blendMode || 'normal',
              visible: layer.hidden !== true,
              locked: layer.locked || false
            }
          };
          
          layerImages.push(layerImage);
          console.log(`✅ Layer ${i} processed successfully`);
        }
      } catch (error) {
        console.error(`❌ Failed to process layer ${i}:`, error);
      }
    }

    console.log(`✅ Processed ${layerImages.length} layer images`);
    return layerImages;
  }

  private async extractLayerImage(layer: any, index: number, fileName: string): Promise<string | null> {
    try {
      if (!layer.canvas) {
        return null;
      }

      // Create canvas for this layer
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        return null;
      }

      // Set canvas size to layer bounds
      const width = (layer.right || 0) - (layer.left || 0);
      const height = (layer.bottom || 0) - (layer.top || 0);
      
      if (width <= 0 || height <= 0) {
        return null;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw the layer
      ctx.globalAlpha = (layer.opacity !== undefined ? layer.opacity : 255) / 255;
      ctx.drawImage(layer.canvas, 0, 0, width, height);

      // Convert to blob and upload
      return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }

          try {
            const layerName = layer.name || `layer_${index}`;
            const file = new File([blob], `${fileName.replace('.psd', '')}_${layerName}_${index}.png`, {
              type: 'image/png'
            });

            const uploadResult = await MediaManager.uploadFile(file, {
              bucket: 'media',
              folder: 'psd-renders/layers',
              optimize: true,
              tags: ['psd-render', 'layer', layerName]
            });

            resolve(uploadResult?.metadata.publicUrl || null);
          } catch (error) {
            console.error('Failed to upload layer image:', error);
            resolve(null);
          }
        }, 'image/png', 0.9);
      });
    } catch (error) {
      console.error('Failed to extract layer image:', error);
      return null;
    }
  }

  private async renderLayersToCanvas(ctx: CanvasRenderingContext2D): Promise<void> {
    if (!this.psd.children) return;

    console.log(`🎨 Manually rendering ${this.psd.children.length} layers to canvas`);

    // Render layers from bottom to top
    for (const layer of this.psd.children) {
      if (layer.canvas && layer.hidden !== true) {
        try {
          ctx.globalAlpha = (layer.opacity !== undefined ? layer.opacity : 255) / 255;
          ctx.drawImage(
            layer.canvas,
            layer.left || 0,
            layer.top || 0
          );
          ctx.globalAlpha = 1;
        } catch (error) {
          console.warn('Failed to render layer:', layer.name, error);
        }
      }
    }
  }

  private process(): ProcessedPSD {
    console.log('🏗️ Processing PSD structure');
    
    const layers = this.processLayers(this.psd.children || []);

    return {
      id: `psd_${Date.now()}`,
      fileName: 'processed.psd',
      width: this.psd.width || 0,
      height: this.psd.height || 0,
      layers: layers,
      totalLayers: layers.length,
      metadata: {
        documentName: this.psd.name || 'Untitled',
        colorMode: this.psd.colorMode?.toString() || 'RGB',
        created: new Date().toISOString()
      },
      flattenedImageUrl: 'placeholder_flattened_url',
      transparentFlattenedImageUrl: 'placeholder_transparent_url',
      thumbnailUrl: 'placeholder_thumbnail_url',
      layerImages: [] // Will be populated later
    };
  }

  private processLayers(layerData: any[], parentName: string = 'root'): ProcessedPSDLayer[] {
    const layers: ProcessedPSDLayer[] = [];
    layerData.forEach((layer, index) => {
      const layerIndex = index;
      const processedLayer = this.processLayer(layer, layerIndex);
      layers.push(processedLayer);

      if (layer.children && layer.children.length > 0) {
        const groupName = layer.name || `Group ${index + 1}`;
        const childLayers = this.processLayers(layer.children, groupName);
        layers.push(...childLayers);
      }
    });
    return layers;
  }

  private processLayer(layer: any, layerIndex: number): ProcessedPSDLayer {
    const bounds: LayerBounds = {
      left: layer.left || 0,
      top: layer.top || 0,
      right: layer.right || layer.left || 0,
      bottom: layer.bottom || layer.top || 0
    };

    const properties: LayerProperties = {
      opacity: (layer.opacity || 255) / 255,
      blendMode: layer.blendMode || 'normal',
      visible: layer.hidden !== true,
      locked: layer.locked || false
    };

    return {
      id: `layer_${layerIndex}`,
      name: layer.name || `Layer ${layerIndex}`,
      bounds,
      properties,
      semanticType: inferLayerSemanticType(layer),
      hasRealImage: !!(layer.canvas || layer.imageData),
      layerIndex: layerIndex,
      type: layer.type || 'layer',
      isVisible: properties.visible,
      opacity: properties.opacity,
      confidence: 0.8
    };
  }
}


import { CRDDocument, CRDUtils, CRDFrameLayer, CRDImageLayer } from '@/types/crd-spec';
import { EnhancedFrameTemplate } from '@/components/editor/frames/types';

export class CRDConverter {
  /**
   * Convert an EnhancedFrameTemplate to a CRD Frame Layer
   */
  static frameTemplateToCRDLayer(template: EnhancedFrameTemplate): CRDFrameLayer {
    return {
      id: `frame-${template.id}`,
      name: template.name,
      type: 'frame',
      visible: true,
      locked: false,
      z_index: 0,
      
      transform: {
        position: { x: 0, y: 0, unit: 'px' },
        rotation: 0,
        scale: { x: 1, y: 1, uniform: true },
        skew: { x: 0, y: 0 }
      },
      
      opacity: 100,
      blend_mode: 'normal',
      
      frame_data: {
        template_id: template.id,
        style: this.mapCategoryToFrameStyle(template.category),
        
        border: {
          width: 2, // Default fallback
          style: 'solid',
          color: { format: 'hex', value: '#000000' }, // Default fallback
          radius: 8 // Default fallback
        },
        
        corner_radius: 8, // Default fallback
        
        shadow: {
          enabled: false, // Default fallback
          offset_x: 0,
          offset_y: 4,
          blur: 8,
          spread: 0,
          color: { format: 'hex', value: '#000000', opacity: 0.25 },
          inset: false
        },
        
        material: {
          type: 'standard', // Default fallback
          albedo: { format: 'hex', value: '#ffffff' },
          metalness: 0.1, // Default fallback
          roughness: 0.6, // Default fallback
        },
        
        layout_areas: {
          image_area: {
            x: 20, // Default fallback
            y: 20, // Default fallback
            width: 260, // Default fallback
            height: 300 // Default fallback
          },
          title_area: {
            x: 20, // Default fallback
            y: 340, // Default fallback
            width: 260, // Default fallback
            height: 30 // Default fallback
          }
        }
      }
    };
  }

  /**
   * Create a complete CRD document from frame template and uploaded image
   */
  static createCRDFromTemplate(
    template: EnhancedFrameTemplate, 
    uploadedImageUrl?: string,
    cardName?: string
  ): CRDDocument {
    const doc = CRDUtils.createEmptyDocument();
    
    // Update basic info
    doc.name = cardName || template.name;
    doc.metadata.category = template.category.toLowerCase();
    doc.metadata.tags = [template.category.toLowerCase(), 'enhanced-frame'];
    
    // Add frame layer
    const frameLayer = this.frameTemplateToCRDLayer(template);
    doc.layers.push(frameLayer);
    
    // Add image layer if provided
    if (uploadedImageUrl) {
      const imageLayer: CRDImageLayer = {
        id: `image-main`,
        name: 'Main Image',
        type: 'image',
        visible: true,
        locked: false,
        z_index: 1,
        
        transform: {
          position: { 
            x: 20, // Default fallback
            y: 20, // Default fallback
            unit: 'px' 
          },
          rotation: 0,
          scale: { x: 1, y: 1, uniform: true },
          skew: { x: 0, y: 0 }
        },
        
        opacity: 100,
        blend_mode: 'normal',
        
        image_data: {
          source: {
            type: 'url',
            url: uploadedImageUrl,
            width: 260, // Default fallback
            height: 300, // Default fallback
            format: 'jpg', // assume jpg, would need detection
            size_bytes: 0 // would need actual size
          },
          fit: 'cover',
          position: { x: 50, y: 50, unit: '%' },
          filters: {
            brightness: 0,
            contrast: 0,
            saturation: 0,
            hue_shift: 0,
            blur: 0,
            sharpen: 0,
            noise: 0,
            vignette: 0
          },
          adjustments: {
            exposure: 0,
            highlights: 0,
            shadows: 0,
            whites: 0,
            blacks: 0,
            clarity: 0,
            vibrance: 0,
            temperature: 5500,
            tint: 0
          },
          crop: {
            enabled: false,
            x: 0,
            y: 0,
            width: 1,
            height: 1
          },
          focus_point: { x: 0.5, y: 0.5 }
        }
      };
      
      doc.layers.push(imageLayer);
    }
    
    return doc;
  }

  // Helper methods
  private static mapCategoryToFrameStyle(category: string): string {
    const mapping: Record<string, string> = {
      'Modern': 'modern',
      'Classic Sports': 'sports',
      'Vintage Ornate': 'vintage',
      'Holographic': 'futuristic',
      'Chrome': 'modern',
      'Crystal': 'artistic'
    };
    return mapping[category] || 'modern';
  }
}

// Export utility for easy access
export const createCRDFromFrame = CRDConverter.createCRDFromTemplate;
export const convertFrameToCRD = CRDConverter.frameTemplateToCRDLayer;

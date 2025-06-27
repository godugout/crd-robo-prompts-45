
import { CRDDocument, CRDUtils, CRDFrameLayer, CRDImageLayer } from '@/types/crd-spec';
import { EnhancedFrameTemplate } from '@/components/studio/frames/EnhancedFrameTemplates';

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
          width: this.extractBorderWidth(template.visual.border.width),
          style: 'solid',
          color: { format: 'hex', value: template.visual.border.color },
          gradient: template.visual.border.gradient,
          radius: this.extractBorderRadius(template.visual.borderRadius)
        },
        
        corner_radius: this.extractBorderRadius(template.visual.borderRadius),
        
        shadow: {
          enabled: !!template.visual.shadow,
          offset_x: 0,
          offset_y: 4,
          blur: 8,
          spread: 0,
          color: { format: 'hex', value: '#000000', opacity: 0.25 },
          inset: false
        },
        
        material: {
          type: this.mapEffectsToMaterialType(template.effects),
          albedo: { format: 'hex', value: '#ffffff' },
          metalness: template.effects.metallic ? 0.8 : 0.1,
          roughness: template.effects.chrome ? 0.1 : 0.6,
          
          holographic: template.effects.holographic ? {
            intensity: 0.8,
            color_shift: 180,
            pattern: 'rainbow'
          } : undefined,
          
          metallic: template.effects.metallic ? {
            reflection_intensity: 0.9,
            tint: { format: 'hex', value: '#c0c0c0' },
            polish: 0.9
          } : undefined,
          
          crystal: template.effects.crystal ? {
            transparency: 0.2,
            refraction_index: 1.5,
            internal_reflections: true
          } : undefined
        },
        
        layout_areas: {
          image_area: {
            x: template.layout.imageArea.x,
            y: template.layout.imageArea.y,
            width: template.layout.imageArea.width,
            height: template.layout.imageArea.height
          },
          title_area: {
            x: template.layout.titleArea.x,
            y: template.layout.titleArea.y,
            width: template.layout.titleArea.width,
            height: template.layout.titleArea.height
          },
          subtitle_area: template.layout.subtitleArea ? {
            x: template.layout.subtitleArea.x,
            y: template.layout.subtitleArea.y,
            width: template.layout.subtitleArea.width,
            height: template.layout.subtitleArea.height
          } : undefined,
          stats_area: template.layout.statsArea ? {
            x: template.layout.statsArea.x,
            y: template.layout.statsArea.y,
            width: template.layout.statsArea.width,
            height: template.layout.statsArea.height
          } : undefined
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
    doc.metadata.rarity = template.rarity.toLowerCase() as any;
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
            x: template.layout.imageArea.x, 
            y: template.layout.imageArea.y, 
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
            width: template.layout.imageArea.width,
            height: template.layout.imageArea.height,
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
  private static mapCategoryToFrameStyle(category: string): any {
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

  private static mapEffectsToMaterialType(effects: any): any {
    if (effects.holographic) return 'holographic';
    if (effects.chrome || effects.metallic) return 'metallic';
    if (effects.crystal) return 'crystal';
    return 'standard';
  }

  private static extractBorderWidth(width: string): number {
    const match = width.match(/(\d+)/);
    return match ? parseInt(match[1]) : 2;
  }

  private static extractBorderRadius(radius: string): number {
    const match = radius.match(/(\d+)/);
    return match ? parseInt(match[1]) : 8;
  }
}

// Export utility for easy access
export const createCRDFromFrame = CRDConverter.createCRDFromTemplate;
export const convertFrameToCRD = CRDConverter.frameTemplateToCRDLayer;

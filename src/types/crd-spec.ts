
/**
 * CRD (Cardshow Readable Document) Specification v1.0
 * 
 * A comprehensive specification for digital trading cards that defines
 * structure, visual properties, animations, and export configurations.
 */

// Core CRD Document Structure
export interface CRDDocument {
  // Document metadata
  version: string; // "1.0"
  id: string; // Unique CRD identifier
  name: string; // Human-readable card name
  description?: string;
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
  creator_id: string;
  
  // Canvas properties
  canvas: CRDCanvas;
  
  // Layer system (ordered from bottom to top)
  layers: CRDLayer[];
  
  // Global visual effects
  effects: CRDGlobalEffects;
  
  // Animation definitions
  animations: CRDAnimation[];
  
  // Export configurations
  export_settings: CRDExportSettings;
  
  // Metadata for organization
  metadata: CRDMetadata;
}

// Canvas Definition
export interface CRDCanvas {
  // Physical dimensions
  width: number; // in pixels at base resolution
  height: number; // in pixels at base resolution
  aspect_ratio: number; // width/height ratio
  
  // Quality settings
  base_resolution: number; // 300 for print, 72 for web
  max_resolution: number; // maximum export resolution
  
  // Background
  background: CRDBackground;
  
  // Safe areas for content placement
  safe_areas: {
    margin: number; // pixels from edge
    content_area: CRDRect; // main content boundaries
    title_area?: CRDRect; // title safe zone
    footer_area?: CRDRect; // footer safe zone
  };
}

// Layer System - Everything is a layer
export type CRDLayer = 
  | CRDFrameLayer 
  | CRDImageLayer 
  | CRDTextLayer 
  | CRDVideoLayer 
  | CRDStickerLayer 
  | CRDPlateLayer 
  | CRDEffectLayer;

// Base layer properties
export interface CRDLayerBase {
  id: string;
  name: string;
  type: 'frame' | 'image' | 'text' | 'video' | 'sticker' | 'plate' | 'effect';
  visible: boolean;
  locked: boolean;
  z_index: number; // stacking order
  
  // Transform properties
  transform: CRDTransform;
  
  // Visual properties
  opacity: number; // 0-100
  blend_mode: CRDBlendMode;
  
  // Mask and clipping
  mask?: CRDMask;
  clip_path?: string; // CSS clip-path syntax
}

// Frame Layer - Defines card structure and borders
export interface CRDFrameLayer extends CRDLayerBase {
  type: 'frame';
  frame_data: {
    template_id: string; // references frame template
    style: CRDFrameStyle;
    border: CRDBorder;
    corner_radius: number;
    shadow: CRDShadow;
    material: CRDMaterial;
    
    // Layout areas within the frame
    layout_areas: {
      image_area: CRDRect;
      title_area?: CRDRect;
      subtitle_area?: CRDRect;
      stats_area?: CRDRect;
      description_area?: CRDRect;
    };
  };
}

// Image Layer - Photos, artwork, graphics
export interface CRDImageLayer extends CRDLayerBase {
  type: 'image';
  image_data: {
    source: CRDImageSource;
    fit: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
    position: CRDPosition;
    
    // Image processing
    filters: CRDImageFilters;
    adjustments: CRDImageAdjustments;
    
    // Cropping and focus
    crop: CRDCrop;
    focus_point: { x: number; y: number }; // 0-1 coordinates
  };
}

// Text Layer - Typography and labels
export interface CRDTextLayer extends CRDLayerBase {
  type: 'text';
  text_data: {
    content: string;
    typography: CRDTypography;
    color: CRDColor;
    
    // Text effects
    stroke: CRDStroke;
    shadow: CRDTextShadow;
    glow: CRDGlow;
    
    // Layout
    alignment: 'left' | 'center' | 'right' | 'justify';
    vertical_alignment: 'top' | 'middle' | 'bottom';
    line_height: number;
    letter_spacing: number;
    
    // Auto-sizing
    auto_size: boolean;
    max_lines?: number;
  };
}

// Video Layer - Motion graphics and video clips
export interface CRDVideoLayer extends CRDLayerBase {
  type: 'video';
  video_data: {
    source: CRDVideoSource;
    playback: {
      autoplay: boolean;
      loop: boolean;
      muted: boolean;
      start_time: number; // seconds
      duration?: number; // seconds, null for full duration
    };
    
    // Video processing
    filters: CRDImageFilters; // same as image filters
    poster_image?: CRDImageSource; // thumbnail/preview
  };
}

// Sticker Layer - Decorative elements and badges
export interface CRDStickerLayer extends CRDLayerBase {
  type: 'sticker';
  sticker_data: {
    sticker_id: string; // references sticker template
    category: 'badge' | 'decoration' | 'pattern' | 'icon' | 'emoji';
    
    // Sticker properties
    color_scheme: string[]; // hex colors for theming
    size_variant: 'small' | 'medium' | 'large';
    
    // Interactive properties
    hover_effect?: CRDHoverEffect;
    click_action?: CRDClickAction;
  };
}

// Plate Layer - Nameplates, stat boxes, info panels
export interface CRDPlateLayer extends CRDLayerBase {
  type: 'plate';
  plate_data: {
    plate_type: 'nameplate' | 'stats' | 'info' | 'badge' | 'banner';
    
    // Plate styling
    background: CRDBackground;
    border: CRDBorder;
    material: CRDMaterial;
    
    // Content areas within the plate
    content_areas: CRDContentArea[];
  };
}

// Effect Layer - Visual effects that apply to other layers
export interface CRDEffectLayer extends CRDLayerBase {
  type: 'effect';
  effect_data: {
    effect_type: 'holographic' | 'chrome' | 'glow' | 'particle' | 'distortion' | 'lighting';
    intensity: number; // 0-100
    
    // Effect-specific parameters
    parameters: Record<string, any>;
    
    // Target layers (empty array = affects all layers below)
    target_layer_ids: string[];
    
    // Blend settings
    blend_mode: CRDBlendMode;
    mask?: CRDMask;
  };
}

// Transform Properties
export interface CRDTransform {
  position: CRDPosition;
  rotation: number; // degrees
  scale: CRDScale;
  skew: { x: number; y: number }; // degrees
  
  // 3D transform (for premium effects)
  rotation_3d?: {
    x: number; // degrees
    y: number; // degrees
    z: number; // degrees
  };
  perspective?: number; // pixels
}

// Material System
export interface CRDMaterial {
  type: 'standard' | 'metallic' | 'holographic' | 'crystal' | 'fabric' | 'wood' | 'plastic';
  
  // PBR properties
  albedo: CRDColor; // base color
  metalness: number; // 0-1
  roughness: number; // 0-1
  normal_map?: string; // texture URL
  
  // Special material properties
  holographic?: {
    intensity: number; // 0-1
    color_shift: number; // hue rotation range
    pattern: 'rainbow' | 'chromatic' | 'prismatic';
  };
  
  metallic?: {
    reflection_intensity: number; // 0-1
    tint: CRDColor;
    polish: number; // 0-1 (roughness inverse)
  };
  
  crystal?: {
    transparency: number; // 0-1
    refraction_index: number; // 1.0-2.0
    internal_reflections: boolean;
  };
}

// Lighting System
export interface CRDLighting {
  global_illumination: {
    intensity: number; // 0-1
    color: CRDColor;
    direction: CRDVector3D;
  };
  
  point_lights: CRDPointLight[];
  environment_lighting: {
    hdri_map?: string; // environment texture URL
    intensity: number; // 0-1
    rotation: number; // degrees
  };
  
  shadows: {
    enabled: boolean;
    intensity: number; // 0-1
    blur: number; // pixels
    color: CRDColor;
  };
}

// Animation System
export interface CRDAnimation {
  id: string;
  name: string;
  target_layer_id: string;
  
  // Animation timing
  duration: number; // seconds
  delay: number; // seconds
  iterations: number | 'infinite';
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  easing: CRDEasing;
  
  // Keyframes
  keyframes: CRDKeyframe[];
  
  // Triggers
  trigger: 'auto' | 'hover' | 'click' | 'scroll' | 'time';
  trigger_conditions?: Record<string, any>;
}

// Supporting Types
export interface CRDRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CRDPosition {
  x: number; // pixels or percentage
  y: number; // pixels or percentage
  unit: 'px' | '%' | 'rem' | 'em';
}

export interface CRDScale {
  x: number; // 0-∞, 1 = 100%
  y: number; // 0-∞, 1 = 100%
  uniform: boolean; // maintain aspect ratio
}

export interface CRDColor {
  format: 'hex' | 'rgb' | 'hsl' | 'gradient';
  value: string; // #ff0000, rgb(255,0,0), linear-gradient(...)
  opacity?: number; // 0-1
}

export interface CRDBackground {
  type: 'solid' | 'gradient' | 'image' | 'video' | 'pattern';
  color?: CRDColor;
  image?: CRDImageSource;
  video?: CRDVideoSource;
  pattern?: {
    type: string;
    parameters: Record<string, any>;
  };
}

export interface CRDBorder {
  width: number; // pixels
  style: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
  color: CRDColor;
  gradient?: string; // CSS gradient syntax
  radius: number | number[]; // pixels, can be array for different corners
}

export interface CRDShadow {
  enabled: boolean;
  offset_x: number; // pixels
  offset_y: number; // pixels
  blur: number; // pixels
  spread: number; // pixels
  color: CRDColor;
  inset: boolean;
}

export interface CRDImageSource {
  type: 'url' | 'upload' | 'generated';
  url?: string;
  file_id?: string; // for uploaded files
  generation_params?: Record<string, any>; // for AI-generated images
  
  // Image metadata
  width: number;
  height: number;
  format: 'jpg' | 'png' | 'webp' | 'svg' | 'gif';
  size_bytes: number;
}

export interface CRDVideoSource {
  type: 'url' | 'upload' | 'generated';
  url?: string;
  file_id?: string;
  
  // Video metadata
  width: number;
  height: number;
  format: 'mp4' | 'webm' | 'gif';
  duration: number; // seconds
  size_bytes: number;
}

export interface CRDImageFilters {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  hue_shift: number; // -180 to 180 degrees
  blur: number; // 0-100 pixels
  sharpen: number; // 0-100
  noise: number; // 0-100
  vignette: number; // 0-100
}

export interface CRDImageAdjustments {
  exposure: number; // -2 to 2 stops
  highlights: number; // -100 to 100
  shadows: number; // -100 to 100
  whites: number; // -100 to 100
  blacks: number; // -100 to 100
  clarity: number; // -100 to 100
  vibrance: number; // -100 to 100
  temperature: number; // 2000-10000K
  tint: number; // -100 to 100
}

export interface CRDCrop {
  enabled: boolean;
  x: number; // 0-1
  y: number; // 0-1
  width: number; // 0-1
  height: number; // 0-1
}

export interface CRDTypography {
  font_family: string;
  font_weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  font_style: 'normal' | 'italic' | 'oblique';
  font_size: number; // pixels
  font_variant: 'normal' | 'small-caps' | 'all-small-caps';
  text_transform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface CRDStroke {
  enabled: boolean;
  width: number; // pixels
  color: CRDColor;
  position: 'inside' | 'outside' | 'center';
}

export interface CRDTextShadow {
  enabled: boolean;
  offset_x: number; // pixels
  offset_y: number; // pixels
  blur: number; // pixels
  color: CRDColor;
}

export interface CRDGlow {
  enabled: boolean;
  intensity: number; // 0-100
  color: CRDColor;
  size: number; // pixels
}

export interface CRDMask {
  type: 'rectangle' | 'ellipse' | 'polygon' | 'image' | 'text';
  invert: boolean;
  feather: number; // pixels
  parameters: Record<string, any>;
}

export interface CRDPointLight {
  position: CRDVector3D;
  color: CRDColor;
  intensity: number; // 0-∞
  range: number; // pixels
  decay: number; // 0-∞
}

export interface CRDVector3D {
  x: number;
  y: number;
  z: number;
}

export interface CRDKeyframe {
  time: number; // 0-1 (percentage of animation duration)
  properties: Record<string, any>; // property values at this time
  easing?: CRDEasing;
}

export interface CRDContentArea {
  id: string;
  type: 'text' | 'image' | 'icon' | 'number';
  bounds: CRDRect;
  content: any; // depends on type
  styling: Record<string, any>;
}

export interface CRDHoverEffect {
  type: 'scale' | 'glow' | 'rotate' | 'fade' | 'bounce';
  intensity: number; // 0-100
  duration: number; // seconds
}

export interface CRDClickAction {
  type: 'none' | 'link' | 'expand' | 'animation' | 'sound';
  parameters: Record<string, any>;
}

export interface CRDGlobalEffects {
  lighting: CRDLighting;
  post_processing: {
    bloom: { enabled: boolean; intensity: number; threshold: number };
    color_grading: { enabled: boolean; lut_url?: string };
    film_grain: { enabled: boolean; intensity: number };
    chromatic_aberration: { enabled: boolean; intensity: number };
  };
}

export interface CRDExportSettings {
  formats: CRDExportFormat[];
  quality_presets: {
    web: CRDQualityPreset;
    print: CRDQualityPreset;
    social: CRDQualityPreset;
    premium: CRDQualityPreset;
  };
}

export interface CRDExportFormat {
  format: 'png' | 'jpg' | 'webp' | 'pdf' | 'svg' | 'mp4' | 'gif';
  width: number;
  height: number;
  quality: number; // 0-100
  transparent_background: boolean;
}

export interface CRDQualityPreset {
  resolution: number; // DPI
  compression: number; // 0-100
  color_profile: 'sRGB' | 'Adobe RGB' | 'P3' | 'CMYK';
  bit_depth: 8 | 16 | 32;
}

export interface CRDMetadata {
  category: string;
  tags: string[];
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  edition: string;
  series: string;
  collection_id?: string;
  
  // Usage rights and licensing
  license: 'public' | 'private' | 'commercial' | 'cc0' | 'cc-by' | 'cc-by-sa';
  attribution_required: boolean;
  commercial_use_allowed: boolean;
  
  // Performance hints
  complexity_score: number; // 1-10 (for rendering performance)
  feature_flags: string[]; // required features/capabilities
}

// Utility Types
export type CRDBlendMode = 
  | 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light'
  | 'color-dodge' | 'color-burn' | 'darken' | 'lighten' | 'difference' | 'exclusion'
  | 'hue' | 'saturation' | 'color' | 'luminosity';

export type CRDEasing = 
  | 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
  | 'cubic-bezier(number, number, number, number)';

export type CRDFrameStyle = 
  | 'minimal' | 'classic' | 'ornate' | 'modern' | 'vintage' | 'futuristic'
  | 'sports' | 'fantasy' | 'sci-fi' | 'artistic' | 'professional';

// Validation and utility functions
export class CRDValidator {
  static validateDocument(doc: CRDDocument): { valid: boolean; errors: string[] } {
    // Implementation would validate the entire CRD document
    return { valid: true, errors: [] };
  }
  
  static validateLayer(layer: CRDLayer): { valid: boolean; errors: string[] } {
    // Implementation would validate individual layers
    return { valid: true, errors: [] };
  }
}

export class CRDUtils {
  static createEmptyDocument(): CRDDocument {
    return {
      version: "1.0",
      id: crypto.randomUUID(),
      name: "Untitled Card",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      creator_id: "anonymous",
      
      canvas: {
        width: 300,
        height: 420,
        aspect_ratio: 300/420,
        base_resolution: 300,
        max_resolution: 3000,
        background: {
          type: 'solid',
          color: { format: 'hex', value: '#ffffff' }
        },
        safe_areas: {
          margin: 20,
          content_area: { x: 20, y: 20, width: 260, height: 380 }
        }
      },
      
      layers: [],
      effects: {
        lighting: {
          global_illumination: {
            intensity: 0.8,
            color: { format: 'hex', value: '#ffffff' },
            direction: { x: 0, y: -1, z: 0.5 }
          },
          point_lights: [],
          environment_lighting: {
            intensity: 0.3,
            rotation: 0
          },
          shadows: {
            enabled: true,
            intensity: 0.3,
            blur: 4,
            color: { format: 'hex', value: '#000000', opacity: 0.25 }
          }
        },
        post_processing: {
          bloom: { enabled: false, intensity: 0.5, threshold: 0.8 },
          color_grading: { enabled: false },
          film_grain: { enabled: false, intensity: 0.1 },
          chromatic_aberration: { enabled: false, intensity: 0.1 }
        }
      },
      
      animations: [],
      
      export_settings: {
        formats: [
          { format: 'png', width: 300, height: 420, quality: 95, transparent_background: false }
        ],
        quality_presets: {
          web: { resolution: 72, compression: 85, color_profile: 'sRGB', bit_depth: 8 },
          print: { resolution: 300, compression: 95, color_profile: 'Adobe RGB', bit_depth: 16 },
          social: { resolution: 72, compression: 80, color_profile: 'sRGB', bit_depth: 8 },
          premium: { resolution: 600, compression: 100, color_profile: 'P3', bit_depth: 32 }
        }
      },
      
      metadata: {
        category: 'general',
        tags: [],
        rarity: 'common',
        edition: '1st',
        series: 'custom',
        license: 'private',
        attribution_required: false,
        commercial_use_allowed: false,
        complexity_score: 1,
        feature_flags: []
      }
    };
  }
  
  static addLayer(doc: CRDDocument, layer: CRDLayer): CRDDocument {
    return {
      ...doc,
      layers: [...doc.layers, layer],
      updated_at: new Date().toISOString()
    };
  }
  
  static updateLayer(doc: CRDDocument, layerId: string, updates: Partial<CRDLayer>): CRDDocument {
    return {
      ...doc,
      layers: doc.layers.map(layer => 
        layer.id === layerId ? { ...layer, ...updates } : layer
      ),
      updated_at: new Date().toISOString()
    };
  }
  
  static removeLayer(doc: CRDDocument, layerId: string): CRDDocument {
    return {
      ...doc,
      layers: doc.layers.filter(layer => layer.id !== layerId),
      updated_at: new Date().toISOString()
    };
  }
}

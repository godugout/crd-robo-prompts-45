// CRD (Card Representation Document) Specification
// Version 1.0 - TypeScript Type Definitions

// Base interfaces
export interface CRDPosition {
  x: number;
  y: number;
  unit: 'px' | '%' | 'em' | 'rem' | 'vw' | 'vh';
}

export interface CRDSize {
  width: number;
  height: number;
  unit: 'px' | '%' | 'em' | 'rem' | 'vw' | 'vh';
}

export interface CRDColor {
  format: 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';
  value: string;
  opacity?: number;
}

export interface CRDGradient {
  type: 'linear' | 'radial' | 'conic';
  angle?: number;
  stops: Array<{
    offset: number;
    color: CRDColor;
  }>;
}

export interface CRDTransform {
  position: CRDPosition;
  rotation: number;
  scale: {
    x: number;
    y: number;
    uniform: boolean;
  };
  skew: {
    x: number;
    y: number;
  };
}

export type CRDBlendMode = 
  | 'normal' | 'multiply' | 'screen' | 'overlay' 
  | 'soft-light' | 'hard-light' | 'color-dodge' | 'color-burn'
  | 'darken' | 'lighten' | 'difference' | 'exclusion';

// Mask interface
export interface CRDMask {
  type: 'alpha' | 'luminance' | 'vector';
  source: string;
  invert: boolean;
}

// Animation interface
export interface CRDAnimation {
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'custom';
  duration: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  delay?: number;
  loop?: boolean;
  keyframes?: Array<{
    offset: number;
    properties: Record<string, any>;
  }>;
}

// Base layer interface
export interface CRDBaseLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  z_index: number;
  transform: CRDTransform;
  opacity: number;
  blend_mode: CRDBlendMode;
  clip_path?: string;
  mask?: CRDMask;
  animation?: CRDAnimation;
}

// Material interfaces
export interface CRDMaterial {
  type: 'standard' | 'metallic' | 'crystal';
  albedo: CRDColor;
  metalness: number;
  roughness: number;
  metallic?: {
    reflection_intensity: number;
    tint: CRDColor;
    polish: number;
  };
  crystal?: {
    transparency: number;
    refraction_index: number;
    internal_reflections: boolean;
  };
}

// Frame-specific data
export interface CRDFrameData {
  template_id: string;
  style: string;
  border: {
    width: number;
    style: 'solid' | 'dashed' | 'dotted';
    color: CRDColor;
    gradient?: CRDGradient;
    radius: number;
  };
  corner_radius: number;
  shadow: {
    enabled: boolean;
    offset_x: number;
    offset_y: number;
    blur: number;
    spread: number;
    color: CRDColor;
    inset: boolean;
  };
  material: CRDMaterial;
  layout_areas: {
    image_area: { x: number; y: number; width: number; height: number };
    title_area: { x: number; y: number; width: number; height: number };
    subtitle_area?: { x: number; y: number; width: number; height: number };
    stats_area?: { x: number; y: number; width: number; height: number };
  };
}

// Image-specific data
export interface CRDImageData {
  source: {
    type: 'url' | 'base64' | 'file';
    url?: string;
    data?: string;
    width: number;
    height: number;
    format: 'jpg' | 'png' | 'gif' | 'webp' | 'svg';
    size_bytes: number;
  };
  fit: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  position: CRDPosition;
  filters: {
    brightness: number;
    contrast: number;
    saturation: number;
    hue_shift: number;
    blur: number;
    sharpen: number;
    noise: number;
    vignette: number;
  };
  adjustments: {
    exposure: number;
    highlights: number;
    shadows: number;
    whites: number;
    blacks: number;
    clarity: number;
    vibrance: number;
    temperature: number;
    tint: number;
  };
  crop: {
    enabled: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  focus_point: { x: number; y: number };
}

// Specific layer types
export interface CRDFrameLayer extends CRDBaseLayer {
  type: 'frame';
  frame_data: CRDFrameData;
}

export interface CRDImageLayer extends CRDBaseLayer {
  type: 'image';
  image_data: CRDImageData;
}

export interface CRDTextLayer extends CRDBaseLayer {
  type: 'text';
  text_data: {
    content: string;
    font_family: string;
    font_size: number;
    font_weight: number;
    font_style: 'normal' | 'italic';
    text_decoration: 'none' | 'underline' | 'line-through';
    text_align: 'left' | 'center' | 'right' | 'justify';
    line_height: number;
    letter_spacing: number;
    color: CRDColor;
    stroke?: {
      width: number;
      color: CRDColor;
    };
    shadow?: {
      offset_x: number;
      offset_y: number;
      blur: number;
      color: CRDColor;
    };
  };
}

export interface CRDVideoLayer extends CRDBaseLayer {
  type: 'video';
  video_data: {
    source: {
      type: 'url' | 'file';
      url?: string;
      duration: number;
      format: 'mp4' | 'webm' | 'ogg';
      size_bytes: number;
    };
    autoplay: boolean;
    loop: boolean;
    muted: boolean;
    controls: boolean;
    poster?: string;
  };
}

export interface CRDStickerLayer extends CRDBaseLayer {
  type: 'sticker';
  sticker_data: {
    sticker_id: string;
    category: string;
    tags: string[];
  };
}

export interface CRDPlateLayer extends CRDBaseLayer {
  type: 'plate';
  plate_data: {
    material: 'gold' | 'silver' | 'bronze' | 'platinum';
    engraving: string;
    finish: 'polished' | 'brushed' | 'antiqued';
  };
}

// Union type for all layers
export type CRDLayer = 
  | CRDFrameLayer 
  | CRDImageLayer 
  | CRDTextLayer 
  | CRDVideoLayer 
  | CRDStickerLayer 
  | CRDPlateLayer;

// Main document interface
export interface CRDDocument {
  version: string;
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    name: string;
    email?: string;
  };
  dimensions: {
    width: number;
    height: number;
    unit: 'px' | 'mm' | 'in' | 'pt';
    dpi?: number;
  };
  background: {
    type: 'solid' | 'gradient' | 'image' | 'transparent';
    color?: CRDColor;
    gradient?: CRDGradient;
    image?: {
      url: string;
      fit: 'cover' | 'contain' | 'fill';
    };
  };
  layers: CRDLayer[];
  metadata: {
    category: string;
    tags: string[];
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    sport?: string;
    player?: string;
    team?: string;
    year?: number;
    series?: string;
    card_number?: string;
    print_run?: number;
  };
  export_settings: {
    formats: Array<{
      type: 'png' | 'jpg' | 'pdf' | 'svg';
      quality?: number;
      dpi?: number;
      color_profile?: string;
    }>;
    bleed?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
  assets: Array<{
    id: string;
    type: 'image' | 'font' | 'video' | 'audio';
    url: string;
    name: string;
    size_bytes: number;
    used_in_layers: string[];
  }>;
}

// Utility functions
export class CRDUtils {
  static createEmptyDocument(): CRDDocument {
    const now = new Date().toISOString();
    
    return {
      version: '1.0',
      id: `crd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Untitled Card',
      created_at: now,
      updated_at: now,
      author: {
        id: 'unknown',
        name: 'Unknown User'
      },
      dimensions: {
        width: 300,
        height: 420,
        unit: 'px'
      },
      background: {
        type: 'solid',
        color: { format: 'hex', value: '#ffffff' }
      },
      layers: [],
      metadata: {
        category: 'sports',
        tags: [],
        rarity: 'common'
      },
      export_settings: {
        formats: [
          { type: 'png', quality: 100, dpi: 300 }
        ]
      },
      assets: []
    };
  }

  static validateDocument(doc: any): doc is CRDDocument {
    return (
      typeof doc === 'object' &&
      typeof doc.version === 'string' &&
      typeof doc.id === 'string' &&
      typeof doc.name === 'string' &&
      Array.isArray(doc.layers) &&
      typeof doc.metadata === 'object' &&
      typeof doc.export_settings === 'object'
    );
  }

  static addLayer(doc: CRDDocument, layer: CRDLayer): CRDDocument {
    return {
      ...doc,
      layers: [...doc.layers, layer],
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

  static updateLayer(doc: CRDDocument, layerId: string, updates: Partial<CRDLayer>): CRDDocument {
    return {
      ...doc,
      layers: doc.layers.map(layer => {
        if (layer.id !== layerId) return layer;
        
        // Type-safe layer updates
        const updatedLayer = { ...layer, ...updates } as CRDLayer;
        
        // Ensure type consistency
        if (layer.type === 'frame' && updates.type === 'frame') {
          return updatedLayer as CRDFrameLayer;
        } else if (layer.type === 'image' && updates.type === 'image') {
          return updatedLayer as CRDImageLayer;
        } else if (layer.type === 'text' && updates.type === 'text') {
          return updatedLayer as CRDTextLayer;
        } else if (layer.type === 'video' && updates.type === 'video') {
          return updatedLayer as CRDVideoLayer;
        } else if (layer.type === 'sticker' && updates.type === 'sticker') {
          return updatedLayer as CRDStickerLayer;
        } else if (layer.type === 'plate' && updates.type === 'plate') {
          return updatedLayer as CRDPlateLayer;
        }
        
        return updatedLayer;
      }),
      updated_at: new Date().toISOString()
    };
  }

  static reorderLayers(doc: CRDDocument, fromIndex: number, toIndex: number): CRDDocument {
    const newLayers = [...doc.layers];
    const [movedLayer] = newLayers.splice(fromIndex, 1);
    newLayers.splice(toIndex, 0, movedLayer);
    
    // Update z-indices
    const updatedLayers = newLayers.map((layer, index) => ({
      ...layer,
      z_index: index
    }));
    
    return {
      ...doc,
      layers: updatedLayers,
      updated_at: new Date().toISOString()
    };
  }

  static getLayersByType<T extends CRDLayer['type']>(
    doc: CRDDocument, 
    type: T
  ): Extract<CRDLayer, { type: T }>[] {
    return doc.layers.filter((layer): layer is Extract<CRDLayer, { type: T }> => 
      layer.type === type
    );
  }

  static exportToJSON(doc: CRDDocument): string {
    return JSON.stringify(doc, null, 2);
  }

  static importFromJSON(json: string): CRDDocument {
    const parsed = JSON.parse(json);
    if (!this.validateDocument(parsed)) {
      throw new Error('Invalid CRD document format');
    }
    return parsed;
  }
}

export default CRDDocument;

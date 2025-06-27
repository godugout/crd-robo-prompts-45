import { type } from 'os';

// Core Types
export interface CRDColor {
  format: 'hex' | 'rgb' | 'hsl';
  value: string;
  opacity?: number;
}

export interface CRDGradientStop {
  offset: number;
  color: CRDColor;
}

export interface CRDGradient {
  type: 'linear' | 'radial' | 'conic';
  angle?: number;
  center?: { x: number; y: number };
  radius?: number;
  stops: CRDGradientStop[];
}

export interface CRDImageSource {
  type: 'url' | 'base64' | 'asset';
  url?: string;
  base64?: string;
  asset_id?: string;
  width?: number;
  height?: number;
  format?: string;
  size_bytes?: number;
}

export interface CRDTransform {
  position: { x: number; y: number; unit: 'px' | '%' };
  rotation: number;
  scale: { x: number; y: number; uniform: boolean };
  skew: { x: number; y: number };
}

export interface CRDAnimation {
  type: 'fade' | 'slide' | 'zoom' | 'rotate' | 'custom';
  duration: number;
  delay: number;
  easing: 'linear' | 'ease-in-out' | 'cubic-bezier';
  keyframes?: any[];
}

export interface CRDShadow {
  enabled: boolean;
  offset_x: number;
  offset_y: number;
  blur: number;
  spread: number;
  color: CRDColor;
  inset: boolean;
}

export interface CRDMask {
  type: 'alpha' | 'luminance' | 'custom';
  source_layer_id?: string;
  invert?: boolean;
}

export type CRDBlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

// Material Types
export interface CRDStandardMaterial {
  type: 'standard';
  albedo: CRDColor;
  roughness: number;
  metalness: number;
}

export interface CRDHolographicMaterial {
  type: 'holographic';
  intensity: number;
  color_shift: number;
  pattern: 'rainbow' | 'interference';
  animation_speed: number;
}

export interface CRDMetallicMaterial {
  type: 'metallic';
  reflection_intensity: number;
  tint: CRDColor;
  polish: number;
}

export interface CRDCrystalMaterial {
  type: 'crystal';
  transparency: number;
  refraction_index: number;
  internal_reflections: boolean;
}

export type CRDMaterial =
  | CRDStandardMaterial
  | CRDHolographicMaterial
  | CRDMetallicMaterial
  | CRDCrystalMaterial;

// Layer Specific Types
export interface CRDImageData {
  source: CRDImageSource;
  fit: 'cover' | 'contain' | 'stretch';
  position: { x: number; y: number; unit: '%' };
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
  shadow: CRDShadow;
  material: CRDMaterial;
  layout_areas: {
    image_area: { x: number; y: number; width: number; height: number };
    title_area: { x: number; y: number; width: number; height: number };
    subtitle_area?: { x: number; y: number; width: number; height: number };
    stats_area?: { x: number; y: number; width: number; height: number };
  };
}

export interface CRDTextData {
  content: string;
  font: {
    family: string;
    size: number;
    weight: number;
    style: 'normal' | 'italic';
    variant: string;
    stretch: string;
    line_height: number;
    letter_spacing: number;
    word_spacing: number;
    text_align: 'left' | 'center' | 'right' | 'justify';
    vertical_align: 'top' | 'middle' | 'bottom';
    direction: 'ltr' | 'rtl';
  };
  color: CRDColor;
  shadow: CRDShadow;
  background: {
    color: CRDColor;
    padding: number;
    border_radius: number;
  };
  effects: {
    outline: {
      width: number;
      color: CRDColor;
    };
    glow: {
      radius: number;
      color: CRDColor;
    };
  };
  transform: {
    text_case: 'uppercase' | 'lowercase' | 'capitalize' | 'normal';
    text_decoration: 'none' | 'underline' | 'overline' | 'line-through';
    white_space: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line';
    word_break: 'normal' | 'break-all' | 'keep-all' | 'break-word';
    overflow: 'visible' | 'hidden' | 'scroll' | 'auto';
  };
}

export interface CRDVideoData {
  source: {
    type: 'url' | 'asset';
    url?: string;
    asset_id?: string;
    format: string;
    size_bytes: number;
    duration: number;
    frame_rate: number;
    resolution: { width: number; height: number };
  };
  controls: boolean;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  volume: number;
  start_time: number;
  end_time: number;
  trim: {
    enabled: boolean;
    start: number;
    end: number;
  };
  effects: {
    brightness: number;
    contrast: number;
    saturation: number;
    hue_shift: number;
    blur: number;
    sharpen: number;
    grayscale: boolean;
    sepia: boolean;
    invert: boolean;
  };
}

export interface CRDStickerData {
  asset_id: string;
  category: string;
  tags: string[];
  animated: boolean;
  animation_data?: any;
}

export interface CRDPlateData {
  type: 'rectangle' | 'circle' | 'ellipse' | 'polygon' | 'path';
  fill: CRDColor;
  stroke: {
    width: number;
    color: CRDColor;
    style: 'solid' | 'dashed' | 'dotted';
    cap: 'butt' | 'round' | 'square';
    join: 'miter' | 'round' | 'bevel';
    dash_array: number[];
    dash_offset: number;
  };
  shadow: CRDShadow;
  geometry: {
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
    sides: number;
    points: { x: number; y: number }[];
    path_data: string;
  };
  interactions: {
    hover_effect: boolean;
    click_action: 'none' | 'link' | 'custom';
    link_url: string;
    custom_script: string;
  };
}

export interface CRDShapeData {
  type: 'rectangle' | 'circle' | 'ellipse' | 'polygon' | 'path';
  fill: CRDColor;
  stroke: {
    width: number;
    color: CRDColor;
    style: 'solid' | 'dashed' | 'dotted';
    cap: 'butt' | 'round' | 'square';
    join: 'miter' | 'round' | 'bevel';
    dash_array: number[];
    dash_offset: number;
  };
  shadow: CRDShadow;
  geometry: {
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
    sides: number;
    points: { x: number; y: number }[];
    path_data: string;
  };
  interactions: {
    hover_effect: boolean;
    click_action: 'none' | 'link' | 'custom';
    link_url: string;
    custom_script: string;
  };
}

export interface CRD3DModelData {
  asset_id: string;
  format: 'glb' | 'gltf' | 'obj';
  size_bytes: number;
  polygons: number;
  textures: string[];
  materials: string[];
  lighting: {
    environment: 'studio' | 'outdoor' | 'custom';
    intensity: number;
    color_temperature: number;
    shadows: boolean;
    ambient_occlusion: boolean;
  };
  animation: {
    enabled: boolean;
    autoplay: boolean;
    loop: boolean;
    timeline: any;
  };
  interactions: {
    rotation: boolean;
    zoom: boolean;
    pan: boolean;
    custom_script: string;
  };
}

export interface CRDParticleSystemData {
  emitter: {
    type: 'point' | 'line' | 'circle' | 'rectangle' | 'volume';
    position: { x: number; y: number; z: number };
    direction: { x: number; y: number; z: number };
    emission_rate: number;
    lifetime: number;
    size: number;
    color: CRDColor;
    speed: number;
    acceleration: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    shape: 'sphere' | 'cube' | 'custom';
    custom_shape_asset_id: string;
  };
  effects: {
    gravity: { x: number; y: number; z: number };
    wind: { x: number; y: number; z: number };
    turbulence: number;
    collision: boolean;
    bounce: number;
    friction: number;
  };
  rendering: {
    blend_mode: CRDBlendMode;
    depth_test: boolean;
    depth_write: boolean;
    transparency: boolean;
    lighting: boolean;
    shadows: boolean;
  };
}

export interface CRDAudioData {
  source: {
    type: 'url' | 'asset';
    url?: string;
    asset_id?: string;
    format: string;
    size_bytes: number;
    duration: number;
    sample_rate: number;
    channels: number;
  };
  controls: boolean;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  volume: number;
  start_time: number;
  end_time: number;
  trim: {
    enabled: boolean;
    start: number;
    end: number;
  };
  effects: {
    equalizer: any[];
    reverb: number;
    delay: number;
    distortion: number;
    panning: number;
  };
  spatial_audio: {
    enabled: boolean;
    position: { x: number; y: number; z: number };
    orientation: { x: number; y: number; z: number };
    distance_model: 'linear' | 'inverse' | 'exponential';
    ref_distance: number;
    max_distance: number;
    rolloff_factor: number;
  };
}

// Base layer interface
interface CRDBaseLayer {
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

// Frame Layer
export interface CRDFrameLayer extends CRDBaseLayer {
  type: 'frame';
  frame_data: CRDFrameData;
}

// Image Layer  
export interface CRDImageLayer extends CRDBaseLayer {
  type: 'image';
  image_data: CRDImageData;
}

// Text Layer
export interface CRDTextLayer extends CRDBaseLayer {
  type: 'text';
  text_data: CRDTextData;
}

// Video Layer
export interface CRDVideoLayer extends CRDBaseLayer {
  type: 'video';
  video_data: CRDVideoData;
}

// Sticker Layer
export interface CRDStickerLayer extends CRDBaseLayer {
  type: 'sticker';
  sticker_data: CRDStickerData;
}

// Plate Layer
export interface CRDPlateLayer extends CRDBaseLayer {
  type: 'plate';
  plate_data: CRDPlateData;
}

// Shape Layer
export interface CRDShapeLayer extends CRDBaseLayer {
  type: 'shape';
  shape_data: CRDShapeData;
}

// 3D Layer
export interface CRD3DLayer extends CRDBaseLayer {
  type: '3d';
  model_data: CRD3DModelData;
}

// Particle Layer
export interface CRDParticleLayer extends CRDBaseLayer {
  type: 'particle';
  particle_data: CRDParticleSystemData;
}

// Audio Layer
export interface CRDAudioLayer extends CRDBaseLayer {
  type: 'audio';
  audio_data: CRDAudioData;
}

// Union of all layer types
export type CRDLayer = 
  | CRDFrameLayer 
  | CRDImageLayer 
  | CRDTextLayer 
  | CRDVideoLayer 
  | CRDStickerLayer 
  | CRDPlateLayer 
  | CRDShapeLayer 
  | CRD3DLayer 
  | CRDParticleLayer 
  | CRDAudioLayer;

// Document Structure
export interface CRDDocument {
  version: string;
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  canvas: {
    width: number;
    height: number;
    unit: 'px' | '%' | 'in' | 'cm' | 'mm';
    dpi: number;
    color_space: 'sRGB' | 'CMYK' | 'P3';
    background: {
      type: 'solid' | 'gradient' | 'image';
      color?: CRDColor;
      gradient?: CRDGradient;
      image?: CRDImageSource;
    };
  };
  metadata: {
    category: string;
    tags: string[];
    rarity: string;
    edition: string;
    print_run: number;
    series: string;
    set: string;
    year: number;
    sport: string;
    team: string;
    player: string;
    card_number: string;
    rookie_card: boolean;
    autograph: boolean;
    memorabilia: boolean;
    graded: boolean;
    grade_company: string;
    grade_score: number;
    custom_fields: { [key: string]: any };
  };
  layers: CRDLayer[];
  global_effects: {
    lighting: {
      environment: 'studio' | 'outdoor' | 'custom';
      intensity: number;
      color_temperature: number;
      shadows: boolean;
      ambient_occlusion: boolean;
    };
    post_processing: {
      bloom: boolean;
      vignette: boolean;
      film_grain: boolean;
      color_grading: {
        enabled: boolean;
        temperature: number;
        tint: number;
        exposure: number;
        contrast: number;
        highlights: number;
        shadows: number;
        whites: number;
        blacks: number;
        saturation: number;
        vibrance: number;
      };
    };
  };
  export_settings: {
    formats: string[];
    quality: number;
    resolution: string;
    color_profile: string;
    transparency: boolean;
    metadata_embed: boolean;
  };
  version_history: any[];
  collaboration: {
    shared: boolean;
    permissions: string;
    collaborators: any[];
  };
}

export class CRDUtils {
  static createEmptyDocument(): CRDDocument {
    return {
      version: '1.0',
      id: crypto.randomUUID(),
      name: 'Untitled Card',
      description: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: {
        id: '',
        name: 'Anonymous',
        email: ''
      },
      
      canvas: {
        width: 300,
        height: 420,
        unit: 'px',
        dpi: 300,
        color_space: 'sRGB',
        background: {
          type: 'solid',
          color: { format: 'hex', value: '#ffffff' }
        }
      },
      
      metadata: {
        category: 'trading_card',
        tags: [],
        rarity: 'common',
        edition: '',
        print_run: 0,
        series: '',
        set: '',
        year: new Date().getFullYear(),
        sport: '',
        team: '',
        player: '',
        card_number: '',
        rookie_card: false,
        autograph: false,
        memorabilia: false,
        graded: false,
        grade_company: '',
        grade_score: 0,
        custom_fields: {}
      },
      
      layers: [] as CRDLayer[],
      
      global_effects: {
        lighting: {
          environment: 'studio',
          intensity: 1.0,
          color_temperature: 5500,
          shadows: true,
          ambient_occlusion: false
        },
        
        post_processing: {
          bloom: false,
          vignette: false,
          film_grain: false,
          color_grading: {
            enabled: false,
            temperature: 0,
            tint: 0,
            exposure: 0,
            contrast: 0,
            highlights: 0,
            shadows: 0,
            whites: 0,
            blacks: 0,
            saturation: 0,
            vibrance: 0
          }
        }
      },
      
      export_settings: {
        formats: ['png', 'jpg'],
        quality: 100,
        resolution: 'high',
        color_profile: 'sRGB',
        transparency: true,
        metadata_embed: true
      },
      
      version_history: [],
      collaboration: {
        shared: false,
        permissions: 'private',
        collaborators: []
      }
    };
  }

  static validateDocument(doc: CRDDocument): boolean {
    return !!(doc.version && doc.id && doc.name && doc.canvas && doc.layers);
  }

  static getLayerById(doc: CRDDocument, id: string): CRDLayer | undefined {
    return doc.layers.find(layer => layer.id === id);
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
      layers: doc.layers.map(layer => 
        layer.id === layerId ? { ...layer, ...updates } : layer
      ),
      updated_at: new Date().toISOString()
    };
  }

  static reorderLayers(doc: CRDDocument, layerIds: string[]): CRDDocument {
    const layerMap = new Map(doc.layers.map(layer => [layer.id, layer]));
    const reorderedLayers = layerIds.map(id => layerMap.get(id)).filter(Boolean) as CRDLayer[];
    
    return {
      ...doc,
      layers: reorderedLayers,
      updated_at: new Date().toISOString()
    };
  }

  static exportToJSON(doc: CRDDocument): string {
    return JSON.stringify(doc, null, 2);
  }

  static importFromJSON(json: string): CRDDocument {
    const doc = JSON.parse(json) as CRDDocument;
    if (!this.validateDocument(doc)) {
      throw new Error('Invalid CRD document format');
    }
    return doc;
  }
}

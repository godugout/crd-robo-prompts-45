
/**
 * CRD (Card Rendering Document) Specification v1.0
 * 
 * A comprehensive format for defining digital trading cards with advanced
 * visual effects, animations, and interactive elements.
 */

// === CORE TYPES ===

export interface CRDPosition {
  x: number;
  y: number;
  unit: 'px' | '%' | 'mm' | 'in';
}

export interface CRDSize {
  width: number;
  height: number;
  unit: 'px' | '%' | 'mm' | 'in';
}

export interface CRDColor {
  format: 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';
  value: string;
  opacity?: number;
}

export interface CRDTransform {
  position: CRDPosition;
  rotation: number; // degrees
  scale: {
    x: number;
    y: number;
    uniform: boolean;
  };
  skew: {
    x: number; // degrees
    y: number; // degrees
  };
}

// === DOCUMENT STRUCTURE ===

export interface CRDDocument {
  // Document metadata
  version: string;
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  
  // Canvas properties
  canvas: CRDCanvas;
  
  // Layer system
  layers: CRDLayer[];
  
  // Global settings
  metadata: CRDMetadata;
  export_settings: CRDExportSettings;
}

export interface CRDCanvas {
  // Physical dimensions
  width: number;
  height: number;
  unit: 'px' | 'mm' | 'in';
  
  // Resolution settings
  dpi: number;
  color_profile: 'sRGB' | 'Adobe RGB' | 'P3';
  
  // Background
  background: {
    type: 'solid' | 'gradient' | 'image' | 'transparent';
    color?: CRDColor;
    gradient?: CRDGradient;
    image?: CRDImageSource;
  };
  
  // Grid and guides
  grid?: {
    enabled: boolean;
    size: number;
    color: CRDColor;
    opacity: number;
  };
  
  // Bleed and safe areas for printing
  bleed?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    unit: 'px' | 'mm' | 'in';
  };
}

// === LAYER SYSTEM ===

interface CRDBaseLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  z_index: number;
  
  // Transform properties
  transform: CRDTransform;
  
  // Visual properties
  opacity: number; // 0-100
  blend_mode: CRDBlendMode;
  
  // Clipping and masking
  clip_path?: string; // SVG path or CSS clip-path
  mask?: CRDMask;
  
  // Animation
  animation?: CRDAnimation;
}

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
  text_data: CRDTextData;
}

export interface CRDVideoLayer extends CRDBaseLayer {
  type: 'video';
  video_data: CRDVideoData;
}

export interface CRDStickerLayer extends CRDBaseLayer {
  type: 'sticker';
  sticker_data: CRDStickerData;
}

export interface CRDPlateLayer extends CRDBaseLayer {
  type: 'plate';
  plate_data: CRDPlateData;
}

export interface CRDEffectLayer extends CRDBaseLayer {
  type: 'effect';
  effect_data: CRDEffectData;
}

export interface CRDGroupLayer extends CRDBaseLayer {
  type: 'group';
  children: CRDLayer[];
}

export type CRDLayer = 
  | CRDFrameLayer 
  | CRDImageLayer 
  | CRDTextLayer 
  | CRDVideoLayer 
  | CRDStickerLayer 
  | CRDPlateLayer 
  | CRDEffectLayer 
  | CRDGroupLayer;

// === FRAME DATA ===

export interface CRDFrameData {
  template_id: string;
  style: 'modern' | 'vintage' | 'sports' | 'fantasy' | 'futuristic' | 'artistic' | 'minimal';
  
  // Border properties
  border: {
    width: number;
    style: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge';
    color: CRDColor;
    gradient?: CRDGradient;
    radius: number;
  };
  
  corner_radius: number;
  
  // Shadow and glow
  shadow?: CRDShadow;
  glow?: CRDGlow;
  
  // Material properties
  material: CRDMaterial;
  
  // Layout areas for content
  layout_areas: {
    image_area: CRDLayoutArea;
    title_area: CRDLayoutArea;
    subtitle_area?: CRDLayoutArea;
    stats_area?: CRDLayoutArea;
    description_area?: CRDLayoutArea;
  };
}

export interface CRDLayoutArea {
  x: number;
  y: number;
  width: number;
  height: number;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// === IMAGE DATA ===

export interface CRDImageData {
  source: CRDImageSource;
  fit: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  position: CRDPosition;
  
  // Image processing
  filters: CRDImageFilters;
  adjustments: CRDImageAdjustments;
  crop: CRDCrop;
  
  // Focus point for smart cropping
  focus_point: {
    x: number; // 0-1
    y: number; // 0-1
  };
}

export interface CRDImageSource {
  type: 'url' | 'base64' | 'file';
  url?: string;
  data?: string;
  width: number;
  height: number;
  format: 'jpg' | 'png' | 'webp' | 'gif' | 'svg';
  size_bytes: number;
}

export interface CRDImageFilters {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  hue_shift: number; // -180 to 180
  blur: number; // 0 to 10
  sharpen: number; // 0 to 10
  noise: number; // 0 to 100
  vignette: number; // 0 to 100
}

export interface CRDImageAdjustments {
  exposure: number; // -2 to 2
  highlights: number; // -100 to 100
  shadows: number; // -100 to 100
  whites: number; // -100 to 100
  blacks: number; // -100 to 100
  clarity: number; // -100 to 100
  vibrance: number; // -100 to 100
  temperature: number; // 2000 to 10000K
  tint: number; // -100 to 100
}

export interface CRDCrop {
  enabled: boolean;
  x: number; // 0-1
  y: number; // 0-1
  width: number; // 0-1
  height: number; // 0-1
}

// === TEXT DATA ===

export interface CRDTextData {
  content: string;
  font: CRDFont;
  alignment: 'left' | 'center' | 'right' | 'justify';
  vertical_alignment: 'top' | 'middle' | 'bottom';
  
  // Text styling
  color: CRDColor;
  stroke?: CRDStroke;
  shadow?: CRDShadow;
  glow?: CRDGlow;
  
  // Text effects
  gradient?: CRDGradient;
  pattern?: CRDPattern;
  
  // Layout
  line_height: number;
  letter_spacing: number;
  word_spacing: number;
  
  // Advanced typography
  kerning?: boolean;
  ligatures?: boolean;
  small_caps?: boolean;
}

export interface CRDFont {
  family: string;
  size: number;
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  style: 'normal' | 'italic' | 'oblique';
  variant: 'normal' | 'small-caps';
  stretch: 'normal' | 'condensed' | 'expanded';
}

// === VIDEO DATA ===

export interface CRDVideoData {
  source: CRDVideoSource;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  controls: boolean;
  
  // Video processing
  filters: CRDImageFilters; // Same as image filters
  crop: CRDCrop;
  
  // Playback settings
  start_time?: number; // seconds
  end_time?: number; // seconds
  playback_rate: number; // 0.25 to 4.0
}

export interface CRDVideoSource {
  type: 'url' | 'file';
  url?: string;
  width: number;
  height: number;
  duration: number; // seconds
  format: 'mp4' | 'webm' | 'ogg';
  size_bytes: number;
}

// === STICKER DATA ===

export interface CRDStickerData {
  sticker_id: string;
  category: 'emoji' | 'badge' | 'decoration' | 'icon' | 'custom';
  source: CRDImageSource;
  
  // Interactive properties
  interactive: boolean;
  hover_effect?: CRDHoverEffect;
  click_action?: CRDClickAction;
}

// === PLATE DATA ===

export interface CRDPlateData {
  plate_type: 'nameplate' | 'stats' | 'info' | 'custom';
  background: CRDColor | CRDGradient;
  border?: {
    width: number;
    color: CRDColor;
    style: 'solid' | 'dashed' | 'dotted';
  };
  corner_radius: number;
  
  // Content
  content: {
    text?: CRDTextData;
    icon?: CRDImageSource;
  };
}

// === MATERIALS AND EFFECTS ===

export interface CRDMaterial {
  type: 'standard' | 'holographic' | 'metallic' | 'crystal' | 'fabric' | 'paper' | 'plastic';
  
  // Base material properties
  albedo: CRDColor;
  metalness: number; // 0-1
  roughness: number; // 0-1
  
  // Advanced material properties
  holographic?: CRDHolographicMaterial;
  metallic?: CRDMetallicMaterial;
  crystal?: CRDCrystalMaterial;
  fabric?: CRDFabricMaterial;
  
  // Texture maps
  normal_map?: CRDImageSource;
  bump_map?: CRDImageSource;
  displacement_map?: CRDImageSource;
  
  // Environmental interaction
  reflectance: number; // 0-1
  transmission: number; // 0-1 for transparent materials
}

export interface CRDHolographicMaterial {
  intensity: number; // 0-1
  color_shift: number; // 0-360 degrees
  pattern: 'rainbow' | 'radial' | 'linear' | 'diamond' | 'custom';
  animation_speed: number; // 0-2
}

export interface CRDMetallicMaterial {
  reflection_intensity: number; // 0-1
  tint: CRDColor;
  polish: number; // 0-1, affects roughness variation
  oxidation?: number; // 0-1 for weathered effects
}

export interface CRDCrystalMaterial {
  transparency: number; // 0-1
  refraction_index: number; // 1.0-2.4
  internal_reflections: boolean;
  facet_count?: number;
  dispersion?: number; // 0-1 for rainbow effects
}

export interface CRDFabricMaterial {
  weave_pattern: 'plain' | 'twill' | 'satin' | 'canvas';
  thread_density: number;
  surface_fuzz: number; // 0-1
}

// === LIGHTING ===

export interface CRDLighting {
  environment: CRDEnvironment;
  lights: CRDLight[];
  ambient_light: {
    color: CRDColor;
    intensity: number; // 0-1
  };
  
  // Global lighting settings
  exposure: number; // -5 to 5
  gamma: number; // 0.1 to 3.0
  tone_mapping: 'linear' | 'reinhard' | 'filmic' | 'aces';
}

export interface CRDEnvironment {
  type: 'studio' | 'outdoor' | 'indoor' | 'abstract' | 'custom';
  hdri_map?: CRDImageSource;
  background_blur: number; // 0-1
  intensity: number; // 0-2
  rotation: number; // 0-360 degrees
}

export interface CRDLight {
  id: string;
  type: 'directional' | 'point' | 'spot' | 'area';
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  color: CRDColor;
  intensity: number; // 0-10
  
  // Shadow properties
  cast_shadows: boolean;
  shadow_softness: number; // 0-1
  shadow_bias: number;
}

// === VISUAL EFFECTS ===

export interface CRDEffectData {
  effect_type: 'particle' | 'distortion' | 'color_grade' | 'composite';
  
  // Particle effects
  particle?: CRDParticleEffect;
  
  // Distortion effects
  distortion?: CRDDistortionEffect;
  
  // Color grading
  color_grade?: CRDColorGrade;
  
  // Composite effects
  composite?: CRDCompositeEffect;
}

export interface CRDParticleEffect {
  particle_type: 'sparkle' | 'dust' | 'energy' | 'fire' | 'smoke' | 'magic';
  count: number;
  size_range: [number, number];
  velocity: {
    x: [number, number];
    y: [number, number];
    z: [number, number];
  };
  lifetime: number; // seconds
  color_over_lifetime: CRDColor[];
  opacity_over_lifetime: number[];
}

export interface CRDGradient {
  type: 'linear' | 'radial' | 'conic';
  angle?: number; // for linear
  center?: CRDPosition; // for radial/conic
  stops: CRDGradientStop[];
}

export interface CRDGradientStop {
  position: number; // 0-1
  color: CRDColor;
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

export interface CRDGlow {
  enabled: boolean;
  color: CRDColor;
  intensity: number; // 0-1
  size: number;
  softness: number; // 0-1
}

export interface CRDStroke {
  width: number;
  color: CRDColor;
  position: 'inside' | 'center' | 'outside';
  dash_pattern?: number[];
}

export interface CRDPattern {
  type: 'dots' | 'stripes' | 'checkerboard' | 'custom';
  colors: CRDColor[];
  scale: number;
  rotation: number;
}

// === ANIMATION ===

export interface CRDAnimation {
  name: string;
  duration: number; // seconds
  timing_function: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'cubic-bezier';
  delay?: number; // seconds
  iteration_count: number | 'infinite';
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fill_mode: 'none' | 'forwards' | 'backwards' | 'both';
  
  keyframes: CRDKeyframe[];
}

export interface CRDKeyframe {
  time: number; // 0-1
  properties: {
    transform?: Partial<CRDTransform>;
    opacity?: number;
    color?: CRDColor;
    [key: string]: any;
  };
  
  // Easing for this specific keyframe
  easing?: string;
}

// === INTERACTIVITY ===

export interface CRDHoverEffect {
  type: 'scale' | 'rotate' | 'glow' | 'color_change' | 'custom';
  parameters: Record<string, any>;
  duration: number; // milliseconds
}

export interface CRDClickAction {
  type: 'link' | 'popup' | 'animation' | 'sound' | 'custom';
  target?: string;
  parameters: Record<string, any>;
}

// === ADVANCED FEATURES ===

export interface CRDMask {
  type: 'alpha' | 'luminance' | 'shape';
  source: CRDImageSource | string; // image or SVG path
  invert: boolean;
  feather: number; // 0-100
}

export interface CRDDistortionEffect {
  type: 'wave' | 'twist' | 'bulge' | 'pinch';
  intensity: number; // 0-1
  frequency?: number; // for wave
  center?: CRDPosition; // for radial distortions
}

export interface CRDColorGrade {
  shadows: CRDColor;
  midtones: CRDColor;
  highlights: CRDColor;
  
  // Color wheels
  lift: CRDColor; // shadows
  gamma: CRDColor; // midtones
  gain: CRDColor; // highlights
  
  // Global adjustments
  saturation: number; // 0-2
  contrast: number; // 0-2
  brightness: number; // -1 to 1
}

export interface CRDCompositeEffect {
  blend_mode: CRDBlendMode;
  source_layer: string; // layer ID
  mask?: CRDMask;
}

export type CRDBlendMode = 
  | 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light'
  | 'color-dodge' | 'color-burn' | 'darken' | 'lighten' | 'difference'
  | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';

// === METADATA ===

export interface CRDMetadata {
  // Card information
  title?: string;
  subtitle?: string;
  description?: string;
  category: string;
  tags: string[];
  
  // Rarity and stats
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  stats?: Record<string, number>;
  
  // Creator information
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
  
  // Technical metadata
  created_with: {
    application: string;
    version: string;
  };
  
  // Copyright and licensing
  copyright?: string;
  license?: string;
  
  // Performance hints
  complexity_score: number; // 1-10
  render_priority: 'low' | 'normal' | 'high';
}

// === EXPORT SETTINGS ===

export interface CRDExportSettings {
  // Image export
  image: {
    formats: ('png' | 'jpg' | 'webp' | 'svg')[];
    quality: number; // 0-100 for lossy formats
    resolution: {
      width: number;
      height: number;
      dpi: number;
    };
    
    // Advanced options
    transparent_background: boolean;
    include_bleed: boolean;
    color_profile: 'sRGB' | 'Adobe RGB' | 'P3';
  };
  
  // Video export (for animated cards)
  video?: {
    format: 'mp4' | 'webm' | 'gif';
    quality: number; // 0-100
    fps: number;
    duration?: number; // seconds, null for full animation
    loop: boolean;
  };
  
  // 3D export
  model_3d?: {
    format: 'gltf' | 'obj' | 'fbx';
    include_textures: boolean;
    include_animations: boolean;
    quality: 'low' | 'medium' | 'high';
  };
  
  // Print settings
  print?: {
    paper_size: 'poker' | 'bridge' | 'tarot' | 'custom';
    bleed: number; // mm
    cut_marks: boolean;
    color_bars: boolean;
  };
}

// === UTILITY FUNCTIONS ===

export class CRDUtils {
  static createEmptyDocument(): CRDDocument {
    return {
      version: '1.0',
      id: crypto.randomUUID(),
      name: 'Untitled Card',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      
      canvas: {
        width: 300,
        height: 420,
        unit: 'px',
        dpi: 300,
        color_profile: 'sRGB',
        background: {
          type: 'solid',
          color: { format: 'hex', value: '#ffffff' }
        }
      },
      
      layers: [],
      
      metadata: {
        category: 'custom',
        tags: [],
        rarity: 'common',
        creator: {
          id: 'unknown',
          name: 'Unknown'
        },
        created_with: {
          application: 'Cardshow',
          version: '1.0'
        },
        complexity_score: 1,
        render_priority: 'normal'
      },
      
      export_settings: {
        image: {
          formats: ['png', 'jpg'],
          quality: 95,
          resolution: {
            width: 300,
            height: 420,
            dpi: 300
          },
          transparent_background: false,
          include_bleed: false,
          color_profile: 'sRGB'
        }
      }
    };
  }
  
  static validateDocument(doc: CRDDocument): boolean {
    // Basic validation logic
    return !!(doc.version && doc.id && doc.canvas && doc.layers && doc.metadata);
  }
  
  static getLayerById(doc: CRDDocument, layerId: string): CRDLayer | null {
    const findLayer = (layers: CRDLayer[]): CRDLayer | null => {
      for (const layer of layers) {
        if (layer.id === layerId) return layer;
        if (layer.type === 'group') {
          const found = findLayer(layer.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findLayer(doc.layers);
  }
  
  static addLayer(doc: CRDDocument, layer: CRDLayer): CRDDocument {
    return {
      ...doc,
      layers: [...doc.layers, layer],
      updated_at: new Date().toISOString()
    };
  }
  
  static removeLayer(doc: CRDDocument, layerId: string): CRDDocument {
    const removeFromLayers = (layers: CRDLayer[]): CRDLayer[] => {
      return layers.filter(layer => {
        if (layer.id === layerId) return false;
        if (layer.type === 'group') {
          layer.children = removeFromLayers(layer.children);
        }
        return true;
      });
    };
    
    return {
      ...doc,
      layers: removeFromLayers(doc.layers),
      updated_at: new Date().toISOString()
    };
  }
  
  static updateLayer(doc: CRDDocument, layerId: string, updates: Partial<CRDLayer>): CRDDocument {
    const updateInLayers = (layers: CRDLayer[]): CRDLayer[] => {
      return layers.map(layer => {
        if (layer.id === layerId) {
          return { ...layer, ...updates };
        }
        if (layer.type === 'group') {
          return {
            ...layer,
            children: updateInLayers(layer.children)
          };
        }
        return layer;
      });
    };
    
    return {
      ...doc,
      layers: updateInLayers(doc.layers),
      updated_at: new Date().toISOString()
    };
  }
}

export default CRDUtils;

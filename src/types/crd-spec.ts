export interface CRDDocument {
  version: string;
  name: string;
  description?: string;
  author?: string;
  created_at?: string;
  updated_at?: string;
  thumbnail?: string;
  metadata: CRDMetadata;
  settings: CRDSettings;
  variables: CRDVariable[];
  components: CRDComponent[];
  interactions: CRDInteraction[];
  layers: CRDLayer[];
}

export interface CRDMetadata {
  category: string;
  tags: string[];
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  [key: string]: any;
}

export interface CRDSettings {
  width: number;
  height: number;
  resolution: number;
  background_color: string;
  frame_rate: number;
  loop: boolean;
  export_options: CRDExportOptions;
}

export interface CRDExportOptions {
  format: 'png' | 'jpeg' | 'webp' | 'gif' | 'mp4';
  quality: number;
  compression: number;
  [key: string]: any;
}

export interface CRDVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'color';
  default_value: any;
  options?: any[];
  [key: string]: any;
}

export interface CRDComponent {
  id: string;
  name: string;
  type: string;
  [key: string]: any;
}

export interface CRDInteraction {
  id: string;
  name: string;
  type: string;
  triggers: CRDTrigger[];
  actions: CRDAction[];
  [key: string]: any;
}

export interface CRDTrigger {
  type: string;
  [key: string]: any;
}

export interface CRDAction {
  type: string;
  [key: string]: any;
}

export interface CRDTransform {
  position: CRDPosition;
  rotation: number;
  scale: CRDScale;
  skew: CRDSkew;
}

export interface CRDPosition {
  x: number;
  y: number;
  unit: 'px' | '%';
}

export interface CRDScale {
  x: number;
  y: number;
  uniform: boolean;
}

export interface CRDSkew {
  x: number;
  y: number;
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

export interface CRDMask {
  type: 'vector' | 'image' | 'text';
  [key: string]: any;
}

export interface CRDAnimation {
  type: 'timeline' | 'state' | 'script';
  [key: string]: any;
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

// Frame layer
export interface CRDFrameLayer extends CRDBaseLayer {
  type: 'frame';
  frame_data: CRDFrameData;
}

export interface CRDFrameData {
  template_id: string;
  style: string;
  border: CRDBorder;
  corner_radius: number;
  shadow: CRDShadow;
  material: CRDMaterial;
  layout_areas: CRDLayoutAreas;
}

export interface CRDBorder {
  width: number;
  style: 'solid' | 'dashed' | 'dotted';
  color: CRDColor;
  gradient?: CRGradient;
  radius: number;
}

export interface CRDColor {
  format: 'hex' | 'rgb' | 'hsl';
  value: string;
  opacity?: number;
}

export interface CRGradient {
  type: 'linear' | 'radial';
  angle?: number;
  stops: CRGradientStop[];
}

export interface CRGradientStop {
  offset: number;
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

export interface CRDMaterial {
  type: 'standard' | 'holographic' | 'metallic' | 'crystal';
  albedo: CRDColor;
  metalness: number;
  roughness: number;
  holographic?: CRDHolographicMaterial;
  metallic?: CRDMetallicMaterial;
  crystal?: CRDCrystalMaterial;
}

export interface CRDHolographicMaterial {
  intensity: number;
  color_shift: number;
  pattern: 'rainbow' | 'interference';
  animation_speed: number;
}

export interface CRDMetallicMaterial {
  reflection_intensity: number;
  tint: CRDColor;
  polish: number;
}

export interface CRDCrystalMaterial {
  transparency: number;
  refraction_index: number;
  internal_reflections: boolean;
}

export interface CRDLayoutAreas {
  image_area: CRDArea;
  title_area: CRDArea;
  subtitle_area?: CRDArea;
  stats_area?: CRDArea;
}

export interface CRDArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Image layer
export interface CRDImageLayer extends CRDBaseLayer {
  type: 'image';
  image_data: CRDImageData;
}

export interface CRDImageData {
  source: CRDImageSource;
  fit: 'cover' | 'contain' | 'fill' | 'fitWidth' | 'fitHeight';
  position: CRDPosition;
  filters: CRDFilters;
  adjustments: CRDAdjustments;
  crop: CRDCrop;
  focus_point: CRDFocusPoint;
}

export interface CRDImageSource {
  type: 'url' | 'upload' | 'nft';
  url?: string;
  upload_id?: string;
  nft_contract?: string;
  nft_token_id?: string;
  width: number;
  height: number;
  format: string;
  size_bytes: number;
}

export interface CRDFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  hue_shift: number;
  blur: number;
  sharpen: number;
  noise: number;
  vignette: number;
}

export interface CRDAdjustments {
  exposure: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  clarity: number;
  vibrance: number;
  temperature: number;
  tint: number;
}

export interface CRDCrop {
  enabled: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CRDFocusPoint {
  x: number;
  y: number;
}

// Text layer
export interface CRDTextLayer extends CRDBaseLayer {
  type: 'text';
  text_data: CRDTextData;
}

export interface CRDTextData {
  content: string;
  font: CRDFont;
  style: CRDTextStyle;
  alignment: CRDTextAlignment;
  effects: CRDTextEffects;
  animation?: CRDTextAnimation;
}

export interface CRDFont {
  family: string;
  size: number;
  weight: number;
  variant: string;
  source: 'google' | 'adobe' | 'custom';
  url?: string;
}

export interface CRDTextStyle {
  color: CRDColor;
  opacity: number;
  letter_spacing: number;
  line_height: number;
  word_spacing: number;
  direction: 'ltr' | 'rtl';
}

export interface CRDTextAlignment {
  horizontal: 'left' | 'center' | 'right' | 'justify';
  vertical: 'top' | 'center' | 'bottom';
  wrap: boolean;
}

export interface CRDTextEffects {
  shadow: CRDShadow;
  outline: CRDOutline;
  background: CRDColor;
  gradient?: CRGradient;
}

export interface CRDOutline {
  width: number;
  color: CRDColor;
}

export interface CRDTextAnimation {
  type: 'typewriter' | 'fade' | 'slide';
  [key: string]: any;
}

// Video layer
export interface CRDVideoLayer extends CRDBaseLayer {
  type: 'video';
  video_data: CRDVideoData;
}

export interface CRDVideoData {
  source: CRDVideoSource;
  controls: boolean;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  start_time: number;
  end_time: number;
  effects: CRDVideoEffects;
}

export interface CRDVideoSource {
  type: 'url' | 'upload';
  url?: string;
  upload_id?: string;
  format: string;
  size_bytes: number;
  duration: number;
  thumbnail?: string;
}

export interface CRDVideoEffects {
  brightness: number;
  contrast: number;
  saturation: number;
  hue_shift: number;
  blur: number;
}

// Sticker layer
export interface CRDStickerLayer extends CRDBaseLayer {
  type: 'sticker';
  sticker_data: CRDStickerData;
}

export interface CRDStickerData {
  source: CRDStickerSource;
  animation?: CRDStickerAnimation;
}

export interface CRDStickerSource {
  type: 'url' | 'upload' | 'lottie';
  url?: string;
  upload_id?: string;
  lottie_data?: any;
  format: string;
  size_bytes: number;
}

export interface CRDStickerAnimation {
  type: 'loop' | 'playOnce' | 'custom';
  [key: string]: any;
}

// Plate layer
export interface CRDPlateLayer extends CRDBaseLayer {
  type: 'plate';
  plate_data: CRDPlateData;
}

export interface CRDPlateData {
  style: 'rect' | 'circle' | 'custom';
  background: CRDColor;
  border: CRDBorder;
  shadow: CRDShadow;
  gradient?: CRGradient;
  corner_radius: number;
}

// Element layer
export interface CRDElementLayer extends CRDBaseLayer {
  type: 'element';
  element_data: CRDElementData;
}

export interface CRDElementData {
  element_type: 'button' | 'input' | 'textarea' | 'select';
  style: any;
  [key: string]: any;
}

// Effect layer
export interface CRDEffectLayer extends CRDBaseLayer {
  type: 'effect';
  effect_data: CRDEffectData;
}

export interface CRDEffectData {
  effect_type: 'blur' | 'noise' | 'vignette' | 'colorOverlay';
  [key: string]: any;
}

// Group layer
export interface CRDGroupLayer extends CRDBaseLayer {
  type: 'group';
  group_data: CRDGroupData;
}

export interface CRDGroupData {
  members: string[]; // Array of layer IDs
}

// NFT layer
export interface CRDNFTLayer extends CRDBaseLayer {
  type: 'nft';
  nft_data: CRDNFTData;
}

export interface CRDNFTData {
  contract_address: string;
  token_id: string;
  chain: 'ethereum' | 'polygon' | 'solana';
  metadata?: any;
}

// Blockchain layer
export interface CRDBlockchainLayer extends CRDBaseLayer {
  type: 'blockchain';
  blockchain_data: CRDBlockchainData;
}

export interface CRDBlockchainData {
  transaction_hash: string;
  chain: 'ethereum' | 'polygon' | 'solana';
  metadata?: any;
}

// AR layer
export interface CRDARLayer extends CRDBaseLayer {
  type: 'ar';
  ar_data: CRDARData;
}

export interface CRDARData {
  model_url: string;
  interaction_type: 'tap' | 'hover';
  [key: string]: any;
}

// Interaction layer
export interface CRDInteractionLayer extends CRDBaseLayer {
  type: 'interaction';
  interaction_data: CRDInteractionData;
}

export interface CRDInteractionData {
  trigger: CRDTrigger;
  actions: CRDAction[];
}

// Union type for all layers
export type CRDLayer = CRDFrameLayer | CRDImageLayer | CRDTextLayer | CRDVideoLayer | CRDStickerLayer | CRDPlateLayer | CRDElementLayer | CRDEffectLayer | CRDGroupLayer | CRDNFTLayer | CRDBlockchainLayer | CRDARLayer | CRDInteractionLayer;

export class CRDUtils {
  static createEmptyDocument(): CRDDocument {
    return {
      version: '1.0',
      name: 'New Card',
      metadata: {
        category: 'template',
        tags: [],
        rarity: 'common'
      },
      settings: {
        width: 300,
        height: 420,
        resolution: 1,
        background_color: '#ffffff',
        frame_rate: 30,
        loop: false,
        export_options: {
          format: 'png',
          quality: 0.9,
          compression: 0.8
        }
      },
      variables: [],
      components: [],
      interactions: [],
      layers: [] as CRDLayer[]
    };
  }
}

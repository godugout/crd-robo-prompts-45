
export interface TemplateLayer {
  id: string;
  name: string;
  type: 'image' | 'frame' | 'stickers' | 'effects';
  visible: boolean;
  opacity: number;
  zIndex: number;
}

export interface FrameLayer extends TemplateLayer {
  type: 'frame';
  cutoutArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  textAreas: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    size: 'small' | 'medium' | 'large';
    position: 'stacked' | 'side-by-side';
    alignment: 'left' | 'center' | 'right';
  }>;
  border: {
    thickness: number;
    color: string;
    padding: number;
  };
}

export interface StickerLayer extends TemplateLayer {
  type: 'stickers';
  availableStickers: Array<{
    id: string;
    name: string;
    type: 'nameplate' | 'rookie-trophy' | 'crd-logo' | 'custom-logo' | 'border' | 'skin';
    position: { x: number; y: number };
    size: { width: number; height: number };
    presetGroup?: string;
  }>;
}

export interface EffectsLayer extends TemplateLayer {
  type: 'effects';
  availableEffects: Array<{
    id: string;
    name: string;
    type: 'hologram' | 'ice' | 'starlight' | 'prism' | 'chrome' | 'matte' | 'glossy';
    intensity: number;
    coverage: 'full' | 'partial' | 'edges';
  }>;
}

export interface LayeredTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  layers: {
    image: TemplateLayer;
    frame: FrameLayer;
    stickers: StickerLayer;
    effects: EffectsLayer;
  };
}

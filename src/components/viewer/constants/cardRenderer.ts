
// Card rendering constants and configurations
export const CARD_CONSTANTS = {
  // Standard trading card dimensions (aspect ratio 2.5:3.5)
  ASPECT_RATIO: 3.5 / 2.5,
  DEFAULT_WIDTH: 2.5,
  DEFAULT_HEIGHT: 3.5,
  THICKNESS: 0.05,
  
  // Layer offsets for effects
  EFFECT_LAYER_OFFSET: 0.001,
  FRAME_LAYER_OFFSET_MULTIPLIER: 1.05,
  
  // Performance settings
  MIN_CARD_SIZE: {
    WIDTH: 2,
    HEIGHT: 2.8
  },
  
  // Viewport constraints
  VIEWPORT_CONSTRAINTS: {
    MAX_WIDTH_PERCENT: 0.6,
    MAX_HEIGHT_PERCENT: 0.7
  }
};

export const MATERIAL_SETTINGS = {
  HOLOGRAPHIC: {
    BASE_METALNESS: 0.9,
    BASE_ROUGHNESS: 0.05,
    BASE_TRANSMISSION: 0.1,
    BASE_CLEARCOAT: 1.0,
    BASE_REFLECTIVITY: 1.0,
    ENV_MAP_INTENSITY: 2.0
  },
  
  CHROME: {
    BASE_METALNESS: 1.0,
    BASE_ROUGHNESS: 0.02,
    BASE_CLEARCOAT: 1.0,
    BASE_REFLECTIVITY: 1.0,
    ENV_MAP_INTENSITY: 3.0,
    COLOR: [0.8, 0.8, 0.9] as const
  },
  
  GOLD: {
    BASE_METALNESS: 1.0,
    BASE_ROUGHNESS: 0.1,
    BASE_CLEARCOAT: 0.8,
    BASE_REFLECTIVITY: 0.9,
    ENV_MAP_INTENSITY: 2.5,
    COLOR: [1.0, 0.84, 0.0] as const
  },
  
  CRYSTAL: {
    BASE_METALNESS: 0.0,
    BASE_ROUGHNESS: 0.0,
    BASE_TRANSMISSION: 0.3,
    BASE_CLEARCOAT: 1.0,
    BASE_REFLECTIVITY: 1.0,
    ENV_MAP_INTENSITY: 2.0,
    COLOR: [0.95, 0.95, 1.0] as const
  }
};

export const EDGE_COLOR = "#ffffff";
export const CARD_BACK_TEXTURE_URL = '/lovable-uploads/b3f6335f-9e0a-4a64-a665-15d04f456d50.png';
export const FALLBACK_FRONT_TEXTURE_URL = '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png';

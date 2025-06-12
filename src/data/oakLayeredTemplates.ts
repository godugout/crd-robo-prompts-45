
import { LayeredTemplate } from '@/types/layeredTemplate';

export const OAK_LAYERED_TEMPLATES: LayeredTemplate[] = [
  {
    id: 'oak-classic-nostalgia',
    name: 'Classic Nostalgia',
    category: 'nostalgia',
    thumbnail: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png',
    layers: {
      image: {
        id: 'background-image',
        name: 'Background Image',
        type: 'image',
        visible: true,
        opacity: 100,
        zIndex: 1
      },
      frame: {
        id: 'classic-frame',
        name: 'Classic Oakland Frame',
        type: 'frame',
        visible: true,
        opacity: 100,
        zIndex: 2,
        cutoutArea: { x: 15, y: 20, width: 70, height: 60 },
        textAreas: [
          {
            id: 'title-area',
            x: 10, y: 5, width: 80, height: 10,
            size: 'large',
            position: 'stacked',
            alignment: 'center'
          },
          {
            id: 'subtitle-area',
            x: 10, y: 85, width: 80, height: 8,
            size: 'medium',
            position: 'stacked',
            alignment: 'center'
          }
        ],
        border: { thickness: 3, color: '#ffd700', padding: 8 }
      },
      stickers: {
        id: 'classic-stickers',
        name: 'Classic Stickers',
        type: 'stickers',
        visible: true,
        opacity: 100,
        zIndex: 3,
        availableStickers: [
          {
            id: 'crd-logo',
            name: 'CRD Logo',
            type: 'crd-logo',
            position: { x: 5, y: 5 },
            size: { width: 15, height: 8 }
          },
          {
            id: 'oakland-nameplate',
            name: 'Oakland Nameplate',
            type: 'nameplate',
            position: { x: 10, y: 82 },
            size: { width: 80, height: 12 }
          }
        ]
      },
      effects: {
        id: 'vintage-effects',
        name: 'Vintage Effects',
        type: 'effects',
        visible: true,
        opacity: 80,
        zIndex: 4,
        availableEffects: [
          {
            id: 'vintage-filter',
            name: 'Vintage Filter',
            type: 'matte',
            intensity: 60,
            coverage: 'full'
          },
          {
            id: 'edge-glow',
            name: 'Golden Edge Glow',
            type: 'starlight',
            intensity: 40,
            coverage: 'edges'
          }
        ]
      }
    }
  },
  {
    id: 'oak-championship-celebration',
    name: 'Championship Celebration',
    category: 'celebration',
    thumbnail: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png',
    layers: {
      image: {
        id: 'background-image',
        name: 'Background Image',
        type: 'image',
        visible: true,
        opacity: 100,
        zIndex: 1
      },
      frame: {
        id: 'championship-frame',
        name: 'Championship Frame',
        type: 'frame',
        visible: true,
        opacity: 100,
        zIndex: 2,
        cutoutArea: { x: 20, y: 15, width: 60, height: 70 },
        textAreas: [
          {
            id: 'champion-title',
            x: 5, y: 5, width: 40, height: 8,
            size: 'large',
            position: 'stacked',
            alignment: 'left'
          },
          {
            id: 'year-label',
            x: 50, y: 5, width: 45, height: 6,
            size: 'small',
            position: 'side-by-side',
            alignment: 'right'
          }
        ],
        border: { thickness: 4, color: '#ffd700', padding: 12 }
      },
      stickers: {
        id: 'championship-stickers',
        name: 'Championship Stickers',
        type: 'stickers',
        visible: true,
        opacity: 100,
        zIndex: 3,
        availableStickers: [
          {
            id: 'trophy-icon',
            name: 'Championship Trophy',
            type: 'rookie-trophy',
            position: { x: 85, y: 10 },
            size: { width: 12, height: 15 }
          },
          {
            id: 'victory-border',
            name: 'Victory Border',
            type: 'border',
            position: { x: 0, y: 0 },
            size: { width: 100, height: 100 },
            presetGroup: 'championship-skin'
          }
        ]
      },
      effects: {
        id: 'celebration-effects',
        name: 'Celebration Effects',
        type: 'effects',
        visible: true,
        opacity: 90,
        zIndex: 4,
        availableEffects: [
          {
            id: 'golden-hologram',
            name: 'Golden Hologram',
            type: 'hologram',
            intensity: 75,
            coverage: 'partial'
          },
          {
            id: 'starlight-sparkle',
            name: 'Starlight Sparkle',
            type: 'starlight',
            intensity: 85,
            coverage: 'full'
          }
        ]
      }
    }
  },
  {
    id: 'oak-protest-spirit',
    name: 'Protest Spirit',
    category: 'protest',
    thumbnail: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png',
    layers: {
      image: {
        id: 'background-image',
        name: 'Background Image',
        type: 'image',
        visible: true,
        opacity: 100,
        zIndex: 1
      },
      frame: {
        id: 'protest-frame',
        name: 'Protest Frame',
        type: 'frame',
        visible: true,
        opacity: 100,
        zIndex: 2,
        cutoutArea: { x: 10, y: 25, width: 80, height: 50 },
        textAreas: [
          {
            id: 'movement-title',
            x: 10, y: 5, width: 80, height: 12,
            size: 'large',
            position: 'stacked',
            alignment: 'center'
          },
          {
            id: 'protest-year',
            x: 10, y: 80, width: 80, height: 6,
            size: 'small',
            position: 'stacked',
            alignment: 'center'
          }
        ],
        border: { thickness: 2, color: '#0f4c3a', padding: 6 }
      },
      stickers: {
        id: 'protest-stickers',
        name: 'Protest Stickers',
        type: 'stickers',
        visible: true,
        opacity: 100,
        zIndex: 3,
        availableStickers: [
          {
            id: 'solidarity-badge',
            name: 'Solidarity Badge',
            type: 'custom-logo',
            position: { x: 80, y: 80 },
            size: { width: 18, height: 18 }
          },
          {
            id: 'movement-nameplate',
            name: 'Movement Nameplate',
            type: 'nameplate',
            position: { x: 5, y: 90 },
            size: { width: 70, height: 8 }
          }
        ]
      },
      effects: {
        id: 'protest-effects',
        name: 'Protest Effects',
        type: 'effects',
        visible: true,
        opacity: 70,
        zIndex: 4,
        availableEffects: [
          {
            id: 'raw-matte',
            name: 'Raw Matte Finish',
            type: 'matte',
            intensity: 80,
            coverage: 'full'
          },
          {
            id: 'solidarity-glow',
            name: 'Solidarity Glow',
            type: 'ice',
            intensity: 50,
            coverage: 'edges'
          }
        ]
      }
    }
  },
  {
    id: 'oak-community-pride',
    name: 'Community Pride',
    category: 'community',
    thumbnail: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png',
    layers: {
      image: {
        id: 'background-image',
        name: 'Background Image',
        type: 'image',
        visible: true,
        opacity: 100,
        zIndex: 1
      },
      frame: {
        id: 'community-frame',
        name: 'Community Frame',
        type: 'frame',
        visible: true,
        opacity: 100,
        zIndex: 2,
        cutoutArea: { x: 12, y: 18, width: 76, height: 65 },
        textAreas: [
          {
            id: 'community-name',
            x: 8, y: 8, width: 60, height: 8,
            size: 'medium',
            position: 'side-by-side',
            alignment: 'left'
          },
          {
            id: 'pride-year',
            x: 70, y: 8, width: 25, height: 6,
            size: 'small',
            position: 'side-by-side',
            alignment: 'right'
          }
        ],
        border: { thickness: 3, color: '#ffd700', padding: 10 }
      },
      stickers: {
        id: 'community-stickers',
        name: 'Community Stickers',
        type: 'stickers',
        visible: true,
        opacity: 100,
        zIndex: 3,
        availableStickers: [
          {
            id: 'oakland-heart',
            name: 'Oakland Heart',
            type: 'custom-logo',
            position: { x: 5, y: 85 },
            size: { width: 12, height: 12 }
          },
          {
            id: 'community-skin',
            name: 'Community Skin',
            type: 'skin',
            position: { x: 0, y: 0 },
            size: { width: 100, height: 100 },
            presetGroup: 'community-pride'
          }
        ]
      },
      effects: {
        id: 'community-effects',
        name: 'Community Effects',
        type: 'effects',
        visible: true,
        opacity: 85,
        zIndex: 4,
        availableEffects: [
          {
            id: 'warm-prism',
            name: 'Warm Prism',
            type: 'prism',
            intensity: 65,
            coverage: 'partial'
          },
          {
            id: 'unity-chrome',
            name: 'Unity Chrome',
            type: 'chrome',
            intensity: 45,
            coverage: 'edges'
          }
        ]
      }
    }
  }
];


export const EFFECT_PRESETS = [
  {
    id: 'holographic_premium',
    name: 'Holographic Premium',
    description: 'Classic holographic card effect',
    effects: { holographic: { intensity: 80, shiftSpeed: 120, rainbowSpread: 180, animated: true } }
  },
  {
    id: 'chrome_luxury',
    name: 'Chrome Luxury',
    description: 'Mirror-like metallic finish',
    effects: { chrome: { intensity: 70, sharpness: 85, highlightSize: 35 } }
  },
  {
    id: 'crystal_rare',
    name: 'Crystal Rare',
    description: 'Crystalline faceted surface',
    effects: { crystal: { intensity: 65, facets: 12, dispersion: 75, clarity: 80, sparkle: true } }
  },
  {
    id: 'gold_legendary',
    name: 'Gold Legendary',
    description: 'Luxurious gold plating',
    effects: { gold: { intensity: 85, shimmerSpeed: 100, platingThickness: 7, goldTone: 'rich', reflectivity: 90, colorEnhancement: true } }
  }
];

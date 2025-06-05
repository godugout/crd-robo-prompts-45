import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { CRDCard } from '@/components/ui/design-system/Card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Typography } from '@/components/ui/design-system/Typography';

type ComboType = 'holographic' | 'prizm' | 'crystal' | 'vintage' | 'golden' | 'ice' | 'solar' | 'lunar' | 'starlight';

interface CardState {
  activeCombo: ComboType;
  effects: {
    holographic: number;
    foilSpray: number;
    prizm: number;
    chrome: number;
    interference: number;
    brushedMetal: number;
    crystal: number;
    vintage: number;
  };
}

const COMBO_PRESETS = {
  holographic: { holographic: 85, foilSpray: 0, prizm: 0, chrome: 45, interference: 0, brushedMetal: 0, crystal: 0, vintage: 0 },
  prizm: { holographic: 0, foilSpray: 0, prizm: 70, chrome: 0, interference: 0, brushedMetal: 55, crystal: 0, vintage: 0 },
  crystal: { holographic: 0, foilSpray: 0, prizm: 0, chrome: 0, interference: 60, brushedMetal: 0, crystal: 80, vintage: 0 },
  vintage: { holographic: 0, foilSpray: 50, prizm: 0, chrome: 0, interference: 0, brushedMetal: 0, crystal: 0, vintage: 65 },
  golden: { holographic: 0, foilSpray: 0, prizm: 0, chrome: 35, interference: 0, brushedMetal: 0, crystal: 0, vintage: 0 },
  ice: { holographic: 0, foilSpray: 0, prizm: 0, chrome: 35, interference: 45, brushedMetal: 0, crystal: 70, vintage: 0 },
  solar: { holographic: 60, foilSpray: 0, prizm: 0, chrome: 0, interference: 0, brushedMetal: 0, crystal: 0, vintage: 0 },
  lunar: { holographic: 0, foilSpray: 0, prizm: 0, chrome: 0, interference: 0, brushedMetal: 0, crystal: 0, vintage: 35 },
  starlight: { holographic: 0, foilSpray: 65, prizm: 40, chrome: 0, interference: 0, brushedMetal: 0, crystal: 0, vintage: 0 }
};

const COMBO_DESCRIPTIONS = {
  holographic: 'Classic iridescent effect',
  prizm: 'Geometric prismatic patterns',
  crystal: 'Transparent crystalline finish',
  vintage: 'Aged metallic patina',
  golden: 'Rich gold leaf surface',
  ice: 'Frosted crystal with cool tones',
  solar: 'Warm golden radiance',
  lunar: 'Cool silver moonlight glow',
  starlight: 'Celestial sparkle field'
};

// Enhanced card back configurations with realistic physics
const CARD_BACK_CONFIGS = {
  solar: {
    background: 'radial-gradient(ellipse at center, #1a1100 0%, #2d1f00 30%, #1a1100 70%, #0d0800 100%)',
    accent: 'rgba(255, 204, 0, 0.15)',
    glow: 'rgba(255, 140, 0, 0.2)',
    pattern: 'solar-rays',
    opacity: 0.95
  },
  holographic: {
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 25%, #2a0a1a 50%, #1a0a3a 75%, #0a0a1a 100%)',
    accent: 'rgba(255, 0, 128, 0.1)',
    glow: 'rgba(0, 255, 255, 0.15)',
    pattern: 'prismatic-shift',
    opacity: 0.92
  },
  lunar: {
    background: 'radial-gradient(ellipse at center, #0f0f1a 0%, #1a1a2a 40%, #151520 80%, #0a0a15 100%)',
    accent: 'rgba(192, 192, 192, 0.12)',
    glow: 'rgba(176, 196, 222, 0.18)',
    pattern: 'moonbeam',
    opacity: 0.94
  },
  starlight: {
    background: 'radial-gradient(ellipse at center, #000011 0%, #001122 30%, #000033 60%, #000008 100%)',
    accent: 'rgba(255, 255, 255, 0.08)',
    glow: 'rgba(135, 206, 235, 0.12)',
    pattern: 'starfield',
    opacity: 0.96
  },
  crystal: {
    background: 'linear-gradient(135deg, #0a1a1a 0%, #1a2a2a 25%, #0f1f2f 50%, #1a2535 75%, #0a1520 100%)',
    accent: 'rgba(173, 216, 230, 0.15)',
    glow: 'rgba(135, 206, 250, 0.2)',
    pattern: 'crystal-facets',
    opacity: 0.88
  },
  vintage: {
    background: 'radial-gradient(ellipse at center, #1a1008 0%, #2a1f10 40%, #352818 70%, #1f1510 100%)',
    accent: 'rgba(205, 133, 63, 0.18)',
    glow: 'rgba(160, 82, 45, 0.25)',
    pattern: 'aged-texture',
    opacity: 0.93
  },
  golden: {
    background: 'radial-gradient(ellipse at center, #1a1500 0%, #2a2200 30%, #352d00 60%, #1f1a00 100%)',
    accent: 'rgba(255, 215, 0, 0.2)',
    glow: 'rgba(255, 165, 0, 0.25)',
    pattern: 'gold-leaf',
    opacity: 0.9
  },
  ice: {
    background: 'linear-gradient(135deg, #0a1520 0%, #152030 25%, #0f1a28 50%, #1a2535 75%, #0a1218 100%)',
    accent: 'rgba(176, 224, 230, 0.12)',
    glow: 'rgba(135, 206, 235, 0.15)',
    pattern: 'frost-crystals',
    opacity: 0.85
  },
  prizm: {
    background: 'linear-gradient(45deg, #1a0a1a 0%, #2a1a2a 25%, #1a2a1a 50%, #2a1a3a 75%, #1a0a2a 100%)',
    accent: 'rgba(255, 20, 147, 0.1)',
    glow: 'rgba(138, 43, 226, 0.15)',
    pattern: 'geometric-prism',
    opacity: 0.91
  }
};

export const EffectCardViewer = () => {
  const [cardState, setCardState] = useState<CardState>({
    activeCombo: 'solar',
    effects: {
      holographic: 60,
      foilSpray: 0,
      prizm: 0,
      chrome: 0,
      interference: 0,
      brushedMetal: 0,
      crystal: 0,
      vintage: 0
    }
  });

  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);

  const applyCombo = (combo: ComboType) => {
    setCardState(prev => ({
      ...prev,
      activeCombo: combo,
      effects: { ...prev.effects, ...COMBO_PRESETS[combo] }
    }));
  };

  const updateEffect = (effectName: keyof CardState['effects'], value: number) => {
    setCardState(prev => ({
      ...prev,
      effects: {
        ...prev.effects,
        [effectName]: value
      }
    }));
  };

  const resetEffect = (effectName: keyof CardState['effects']) => {
    updateEffect(effectName, 0);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  const getMaterialStyle = (): React.CSSProperties => {
    const { activeCombo, effects } = cardState;
    const config = CARD_BACK_CONFIGS[activeCombo];
    const time = Date.now() * 0.001; // For animations
    
    let baseStyle: React.CSSProperties = {
      background: config.background,
      opacity: config.opacity
    };

    // Enhanced Physics-Based Effects
    if (effects.holographic > 0) {
      const intensity = effects.holographic / 100;
      const angle = mousePosition.x * 360 + time * 20;
      const viewAngle = Math.abs(Math.cos((mousePosition.x - 0.5) * Math.PI));
      
      // Realistic holographic physics - viewing angle dependent color shifting
      baseStyle.background = `
        ${baseStyle.background},
        conic-gradient(
          from ${angle}deg at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%,
          hsl(${Math.sin(angle * 0.1) * 60 + 200}, 80%, ${60 * viewAngle}%) 0deg,
          hsl(${Math.cos(angle * 0.15) * 80 + 280}, 70%, ${50 * viewAngle}%) 60deg,
          hsl(${Math.sin(angle * 0.12) * 100 + 180}, 85%, ${55 * viewAngle}%) 120deg,
          hsl(${Math.cos(angle * 0.08) * 120 + 300}, 75%, ${65 * viewAngle}%) 180deg,
          hsl(${Math.sin(angle * 0.14) * 90 + 240}, 80%, ${50 * viewAngle}%) 240deg,
          hsl(${Math.cos(angle * 0.11) * 110 + 160}, 70%, ${60 * viewAngle}%) 300deg,
          hsl(${Math.sin(angle * 0.1) * 60 + 200}, 80%, ${60 * viewAngle}%) 360deg
        )
      `;
      
      // Micro-sparkle animation - thousands of tiny light points
      baseStyle.boxShadow = `
        inset 0 0 ${20 * intensity}px rgba(255, 255, 255, ${0.3 * intensity * viewAngle}),
        0 0 ${40 * intensity}px rgba(255, 255, 255, ${0.1 * intensity})
      `;
      
      baseStyle.filter = `brightness(${1 + 0.3 * intensity * viewAngle}) contrast(${1.1 + 0.2 * intensity})`;
    }

    if (effects.prizm > 0) {
      const intensity = effects.prizm / 100;
      const facetSize = 12; // Realistic facet size
      const facetAngle = mousePosition.x * 180;
      
      // Geometric facet structure - hexagonal pattern like real Prizm
      baseStyle.background = `
        ${baseStyle.background},
        repeating-conic-gradient(
          from ${facetAngle}deg at 50% 50%,
          transparent 0deg,
          rgba(255, 0, 0, ${intensity * 0.4}) ${60 / 6}deg,
          rgba(255, 165, 0, ${intensity * 0.35}) ${120 / 6}deg,
          rgba(255, 255, 0, ${intensity * 0.4}) ${180 / 6}deg,
          rgba(0, 255, 0, ${intensity * 0.35}) ${240 / 6}deg,
          rgba(0, 0, 255, ${intensity * 0.4}) ${300 / 6}deg,
          rgba(138, 43, 226, ${intensity * 0.35}) ${360 / 6}deg,
          transparent 60deg
        )
      `;
      
      // Sharp geometric boundaries with scanning light effect
      baseStyle.backgroundSize = `${facetSize}px ${facetSize}px`;
      baseStyle.backgroundPosition = `${mousePosition.x * 20}px ${mousePosition.y * 20}px`;
      
      // Crisp geometric edges
      baseStyle.filter = `contrast(${1.3 + 0.2 * intensity}) saturate(${1.5 + 0.5 * intensity})`;
    }

    // Apply combo-specific enhancements
    switch (activeCombo) {
      case 'solar':
        baseStyle = {
          ...baseStyle,
          boxShadow: `0 0 40px ${config.glow}, inset 0 0 20px ${config.accent}`,
          background: `
            ${config.background},
            radial-gradient(ellipse 200% 100% at 50% 50%, ${config.accent} 0%, transparent 50%),
            conic-gradient(from ${time * 10}deg, transparent 0deg, rgba(255, 204, 0, 0.1) 30deg, transparent 60deg)
          `
        };
        break;
      case 'holographic':
        if (effects.holographic === 0) {
          baseStyle = {
            ...baseStyle,
            background: `
              ${config.background},
              linear-gradient(45deg, 
                rgba(255, 0, 128, 0.05), 
                rgba(0, 128, 255, 0.05), 
                rgba(0, 255, 128, 0.05), 
                rgba(255, 128, 0, 0.05)
              )
            `,
            backgroundSize: '400% 400%',
            animation: 'holographicShift 4s ease-in-out infinite'
          };
        }
        break;
      case 'lunar':
        baseStyle = {
          ...baseStyle,
          boxShadow: `0 0 30px ${config.glow}, inset 0 0 15px ${config.accent}`,
          background: `
            ${config.background},
            radial-gradient(circle at 30% 30%, ${config.accent} 0%, transparent 40%)
          `
        };
        break;
      case 'starlight':
        baseStyle = {
          ...baseStyle,
          background: `
            ${config.background},
            radial-gradient(circle at 20% 20%, ${config.accent} 1px, transparent 2px),
            radial-gradient(circle at 80% 40%, ${config.accent} 1px, transparent 2px),
            radial-gradient(circle at 40% 80%, ${config.accent} 1px, transparent 2px)
          `,
          backgroundSize: '100px 100px, 150px 150px, 120px 120px'
        };
        break;
      case 'crystal':
        baseStyle = {
          ...baseStyle,
          background: `
            ${config.background},
            linear-gradient(120deg, transparent 40%, ${config.accent} 45%, ${config.accent} 55%, transparent 60%),
            linear-gradient(60deg, transparent 40%, ${config.glow} 45%, ${config.glow} 55%, transparent 60%)
          `,
          filter: 'blur(0.5px) brightness(1.1)'
        };
        break;
      case 'vintage':
        baseStyle = {
          ...baseStyle,
          background: `
            ${config.background},
            radial-gradient(ellipse 150% 80% at 20% 80%, ${config.accent} 0%, transparent 50%),
            linear-gradient(45deg, transparent 60%, ${config.glow} 65%, transparent 70%)
          `,
          filter: 'sepia(0.1) contrast(1.05)'
        };
        break;
      case 'golden':
        baseStyle = {
          ...baseStyle,
          background: `
            ${config.background},
            radial-gradient(ellipse 120% 60% at 50% 40%, ${config.accent} 0%, transparent 60%),
            linear-gradient(135deg, transparent 40%, ${config.glow} 50%, transparent 60%)
          `,
          boxShadow: `0 0 25px ${config.glow}`
        };
        break;
      case 'ice':
        baseStyle = {
          ...baseStyle,
          background: `
            ${config.background},
            linear-gradient(45deg, ${config.accent} 0%, transparent 20%, ${config.glow} 40%, transparent 60%, ${config.accent} 80%, transparent 100%)
          `,
          filter: 'blur(0.3px) brightness(1.15)',
          opacity: config.opacity
        };
        break;
      case 'prizm':
        baseStyle = {
          ...baseStyle,
          background: `
            ${config.background},
            conic-gradient(from 0deg at 50% 50%, ${config.accent} 0deg, ${config.glow} 60deg, ${config.accent} 120deg, ${config.glow} 180deg, ${config.accent} 240deg, ${config.glow} 300deg, ${config.accent} 360deg)
          `,
          backgroundSize: '200% 200%'
        };
        break;
    }

    return baseStyle;
  };

  const effectsConfig = [
    { name: 'holographic', label: 'Holographic', color: 'bg-purple-500' },
    { name: 'foilSpray', label: 'Foil Spray', color: 'bg-blue-500' },
    { name: 'prizm', label: 'Prizm', color: 'bg-pink-500' },
    { name: 'chrome', label: 'Chrome', color: 'bg-gray-400' },
    { name: 'interference', label: 'Interference', color: 'bg-cyan-500' },
    { name: 'brushedMetal', label: 'Brushed Metal', color: 'bg-amber-600' },
    { name: 'crystal', label: 'Crystal', color: 'bg-blue-400' },
    { name: 'vintage', label: 'Vintage', color: 'bg-orange-500' }
  ] as const;

  return (
    <div>
      <style>
        {`
          @keyframes holographicShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes prizmScan {
            0% { background-position: -100% 0%; }
            100% { background-position: 100% 0%; }
          }
          
          @keyframes microSparkle {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
        `}
      </style>
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card Display Area */}
          <div className="lg:col-span-2">
            <CRDCard className="h-full" padding="lg">
              <div className="flex items-center justify-center">
                <div className="relative">
                  {/* Card Container */}
                  <div 
                    className="w-80 h-[448px] rounded-lg shadow-2xl transition-all duration-500 relative overflow-hidden border border-white/10 cursor-pointer"
                    style={getMaterialStyle()}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    {/* Card Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">EZ-ETH</h2>
                        <div className="w-32 h-32 mx-auto bg-black/20 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10">
                          <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                            <div className="w-12 h-12 bg-white rounded" />
                          </div>
                        </div>
                        <p className="text-sm opacity-90 drop-shadow">Character wearing purple hoodie and sunglasses</p>
                      </div>
                      <div className="text-center">
                        <span className="inline-block px-4 py-2 bg-yellow-500 text-black font-bold rounded shadow-lg">
                          LEGENDARY
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CRDCard>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            
            {/* Quick Combos Panel */}
            <CRDCard padding="default">
              <Typography variant="h4" className="mb-4">Quick Combos</Typography>
              <div className="space-y-2">
                {Object.entries(COMBO_DESCRIPTIONS).map(([combo, description]) => (
                  <CRDButton
                    key={combo}
                    onClick={() => applyCombo(combo as ComboType)}
                    variant="ghost"
                    className={`w-full justify-start text-left h-auto p-3 transition-all duration-200 ${
                      cardState.activeCombo === combo 
                        ? 'bg-crd-green/20 border border-crd-green text-crd-green' 
                        : 'text-crd-lightGray hover:bg-crd-mediumGray/20 hover:text-crd-white'
                    }`}
                  >
                    <div>
                      <div className="font-medium capitalize">{combo}</div>
                      <div className="text-xs opacity-70">{description}</div>
                    </div>
                    {cardState.activeCombo === combo && (
                      <span className="ml-auto text-crd-green">✓</span>
                    )}
                  </CRDButton>
                ))}
              </div>
            </CRDCard>

            {/* Effects Panel */}
            <CRDCard padding="default">
              <Typography variant="h4" className="mb-4">Effects</Typography>
              <div className="space-y-4">
                {effectsConfig.map(({ name, label, color }) => {
                  const value = cardState.effects[name as keyof CardState['effects']];
                  return (
                    <div key={name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${color}`} />
                          <Typography variant="body" className="text-sm font-medium">{label}</Typography>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Typography variant="caption" className="w-8 text-right">
                            {value}%
                          </Typography>
                          <CRDButton
                            onClick={() => resetEffect(name as keyof CardState['effects'])}
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6 p-0 text-crd-lightGray hover:text-crd-white"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </CRDButton>
                        </div>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={([newValue]) => updateEffect(name as keyof CardState['effects'], newValue)}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  );
                })}
              </div>
            </CRDCard>
          </div>
        </div>
      </div>
    </div>
  );
};

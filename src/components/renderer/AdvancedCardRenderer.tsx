
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Sparkles, Palette, Zap, Sun, Moon, Droplet, Flame, Diamond } from 'lucide-react';
import type { CardData } from '@/hooks/useCardEditor';

interface CardEffect {
  type: 'holographic' | 'refractor' | 'foil' | 'prizm' | 'chrome' | 'rainbow' | 'gold' | 'black';
  intensity: number;
  color?: string;
  pattern?: string;
}

interface AdvancedCardRendererProps {
  card: CardData;
  width?: number;
  height?: number;
  interactive?: boolean;
  showEffectControls?: boolean;
  onEffectChange?: (effects: CardEffect[]) => void;
  className?: string;
}

// Advanced shader-like effects using CSS and Canvas
const AdvancedCardRenderer: React.FC<AdvancedCardRendererProps> = ({
  card,
  width = 300,
  height = 420,
  interactive = true,
  showEffectControls = false,
  onEffectChange,
  className = ''
}) => {
  // Convert card effects to the expected format
  const convertedEffects: CardEffect[] = useMemo(() => {
    if (!card.design_metadata?.effects) {
      return [
        { type: 'holographic', intensity: 0 },
        { type: 'refractor', intensity: 0 },
        { type: 'foil', intensity: 0 },
        { type: 'prizm', intensity: 0 },
        { type: 'chrome', intensity: 0 },
        { type: 'rainbow', intensity: 0 },
        { type: 'gold', intensity: 0 },
        { type: 'black', intensity: 0 }
      ];
    }
    
    return Object.entries(card.design_metadata.effects).map(([type, intensity]) => ({
      type: type as CardEffect['type'],
      intensity: typeof intensity === 'number' ? intensity : 0
    }));
  }, [card.design_metadata?.effects]);

  // State
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [activeEffects, setActiveEffects] = useState(convertedEffects);
  
  // Refs
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Update effects when card changes
  useEffect(() => {
    setActiveEffects(convertedEffects);
  }, [convertedEffects]);

  // Handle mouse movement
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
    
    // Update rotation based on mouse position
    setRotation({
      x: (y - 0.5) * 20,
      y: (x - 0.5) * -20
    });
  }, [interactive]);

  // Handle mouse enter/leave
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
    setMousePosition({ x: 0.5, y: 0.5 });
  }, []);

  // Update effects
  const updateEffect = useCallback((effectType: string, intensity: number) => {
    const newEffects = activeEffects.map(e => 
      e.type === effectType ? { ...e, intensity } : e
    );
    setActiveEffects(newEffects);
    if (onEffectChange) {
      onEffectChange(newEffects);
    }
  }, [activeEffects, onEffectChange]);

  // Canvas-based effects rendering
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const renderEffects = () => {
      ctx.clearRect(0, 0, width, height);
      
      activeEffects.forEach(effect => {
        if (effect.intensity > 0) {
          switch (effect.type) {
            case 'rainbow':
              renderRainbowEffect(ctx, effect.intensity);
              break;
            case 'chrome':
              renderChromeEffect(ctx, effect.intensity);
              break;
            case 'gold':
              renderGoldEffect(ctx, effect.intensity);
              break;
            case 'black':
              renderBlackEffect(ctx, effect.intensity);
              break;
          }
        }
      });
      
      animationRef.current = requestAnimationFrame(renderEffects);
    };

    renderEffects();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeEffects, width, height, mousePosition]);

  // Canvas effect renderers
  const renderRainbowEffect = (ctx: CanvasRenderingContext2D, intensity: number) => {
    const gradient = ctx.createLinearGradient(
      mousePosition.x * width, 
      mousePosition.y * height, 
      width - mousePosition.x * width, 
      height - mousePosition.y * height
    );
    
    const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
    colors.forEach((color, i) => {
      gradient.addColorStop(i / (colors.length - 1), color);
    });
    
    ctx.globalAlpha = intensity * 0.3;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  const renderChromeEffect = (ctx: CanvasRenderingContext2D, intensity: number) => {
    const gradient = ctx.createRadialGradient(
      mousePosition.x * width,
      mousePosition.y * height,
      0,
      mousePosition.x * width,
      mousePosition.y * height,
      Math.max(width, height)
    );
    
    gradient.addColorStop(0, `rgba(255, 255, 255, ${intensity})`);
    gradient.addColorStop(0.5, `rgba(192, 192, 192, ${intensity * 0.5})`);
    gradient.addColorStop(1, `rgba(128, 128, 128, 0)`);
    
    ctx.globalAlpha = 1;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  const renderGoldEffect = (ctx: CanvasRenderingContext2D, intensity: number) => {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `rgba(255, 215, 0, ${intensity * 0.3})`);
    gradient.addColorStop(0.5, `rgba(255, 223, 0, ${intensity * 0.5})`);
    gradient.addColorStop(1, `rgba(255, 215, 0, ${intensity * 0.3})`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  const renderBlackEffect = (ctx: CanvasRenderingContext2D, intensity: number) => {
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.max(width, height) / 2
    );
    
    gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
    gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity * 0.8})`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  // CSS-based effects
  const getCSSEffects = useMemo(() => {
    const styles: React.CSSProperties = {};
    const filters: string[] = [];
    
    activeEffects.forEach(effect => {
      if (effect.intensity > 0) {
        switch (effect.type) {
          case 'holographic':
            const hueRotate = isHovering ? mousePosition.x * 360 : 0;
            filters.push(`hue-rotate(${hueRotate}deg)`);
            filters.push(`brightness(${1 + effect.intensity * 0.5})`);
            filters.push(`contrast(${1 + effect.intensity * 0.3})`);
            break;
            
          case 'foil':
            styles.boxShadow = `
              0 0 ${20 * effect.intensity}px rgba(255, 255, 255, 0.8),
              inset 0 0 ${10 * effect.intensity}px rgba(255, 255, 255, 0.5)
            `;
            break;
            
          case 'refractor':
            filters.push(`saturate(${1 + effect.intensity})`);
            if (isHovering) {
              const angle = mousePosition.x * 360;
              filters.push(`hue-rotate(${angle * effect.intensity}deg)`);
            }
            break;
            
          case 'prizm':
            const prizmAngle = (mousePosition.x + mousePosition.y) * 180;
            styles.background = `linear-gradient(${prizmAngle}deg, 
              rgba(255,0,100,${effect.intensity * 0.3}), 
              rgba(100,255,0,${effect.intensity * 0.3}), 
              rgba(0,100,255,${effect.intensity * 0.3}))`;
            break;
        }
      }
    });
    
    if (filters.length > 0) {
      styles.filter = filters.join(' ');
    }
    
    return styles;
  }, [activeEffects, mousePosition, isHovering]);

  // Get frame styles
  const getFrameStyles = () => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      borderRadius: 8
    };

    switch (card.template_id) {
      case 'premium':
        return {
          ...baseStyles,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
        };
      case 'neon':
        return {
          ...baseStyles,
          boxShadow: `0 0 30px #c026d3`,
          border: `2px solid #c026d3`
        };
      case 'vintage':
        return {
          ...baseStyles,
          boxShadow: '0 8px 16px rgba(139,69,19,0.2)',
          background: 'linear-gradient(135deg, #f5e6d3 0%, #e6d7c3 100%)',
          border: '4px solid #8b4513'
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Card Container */}
      <div
        ref={cardRef}
        className="relative overflow-hidden transition-all duration-300"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: interactive 
            ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovering ? 1.05 : 1})`
            : 'none',
          transformStyle: 'preserve-3d',
          ...getFrameStyles()
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Layer */}
        <div className="absolute inset-0" style={getFrameStyles()} />
        
        {/* CSS Effects Layer */}
        <div className="absolute inset-0 pointer-events-none" style={getCSSEffects} />
        
        {/* Canvas Effects Layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{ width: '100%', height: '100%' }}
        />
        
        {/* Card Content */}
        <div className="relative h-full p-4 flex flex-col">
          {/* Image Section */}
          {card.image_url && (
            <div className="flex-1 mb-4 relative overflow-hidden rounded">
              <img 
                src={card.image_url} 
                alt={card.title}
                className="w-full h-full object-cover"
                style={{
                  filter: isHovering ? 'brightness(1.1)' : 'brightness(1)'
                }}
              />
            </div>
          )}
          
          {/* Details Section */}
          <div className={`mt-auto p-3 rounded ${
            card.template_id === 'premium' || card.template_id === 'neon'
              ? 'bg-black bg-opacity-80'
              : 'bg-white bg-opacity-90'
          }`}>
            <h3 className={`text-lg font-bold ${
              card.template_id === 'premium' || card.template_id === 'neon'
                ? 'text-white'
                : 'text-gray-900'
            }`}>
              {card.title}
            </h3>
            {card.description && (
              <p className={`text-sm ${
                card.template_id === 'premium' || card.template_id === 'neon'
                  ? 'text-gray-300'
                  : 'text-gray-600'
              }`}>
                {card.description}
              </p>
            )}
            {card.rarity && (
              <p className={`text-xs ${
                card.template_id === 'premium' || card.template_id === 'neon'
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}>
                {card.rarity}
              </p>
            )}
          </div>
        </div>

        {/* Shine Effect Overlay */}
        {isHovering && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(105deg, 
                transparent 40%, 
                rgba(255, 255, 255, 0.7) 50%, 
                transparent 60%)`,
              transform: `translateX(${(mousePosition.x - 0.5) * 100}%)`,
              transition: 'transform 0.1s ease'
            }}
          />
        )}
      </div>

      {/* Effect Controls */}
      {showEffectControls && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h4 className="text-sm font-bold mb-3 flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Visual Effects
          </h4>
          <div className="space-y-2">
            {[
              { type: 'holographic', icon: Zap, label: 'Holographic' },
              { type: 'refractor', icon: Sun, label: 'Refractor' },
              { type: 'foil', icon: Diamond, label: 'Foil' },
              { type: 'prizm', icon: Palette, label: 'Prizm' },
              { type: 'rainbow', icon: Droplet, label: 'Rainbow' },
              { type: 'chrome', icon: Moon, label: 'Chrome' },
              { type: 'gold', icon: Flame, label: 'Gold' },
              { type: 'black', icon: Moon, label: 'Black' }
            ].map(({ type, icon: Icon, label }) => {
              const effect = activeEffects.find(e => e.type === type) || 
                { type: type as CardEffect['type'], intensity: 0 };
              
              return (
                <div key={type} className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-gray-600" />
                  <label className="text-xs w-20">{label}:</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={effect.intensity}
                    onChange={(e) => updateEffect(type, parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-xs w-8 text-right">
                    {Math.round(effect.intensity * 100)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedCardRenderer;

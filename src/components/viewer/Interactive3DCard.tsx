
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, MousePointer, Smartphone, Zap, Eye, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CardData } from '@/types/card';

export type InteractionMode = 'tilt' | 'orbital' | 'gyroscope' | 'physics' | 'magnetic' | 'carousel';

interface Interactive3DCardProps {
  card: CardData;
  mode?: InteractionMode;
  onModeChange?: (mode: InteractionMode) => void;
  className?: string;
}

export const Interactive3DCard = ({ 
  card, 
  mode = 'tilt', 
  onModeChange,
  className 
}: Interactive3DCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  const animationRef = useRef<number>();
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });

  const interactionModes = [
    { id: 'tilt' as const, name: 'Tilt', icon: MousePointer, description: 'Simple tilt on hover' },
    { id: 'orbital' as const, name: 'Orbital', icon: RotateCcw, description: 'Free 3D rotation' },
    { id: 'gyroscope' as const, name: 'Gyroscope', icon: Smartphone, description: 'Follow cursor smoothly' },
    { id: 'physics' as const, name: 'Physics', icon: Zap, description: 'Realistic momentum' },
    { id: 'magnetic' as const, name: 'Magnetic', icon: Eye, description: 'Magnetic attraction' },
    { id: 'carousel' as const, name: 'Carousel', icon: RotateCw, description: 'Multiple angles' }
  ];

  const carouselAngles = [
    { x: 0, y: 0, z: 0 },      // Front
    { x: 0, y: 25, z: 0 },     // Slight right
    { x: 15, y: 0, z: 0 },     // Slight down
    { x: 0, y: -25, z: 0 },    // Slight left
    { x: -15, y: 0, z: 0 },    // Slight up
    { x: 0, y: 180, z: 0 }     // Back
  ];

  // Reset animation when mode changes
  useEffect(() => {
    setRotation({ x: 0, y: 0, z: 0 });
    setIsInteracting(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [mode]);

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);

    setMousePos({ x, y });

    switch (mode) {
      case 'tilt':
        setRotation({
          x: -y * 15,
          y: x * 15,
          z: 0
        });
        break;

      case 'orbital':
        if (isInteracting) {
          const deltaX = e.clientX - lastMouseRef.current.x;
          const deltaY = e.clientY - lastMouseRef.current.y;
          
          setRotation(prev => ({
            x: Math.max(-180, Math.min(180, prev.x + deltaY * 0.5)),
            y: prev.y + deltaX * 0.5,
            z: prev.z
          }));
        }
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
        break;

      case 'gyroscope':
        const smoothX = rotation.x + (-y * 20 - rotation.x) * 0.1;
        const smoothY = rotation.y + (x * 20 - rotation.y) * 0.1;
        setRotation({ x: smoothX, y: smoothY, z: 0 });
        break;

      case 'physics':
        if (isInteracting) {
          const deltaX = e.clientX - lastMouseRef.current.x;
          const deltaY = e.clientY - lastMouseRef.current.y;
          
          velocityRef.current.x = deltaX * 0.3;
          velocityRef.current.y = deltaY * 0.3;
          
          setRotation(prev => ({
            x: prev.x + velocityRef.current.y,
            y: prev.y + velocityRef.current.x,
            z: prev.z
          }));
        }
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
        break;

      case 'magnetic':
        const magneticStrength = 0.8;
        const targetX = -y * 25 * magneticStrength;
        const targetY = x * 25 * magneticStrength;
        
        setRotation(prev => ({
          x: prev.x + (targetX - prev.x) * 0.15,
          y: prev.y + (targetY - prev.y) * 0.15,
          z: Math.sin(Date.now() * 0.002) * 2
        }));
        break;
    }
  };

  // Physics animation loop
  useEffect(() => {
    if (mode === 'physics' && !isInteracting) {
      const animate = () => {
        velocityRef.current.x *= 0.95;
        velocityRef.current.y *= 0.95;
        
        if (Math.abs(velocityRef.current.x) > 0.1 || Math.abs(velocityRef.current.y) > 0.1) {
          setRotation(prev => ({
            x: prev.x + velocityRef.current.y,
            y: prev.y + velocityRef.current.x,
            z: prev.z
          }));
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mode, isInteracting]);

  const handleMouseEnter = () => {
    setIsInteracting(true);
  };

  const handleMouseLeave = () => {
    setIsInteracting(false);
    
    if (mode === 'tilt' || mode === 'gyroscope' || mode === 'magnetic') {
      setRotation({ x: 0, y: 0, z: 0 });
    }
  };

  const handleCarouselNext = () => {
    const nextIndex = (carouselIndex + 1) % carouselAngles.length;
    setCarouselIndex(nextIndex);
    setRotation(carouselAngles[nextIndex]);
  };

  const handleCarouselPrev = () => {
    const prevIndex = (carouselIndex - 1 + carouselAngles.length) % carouselAngles.length;
    setCarouselIndex(prevIndex);
    setRotation(carouselAngles[prevIndex]);
  };

  const getTransformStyle = () => {
    const perspective = mode === 'physics' ? 2000 : 1000;
    return {
      perspective: `${perspective}px`,
      transformStyle: 'preserve-3d' as const,
    };
  };

  const getCardTransform = () => {
    const scale = isInteracting && (mode === 'magnetic' || mode === 'tilt') ? 1.05 : 1;
    return `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg) scale(${scale})`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Mode Selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {interactionModes.map((modeOption) => {
          const Icon = modeOption.icon;
          return (
            <Button
              key={modeOption.id}
              variant={mode === modeOption.id ? "default" : "outline"}
              size="sm"
              onClick={() => onModeChange?.(modeOption.id)}
              className="flex items-center gap-1"
            >
              <Icon className="w-3 h-3" />
              {modeOption.name}
            </Button>
          );
        })}
      </div>

      {/* Mode Description */}
      <p className="text-center text-sm text-muted-foreground">
        {interactionModes.find(m => m.id === mode)?.description}
      </p>

      {/* 3D Card Container */}
      <div 
        className="flex justify-center items-center h-80"
        style={getTransformStyle()}
      >
        <div
          ref={cardRef}
          className="relative w-60 h-80 cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={() => setIsInteracting(true)}
          onMouseUp={() => setIsInteracting(false)}
          style={{
            transform: getCardTransform(),
            transition: mode === 'carousel' ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 
                       mode === 'tilt' ? 'transform 0.3s ease-out' :
                       mode === 'gyroscope' ? 'none' : 
                       'none',
          }}
        >
          <Card className="w-full h-full overflow-hidden shadow-2xl border-2 bg-gradient-to-br from-white to-gray-50">
            {/* Card Image */}
            {card.image_url ? (
              <img 
                src={card.image_url} 
                alt={card.title}
                className="w-full h-48 object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {card.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            {/* Card Content */}
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-lg truncate">{card.title}</h3>
              {card.description && (
                <p className="text-sm text-gray-600 line-clamp-3">{card.description}</p>
              )}
              <div className="flex justify-between items-center pt-2">
                <span className={cn(
                  "px-2 py-1 rounded text-xs font-medium",
                  card.rarity === 'legendary' && "bg-yellow-100 text-yellow-800",
                  card.rarity === 'epic' && "bg-purple-100 text-purple-800",
                  card.rarity === 'rare' && "bg-blue-100 text-blue-800",
                  card.rarity === 'uncommon' && "bg-green-100 text-green-800",
                  card.rarity === 'common' && "bg-gray-100 text-gray-800"
                )}>
                  {card.rarity}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Carousel Controls */}
      {mode === 'carousel' && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCarouselPrev}>
            Previous
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            {carouselIndex + 1} / {carouselAngles.length}
          </span>
          <Button variant="outline" size="sm" onClick={handleCarouselNext}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

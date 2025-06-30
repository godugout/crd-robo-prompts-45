
import React, { useState, useRef, useCallback } from 'react';
import { Enhanced3DCardViewer } from '@/components/3d/enhanced/Enhanced3DCardViewer';
import { EffectProvider } from './contexts/EffectContext';
import type { Card } from '@/types/card';

interface EnhancedCardViewerProps {
  card: Card;
  className?: string;
}

export const EnhancedCardViewer: React.FC<EnhancedCardViewerProps> = ({
  card,
  className = ""
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [effectValues, setEffectValues] = useState({});
  const [materialSettings] = useState({
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 0.0,
    transmission: 0.0,
    reflectivity: 50
  });

  const handleEffectChange = useCallback(() => {}, []);
  const resetEffect = useCallback(() => {}, []);
  const resetAllEffects = useCallback(() => {}, []);

  return (
    <div className={`w-full h-full ${className}`}>
      <EffectProvider 
        initialEffects={effectValues}
        initialValues={{
          effectValues,
          mousePosition,
          isHovering,
          showEffects: true,
          materialSettings,
          interactiveLighting: false,
          effectIntensity: [0]
        }}
      >
        <Enhanced3DCardViewer
          card={card}
          className="w-full h-full"
          autoEnable={false}
          onModeChange={() => {}}
          fallbackComponent={<div>Loading...</div>}
        />
      </EffectProvider>
    </div>
  );
};

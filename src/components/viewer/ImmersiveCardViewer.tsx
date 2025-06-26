
import React, { useState, useCallback } from 'react';
import { EffectProvider } from './contexts/EffectContext';
import type { CardData } from '@/hooks/useCardEditor';

interface ImmersiveCardViewerProps {
  card: CardData;
  className?: string;
}

export const ImmersiveCardViewer: React.FC<ImmersiveCardViewerProps> = ({
  card,
  className = ""
}) => {
  const [effectValues, setEffectValues] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
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
        <div className="immersive-card-viewer">
          <h3 className="text-lg font-semibold mb-4">{card.title}</h3>
          <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Immersive 3D View</span>
          </div>
        </div>
      </EffectProvider>
    </div>
  );
};

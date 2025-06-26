
import React, { createContext, useContext, useState, useCallback } from 'react';

interface EffectContextType {
  effectValues: Record<string, Record<string, any>>;
  showEffects: boolean;
  isHovering: boolean;
  effectIntensity: number;
  mousePosition: { x: number; y: number };
  materialSettings: {
    metalness: number;
    roughness: number;
    clearcoat: number;
    transmission: number;
    reflectivity: number;
  };
  interactiveLighting: boolean;
  updateEffect: (effectId: string, parameterId: string, value: any) => void;
  setShowEffects: (show: boolean) => void;
  setIsHovering: (hovering: boolean) => void;
  setMousePosition: (position: { x: number; y: number }) => void;
  setMaterialSettings: (settings: any) => void;
}

const EffectContext = createContext<EffectContextType | null>(null);

export const useEffectContext = () => {
  const context = useContext(EffectContext);
  if (!context) {
    console.warn('useEffectContext used outside of EffectProvider');
    return null;
  }
  return context;
};

interface EffectProviderProps {
  children: React.ReactNode;
  initialEffects?: Record<string, any>;
}

export const EffectProvider: React.FC<EffectProviderProps> = ({
  children,
  initialEffects = {}
}) => {
  const [effectValues, setEffectValues] = useState<Record<string, Record<string, any>>>(
    initialEffects
  );
  const [showEffects, setShowEffects] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [effectIntensity, setEffectIntensity] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [materialSettings, setMaterialSettings] = useState({
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 0.0,
    transmission: 0.0,
    reflectivity: 50
  });
  const [interactiveLighting, setInteractiveLighting] = useState(false);

  const updateEffect = useCallback((effectId: string, parameterId: string, value: any) => {
    setEffectValues(prev => ({
      ...prev,
      [effectId]: {
        ...prev[effectId],
        [parameterId]: value
      }
    }));
  }, []);

  const value: EffectContextType = {
    effectValues,
    showEffects,
    isHovering,
    effectIntensity,
    mousePosition,
    materialSettings,
    interactiveLighting,
    updateEffect,
    setShowEffects,
    setIsHovering,
    setMousePosition,
    setMaterialSettings
  };

  return (
    <EffectContext.Provider value={value}>
      {children}
    </EffectContext.Provider>
  );
};

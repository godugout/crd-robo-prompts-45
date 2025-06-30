
import React, { createContext, useContext, useState, useCallback } from 'react';

interface EffectContextType {
  effectValues: Record<string, Record<string, any>>;
  showEffects: boolean;
  isHovering: boolean;
  effectIntensity: number[];
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
  setEffectIntensity: (intensity: number[]) => void;
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
  initialValues?: Partial<EffectContextType>;
}

export const EffectProvider: React.FC<EffectProviderProps> = ({
  children,
  initialEffects = {},
  initialValues = {}
}) => {
  const [effectValues, setEffectValues] = useState<Record<string, Record<string, any>>>(
    initialValues.effectValues || initialEffects
  );
  const [showEffects, setShowEffects] = useState(initialValues.showEffects ?? true);
  const [isHovering, setIsHovering] = useState(initialValues.isHovering ?? false);
  const [effectIntensity, setEffectIntensity] = useState<number[]>(
    initialValues.effectIntensity || [0]
  );
  const [mousePosition, setMousePosition] = useState(
    initialValues.mousePosition || { x: 0, y: 0 }
  );
  const [materialSettings, setMaterialSettings] = useState(
    initialValues.materialSettings || {
      metalness: 0.5,
      roughness: 0.5,
      clearcoat: 0.0,
      transmission: 0.0,
      reflectivity: 50
    }
  );
  const [interactiveLighting, setInteractiveLighting] = useState(
    initialValues.interactiveLighting ?? false
  );

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
    setMaterialSettings,
    setEffectIntensity
  };

  return (
    <EffectContext.Provider value={value}>
      {children}
    </EffectContext.Provider>
  );
};

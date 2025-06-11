
import React, { createContext, useContext, ReactNode } from 'react';
import type { EffectValues } from '../types';
import type { MaterialSettings } from '../types';

interface EffectContextType {
  effectValues: EffectValues;
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  showEffects: boolean;
  materialSettings: MaterialSettings;
  interactiveLighting: boolean;
  effectIntensity: number[];
  handleEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  resetEffect: (effectId: string) => void;
  resetAllEffects: () => void;
}

const EffectContext = createContext<EffectContextType | undefined>(undefined);

interface EffectProviderProps {
  children: ReactNode;
  value: EffectContextType;
}

export const EffectProvider: React.FC<EffectProviderProps> = ({ children, value }) => {
  return (
    <EffectContext.Provider value={value}>
      {children}
    </EffectContext.Provider>
  );
};

export const useEffectContext = () => {
  const context = useContext(EffectContext);
  if (context === undefined) {
    throw new Error('useEffectContext must be used within an EffectProvider');
  }
  return context;
};

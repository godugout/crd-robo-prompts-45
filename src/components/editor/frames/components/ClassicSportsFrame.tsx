
import React from 'react';
import { ModularFrameBuilder } from '../ModularFrameBuilder';
import { ALL_FRAME_CONFIGS } from '../VintageFrameConfigs';

export interface FrameProps {
  imageUrl?: string; 
  title?: string; 
  subtitle?: string;
  width?: number;
  height?: number;
}

export const ClassicSportsFrame: React.FC<FrameProps> = (props) => {
  const config = ALL_FRAME_CONFIGS.find(c => c.id === 'donruss-1987-classic')!;
  return <ModularFrameBuilder config={config} {...props} />;
};

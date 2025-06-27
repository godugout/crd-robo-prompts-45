
import React from 'react';
import { ModularFrameBuilder } from '../ModularFrameBuilder';
import { ALL_FRAME_CONFIGS } from '../VintageFrameConfigs';
import { FrameProps } from './ClassicSportsFrame';

export const VintageOrnateFrame: React.FC<FrameProps> = (props) => {
  const config = ALL_FRAME_CONFIGS.find(c => c.id === 'vintage-gold')!;
  return <ModularFrameBuilder config={config} {...props} />;
};

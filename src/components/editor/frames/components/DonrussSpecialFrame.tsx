
import React from 'react';
import { ModularFrameBuilder } from '../ModularFrameBuilder';
import { ALL_FRAME_CONFIGS } from '../VintageFrameConfigs';
import { FrameProps } from './ClassicSportsFrame';

export const DonrussSpecialFrame: React.FC<FrameProps> = (props) => {
  const config = ALL_FRAME_CONFIGS.find(c => c.id === 'donruss-1987-special')!;
  return <ModularFrameBuilder config={config} {...props} />;
};

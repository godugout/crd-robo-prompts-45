
import React from 'react';
import { ModularFrameBuilder } from '../ModularFrameBuilder';
import { ALL_FRAME_CONFIGS } from '../VintageFrameConfigs';
import { FrameProps } from './ClassicSportsFrame';

export const ChromeEditionFrame: React.FC<FrameProps> = (props) => {
  const config = ALL_FRAME_CONFIGS.find(c => c.id === 'chrome-edition')!;
  return <ModularFrameBuilder config={config} {...props} />;
};

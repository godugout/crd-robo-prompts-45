
import React from 'react';
import { FrameConfiguration } from './ModularFrameBuilder';

export interface EnhancedFrameTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  preview_component: React.ComponentType<any>;
  config?: FrameConfiguration;
}

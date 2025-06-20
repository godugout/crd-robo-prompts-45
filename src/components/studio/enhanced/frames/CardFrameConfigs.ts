
// Simple frame configurations for the streamlined creator
export interface FrameConfig {
  id: string;
  name: string;
  category: string;
  description: string;
}

export const getFrameConfigs = (): FrameConfig[] => [
  {
    id: 'classic-sports',
    name: 'Classic Sports',
    category: 'Traditional',
    description: 'Traditional sports card design'
  },
  {
    id: 'holographic-modern',
    name: 'Holographic',
    category: 'Modern',
    description: 'Modern holographic design'
  },
  {
    id: 'vintage-ornate',
    name: 'Vintage Ornate',
    category: 'Vintage',
    description: 'Ornate vintage design'
  },
  {
    id: 'donruss-special',
    name: 'Donruss Special',
    category: 'Special',
    description: 'Special edition Donruss style'
  },
  {
    id: 'donruss-rookie',
    name: 'Donruss Rookie',
    category: 'Rookie',
    description: 'Rookie card design'
  },
  {
    id: 'chrome-edition',
    name: 'Chrome Edition',
    category: 'Chrome',
    description: 'Shiny chrome finish'
  }
];

export const getFrameById = (id: string): FrameConfig | null => {
  return getFrameConfigs().find(frame => frame.id === id) || null;
};

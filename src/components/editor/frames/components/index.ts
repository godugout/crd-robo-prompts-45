
// Import all frame components
export { ClassicSportsFrame } from './ClassicSportsFrame';
export { ModernHolographicFrame } from './ModernHolographicFrame';
export { VintageOrnateFrame } from './VintageOrnateFrame';
export { ChromeEditionFrame } from './ChromeEditionFrame';
export { DonrussSpecialFrame } from './DonrussSpecialFrame';
export { DonrussRookieFrame } from './DonrussRookieFrame';

// Import the components for the mapping object
import { ClassicSportsFrame } from './ClassicSportsFrame';
import { ModernHolographicFrame } from './ModernHolographicFrame';
import { VintageOrnateFrame } from './VintageOrnateFrame';
import { ChromeEditionFrame } from './ChromeEditionFrame';
import { DonrussSpecialFrame } from './DonrussSpecialFrame';
import { DonrussRookieFrame } from './DonrussRookieFrame';

// Component mapping for easy access
export const FRAME_COMPONENTS = {
  'classic-sports': ClassicSportsFrame,
  'holographic-modern': ModernHolographicFrame,
  'vintage-ornate': VintageOrnateFrame,
  'chrome-edition': ChromeEditionFrame,
  'donruss-special': DonrussSpecialFrame,
  'donruss-rookie': DonrussRookieFrame
} as const;


import { useMobileControl } from '../context/MobileControlContext';

// Helper hook to safely use MobileControlContext
export const useSafeMobileControl = () => {
  try {
    return useMobileControl();
  } catch (error) {
    // Return fallback values when provider is not available (desktop mode)
    return {
      cardState: {
        zoom: 1,
        rotation: { x: 0, y: 0 },
        isFlipped: false,
        position: { x: 0, y: 0 }
      },
      flipCard: () => {},
      zoomCard: () => {},
      rotateCard: () => {},
      panCard: () => {},
      resetCardState: () => {},
      panelState: {
        studio: false,
        createCard: false,
        frames: false,
        showcase: false,
        rotateMode: false
      },
      applyRotationStep: () => {}
    };
  }
};

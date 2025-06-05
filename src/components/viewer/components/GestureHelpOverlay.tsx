
import React from 'react';
import { X, Hand, RotateCw, ZoomIn, Move, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GestureHelpOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

export const GestureHelpOverlay: React.FC<GestureHelpOverlayProps> = ({
  isVisible,
  onClose
}) => {
  if (!isVisible) return null;

  const gestures = [
    {
      icon: <Hand className="w-6 h-6" />,
      title: "Single Tap",
      description: "Flip card front/back"
    },
    {
      icon: <MousePointer2 className="w-6 h-6" />,
      title: "Double Tap",
      description: "Zoom to fit or fill screen"
    },
    {
      icon: <Move className="w-6 h-6" />,
      title: "Drag",
      description: "Pan around the card"
    },
    {
      icon: <ZoomIn className="w-6 h-6" />,
      title: "Pinch",
      description: "Zoom in/out with two fingers"
    },
    {
      icon: <RotateCw className="w-6 h-6" />,
      title: "Twist",
      description: "Rotate card with two fingers"
    },
    {
      icon: <Hand className="w-6 h-6" />,
      title: "Long Press",
      description: "Show card details"
    },
    {
      icon: <Move className="w-6 h-6" />,
      title: "Swipe Left/Right",
      description: "Navigate between cards"
    },
    {
      icon: <RotateCw className="w-6 h-6" />,
      title: "Three Finger Tap",
      description: "Reset view to default"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-black bg-opacity-90 backdrop-blur-lg rounded-lg border border-white/20 max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Touch Gestures</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {gestures.map((gesture, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 rounded hover:bg-white/5">
              <div className="text-crd-green flex-shrink-0">
                {gesture.icon}
              </div>
              <div>
                <div className="text-white font-medium text-sm">{gesture.title}</div>
                <div className="text-crd-lightGray text-xs">{gesture.description}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-white/20">
          <p className="text-xs text-crd-lightGray text-center">
            Hold and drag for smooth movement with momentum
          </p>
        </div>
      </div>
    </div>
  );
};

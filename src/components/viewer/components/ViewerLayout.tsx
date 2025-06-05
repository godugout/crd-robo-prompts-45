
import React from 'react';

interface ViewerLayoutProps {
  isOpen: boolean;
  isFullscreen: boolean;
  panelWidth: number;
  children: React.ReactNode;
  getEnvironmentStyle: () => React.CSSProperties;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export const ViewerLayout: React.FC<ViewerLayoutProps> = ({
  isOpen,
  isFullscreen,
  panelWidth,
  children,
  getEnvironmentStyle,
  onMouseMove,
  onMouseUp,
  onMouseLeave
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isFullscreen ? 'p-0' : 'p-8'
      }`}
      style={{
        ...getEnvironmentStyle(),
        paddingRight: isFullscreen ? 0 : `${panelWidth + 32}px`
      }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};

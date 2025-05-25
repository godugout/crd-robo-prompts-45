
import React from 'react';

interface CraftBoardOverlayProps {
  isActive: boolean;
  children: React.ReactNode;
}

export const CraftBoardOverlay = ({ isActive, children }: CraftBoardOverlayProps) => {
  if (!isActive) return <>{children}</>;

  return (
    <div className="relative craft-board-mode">
      {children}
    </div>
  );
};

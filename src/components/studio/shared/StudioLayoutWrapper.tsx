/**
 * Unified Studio Layout Wrapper
 * Provides consistent layout structure for all studio-style pages
 */

import React from 'react';

interface StudioLayoutWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const StudioLayoutWrapper: React.FC<StudioLayoutWrapperProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#2d1b69] flex overflow-hidden ${className}`}>
      {children}
    </div>
  );
};
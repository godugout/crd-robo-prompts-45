/**
 * Studio Panel Component
 * Consistent panel styling for all studio-style side panels
 */

import React from 'react';

interface StudioPanelProps {
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
  className?: string;
}

const widthClasses = {
  sm: 'w-80',
  md: 'w-96', 
  lg: 'w-[28rem]'
};

export const StudioPanel: React.FC<StudioPanelProps> = ({
  children,
  width = 'md',
  className = ''
}) => {
  return (
    <div className={`${widthClasses[width]} bg-[#1a1a1a] border-l border-[#4a4a4a] overflow-y-auto ${className}`}>
      {children}
    </div>
  );
};
/**
 * Studio Header Component
 * Consistent header styling for all studio pages
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface StudioHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  title,
  subtitle,
  onBack,
  backLabel = 'Back',
  actions,
  className = ''
}) => {
  return (
    <div className={`bg-gradient-to-r from-[#2c2c54] to-[#40407a] border-b border-[#4a4a4a] p-4 flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-4">
        {onBack && (
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-[#4a4a4a]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backLabel}
          </Button>
        )}
        <div>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-300">{subtitle}</p>
          )}
        </div>
      </div>
      
      {actions && (
        <div className="flex gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};
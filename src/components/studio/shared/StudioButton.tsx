/**
 * Studio Button Component
 * Consistent button styling for studio actions
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StudioButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const StudioButton: React.FC<StudioButtonProps> = ({
  children,
  variant = 'outline',
  size = 'sm',
  icon,
  disabled,
  onClick,
  className
}) => {
  const baseClasses = 'border-[#4a4a4a] text-white hover:bg-[#4a4a4a] transition-colors';
  
  const variantClasses = {
    primary: 'bg-[#4a90e2] hover:bg-[#4a90e2]/90 border-[#4a90e2]',
    secondary: 'bg-[#6366f1] hover:bg-[#6366f1]/90 border-[#6366f1]',
    outline: baseClasses,
    ghost: 'border-transparent hover:bg-[#4a4a4a]'
  };

  return (
    <Button
      variant="outline"
      size={size}
      disabled={disabled}
      onClick={onClick}
      className={cn(variantClasses[variant], className)}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Button>
  );
};

import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { psdTokens, LayerCategoryType } from './psd-tokens';

interface PSDCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive';
  category?: LayerCategoryType;
  children: React.ReactNode;
}

export const PSDCard: React.FC<PSDCardProps> = ({
  variant = 'default',
  category,
  className,
  children,
  ...props
}) => {
  const getCardStyles = () => {
    const baseStyles = 'transition-all duration-200';
    
    const variantStyles = {
      default: 'bg-[#1a1f2e] border-slate-700',
      elevated: 'bg-[#1a1f2e] border-slate-700 shadow-lg',
      interactive: 'bg-[#1a1f2e] border-slate-700 hover:border-slate-600 cursor-pointer hover:shadow-md',
    };
    
    const categoryStyles = category ? {
      background: 'border-l-4 border-l-slate-500',
      character: 'border-l-4 border-l-green-500',
      ui: 'border-l-4 border-l-blue-500',
      text: 'border-l-4 border-l-yellow-500',
      effects: 'border-l-4 border-l-purple-500',
    } : {};
    
    return cn(
      baseStyles,
      variantStyles[variant],
      category && categoryStyles[category],
      className
    );
  };

  return (
    <Card className={getCardStyles()} {...props}>
      {children}
    </Card>
  );
};

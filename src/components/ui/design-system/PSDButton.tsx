
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayerCategoryType } from './psd-tokens';

interface PSDButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'category';
  size?: 'sm' | 'md' | 'lg';
  category?: LayerCategoryType;
  active?: boolean;
  children: React.ReactNode;
}

export const PSDButton: React.FC<PSDButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  category,
  active = false,
  className,
  children,
  ...props
}) => {
  const getButtonStyles = () => {
    const sizeStyles = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-9 px-4 text-sm',
      lg: 'h-10 px-6 text-base',
    };
    
    const variantStyles = {
      primary: 'bg-crd-green text-black hover:bg-crd-green/90 font-medium',
      secondary: 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white',
      ghost: 'text-slate-300 hover:bg-slate-700 hover:text-white',
      category: getCategoryStyles(),
    };
    
    return cn(
      'transition-all duration-200 font-medium',
      sizeStyles[size],
      variantStyles[variant],
      active && variant === 'category' && 'ring-2 ring-white/20',
      className
    );
  };

  function getCategoryStyles() {
    if (!category) return 'bg-slate-800 text-slate-300 border-slate-600';
    
    const categoryStyles = {
      background: active 
        ? 'bg-slate-600 text-white border-slate-500' 
        : 'bg-slate-800 text-slate-400 border-slate-600 hover:bg-slate-700',
      character: active 
        ? 'bg-green-600 text-white border-green-500' 
        : 'bg-green-900/30 text-green-400 border-green-700 hover:bg-green-800/40',
      ui: active 
        ? 'bg-blue-600 text-white border-blue-500' 
        : 'bg-blue-900/30 text-blue-400 border-blue-700 hover:bg-blue-800/40',
      text: active 
        ? 'bg-yellow-600 text-black border-yellow-500' 
        : 'bg-yellow-900/30 text-yellow-400 border-yellow-700 hover:bg-yellow-800/40',
      effects: active 
        ? 'bg-purple-600 text-white border-purple-500' 
        : 'bg-purple-900/30 text-purple-400 border-purple-700 hover:bg-purple-800/40',
    };
    
    return categoryStyles[category];
  }

  return (
    <Button className={getButtonStyles()} {...props}>
      {children}
    </Button>
  );
};

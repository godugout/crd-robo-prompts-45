
import React from 'react';
import { cn } from '@/lib/utils';
import { cardshowColors } from './colors';
import { componentTokens } from './design-tokens';

// Semantic Card Components
interface SemanticCardProps extends React.HTMLAttributes<HTMLDivElement> {
  context: 'collections' | 'cards' | 'shops' | 'default';
  variant?: 'default' | 'elevated' | 'interactive';
  children: React.ReactNode;
}

export const SemanticCard: React.FC<SemanticCardProps> = ({
  context,
  variant = 'default',
  className,
  children,
  ...props
}) => {
  const getContextStyles = () => {
    const contextColors = {
      collections: cardshowColors.semantic.collections,
      cards: cardshowColors.semantic.cards,
      shops: cardshowColors.semantic.shops,
      default: cardshowColors.extended['gray-500']
    };
    
    return {
      borderLeftColor: contextColors[context],
      borderLeftWidth: '4px'
    };
  };

  const variantStyles = {
    default: 'bg-[#1E1E1E] border border-[#333333]',
    elevated: 'bg-[#1E1E1E] border border-[#333333] shadow-[0px_4px_12px_rgba(0,0,0,0.25)]',
    interactive: 'bg-[#1E1E1E] border border-[#333333] hover:shadow-[0px_6px_20px_rgba(0,0,0,0.35)] cursor-pointer transition-all duration-250'
  };

  return (
    <div
      className={cn(
        'rounded-lg p-6 transition-all duration-250',
        variantStyles[variant],
        className
      )}
      style={getContextStyles()}
      {...props}
    >
      {children}
    </div>
  );
};

// Semantic Buttons
interface SemanticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  context: 'collections' | 'cards' | 'shops' | 'currency' | 'default';
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const SemanticButton: React.FC<SemanticButtonProps> = ({
  context,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const getContextColors = () => {
    const colors = {
      collections: cardshowColors.semantic.collections,
      cards: cardshowColors.semantic.cards,
      shops: cardshowColors.semantic.shops,
      currency: cardshowColors.semantic.currency,
      default: cardshowColors.extended['gray-500']
    };
    
    return colors[context];
  };

  const sizeStyles = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-6 text-base',
    lg: 'h-12 px-8 text-lg'
  };

  const contextColor = getContextColors();
  
  const variantStyles = {
    primary: {
      backgroundColor: contextColor,
      color: context === 'currency' ? '#000000' : '#FFFFFF'
    },
    secondary: {
      backgroundColor: 'transparent',
      color: contextColor,
      borderColor: contextColor,
      borderWidth: '1px'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: contextColor
    }
  };

  return (
    <button
      className={cn(
        'font-medium rounded-lg transition-all duration-250 hover:opacity-90',
        sizeStyles[size],
        variant === 'secondary' && 'border',
        className
      )}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </button>
  );
};

// Context Indicators
interface ContextIndicatorProps {
  context: 'collections' | 'cards' | 'shops';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ContextIndicator: React.FC<ContextIndicatorProps> = ({
  context,
  size = 'md',
  className
}) => {
  const colors = {
    collections: cardshowColors.semantic.collections,
    cards: cardshowColors.semantic.cards,
    shops: cardshowColors.semantic.shops
  };

  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div
      className={cn('rounded-full', sizes[size], className)}
      style={{ backgroundColor: colors[context] }}
    />
  );
};


import React from 'react';
import { Slider } from '@/components/ui/slider';

interface ColoredSliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
  color: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const ColoredSlider: React.FC<ColoredSliderProps> = ({ 
  value, 
  onValueChange, 
  min, 
  max, 
  step, 
  color, 
  variant = 'primary', 
  className = '' 
}) => {
  // Using CSS variables to ensure dynamic colors work
  const sliderStyle = React.useMemo(() => {
    const colorMap: Record<string, string> = {
      purple: '#a855f7',
      yellow: '#facc15', 
      blue: '#60a5fa',
      gray: '#9ca3af',
      green: '#4ade80',
      orange: '#fb923c',
      cyan: '#22d3ee',
      amber: '#fbbf24'
    };
    
    const baseColor = colorMap[color] || '#9ca3af';
    
    if (variant === 'primary') {
      // Primary: white track with colored thumb
      return {
        '--track-bg': 'rgba(255, 255, 255, 0.2)',
        '--track-border': 'rgba(255, 255, 255, 0.4)',
        '--range-bg': 'rgba(255, 255, 255, 1)',
        '--thumb-bg': baseColor,
        '--thumb-border': baseColor,
        '--thumb-shadow': `${baseColor}80`
      } as React.CSSProperties;
    } else {
      // Secondary: colored track (muted) with colored thumb
      return {
        '--track-bg': `${baseColor}33`,
        '--track-border': `${baseColor}66`,
        '--range-bg': `${baseColor}66`,
        '--thumb-bg': baseColor,
        '--thumb-border': baseColor,
        '--thumb-shadow': `${baseColor}80`
      } as React.CSSProperties;
    }
  }, [color, variant]);

  return (
    <div style={sliderStyle}>
      <Slider
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        className={`w-full slider-colored ${className}`}
      />
    </div>
  );
};

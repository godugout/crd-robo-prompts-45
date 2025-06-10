
import React from 'react';

// Individual frame element components based on your provided designs
export const CornerElement: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  color?: string;
  style?: 'classic' | 'ornate' | 'modern';
}> = ({ position, size = 16, color = '#fbbf24', style = 'classic' }) => {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 rotate-90',
    'bottom-left': 'bottom-0 left-0 -rotate-90',
    'bottom-right': 'bottom-0 right-0 rotate-180'
  };

  const styleVariants = {
    classic: (
      <svg width={size} height={size} viewBox="0 0 16 16" className="absolute">
        <path d="M0 0 L16 0 L16 8 L8 8 L8 16 L0 16 Z" fill={color} />
        <path d="M2 2 L14 2 L14 6 L6 6 L6 14 L2 14 Z" fill="rgba(255,255,255,0.2)" />
      </svg>
    ),
    ornate: (
      <svg width={size} height={size} viewBox="0 0 16 16" className="absolute">
        <path d="M0 0 Q8 0 16 0 Q16 8 16 16 L8 16 Q8 8 8 8 L0 8 Z" fill={color} />
        <circle cx="4" cy="4" r="1.5" fill="rgba(255,255,255,0.4)" />
      </svg>
    ),
    modern: (
      <div 
        className="absolute"
        style={{ width: size, height: size, backgroundColor: color }}
      >
        <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent"></div>
      </div>
    )
  };

  return (
    <div className={`absolute ${positionClasses[position]}`}>
      {styleVariants[style]}
    </div>
  );
};

export const BorderPattern: React.FC<{
  side: 'top' | 'bottom' | 'left' | 'right';
  pattern: 'dots' | 'lines' | 'diamonds' | 'classic';
  color?: string;
  thickness?: number;
}> = ({ side, pattern, color = '#fbbf24', thickness = 4 }) => {
  const sideClasses = {
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
    left: 'left-0 top-0 bottom-0',
    right: 'right-0 top-0 bottom-0'
  };

  const isVertical = side === 'left' || side === 'right';
  
  const patterns = {
    dots: (
      <div className={`flex ${isVertical ? 'flex-col justify-center' : 'justify-center items-center'} h-full w-full gap-1`}>
        {Array.from({length: isVertical ? 12 : 20}).map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: color }}></div>
        ))}
      </div>
    ),
    lines: (
      <div className={`${isVertical ? 'h-full' : 'w-full'}`} style={{
        background: `repeating-linear-gradient(${isVertical ? '0deg' : '90deg'}, ${color} 0px, ${color} 2px, transparent 2px, transparent 4px)`
      }}></div>
    ),
    diamonds: (
      <div className={`flex ${isVertical ? 'flex-col justify-center' : 'justify-center items-center'} h-full w-full gap-2`}>
        {Array.from({length: isVertical ? 8 : 15}).map((_, i) => (
          <div key={i} className="w-2 h-2 rotate-45" style={{ backgroundColor: color }}></div>
        ))}
      </div>
    ),
    classic: (
      <div className="w-full h-full" style={{ backgroundColor: color }}>
        <div className="w-full h-full bg-gradient-to-r from-white/20 via-transparent to-white/20"></div>
      </div>
    )
  };

  return (
    <div 
      className={`absolute ${sideClasses[side]}`}
      style={{ 
        [isVertical ? 'width' : 'height']: thickness + 'px'
      }}
    >
      {patterns[pattern]}
    </div>
  );
};

export const CenterEmblem: React.FC<{
  type: 'logo' | 'seal' | 'badge';
  position: 'top' | 'bottom' | 'center';
  text?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}> = ({ type, position, text = 'CRD', color = '#fbbf24', size = 'medium' }) => {
  const positionClasses = {
    top: 'top-2',
    bottom: 'bottom-2',
    center: 'top-1/2 -translate-y-1/2'
  };

  const sizeClasses = {
    small: 'w-12 h-6 text-xs',
    medium: 'w-16 h-8 text-sm',
    large: 'w-20 h-10 text-base'
  };

  return (
    <div className={`absolute left-1/2 -translate-x-1/2 ${positionClasses[position]} ${sizeClasses[size]} flex items-center justify-center rounded`}>
      {type === 'logo' && (
        <div className="w-full h-full bg-gradient-to-r from-blue-800 to-blue-600 rounded flex items-center justify-center">
          <span className="text-white font-bold tracking-wider">{text}</span>
        </div>
      )}
      {type === 'seal' && (
        <div className="w-full h-full rounded-full border-2 flex items-center justify-center" style={{ borderColor: color, backgroundColor: color }}>
          <span className="text-white font-bold text-xs">{text}</span>
        </div>
      )}
      {type === 'badge' && (
        <div className="w-full h-full bg-gradient-to-r rounded flex items-center justify-center" style={{ 
          background: `linear-gradient(45deg, ${color}, ${color}dd)`
        }}>
          <span className="text-white font-semibold">{text}</span>
        </div>
      )}
    </div>
  );
};

export const TextPlaque: React.FC<{
  text: string;
  position: 'title' | 'subtitle' | 'stats';
  style: 'raised' | 'engraved' | 'modern';
  color?: string;
  width?: string;
  height?: string;
}> = ({ text, position, style, color = '#1e3a8a', width = '100%', height = '24px' }) => {
  const baseClasses = "flex items-center justify-center px-2";
  
  const styleVariants = {
    raised: `${baseClasses} bg-gradient-to-r shadow-lg border-2 border-white/20`,
    engraved: `${baseClasses} bg-gradient-to-r shadow-inner border border-black/20`,
    modern: `${baseClasses} bg-gradient-to-r rounded-md`
  };

  return (
    <div 
      className={styleVariants[style]}
      style={{ 
        background: `linear-gradient(90deg, ${color}, ${color}dd)`,
        width, 
        height 
      }}
    >
      <span className="text-white font-bold text-sm tracking-wide truncate">{text}</span>
    </div>
  );
};

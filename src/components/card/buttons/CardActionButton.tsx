
import React from 'react';

interface CardActionButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const CardActionButton: React.FC<CardActionButtonProps> = ({
  icon,
  onClick,
  disabled = false,
  className = ""
}) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("CardActionButton clicked");
        onClick?.();
      }}
      disabled={disabled}
      className={`
        relative z-10
        w-12 h-12 
        bg-white/10 backdrop-blur-sm 
        rounded-full 
        flex items-center justify-center 
        transition-all duration-200 
        hover:bg-white/20 hover:scale-110
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer
        ${className}
      `}
      style={{ pointerEvents: 'auto' }}
    >
      {icon}
    </button>
  );
};

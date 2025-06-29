
import React from 'react';
import { cardshowColors } from './colors';

interface CRDTokenDisplayProps {
  amount: number;
  className?: string;
  showIcon?: boolean;
}

export const CRDTokenDisplay: React.FC<CRDTokenDisplayProps> = ({
  amount,
  className = '',
  showIcon = true
}) => {
  // Display in tens as specified
  const displayAmount = Math.floor(amount / 10);
  
  return (
    <span 
      className={`inline-flex items-center gap-1 font-medium ${className}`}
      style={{ color: cardshowColors.primary.coin }}
    >
      {showIcon && <span>🪙</span>}
      <span>{displayAmount.toLocaleString()}</span>
    </span>
  );
};

// Currency utilities
export const currencyUtils = {
  formatCRD: (amount: number) => Math.floor(amount / 10),
  toCRDDisplay: (amount: number) => `🪙 ${Math.floor(amount / 10).toLocaleString()}`,
  fromCRDDisplay: (displayAmount: number) => displayAmount * 10
};

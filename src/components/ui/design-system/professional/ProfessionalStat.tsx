
import React from 'react';

export interface ProfessionalStatProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  context?: 'collections' | 'cards' | 'shops' | 'currency' | 'professional';
}

export const ProfessionalStat: React.FC<ProfessionalStatProps> = ({
  label,
  value, 
  icon,
  trend,
  context
}) => {
  const getContextColor = () => {
    switch (context) {
      case 'collections': return '#22C55E';
      case 'cards': return '#F97316';
      case 'shops': return '#3B82F6'; 
      case 'currency': return '#FACC15';
      case 'professional': return '#8B5CF6';
      default: return '#E5E5E7';
    }
  };

  return (
    <div className="flex items-center gap-3">
      {icon && (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#252526]">
          <div style={{ color: getContextColor() }}>
            {icon}
          </div>
        </div>
      )}
      <div className="flex-1">
        <div className="text-2xl font-bold text-[#FFFFFF]" style={{ color: getContextColor() }}>
          {value}
        </div>
        <div className="text-sm text-[#9CA3AF]">{label}</div>
      </div>
    </div>
  );
};

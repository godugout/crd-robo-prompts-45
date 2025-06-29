
import React from 'react';
import { cn } from '@/lib/utils';
import { ProfessionalCard } from './ProfessionalCard';

export interface ProfessionalPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const ProfessionalPanel: React.FC<ProfessionalPanelProps> = ({
  header,
  children,
  actions,
  className,
  ...props
}) => {
  return (
    <ProfessionalCard variant="elevated" padding="none" className={cn("h-full flex flex-col", className)} {...props}>
      {header && (
        <div className="px-6 py-4 border-b border-[#404040] flex items-center justify-between">
          {typeof header === 'string' ? (
            <h2 className="text-lg font-semibold text-[#FFFFFF]">{header}</h2>
          ) : (
            header
          )}
          {actions}
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </ProfessionalCard>
  );
};

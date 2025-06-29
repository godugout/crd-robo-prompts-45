
import React from 'react';
import { cn } from '@/lib/utils';

// Professional Layout Container
export interface ProfessionalLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const ProfessionalLayout: React.FC<ProfessionalLayoutProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "min-h-screen bg-[#0A0A0B]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Two Column Professional Layout
export interface TwoColumnLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  leftWidth?: 'narrow' | 'normal' | 'wide';
  className?: string;
}

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  leftPanel,
  rightPanel,
  leftWidth = 'normal',
  className
}) => {
  const getLeftWidth = () => {
    switch (leftWidth) {
      case 'narrow': return 'w-1/4';
      case 'wide': return 'w-2/3';
      default: return 'w-1/2';
    }
  };

  const getRightWidth = () => {
    switch (leftWidth) {
      case 'narrow': return 'w-3/4';
      case 'wide': return 'w-1/3';
      default: return 'w-1/2';
    }
  };

  return (
    <div className={cn("flex h-full", className)}>
      <div className={cn(getLeftWidth(), "border-r border-[#404040]")}>
        {leftPanel}
      </div>
      <div className={getRightWidth()}>
        {rightPanel}
      </div>
    </div>
  );
};

// Three Column Professional Layout
export interface ThreeColumnLayoutProps {
  leftPanel: React.ReactNode;
  centerPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  className?: string;
}

export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  leftPanel,
  centerPanel,
  rightPanel,
  className
}) => {
  return (
    <div className={cn("flex h-full", className)}>
      <div className="w-1/3 border-r border-[#404040]">
        {leftPanel}
      </div>
      <div className="w-1/3 border-r border-[#404040]">
        {centerPanel}
      </div>
      <div className="w-1/3">
        {rightPanel}
      </div>
    </div>
  );
};

// Professional Header Component
export interface ProfessionalHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  className?: string;
}

export const ProfessionalHeader: React.FC<ProfessionalHeaderProps> = ({
  title,
  subtitle,
  actions,
  breadcrumbs,
  className
}) => {
  return (
    <div className={cn("border-b border-[#404040] bg-[#1A1A1B]", className)}>
      <div className="px-6 py-4">
        {breadcrumbs && (
          <div className="mb-2 text-sm text-[#9CA3AF]">
            {breadcrumbs}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#FFFFFF]">{title}</h1>
            {subtitle && (
              <p className="text-[#9CA3AF] mt-1">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Professional Content Area
export interface ProfessionalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const ProfessionalContent: React.FC<ProfessionalContentProps> = ({
  children,
  padding = 'md',
  className,
  ...props
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'none': return 'p-0';
      case 'sm': return 'p-4';
      case 'lg': return 'p-8';
      default: return 'p-6';
    }
  };

  return (
    <div
      className={cn(
        "flex-1 overflow-auto",
        getPadding(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

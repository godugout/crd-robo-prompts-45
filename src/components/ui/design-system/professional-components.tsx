
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { enhancedCardshowColors } from './enhanced-colors';

// Professional Card Component
const professionalCardVariants = cva(
  "rounded-lg border transition-all duration-250 ease-out",
  {
    variants: {
      variant: {
        default: "bg-[#1A1A1B] border-[#404040]",
        elevated: "bg-[#252526] border-[#525252] shadow-[0_8px_16px_rgba(0,0,0,0.15)]",
        professional: "bg-[#2D2D30] border-[#525252] shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
        glass: "bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] backdrop-blur-sm",
        interactive: "bg-[#1A1A1B] border-[#404040] hover:bg-[#252526] hover:border-[#525252] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] cursor-pointer",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6", 
        lg: "p-8",
        xl: "p-12",
      },
      context: {
        none: "",
        collections: "border-l-4 border-l-[#22C55E]",
        cards: "border-l-4 border-l-[#F97316]",
        shops: "border-l-4 border-l-[#3B82F6]",
        currency: "border-l-4 border-l-[#FACC15]",
        professional: "border-l-4 border-l-[#8B5CF6]",
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      context: "none",
    },
  }
);

export interface ProfessionalCardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof professionalCardVariants> {}

export const ProfessionalCard = React.forwardRef<HTMLDivElement, ProfessionalCardProps>(
  ({ className, variant, padding, context, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(professionalCardVariants({ variant, padding, context }), className)}
        {...props}
      />
    );
  }
);
ProfessionalCard.displayName = "ProfessionalCard";

// Professional Button Component - Updated with professional context
const professionalButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-250 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0B] disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-[#F97316] text-white hover:bg-[#FB923C] focus:ring-[#F97316]",
        secondary: "bg-[#252526] text-[#E5E5E7] border border-[#525552] hover:bg-[#2D2D30] hover:border-[#737373] focus:ring-[#525552]",
        professional: "bg-[#8B5CF6] text-white hover:bg-[#A78BFA] focus:ring-[#8B5CF6]",
        ghost: "text-[#E5E5E7] hover:bg-[#252526] focus:ring-[#525552]",
        destructive: "bg-[#EF4444] text-white hover:bg-[#F87171] focus:ring-[#EF4444]",
        outline: "border border-[#525552] text-[#E5E5E7] hover:bg-[#252526] focus:ring-[#525552]",
        link: "text-[#3B82F6] hover:text-[#60A5FA] underline-offset-4 hover:underline focus:ring-[#3B82F6]",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-lg",
        icon: "h-10 w-10",
      },
      context: {
        none: "",
        collections: "bg-[#22C55E] text-white hover:bg-[#16A34A] focus:ring-[#22C55E]",
        cards: "bg-[#F97316] text-white hover:bg-[#FB923C] focus:ring-[#F97316]", 
        shops: "bg-[#3B82F6] text-white hover:bg-[#60A5FA] focus:ring-[#3B82F6]",
        currency: "bg-[#FACC15] text-black hover:bg-[#FDE047] focus:ring-[#FACC15]",
        professional: "bg-[#8B5CF6] text-white hover:bg-[#A78BFA] focus:ring-[#8B5CF6]",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md", 
      context: "none",
    },
    compoundVariants: [
      {
        variant: "primary",
        context: "professional",
        className: "bg-[#8B5CF6] text-white hover:bg-[#A78BFA] focus:ring-[#8B5CF6]"
      }
    ]
  }
);

export interface ProfessionalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof professionalButtonVariants> {
  asChild?: boolean;
}

export const ProfessionalButton = React.forwardRef<HTMLButtonElement, ProfessionalButtonProps>(
  ({ className, variant, size, context, asChild = false, ...props }, ref) => {
    if (asChild) {
      // When asChild is true, render as div without button-specific props
      const { type, disabled, form, formAction, formEncType, formMethod, formNoValidate, formTarget, name, value, ...divProps } = props;
      return (
        <div
          className={cn(professionalButtonVariants({ variant, size, context }), className)}
          {...(divProps as unknown as React.HTMLAttributes<HTMLDivElement>)}
        />
      );
    }
    
    return (
      <button
        ref={ref}
        className={cn(professionalButtonVariants({ variant, size, context }), className)}
        {...props}
      />
    );
  }
);
ProfessionalButton.displayName = "ProfessionalButton";

// Professional Panel Layout Component  
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

// Professional Statistics Component
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

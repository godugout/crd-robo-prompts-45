
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

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

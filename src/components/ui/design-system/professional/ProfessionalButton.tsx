
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

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

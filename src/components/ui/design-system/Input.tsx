
import React from 'react';
import { Input as ShadcnInput, InputProps as ShadcnInputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  "w-full rounded-md border px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-background border-input focus-visible:ring-ring",
        crd: "bg-crd-dark border-crd-mediumGray text-crd-white placeholder:text-crd-lightGray focus-visible:ring-crd-blue focus-visible:border-crd-blue",
        editor: "bg-editor-darker border-editor-border text-cardshow-white placeholder:text-cardshow-lightGray focus-visible:ring-cardshow-blue focus-visible:border-cardshow-blue",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CRDInputProps extends ShadcnInputProps, VariantProps<typeof inputVariants> {}

export const CRDInput = React.forwardRef<HTMLInputElement, CRDInputProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <ShadcnInput
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

CRDInput.displayName = "CRDInput";


import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const typographyVariants = cva(
  "",
  {
    variants: {
      variant: {
        h1: "text-4xl font-bold text-crd-white mb-8",
        h2: "text-3xl font-bold text-crd-white mb-6", 
        h3: "text-2xl font-bold text-crd-white mb-4",
        h4: "text-xl font-semibold text-crd-white mb-3",
        body: "text-base text-crd-white",
        caption: "text-sm text-crd-lightGray",
        accent: "text-crd-orange font-medium",
        muted: "text-crd-lightGray",
      },
    },
    defaultVariants: {
      variant: "body",
    },
  }
);

export interface TypographyProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
  as?: keyof JSX.IntrinsicElements;
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, as: Component = "p", ...props }, ref) => {
    return React.createElement(Component, {
      className: cn(typographyVariants({ variant, className })),
      ref,
      ...props
    });
  }
);

Typography.displayName = "Typography";

// Convenience components
export const Heading = ({ level = 1, children, className, ...props }: { 
  level?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLHeadingElement>) => (
  <Typography
    as={`h${level}` as keyof JSX.IntrinsicElements}
    variant={`h${level}` as VariantProps<typeof typographyVariants>['variant']}
    className={className}
    {...props}
  >
    {children}
  </Typography>
);

export const AccentText = ({ children, className, ...props }: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) => (
  <Typography
    as="span"
    variant="accent"
    className={className}
    {...props}
  >
    {children}
  </Typography>
);

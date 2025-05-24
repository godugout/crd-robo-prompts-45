
import React from "react";
import { CRDButton } from "@/components/ui/design-system";
import type { CRDButtonProps } from "@/components/ui/design-system/Button";

interface CardActionButtonProps extends Omit<CRDButtonProps, 'variant' | 'size'> {
  icon: React.ReactNode;
}

export const CardActionButton = ({ icon, className, ...props }: CardActionButtonProps) => {
  return (
    <CRDButton
      variant="action"
      size="action-icon"
      icon={icon}
      className={className}
      {...props}
    />
  );
};

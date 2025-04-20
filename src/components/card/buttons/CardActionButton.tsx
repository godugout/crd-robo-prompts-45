
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CardActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
}

export const CardActionButton = ({ icon, className, ...props }: CardActionButtonProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "p-3 rounded-full border-2 border-[#353945] bg-transparent hover:bg-[#353945]/10",
        className
      )}
      {...props}
    >
      {icon}
    </Button>
  );
};

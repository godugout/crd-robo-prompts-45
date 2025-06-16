
import React from "react";
import { LogoPicker } from "./LogoPicker";

interface LogoProps {
  onLogoChange?: (logoId: string, navBgColor: string) => void;
}

export const Logo = ({ onLogoChange }: LogoProps) => {
  return <LogoPicker onLogoChange={onLogoChange} />;
};


import React from "react";
import { LogoPicker, LogoPickerProps } from "./index";

export const Logo: React.FC<LogoPickerProps> = ({ onLogoChange }) => {
  return <LogoPicker onLogoChange={onLogoChange} />;
};

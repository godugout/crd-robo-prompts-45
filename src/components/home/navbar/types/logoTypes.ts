
export interface LogoOption {
  id: string;
  name: string;
  src: string;
  has3D: boolean;
  navBgColor: string;
  dropdownBgColor: string;
}

export interface LogoPickerProps {
  onLogoChange?: (logoId: string, navBgColor: string) => void;
}

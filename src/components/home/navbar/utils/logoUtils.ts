
import { LOGO_OPTIONS } from '../constants/logoOptions';

export const getHeaderLogoStyles = (logoId: string): string => {
  switch (logoId) {
    case 'cardshow-modern-red':
      return 'bg-white rounded px-1 py-0.5';
    case 'cardshow-red-blue-script':
    case 'cardshow-blue-script':
      return 'drop-shadow-[0_0_4px_rgba(255,255,255,0.9)] filter [text-shadow:_0_0_6px_rgba(255,255,255,0.8)]';
    default:
      return '';
  }
};

export const getDropdownBgClass = (logoId: string): string => {
  const logo = LOGO_OPTIONS.find(l => l.id === logoId);
  return logo?.dropdownBgColor || 'bg-crd-darkest/95';
};

export const getContainerBgClass = (logoId: string): string => {
  return logoId === 'cardshow-red-blue-script' || logoId === 'cardshow-blue-script' 
    ? 'bg-gray-700' 
    : 'bg-crd-darkest';
};

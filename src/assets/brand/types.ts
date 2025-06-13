
// Brand Asset Types
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LogoVariant = 'default' | 'light' | 'dark' | 'icon-only';

export interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  className?: string;
  showText?: boolean;
  animated?: boolean;
}

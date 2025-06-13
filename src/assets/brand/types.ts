
// Brand Asset Types
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '1.5xl' | '2xl';
export type LogoVariant = 'default' | 'light' | 'dark' | 'icon-only';

export interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  className?: string;
  animated?: boolean;
  style?: React.CSSProperties;
}

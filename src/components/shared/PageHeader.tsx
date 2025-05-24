
import React from 'react';
import { Heading, AccentText } from '@/components/ui/design-system';

interface PageHeaderProps {
  title: string;
  accentText?: string;
  subtitle?: string;
  className?: string;
}

export const PageHeader = ({ title, accentText, subtitle, className }: PageHeaderProps) => {
  return (
    <div className={`crd-section ${className || ''}`}>
      <Heading level={1} className="crd-header">
        {title} {accentText && <AccentText>{accentText}</AccentText>}
      </Heading>
      {subtitle && (
        <p className="text-crd-lightGray text-lg mb-6">{subtitle}</p>
      )}
    </div>
  );
};

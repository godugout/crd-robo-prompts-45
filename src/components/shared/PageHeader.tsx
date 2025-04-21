
import React from 'react';

interface PageHeaderProps {
  title: string;
  accentText?: string;
  description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  accentText, 
  description 
}) => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-crd-white">
        {title} {accentText && <span className="text-crd-orange">{accentText}</span>}
      </h1>
      {description && (
        <p className="text-crd-lightGray mt-2">{description}</p>
      )}
    </div>
  );
};

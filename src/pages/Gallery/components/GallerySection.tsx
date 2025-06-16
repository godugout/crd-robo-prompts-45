
import React from 'react';

interface GallerySectionProps {
  title: string;
  children: React.ReactNode;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ 
  title, 
  children 
}) => (
  <div className="mb-16">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-3xl font-bold text-crd-white">{title}</h2>
      <div className="h-px bg-gradient-to-r from-crd-green/50 to-transparent flex-1 ml-6" />
    </div>
    {children}
  </div>
);

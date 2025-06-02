
import React from 'react';

interface GallerySectionProps {
  title: string;
  children: React.ReactNode;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ 
  title, 
  children 
}) => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold mb-6 text-[#FCFCFD]">{title}</h2>
    {children}
  </div>
);

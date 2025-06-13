
import React from 'react';

export const CRDCardBack: React.FC = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-crd-darkest via-editor-dark to-black relative overflow-hidden rounded-lg border border-editor-border">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-crd-green/20 to-crd-purple/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(116, 235, 94, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
        {/* Logo Section */}
        <div className="flex items-center justify-center mb-8">
          <img 
            src="/lovable-uploads/4b5f3591-e7ce-4903-ba12-be85faf3d44d.png" 
            alt="Cardshow Logo" 
            className="w-24 h-24 object-contain"
          />
          <div className="text-center ml-4">
            <div className="text-4xl font-bold bg-gradient-to-r from-crd-green to-crd-purple bg-clip-text text-transparent">
              CARDSHOW
            </div>
            <div className="text-sm text-crd-lightGray uppercase tracking-wider">
              Digital Card Creation Platform
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-center mb-8">
          <p className="text-crd-lightGray text-sm mb-2">
            Professional Card Creation Platform
          </p>
          <p className="text-xs text-crd-lightGray/70">
            Bringing your cards to life with cutting-edge technology
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-crd-green"></div>
          <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse"></div>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-crd-purple"></div>
        </div>

        {/* Bottom Section */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex justify-between items-center text-xs text-crd-lightGray/50">
            <span>© 2024 Cardshow Platform</span>
            <span>cardshow.digital</span>
          </div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-crd-green/30"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-crd-purple/30"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-crd-green/30"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-crd-purple/30"></div>
      </div>

      {/* Subtle Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-crd-green/5 via-transparent to-crd-purple/5 animate-pulse"></div>
    </div>
  );
};

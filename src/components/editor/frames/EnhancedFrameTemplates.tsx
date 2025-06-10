
import React from 'react';

export interface EnhancedFrameTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  preview_component: React.ComponentType<any>;
  layers: {
    background: {
      type: 'solid' | 'gradient' | 'pattern';
      colors: string[];
    };
    border: {
      style: 'classic' | 'decorative' | 'minimal' | 'ornate';
      width: number;
      colors: string[];
      pattern?: string;
    };
    content_areas: {
      image: { x: number; y: number; width: number; height: number };
      title: { x: number; y: number; width: number; height: number };
      subtitle?: { x: number; y: number; width: number; height: number };
      stats?: { x: number; y: number; width: number; height: number };
    };
    decorative_elements?: Array<{
      type: 'corner' | 'side' | 'emblem';
      position: string;
      size: number;
      color: string;
    }>;
  };
}

// Classic Sports Card Frame (inspired by Donruss style)
export const ClassicSportsFrame: React.FC<{ 
  imageUrl?: string; 
  title?: string; 
  subtitle?: string;
  width?: number;
  height?: number;
}> = ({ 
  imageUrl = 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=400&fit=crop',
  title = 'CARD TITLE',
  subtitle = 'Subtitle Text',
  width = 300,
  height = 420
}) => (
  <div 
    className="relative overflow-hidden rounded-lg shadow-lg"
    style={{ width, height, backgroundColor: '#1a1a2e' }}
  >
    {/* Outer Border */}
    <div className="absolute inset-1 border-4 border-yellow-400 rounded-lg">
      {/* Inner Border with Pattern */}
      <div className="absolute inset-1 border-2 border-gray-300 rounded-md bg-gradient-to-b from-gray-100 to-white">
        
        {/* Top Brand Bar */}
        <div className="absolute top-2 left-2 right-2 h-8 bg-gradient-to-r from-blue-800 to-blue-600 rounded flex items-center justify-center">
          <span className="text-white font-bold text-sm tracking-wider">CRD PREMIUM</span>
        </div>
        
        {/* Main Image Area */}
        <div className="absolute top-12 left-4 right-4 bottom-20 rounded-md overflow-hidden border border-gray-300">
          <img 
            src={imageUrl}
            alt="Card"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Decorative Corner Elements */}
        <div className="absolute top-14 left-6 w-4 h-4">
          <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border border-yellow-600"></div>
        </div>
        <div className="absolute top-14 right-6 w-4 h-4">
          <div className="w-full h-full bg-gradient-to-bl from-yellow-400 to-orange-500 rounded-full border border-yellow-600"></div>
        </div>
        
        {/* Side Decorative Patterns */}
        <div className="absolute left-1 top-16 bottom-24 w-2 bg-gradient-to-b from-gray-400 to-gray-600">
          <div className="w-full h-full bg-repeat-y opacity-60" style={{
            backgroundImage: `repeating-linear-gradient(0deg, #666 0px, #666 4px, #999 4px, #999 8px)`
          }}></div>
        </div>
        <div className="absolute right-1 top-16 bottom-24 w-2 bg-gradient-to-b from-gray-400 to-gray-600">
          <div className="w-full h-full bg-repeat-y opacity-60" style={{
            backgroundImage: `repeating-linear-gradient(0deg, #666 0px, #666 4px, #999 4px, #999 8px)`
          }}></div>
        </div>
        
        {/* Title Area */}
        <div className="absolute bottom-12 left-4 right-4 h-6 bg-gradient-to-r from-blue-800 to-blue-600 rounded flex items-center justify-center">
          <span className="text-white font-bold text-sm tracking-wide truncate px-2">{title}</span>
        </div>
        
        {/* Subtitle Area */}
        <div className="absolute bottom-4 left-4 right-4 h-4 bg-gradient-to-r from-gray-600 to-gray-500 rounded flex items-center justify-center">
          <span className="text-white text-xs truncate px-2">{subtitle}</span>
        </div>
      </div>
    </div>
  </div>
);

// Modern Holographic Frame
export const ModernHolographicFrame: React.FC<{ 
  imageUrl?: string; 
  title?: string; 
  subtitle?: string;
  width?: number;
  height?: number;
}> = ({ 
  imageUrl = 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=400&fit=crop',
  title = 'CARD TITLE',
  subtitle = 'Holographic Edition',
  width = 300,
  height = 420
}) => (
  <div 
    className="relative overflow-hidden rounded-xl shadow-2xl"
    style={{ width, height }}
  >
    {/* Holographic Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-800 to-cyan-600">
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse"></div>
    </div>
    
    {/* Prismatic Border */}
    <div className="absolute inset-2 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 via-green-500 to-yellow-500 p-0.5">
      <div className="w-full h-full bg-black rounded-lg">
        
        {/* Inner Content Area */}
        <div className="absolute inset-3 bg-gradient-to-b from-gray-900 to-black rounded-md">
          
          {/* Top Holographic Strip */}
          <div className="absolute top-2 left-2 right-2 h-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded flex items-center justify-center">
            <span className="text-black font-bold text-xs tracking-widest">HOLOGRAPHIC</span>
          </div>
          
          {/* Main Image */}
          <div className="absolute top-10 left-4 right-4 bottom-16 rounded-lg overflow-hidden border-2 border-cyan-400/50">
            <img 
              src={imageUrl}
              alt="Card"
              className="w-full h-full object-cover"
            />
            {/* Holographic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/20 to-purple-400/20 mix-blend-overlay"></div>
          </div>
          
          {/* Corner Prisms */}
          <div className="absolute top-12 left-6 w-3 h-3 bg-gradient-to-br from-cyan-400 to-purple-400 rotate-45"></div>
          <div className="absolute top-12 right-6 w-3 h-3 bg-gradient-to-bl from-pink-400 to-blue-400 rotate-45"></div>
          
          {/* Title */}
          <div className="absolute bottom-8 left-4 right-4 h-5 bg-gradient-to-r from-cyan-400/80 to-purple-400/80 rounded flex items-center justify-center">
            <span className="text-black font-bold text-xs tracking-wide truncate px-2">{title}</span>
          </div>
          
          {/* Edition Info */}
          <div className="absolute bottom-2 left-4 right-4 h-4 bg-gradient-to-r from-purple-400/60 to-pink-400/60 rounded flex items-center justify-center">
            <span className="text-black text-xs font-medium truncate px-2">{subtitle}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Vintage Ornate Frame
export const VintageOrnateFrame: React.FC<{ 
  imageUrl?: string; 
  title?: string; 
  subtitle?: string;
  width?: number;
  height?: number;
}> = ({ 
  imageUrl = 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=400&fit=crop',
  title = 'VINTAGE CARD',
  subtitle = 'Classic Edition',
  width = 300,
  height = 420
}) => (
  <div 
    className="relative overflow-hidden rounded-lg shadow-xl"
    style={{ width, height, backgroundColor: '#8B4513' }}
  >
    {/* Ornate Outer Border */}
    <div className="absolute inset-1 border-4 border-yellow-600 rounded-lg">
      <div className="absolute inset-1 bg-gradient-to-b from-amber-50 to-amber-100 rounded-md">
        
        {/* Decorative Header */}
        <div className="absolute top-2 left-2 right-2 h-8 bg-gradient-to-r from-amber-700 to-yellow-700 rounded-md flex items-center justify-center relative">
          <span className="text-amber-100 font-serif font-bold text-sm tracking-wide">CLASSIC</span>
          {/* Ornate corners */}
          <div className="absolute -left-1 -top-1 w-3 h-3 border-2 border-yellow-400 bg-amber-600 rotate-45"></div>
          <div className="absolute -right-1 -top-1 w-3 h-3 border-2 border-yellow-400 bg-amber-600 rotate-45"></div>
        </div>
        
        {/* Main Image with Ornate Frame */}
        <div className="absolute top-12 left-6 right-6 bottom-20 bg-gradient-to-br from-amber-200 to-amber-300 rounded-md p-2">
          <div className="w-full h-full rounded border-2 border-amber-600 overflow-hidden">
            <img 
              src={imageUrl}
              alt="Card"
              className="w-full h-full object-cover sepia-[0.2]"
            />
          </div>
        </div>
        
        {/* Ornate Side Decorations */}
        <div className="absolute left-2 top-16 bottom-24 w-3 bg-gradient-to-b from-amber-600 to-yellow-700 rounded-full flex flex-col justify-center space-y-1">
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} className="w-2 h-1 bg-yellow-400 rounded-full mx-auto"></div>
          ))}
        </div>
        <div className="absolute right-2 top-16 bottom-24 w-3 bg-gradient-to-b from-amber-600 to-yellow-700 rounded-full flex flex-col justify-center space-y-1">
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} className="w-2 h-1 bg-yellow-400 rounded-full mx-auto"></div>
          ))}
        </div>
        
        {/* Title Plaque */}
        <div className="absolute bottom-10 left-4 right-4 h-6 bg-gradient-to-r from-amber-700 to-yellow-700 rounded-md flex items-center justify-center border-2 border-yellow-600">
          <span className="text-amber-100 font-serif font-bold text-sm tracking-wide truncate px-2">{title}</span>
        </div>
        
        {/* Subtitle Banner */}
        <div className="absolute bottom-3 left-6 right-6 h-4 bg-gradient-to-r from-yellow-600 to-amber-600 rounded flex items-center justify-center">
          <span className="text-amber-900 text-xs font-semibold truncate px-2">{subtitle}</span>
        </div>
      </div>
    </div>
  </div>
);

export const ENHANCED_FRAME_TEMPLATES: EnhancedFrameTemplate[] = [
  {
    id: 'classic-sports',
    name: 'Classic Sports',
    category: 'Professional',
    description: 'Traditional sports card design with premium borders',
    preview_component: ClassicSportsFrame,
    layers: {
      background: { type: 'gradient', colors: ['#1a1a2e', '#16213e'] },
      border: { style: 'classic', width: 4, colors: ['#fbbf24', '#f59e0b'] },
      content_areas: {
        image: { x: 4, y: 12, width: 92, height: 65 },
        title: { x: 4, y: 80, width: 92, height: 6 },
        subtitle: { x: 4, y: 88, width: 92, height: 4 }
      }
    }
  },
  {
    id: 'holographic-modern',
    name: 'Holographic',
    category: 'Premium',
    description: 'Modern holographic design with prismatic effects',
    preview_component: ModernHolographicFrame,
    layers: {
      background: { type: 'gradient', colors: ['#1e1b4b', '#06b6d4', '#8b5cf6'] },
      border: { style: 'decorative', width: 2, colors: ['#06b6d4', '#8b5cf6', '#ec4899'] },
      content_areas: {
        image: { x: 4, y: 10, width: 92, height: 70 },
        title: { x: 4, y: 82, width: 92, height: 5 },
        subtitle: { x: 4, y: 90, width: 92, height: 4 }
      }
    }
  },
  {
    id: 'vintage-ornate',
    name: 'Vintage Ornate',
    category: 'Classic',
    description: 'Ornate vintage design with decorative elements',
    preview_component: VintageOrnateFrame,
    layers: {
      background: { type: 'gradient', colors: ['#fef3c7', '#fbbf24'] },
      border: { style: 'ornate', width: 6, colors: ['#d97706', '#fbbf24'] },
      content_areas: {
        image: { x: 6, y: 12, width: 88, height: 65 },
        title: { x: 4, y: 80, width: 92, height: 6 },
        subtitle: { x: 6, y: 88, width: 88, height: 4 }
      }
    }
  }
];

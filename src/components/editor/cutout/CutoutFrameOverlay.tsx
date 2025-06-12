
import React from 'react';

interface RegionData {
  id: string;
  type: 'photo' | 'text' | 'sticker';
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

interface CutoutFrameOverlayProps {
  frameId: string;
  onRegionClick: (regionId: string, regionType: 'photo' | 'text' | 'sticker') => void;
  selectedRegion: string | null;
}

export const CutoutFrameOverlay: React.FC<CutoutFrameOverlayProps> = ({
  frameId,
  onRegionClick,
  selectedRegion
}) => {
  // Frame-specific region definitions
  const frameRegions: Record<string, RegionData[]> = {
    'classic-sports-cutout': [
      { id: 'title', type: 'text', x: 10, y: 2, width: 80, height: 12, label: 'Title' },
      { id: 'main-photo', type: 'photo', x: 10, y: 15, width: 80, height: 65, label: 'Main Photo Area' },
      { id: 'stats', type: 'text', x: 10, y: 82, width: 80, height: 8, label: 'Stats' },
      { id: 'corner-logo', type: 'sticker', x: 85, y: 2, width: 12, height: 12, label: 'Logo' }
    ],
    'modern-holographic-cutout': [
      { id: 'title', type: 'text', x: 10, y: 2, width: 80, height: 10, label: 'Title' },
      { id: 'main-photo', type: 'photo', x: 10, y: 15, width: 80, height: 65, label: 'Photo' },
      { id: 'description', type: 'text', x: 10, y: 82, width: 80, height: 10, label: 'Description' },
      { id: 'hologram-effect', type: 'sticker', x: 85, y: 2, width: 12, height: 12, label: 'Effect' }
    ],
    'vintage-ornate-cutout': [
      { id: 'ornate-title', type: 'text', x: 10, y: 2, width: 80, height: 8, label: 'Title' },
      { id: 'photo-frame', type: 'photo', x: 10, y: 15, width: 80, height: 65, label: 'Photo' },
      { id: 'vintage-text', type: 'text', x: 10, y: 82, width: 80, height: 10, label: 'Details' },
      { id: 'ornament-left', type: 'sticker', x: 2, y: 40, width: 6, height: 20, label: 'Ornament' },
      { id: 'ornament-right', type: 'sticker', x: 92, y: 40, width: 6, height: 20, label: 'Ornament' }
    ],
    'chrome-edition-cutout': [
      { id: 'chrome-header', type: 'text', x: 10, y: 2, width: 80, height: 10, label: 'Header' },
      { id: 'chrome-photo', type: 'photo', x: 10, y: 15, width: 80, height: 65, label: 'Photo' },
      { id: 'chrome-footer', type: 'text', x: 10, y: 82, width: 80, height: 10, label: 'Footer' },
      { id: 'chrome-accent', type: 'sticker', x: 85, y: 2, width: 12, height: 15, label: 'Accent' }
    ]
  };

  const regions = frameRegions[frameId] || frameRegions['classic-sports-cutout'];

  const getRegionStyle = (region: RegionData) => ({
    position: 'absolute' as const,
    left: `${region.x}%`,
    top: `${region.y}%`,
    width: `${region.width}%`,
    height: `${region.height}%`,
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Invisible by default, only show on hover or when selected
    backgroundColor: selectedRegion === region.id 
      ? 'rgba(255, 215, 0, 0.3)' 
      : 'transparent',
    border: selectedRegion === region.id 
      ? '2px solid #ffd700' 
      : '2px solid transparent',
  });

  const getRegionIcon = (type: RegionData['type']) => {
    switch (type) {
      case 'photo': return '📷';
      case 'text': return '📝';
      case 'sticker': return '✨';
      default: return '🎨';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Clickable Regions - Invisible until hovered */}
      {regions.map((region) => (
        <div
          key={region.id}
          style={getRegionStyle(region)}
          className="pointer-events-auto hover:bg-crd-green/20 hover:border-crd-green/60 group"
          onClick={() => onRegionClick(region.id, region.type)}
        >
          <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="text-lg mb-1">{getRegionIcon(region.type)}</div>
            <div className="text-xs text-white font-medium bg-black/70 px-2 py-1 rounded">
              {region.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

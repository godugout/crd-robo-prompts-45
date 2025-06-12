
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
      { id: 'title', type: 'text', x: 5, y: 5, width: 90, height: 12, label: 'Title' },
      { id: 'main-photo', type: 'photo', x: 10, y: 20, width: 80, height: 60, label: 'Main Photo Area' },
      { id: 'stats', type: 'text', x: 15, y: 82, width: 70, height: 8, label: 'Stats' },
      { id: 'corner-logo', type: 'sticker', x: 75, y: 88, width: 20, height: 8, label: 'Logo' }
    ],
    'modern-holographic-cutout': [
      { id: 'title', type: 'text', x: 8, y: 8, width: 84, height: 10, label: 'Title' },
      { id: 'main-photo', type: 'photo', x: 12, y: 22, width: 76, height: 55, label: 'Photo' },
      { id: 'description', type: 'text', x: 10, y: 80, width: 80, height: 12, label: 'Description' },
      { id: 'hologram-effect', type: 'sticker', x: 70, y: 5, width: 25, height: 15, label: 'Effect' }
    ],
    'vintage-ornate-cutout': [
      { id: 'ornate-title', type: 'text', x: 12, y: 10, width: 76, height: 8, label: 'Title' },
      { id: 'photo-frame', type: 'photo', x: 18, y: 25, width: 64, height: 50, label: 'Photo' },
      { id: 'vintage-text', type: 'text', x: 15, y: 78, width: 70, height: 10, label: 'Details' },
      { id: 'ornament-left', type: 'sticker', x: 5, y: 45, width: 8, height: 15, label: 'Ornament' },
      { id: 'ornament-right', type: 'sticker', x: 87, y: 45, width: 8, height: 15, label: 'Ornament' }
    ],
    'chrome-edition-cutout': [
      { id: 'chrome-header', type: 'text', x: 10, y: 6, width: 80, height: 12, label: 'Header' },
      { id: 'chrome-photo', type: 'photo', x: 15, y: 22, width: 70, height: 55, label: 'Photo' },
      { id: 'chrome-footer', type: 'text', x: 12, y: 82, width: 76, height: 10, label: 'Footer' },
      { id: 'chrome-accent', type: 'sticker', x: 85, y: 15, width: 12, height: 20, label: 'Accent' }
    ]
  };

  const regions = frameRegions[frameId] || frameRegions['classic-sports-cutout'];

  const getRegionStyle = (region: RegionData) => ({
    position: 'absolute' as const,
    left: `${region.x}%`,
    top: `${region.y}%`,
    width: `${region.width}%`,
    height: `${region.height}%`,
    border: selectedRegion === region.id ? '2px solid #ffd700' : '2px dashed rgba(255, 215, 0, 0.5)',
    backgroundColor: selectedRegion === region.id ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
      {/* Frame Border/Design - This would normally be an actual PNG overlay */}
      <div className="absolute inset-0 border-4 border-crd-green/30 rounded-lg pointer-events-none" />
      
      {/* Clickable Regions */}
      {regions.map((region) => (
        <div
          key={region.id}
          style={getRegionStyle(region)}
          className="pointer-events-auto hover:bg-crd-green/20 transition-colors group"
          onClick={() => onRegionClick(region.id, region.type)}
        >
          <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="text-lg mb-1">{getRegionIcon(region.type)}</div>
            <div className="text-xs text-white font-medium">{region.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

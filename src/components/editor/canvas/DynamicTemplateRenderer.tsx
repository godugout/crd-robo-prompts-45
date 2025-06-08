import React from 'react';
import { Camera } from 'lucide-react';
import { FullBleedTemplateRenderer } from './FullBleedTemplateRenderer';
import type { CardData } from '@/hooks/useCardEditor';

interface TemplateRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TemplateData {
  colors: {
    background: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  regions: Record<string, TemplateRegion>;
}

interface DynamicTemplateRendererProps {
  template: {
    id: string;
    name: string;
    template_data: Record<string, any>; // Accept the broader type from DesignTemplate
  };
  cardData: CardData;
  currentPhoto?: string;
  scaleFactor?: number;
  onPhotoUpload?: () => void;
  onElementSelect?: (elementId: string) => void;
  dimensions?: {
    width: number;
    height: number;
  };
}

export const DynamicTemplateRenderer = ({
  template,
  cardData,
  currentPhoto,
  scaleFactor = 1,
  onPhotoUpload,
  onElementSelect,
  dimensions
}: DynamicTemplateRendererProps) => {
  // Check if this is a full-bleed template
  const templateData = template.template_data as TemplateData;
  const isFullBleed = templateData.layout_type === 'full-bleed-minimal' || 
                     templateData.layout_type === 'full-bleed-social';

  // Use FullBleedTemplateRenderer for full-bleed templates
  if (isFullBleed) {
    return (
      <FullBleedTemplateRenderer
        template={template}
        cardData={cardData}
        currentPhoto={currentPhoto}
        scaleFactor={scaleFactor}
        onPhotoUpload={onPhotoUpload}
        onElementSelect={onElementSelect}
        dimensions={dimensions}
      />
    );
  }

  // Safely extract colors and regions with fallbacks
  const colors = templateData.colors || {
    background: '#1e293b',
    primary: '#2563eb',
    secondary: '#fbbf24',
    accent: '#f59e0b',
    text: '#ffffff'
  };
  const regions = templateData.regions || {};

  // Calculate actual dimensions
  const actualWidth = dimensions?.width || (300 * scaleFactor);
  const actualHeight = dimensions?.height || (420 * scaleFactor);

  // Field mapping - maps standard card fields to template-specific region names
  const getFieldMapping = (templateId: string) => {
    const mappings = {
      'tcg-classic': {
        title: 'title',
        image: 'image',
        description: 'stats'
      },
      'sports-modern': {
        title: 'playerName',
        image: 'image',
        description: 'stats',
        team: 'team',
        position: 'position'
      },
      'school-academic': {
        title: 'name',
        image: 'image',
        description: 'details',
        school: 'school',
        achievement: 'achievement'
      },
      'corporate-elite': {
        title: 'name',
        image: 'image',
        description: 'details',
        company: 'company',
        position: 'position'
      },
      'friends-forever': {
        title: 'name',
        image: 'image',
        description: 'memories',
        friendship: 'friendship'
      },
      'vintage-dreams': {
        title: 'title',
        image: 'image',
        description: 'story',
        era: 'era'
      }
    };
    
    return mappings[templateId as keyof typeof mappings] || mappings['tcg-classic'];
  };

  const fieldMapping = getFieldMapping(template.id);

  const renderRegion = (regionKey: string, region: TemplateRegion) => {
    const mappedField = Object.entries(fieldMapping).find(([_, value]) => value === regionKey)?.[0];
    
    // Handle image regions
    if (regionKey === fieldMapping.image) {
      return (
        <div 
          key={regionKey}
          className="absolute overflow-hidden rounded border-2 border-white/50"
          style={{
            left: region.x * scaleFactor,
            top: region.y * scaleFactor,
            width: region.width * scaleFactor,
            height: region.height * scaleFactor
          }}
        >
          {currentPhoto || cardData.image_url ? (
            <img 
              src={currentPhoto || cardData.image_url} 
              alt="Card" 
              className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => onElementSelect?.('image')}
            />
          ) : (
            <div 
              className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={onPhotoUpload}
            >
              <Camera className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500 text-center px-2">Click to add photo</span>
            </div>
          )}
        </div>
      );
    }

    // Handle title regions
    if (regionKey === fieldMapping.title) {
      return (
        <div 
          key={regionKey}
          className="absolute flex items-center justify-center text-white font-bold text-sm rounded shadow-lg"
          style={{
            left: region.x * scaleFactor,
            top: region.y * scaleFactor,
            width: region.width * scaleFactor,
            height: region.height * scaleFactor,
            backgroundColor: colors.primary
          }}
        >
          {cardData.title}
        </div>
      );
    }

    // Handle description/stats regions - use safe access
    if (regionKey === fieldMapping.description || (fieldMapping as any).stats === regionKey) {
      return (
        <div 
          key={regionKey}
          className="absolute p-2 text-xs rounded shadow-inner"
          style={{
            left: region.x * scaleFactor,
            top: region.y * scaleFactor,
            width: region.width * scaleFactor,
            height: region.height * scaleFactor,
            backgroundColor: colors.secondary,
            color: colors.text === '#ffffff' ? '#000000' : colors.text
          }}
        >
          <div className="font-semibold mb-1">Description:</div>
          <div className="text-xs opacity-90">{cardData.description || 'Add a description for your card'}</div>
          <div className="mt-2 text-xs flex justify-between">
            <div>Rarity: {cardData.rarity}</div>
            <div>Edition: {cardData.edition_size || 1}/1</div>
          </div>
        </div>
      );
    }

    // Handle other template-specific regions
    const getRegionContent = () => {
      switch (regionKey) {
        case 'team':
        case 'company':
        case 'school':
          return 'Organization';
        case 'position':
          return 'Position/Role';
        case 'achievement':
          return 'Achievement';
        case 'friendship':
          return 'Friendship Level: Best Friends';
        case 'memories':
          return 'Shared memories and adventures';
        case 'era':
          return 'Classic Era';
        case 'story':
          return 'A timeless story worth remembering';
        default:
          return 'Custom Field';
      }
    };

    return (
      <div 
        key={regionKey}
        className="absolute flex items-center justify-center px-2 text-xs font-medium"
        style={{
          left: region.x * scaleFactor,
          top: region.y * scaleFactor,
          width: region.width * scaleFactor,
          height: region.height * scaleFactor,
          backgroundColor: colors.accent,
          color: 'white'
        }}
      >
        <span className="text-center">{getRegionContent()}</span>
      </div>
    );
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: '#6b7280',
      uncommon: '#10b981',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#f59e0b'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  return (
    <div 
      className="relative rounded-xl shadow-2xl border-4 border-crd-green/30 overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer group"
      style={{ 
        width: actualWidth, 
        height: actualHeight,
        backgroundColor: colors.background 
      }}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-crd-green/10 to-crd-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Render all regions dynamically */}
      {Object.entries(regions).map(([regionKey, region]) => 
        renderRegion(regionKey, region)
      )}

      {/* Rarity badge */}
      <div className="absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white rounded-full shadow-lg"
        style={{ backgroundColor: getRarityColor(cardData.rarity) }}>
        {cardData.rarity.toUpperCase()}
      </div>
    </div>
  );
};

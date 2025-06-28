
import React from 'react';
import { ProcessedPSDLayer } from '@/services/psdProcessor/psdProcessingService';
import { PSDCard } from '@/components/ui/design-system/PSDCard';
import { Badge } from '@/components/ui/badge';
import { LayerHoverCard } from './LayerHoverCard';
import { 
  Image, 
  Frame, 
  Eye, 
  EyeOff,
  User,
  Palette
} from 'lucide-react';

interface FrameModeViewProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  onLayerToggle: (layerId: string) => void;
}

export const FrameModeView: React.FC<FrameModeViewProps> = ({
  layers,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  onLayerToggle
}) => {
  const categorizeLayersForFrame = (layers: ProcessedPSDLayer[]) => {
    const content: ProcessedPSDLayer[] = [];
    const design: ProcessedPSDLayer[] = [];

    layers.forEach(layer => {
      const name = layer.name.toLowerCase();
      const semanticType = layer.semanticType;

      // Content: photos, subjects, backgrounds
      if (
        semanticType === 'player' ||
        semanticType === 'background' ||
        name.includes('photo') ||
        name.includes('image') ||
        name.includes('player') ||
        name.includes('character') ||
        name.includes('subject') ||
        name.includes('portrait')
      ) {
        content.push(layer);
      } 
      // Design: borders, frames, decorative elements
      else if (
        semanticType === 'border' ||
        semanticType === 'logo' ||
        semanticType === 'effect' ||
        name.includes('border') ||
        name.includes('frame') ||
        name.includes('logo') ||
        name.includes('decoration') ||
        name.includes('pattern') ||
        name.includes('ornament')
      ) {
        design.push(layer);
      }
      // Default to design for UI elements and text
      else {
        design.push(layer);
      }
    });

    return { content, design };
  };

  const { content, design } = categorizeLayersForFrame(layers);

  const renderLayerGroup = (
    groupLayers: ProcessedPSDLayer[], 
    title: string, 
    icon: React.ComponentType<{ className?: string }>,
    color: string
  ) => {
    const Icon = icon;
    
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
          <Icon className={`w-5 h-5 ${color}`} />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-600">
            {groupLayers.length}
          </Badge>
        </div>
        
        <div className="space-y-2">
          {groupLayers.map((layer) => {
            const isSelected = selectedLayerId === layer.id;
            const isHidden = hiddenLayers.has(layer.id);
            
            return (
              <LayerHoverCard key={layer.id} layer={layer}>
                <PSDCard
                  variant="default"
                  className={`
                    p-3 cursor-pointer transition-all hover:bg-slate-800/50
                    ${isSelected ? 'border-crd-green bg-crd-green/10' : ''}
                    ${isHidden ? 'opacity-50' : ''}
                  `}
                  onClick={() => onLayerSelect(layer.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-3 h-3 rounded-full ${color.replace('text-', 'bg-')}`} />
                      <span className="text-sm font-medium text-white truncate">
                        {layer.name}
                      </span>
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-slate-800 text-slate-400 border-slate-600 ml-auto"
                      >
                        {layer.semanticType || layer.type}
                      </Badge>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerToggle(layer.id);
                      }}
                      className="text-slate-400 hover:text-white transition-colors ml-2"
                    >
                      {isHidden ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </PSDCard>
              </LayerHoverCard>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {content.length > 0 && renderLayerGroup(
        content, 
        'Content', 
        User, 
        'text-blue-400'
      )}
      
      {design.length > 0 && renderLayerGroup(
        design, 
        'Design', 
        Palette, 
        'text-purple-400'
      )}
      
      {content.length === 0 && design.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <Frame className="w-12 h-12 mx-auto mb-4 text-slate-600" />
          <p>No layers to categorize</p>
        </div>
      )}
    </div>
  );
};

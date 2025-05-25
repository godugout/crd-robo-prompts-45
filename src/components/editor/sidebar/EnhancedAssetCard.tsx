
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AssetCardProps {
  asset: {
    id: string;
    name: string;
    thumbnail: string;
    url?: string;
    category: string;
    tags?: string[];
    size?: { width: number; height: number };
  };
}

export const EnhancedAssetCard = ({ asset }: AssetCardProps) => {
  const handleAssetClick = () => {
    // Use the enhanced asset integration function
    if ((window as any).addAssetToCanvas) {
      const assetData = {
        id: asset.id,
        name: asset.name,
        url: asset.url || asset.thumbnail,
        thumbnail: asset.thumbnail,
        category: asset.category,
        tags: asset.tags,
        size: asset.size
      };
      (window as any).addAssetToCanvas(assetData);
    } else {
      toast(`${asset.name} added to canvas`);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', asset.id);
    
    if ((window as any).handleAssetDragStart) {
      (window as any).handleAssetDragStart(asset);
    }
  };

  const handleDragEnd = () => {
    if ((window as any).handleAssetDragEnd) {
      (window as any).handleAssetDragEnd();
    }
  };

  return (
    <div 
      className="group p-3 rounded-lg cursor-pointer flex flex-col bg-editor-darker hover:bg-editor-tool/50 transition-all duration-200 border border-transparent hover:border-crd-green/30"
      onClick={handleAssetClick}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="relative mb-2 overflow-hidden rounded">
        <img 
          src={asset.thumbnail} 
          alt={asset.name} 
          className="w-full aspect-square object-cover transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        
        {/* Drag indicator */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-crd-green/80 text-white px-2 py-1 rounded text-xs font-medium">
            Drag to Canvas
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-cardshow-white font-medium text-sm leading-tight">{asset.name}</p>
        
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs bg-editor-tool text-cardshow-lightGray">
            {asset.category}
          </Badge>
          
          {asset.size && (
            <span className="text-xs text-cardshow-lightGray">
              {asset.size.width}×{asset.size.height}
            </span>
          )}
        </div>
        
        {asset.tags && asset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {asset.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag} 
                className="text-xs bg-crd-orange/20 text-crd-orange px-1.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
            {asset.tags.length > 2 && (
              <span className="text-xs text-cardshow-lightGray">
                +{asset.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

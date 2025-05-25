
import React from 'react';
import { toast } from 'sonner';

interface AssetCardProps {
  asset: {
    id: string;
    name: string;
    thumb: string;
    url?: string;
  };
}

export const AssetCard = ({ asset }: AssetCardProps) => {
  const handleAssetClick = () => {
    // Use the global asset integration function
    if ((window as any).addAssetToCanvas) {
      const assetData = {
        id: asset.id,
        name: asset.name,
        url: asset.url || asset.thumb,
        thumbnail: asset.thumb
      };
      (window as any).addAssetToCanvas(assetData);
    } else {
      toast(`${asset.name} added to canvas`);
    }
  };

  return (
    <div 
      key={asset.id}
      className="p-3 rounded-lg cursor-pointer flex flex-col items-center bg-editor-darker hover:bg-editor-tool/50 transition-colors"
      onClick={handleAssetClick}
    >
      <img 
        src={asset.thumb} 
        alt={asset.name} 
        className="w-full aspect-square rounded bg-editor-tool object-cover mb-2"
        loading="lazy"
      />
      <p className="text-cardshow-white font-medium text-sm text-center">{asset.name}</p>
    </div>
  );
};

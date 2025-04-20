
import React from 'react';
import { toast } from 'sonner';

interface AssetCardProps {
  asset: {
    id: string;
    name: string;
    thumb: string;
  };
}

export const AssetCard = ({ asset }: AssetCardProps) => {
  return (
    <div 
      key={asset.id}
      className="p-3 rounded-lg cursor-pointer flex flex-col items-center bg-editor-darker hover:bg-editor-tool/50 transition-colors"
      onClick={() => toast(`${asset.name} added to canvas`)}
    >
      <img src={asset.thumb} alt={asset.name} className="w-full aspect-square rounded bg-editor-tool object-cover mb-2" />
      <p className="text-cardshow-white font-medium text-sm text-center">{asset.name}</p>
    </div>
  );
};

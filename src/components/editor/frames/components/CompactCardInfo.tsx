
import React, { useState } from 'react';
import { Edit2 } from 'lucide-react';
import { CardMetadataDialog } from './CardMetadataDialog';

interface CompactCardInfoProps {
  title?: string;
  description?: string;
  rarity?: string;
  onUpdate?: (data: { title: string; description: string; rarity: string }) => void;
  className?: string;
}

export const CompactCardInfo: React.FC<CompactCardInfoProps> = ({
  title = "Your Card Title",
  description = "Description",
  rarity = "common",
  onUpdate,
  className = ""
}) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleUpdate = (data: { title: string; description: string; rarity: string }) => {
    onUpdate?.(data);
    setShowDialog(false);
  };

  return (
    <>
      <div className={`flex items-center justify-between p-2 group hover:bg-black/10 rounded transition-colors ${className}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm truncate">{title}</h4>
            <span className={`px-2 py-0.5 text-xs rounded uppercase font-medium ${
              rarity === 'legendary' ? 'bg-yellow-200 text-yellow-800' :
              rarity === 'epic' ? 'bg-purple-200 text-purple-800' :
              rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
              'bg-gray-200 text-gray-800'
            }`}>
              {rarity}
            </span>
          </div>
          <p className="text-xs opacity-70 truncate">{description}</p>
        </div>
        
        <button
          onClick={() => setShowDialog(true)}
          className="ml-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-black/20 transition-all"
          title="Edit card details"
        >
          <Edit2 className="w-3 h-3" />
        </button>
      </div>

      <CardMetadataDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        title={title}
        description={description}
        rarity={rarity}
        onSave={handleUpdate}
      />
    </>
  );
};

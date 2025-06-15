
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, Lock, Eye, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserCard } from '@/hooks/useUserCards';

interface ProfileCardThumbnailProps {
  card: UserCard;
  isSelected?: boolean;
  isMultiSelectMode?: boolean;
  onSelect?: (cardId: string) => void;
  onEdit?: (cardId: string) => void;
}

export const ProfileCardThumbnail: React.FC<ProfileCardThumbnailProps> = ({
  card,
  isSelected = false,
  isMultiSelectMode = false,
  onSelect,
  onEdit
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isMultiSelectMode && onSelect) {
      onSelect(card.id);
    } else {
      navigate(`/card/${card.id}`);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(card.id);
    } else {
      navigate(`/card/${card.id}`);
    }
  };

  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-crd-green' : ''
      }`}
      onClick={handleClick}
    >
      {/* Multi-select checkbox */}
      {isMultiSelectMode && (
        <div className="absolute top-2 left-2 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect?.(card.id)}
            className="bg-black/50 border-white/50"
          />
        </div>
      )}

      {/* Card Image */}
      <div className="aspect-[2.5/3.5] bg-editor-darker rounded-lg overflow-hidden">
        {card.image_url ? (
          <img
            src={card.image_url}
            alt={card.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-crd-lightGray">
            No Image
          </div>
        )}

        {/* Overlay with controls */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/card/${card.id}`);
              }}
              size="sm"
              variant="outline"
              className="bg-black/50 border-white/20 text-white hover:bg-black/70"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleEdit}
              size="sm"
              className="bg-crd-green hover:bg-crd-green/90 text-black"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-white truncate flex-1 mr-2">
            {card.title}
          </h3>
          <div className="flex items-center gap-1">
            {card.is_public ? (
              <Globe className="w-4 h-4 text-crd-green" />
            ) : (
              <Lock className="w-4 h-4 text-yellow-400" />
            )}
          </div>
        </div>
        
        {card.description && (
          <p className="text-sm text-crd-lightGray truncate">
            {card.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-crd-lightGray">
          <span className="capitalize">{card.rarity}</span>
          {card.created_at && (
            <span>
              {new Date(card.created_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

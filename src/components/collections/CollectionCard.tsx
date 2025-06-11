
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash2, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Collection } from '@/repositories/collection/types';

interface CollectionCardProps {
  collection: Collection;
  onEdit?: (collection: Collection) => void;
  onDelete?: (collectionId: string) => void;
  onView?: (collection: Collection) => void;
  showOwner?: boolean;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onEdit,
  onDelete,
  onView,
  showOwner = false
}) => {
  const hasActions = onEdit || onDelete;

  return (
    <Card className="bg-editor-dark border-crd-mediumGray/20 overflow-hidden hover:border-crd-mediumGray/40 transition-colors">
      <div 
        className="h-32 bg-cover bg-center bg-crd-mediumGray"
        style={{ 
          backgroundImage: collection.coverImageUrl 
            ? `url(${collection.coverImageUrl})` 
            : undefined
        }}
      />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-crd-white text-sm truncate">
            {collection.title}
          </CardTitle>
          {hasActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onView && (
                  <DropdownMenuItem onClick={() => onView(collection)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(collection)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(collection.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-crd-lightGray text-xs line-clamp-2 mb-2">
          {collection.description || 'A curated collection of cards'}
        </p>
        
        {showOwner && (
          <div className="flex items-center gap-1 text-xs text-crd-lightGray mb-2">
            <User className="h-3 w-3" />
            <span>by Creator</span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-crd-lightGray">
          <span>{collection.cardCount || 0} cards</span>
          <span>{new Date(collection.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full border-crd-mediumGray text-crd-lightGray hover:text-white hover:bg-crd-mediumGray/20 text-xs"
          onClick={() => onView?.(collection)}
        >
          <Eye className="mr-1 h-3 w-3" />
          View Collection
        </Button>
      </CardFooter>
    </Card>
  );
};

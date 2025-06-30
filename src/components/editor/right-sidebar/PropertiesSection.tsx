
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useCardEditor } from '@/hooks/useCardEditor';
import { useTags } from '@/components/memory/hooks/useTags';

interface PropertiesSectionProps {
  cardEditor: ReturnType<typeof useCardEditor>;
}

export const PropertiesSection = ({ cardEditor }: PropertiesSectionProps) => {
  const { cardData, updateCardField } = cardEditor;
  
  // Use the enhanced useTags hook for tag functionality
  const { 
    tags, 
    handleTagInput, 
    handlePaste, 
    removeTag, 
    hasMaxTags 
  } = useTags(cardData.tags || [], { 
    maxTags: 10,
    onTagAdded: (tag: string) => {
      const currentTags = cardData.tags || [];
      updateCardField('tags', [...currentTags, tag]);
    },
    onTagRemoved: (tag: string) => {
      const currentTags = cardData.tags || [];
      updateCardField('tags', currentTags.filter(t => t !== tag));
    }
  });

  return (
    <div className="p-6 border-b border-editor-border">
      <h3 className="text-cardshow-white font-semibold mb-4">Properties</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="tags-input" className="text-cardshow-lightGray text-sm">
            Tags ({tags.length}/10)
          </Label>
          <Input
            id="tags-input"
            onKeyDown={handleTagInput}
            onPaste={handlePaste}
            placeholder={hasMaxTags ? "Maximum tags reached" : "Add tags (press Enter or use commas to separate)"}
            disabled={hasMaxTags}
            className="bg-editor-darker border-editor-border text-cardshow-white mt-1"
          />
          <p className="text-xs text-cardshow-lightGray/70 mt-1">
            Separate multiple tags with commas, semicolons, or paste from clipboard
          </p>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-cardshow-blue/20 text-cardshow-blue border-cardshow-blue/30 flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-cardshow-white"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

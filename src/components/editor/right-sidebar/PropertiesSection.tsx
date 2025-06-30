
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useCardEditor } from '@/hooks/useCardEditor';

interface PropertiesSectionProps {
  cardEditor: ReturnType<typeof useCardEditor>;
}

export const PropertiesSection = ({ cardEditor }: PropertiesSectionProps) => {
  const { cardData, updateCardField, tags, addTag, removeTag, hasMaxTags } = cardEditor;

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.currentTarget;
      const value = input.value.trim();
      if (value && !hasMaxTags && !tags.includes(value)) {
        addTag(value);
        input.value = '';
      }
    }
  };

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
            onKeyPress={handleTagKeyPress}
            placeholder={hasMaxTags ? "Maximum tags reached" : "Add tags (press Enter)"}
            disabled={hasMaxTags}
            className="bg-editor-darker border-editor-border text-cardshow-white mt-1"
          />
          
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

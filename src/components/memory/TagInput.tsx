
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onTagAdd: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onTagRemove: (tagToRemove: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onTagAdd,
  onTagRemove,
  disabled = false,
  placeholder = "Add tags..."
}) => {
  return (
    <div className="space-y-2">
      <Input
        onKeyDown={onTagAdd}
        placeholder={placeholder}
        disabled={disabled}
        className="bg-slate-800 border-slate-600"
      />
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-400"
                onClick={() => onTagRemove(tag)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};


import React from 'react';
import { X } from 'lucide-react';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface TagInputProps {
  tags: string[];
  onTagAdd: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onTagRemove: (tag: string) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const TagInput = ({ 
  tags, 
  onTagAdd, 
  onTagRemove, 
  onPaste,
  disabled 
}: TagInputProps) => {
  return (
    <FormItem>
      <FormLabel>Tags</FormLabel>
      <div className="space-y-2">
        <Input
          placeholder={disabled ? "Maximum tags reached" : "Add tags (press Enter or use commas to separate multiple tags)"}
          onKeyDown={onTagAdd}
          onPaste={onPaste}
          disabled={disabled}
        />
        <div className="text-xs text-muted-foreground">
          Separate multiple tags with commas, semicolons, or paste from clipboard
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm bg-primary/10 text-primary"
            >
              {tag}
              <button
                type="button"
                onClick={() => onTagRemove(tag)}
                className="hover:text-primary/80"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {tag} tag</span>
              </button>
            </span>
          ))}
        </div>
      </div>
    </FormItem>
  );
};

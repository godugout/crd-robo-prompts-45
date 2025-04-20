
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface UseTagsOptions {
  maxTags?: number;
  validateTag?: (tag: string) => boolean;
  onTagAdded?: (tag: string) => void;
  onTagRemoved?: (tag: string) => void;
}

export const useTags = (initialTags: string[] = [], options: UseTagsOptions = {}) => {
  const {
    maxTags = 20,
    validateTag = () => true,
    onTagAdded,
    onTagRemoved
  } = options;
  
  const [tags, setTags] = useState<string[]>(initialTags);

  const addTag = useCallback((tag: string) => {
    const trimmedTag = tag.trim().toUpperCase();
    
    if (!trimmedTag) {
      return;
    }

    if (tags.length >= maxTags) {
      toast.error(`Maximum ${maxTags} tags allowed`);
      return;
    }

    if (tags.includes(trimmedTag)) {
      toast.error('Tag already exists');
      return;
    }

    if (!validateTag(trimmedTag)) {
      toast.error('Invalid tag format');
      return;
    }

    setTags(prev => [...prev, trimmedTag]);
    onTagAdded?.(trimmedTag);
    toast.success(`Tag "${trimmedTag}" added`);
  }, [tags, maxTags, validateTag, onTagAdded]);

  const removeTag = useCallback((tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
    onTagRemoved?.(tagToRemove);
    toast(`Tag "${tagToRemove}" removed`);
  }, [onTagRemoved]);

  const handleTagInput = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const value = input.value.trim();

    if ((event.key === 'Enter' || event.key === ',') && value) {
      event.preventDefault();
      addTag(value);
      input.value = '';
    }
  }, [addTag]);

  return { 
    tags, 
    addTag, 
    removeTag, 
    handleTagInput,
    hasMaxTags: tags.length >= maxTags 
  };
};


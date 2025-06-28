
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface UseTagsOptions {
  maxTags?: number;
  validateTag?: (tag: string) => boolean;
  onTagAdded?: (tag: string) => void;
  onTagRemoved?: (tag: string) => void;
}

const TAG_DELIMITERS = /[,;|\n\t]+/;

export const useTags = (initialTags: string[] = [], options: UseTagsOptions = {}) => {
  const {
    maxTags = 20,
    validateTag = () => true,
    onTagAdded,
    onTagRemoved
  } = options;
  
  const [tags, setTags] = useState<string[]>(initialTags);

  const splitTagsFromInput = (input: string): string[] => {
    return input
      .split(TAG_DELIMITERS)
      .map(tag => tag.trim().toUpperCase())
      .filter(tag => tag.length > 0);
  };

  const addTag = useCallback((tag: string) => {
    const trimmedTag = tag.trim().toUpperCase();
    
    if (!trimmedTag) {
      return false;
    }

    if (tags.length >= maxTags) {
      toast.error(`Maximum ${maxTags} tags allowed`);
      return false;
    }

    if (tags.includes(trimmedTag)) {
      toast.error('Tag already exists');
      return false;
    }

    if (!validateTag(trimmedTag)) {
      toast.error('Invalid tag format');
      return false;
    }

    setTags(prev => [...prev, trimmedTag]);
    onTagAdded?.(trimmedTag);
    toast.success(`Tag "${trimmedTag}" added`);
    return true;
  }, [tags, maxTags, validateTag, onTagAdded]);

  const addMultipleTags = useCallback((inputTags: string[]) => {
    const uniqueNewTags = inputTags.filter(tag => 
      tag && !tags.includes(tag.toUpperCase()) && validateTag(tag.toUpperCase())
    );

    const availableSlots = maxTags - tags.length;
    const tagsToAdd = uniqueNewTags.slice(0, availableSlots);
    
    if (tagsToAdd.length === 0) {
      if (uniqueNewTags.length === 0) {
        toast.error('No valid new tags to add');
      } else {
        toast.error(`No available slots (${tags.length}/${maxTags})`);
      }
      return 0;
    }

    const processedTags = tagsToAdd.map(tag => tag.trim().toUpperCase());
    
    setTags(prev => [...prev, ...processedTags]);
    
    processedTags.forEach(tag => onTagAdded?.(tag));
    
    if (tagsToAdd.length === 1) {
      toast.success(`Tag "${processedTags[0]}" added`);
    } else {
      toast.success(`${tagsToAdd.length} tags added successfully`);
      
      if (uniqueNewTags.length > tagsToAdd.length) {
        toast.warning(`${uniqueNewTags.length - tagsToAdd.length} tags skipped (limit reached)`);
      }
    }
    
    return tagsToAdd.length;
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
      
      // Check if input contains multiple tags
      const potentialTags = splitTagsFromInput(value);
      
      if (potentialTags.length > 1) {
        // Multiple tags detected
        const addedCount = addMultipleTags(potentialTags);
        if (addedCount > 0) {
          input.value = '';
        }
      } else if (potentialTags.length === 1) {
        // Single tag
        if (addTag(potentialTags[0])) {
          input.value = '';
        }
      }
    }
  }, [addTag, addMultipleTags, splitTagsFromInput]);

  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = event.clipboardData.getData('text');
    const potentialTags = splitTagsFromInput(pastedText);
    
    if (potentialTags.length > 1) {
      event.preventDefault();
      const addedCount = addMultipleTags(potentialTags);
      
      if (addedCount > 0) {
        event.currentTarget.value = '';
      }
    }
  }, [addMultipleTags, splitTagsFromInput]);

  return { 
    tags, 
    addTag, 
    addMultipleTags,
    removeTag, 
    handleTagInput,
    handlePaste,
    hasMaxTags: tags.length >= maxTags 
  };
};

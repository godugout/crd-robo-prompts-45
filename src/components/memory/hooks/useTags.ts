
import { useState, useCallback } from 'react';

export const useTags = (initialTags: string[] = []) => {
  const [tags, setTags] = useState<string[]>(initialTags);

  const addTag = useCallback((tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags(prev => [...prev, trimmedTag]);
    }
  }, [tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  }, []);

  const handleTagInput = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const value = input.value.trim();

    if ((event.key === 'Enter' || event.key === ',') && value) {
      event.preventDefault();
      addTag(value);
      input.value = '';
    }
  }, [addTag]);

  return { tags, addTag, removeTag, handleTagInput };
};

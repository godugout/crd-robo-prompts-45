
import React from 'react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const SearchBar = ({ searchQuery, onSearchChange }: SearchBarProps) => {
  return (
    <div className="p-4 border-b border-editor-border">
      <Input
        placeholder="Search templates & assets..."
        className="bg-editor-darker border-editor-border text-white focus-visible:ring-cardshow-blue"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

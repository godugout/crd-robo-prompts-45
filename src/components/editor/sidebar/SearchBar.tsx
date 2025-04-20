
import React from 'react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="p-4 border-b border-editor-border">
      <Input
        placeholder="Search templates & assets..."
        className="bg-editor-darker border-editor-border text-white focus-visible:ring-cardshow-blue"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

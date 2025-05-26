
import React from 'react';
import { PhotoTab } from '../PhotoTab';

interface PhotoStepProps {
  selectedTemplate: string;
  searchQuery: string;
}

export const PhotoStep = ({ selectedTemplate, searchQuery }: PhotoStepProps) => {
  return (
    <div className="h-full">
      <PhotoTab selectedTemplate={selectedTemplate} searchQuery={searchQuery} />
    </div>
  );
};

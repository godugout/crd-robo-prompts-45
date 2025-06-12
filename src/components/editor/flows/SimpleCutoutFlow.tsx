
import React from 'react';
import { SimpleCutoutEditor } from '../cutout/SimpleCutoutEditor';
import { useCardEditor } from '@/hooks/useCardEditor';

export const SimpleCutoutFlow: React.FC = () => {
  const cardEditor = useCardEditor({
    initialData: {
      title: 'My Cutout Card',
      rarity: 'common',
      tags: ['cutout', 'custom'],
      visibility: 'private',
      creator_attribution: { collaboration_type: 'solo' },
      publishing_options: {
        marketplace_listing: false,
        crd_catalog_inclusion: true,
        print_available: false,
        pricing: { currency: 'USD' },
        distribution: { limited_edition: false }
      }
    },
    autoSave: true
  });

  return (
    <div className="h-screen bg-editor-darker">
      <SimpleCutoutEditor cardEditor={cardEditor} />
    </div>
  );
};

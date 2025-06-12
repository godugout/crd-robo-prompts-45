
import React from 'react';
import { OakTemplate } from '@/types/oakTemplates';
import { TemplateConfig } from '@/components/editor/wizard/wizardConfig';

export const convertOakTemplateToStudio = (oakTemplate: OakTemplate): TemplateConfig => {
  return {
    id: oakTemplate.id,
    name: oakTemplate.name,
    category: oakTemplate.category.toLowerCase(),
    thumbnail: oakTemplate.thumbnail,
    template_data: {
      background_color: oakTemplate.colors?.primary || '#0f4c3a',
      border_color: oakTemplate.colors?.secondary || '#ffd700',
      text_color: oakTemplate.colors?.accent || '#ffffff',
      layout: 'full-bleed' as const,
      style: 'vintage' as const,
      oaklandTheme: true,
      era: oakTemplate.era,
      tags: oakTemplate.tags
    }
  };
};

export const createOakStudioTemplate = (oakTemplate: OakTemplate, imageUrl?: string) => {
  const studioTemplate = convertOakTemplateToStudio(oakTemplate);
  
  return {
    ...studioTemplate,
    template_data: {
      ...studioTemplate.template_data,
      image_url: imageUrl || oakTemplate.thumbnail,
      title: oakTemplate.name,
      description: oakTemplate.description
    }
  };
};

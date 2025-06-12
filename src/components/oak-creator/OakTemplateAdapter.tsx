
import React from 'react';
import { OakTemplate } from '@/types/oakTemplates';
import { TemplateConfig } from '@/components/editor/wizard/wizardConfig';

export const convertOakTemplateToStudio = (oakTemplate: OakTemplate): TemplateConfig => {
  const templateConfig: TemplateConfig = {
    id: oakTemplate.id,
    name: oakTemplate.name,
    category: oakTemplate.category.toLowerCase(),
    template_data: {
      layout: 'full-bleed',
      style: {
        primaryColor: oakTemplate.colors?.primary || '#0f4c3a',
        accentColor: oakTemplate.colors?.secondary || '#ffd700',
        backgroundColor: oakTemplate.colors?.accent || '#ffffff',
        borderRadius: 8,
        borderWidth: 2
      },
      typography: {
        titleFont: 'Inter',
        bodyFont: 'Inter',
        titleSize: 24,
        bodySize: 14
      },
      effects: ['vintage'],
      supports_stickers: true,
      thumbnail: oakTemplate.thumbnail
    }
  };
  return templateConfig;
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

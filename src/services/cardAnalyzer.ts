
import { supabase } from '@/integrations/supabase/client';

export interface CardAnalysisResult {
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tags: string[];
  category: string;
  type: string;
  series: string;
}

export const analyzeCardImage = async (imageDataUrl: string): Promise<CardAnalysisResult> => {
  try {
    console.log('Analyzing card image with AI...');
    
    // Call Supabase Edge Function for AI analysis
    const { data, error } = await supabase.functions.invoke('analyze-card-image', {
      body: { imageData: imageDataUrl }
    });

    if (error) {
      console.error('AI analysis error:', error);
      return getDefaultCardData();
    }

    return {
      title: data.title || 'Untitled Card',
      description: data.description || 'A unique trading card with distinctive features.',
      rarity: data.rarity || 'common',
      tags: data.tags || ['trading-card', 'collectible'],
      category: data.category || 'Trading Card',
      type: data.type || 'Character',
      series: data.series || 'Custom Series'
    };
  } catch (error) {
    console.error('Card analysis failed:', error);
    return getDefaultCardData();
  }
};

const getDefaultCardData = (): CardAnalysisResult => {
  return {
    title: 'Custom Trading Card',
    description: 'A unique collectible card featuring custom artwork and design.',
    rarity: 'common',
    tags: ['custom', 'trading-card', 'collectible'],
    category: 'Trading Card',
    type: 'Character',
    series: 'Custom Collection'
  };
};

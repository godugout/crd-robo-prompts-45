
export interface CardAnalysisResult {
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tags: string[];
  category?: string;
}

export const analyzeCardImage = async (imageFile: File): Promise<CardAnalysisResult> => {
  // Simulate AI analysis for now - in a real implementation this would call an AI service
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate some example analysis based on file name or random selection
      const filename = imageFile.name.toLowerCase();
      
      let analysis: CardAnalysisResult;
      
      if (filename.includes('car') || filename.includes('vehicle')) {
        analysis = {
          title: 'Classic Sports Car',
          description: 'A stunning vintage sports car captured in perfect lighting.',
          rarity: 'rare',
          tags: ['vehicle', 'sports', 'classic', 'automotive'],
          category: 'vehicles'
        };
      } else if (filename.includes('person') || filename.includes('portrait')) {
        analysis = {
          title: 'Portrait Card',
          description: 'A memorable portrait captured in time.',
          rarity: 'uncommon',
          tags: ['portrait', 'person', 'character'],
          category: 'people'
        };
      } else if (filename.includes('nature') || filename.includes('landscape')) {
        analysis = {
          title: 'Natural Wonder',
          description: 'A breathtaking view of nature\'s beauty.',
          rarity: 'common',
          tags: ['nature', 'landscape', 'scenic'],
          category: 'nature'
        };
      } else {
        analysis = {
          title: 'My Awesome Card',
          description: 'A unique and special card created from your image.',
          rarity: 'uncommon',
          tags: ['custom', 'unique', 'special'],
          category: 'general'
        };
      }
      
      resolve(analysis);
    }, 2000); // Simulate processing time
  });
};

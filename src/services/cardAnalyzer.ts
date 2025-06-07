
export interface CardAnalysisResult {
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tags: string[];
  category: string;
}

export const analyzeCardImage = async (file: File): Promise<CardAnalysisResult> => {
  // Simulate AI analysis delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simple analysis based on file name and random generation
  const fileName = file.name.toLowerCase();
  
  const categories = ['sports', 'pokemon', 'gaming', 'art', 'anime', 'nature'];
  const adjectives = ['Amazing', 'Epic', 'Legendary', 'Rare', 'Powerful', 'Mystical', 'Unique'];
  const nouns = ['Card', 'Hero', 'Champion', 'Legend', 'Master', 'Guardian'];
  
  // Generate suggestions based on filename or random
  const category = categories.find(cat => fileName.includes(cat)) || categories[Math.floor(Math.random() * categories.length)];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  const rarities: CardAnalysisResult['rarity'][] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  const rarity = rarities[Math.floor(Math.random() * rarities.length)];
  
  return {
    title: `${adjective} ${noun}`,
    description: `A ${rarity} ${category} card with incredible power and unique abilities. Perfect for collectors and enthusiasts.`,
    rarity,
    tags: [category, adjective.toLowerCase(), noun.toLowerCase(), 'auto-generated'],
    category
  };
};

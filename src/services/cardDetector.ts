
export interface DetectedCard {
  imageUrl: string;
  confidence: number;
  aspectRatio: number;
  caption?: string;
}

export const detectTradingCards = async (posts: any[]): Promise<DetectedCard[]> => {
  const detectedCards: DetectedCard[] = [];

  for (const post of posts) {
    try {
      const { width, height } = post.dimensions;
      const aspectRatio = width / height;
      
      // Get caption text
      const caption = post.edge_media_to_caption?.edges?.[0]?.node?.text || '';
      
      // Enhanced keyword detection for trading cards
      const cardKeywords = [
        'card', 'trading', 'collectible', 'pokemon', 'baseball', 'basketball', 
        'football', 'tcg', 'mtg', 'yugioh', 'topps', 'panini', 'upper deck',
        'rookie', 'autograph', 'patch', 'relic', 'graded', 'psa', 'bgs',
        'prizm', 'optic', 'mosaic', 'select', 'chronicles', 'donruss'
      ];
      
      const hasCardKeywords = cardKeywords.some(keyword => 
        caption.toLowerCase().includes(keyword)
      );

      let confidence = 0;
      
      // Enhanced scoring system
      
      // Basic image quality check
      if (width >= 300 && height >= 300) confidence += 20;
      if (width >= 600 && height >= 600) confidence += 10;
      
      // Caption keyword matching
      if (hasCardKeywords) confidence += 50;
      
      // Aspect ratio scoring (trading cards are typically rectangular)
      if (aspectRatio >= 0.6 && aspectRatio <= 0.8) {
        confidence += 30; // Portrait cards (most common)
      } else if (aspectRatio >= 1.2 && aspectRatio <= 1.7) {
        confidence += 25; // Landscape cards
      } else if (aspectRatio >= 0.9 && aspectRatio <= 1.1) {
        confidence += 15; // Square-ish (some special cards)
      }
      
      // Bonus for exact trading card ratios
      const cardRatio = 2.5 / 3.5; // Standard trading card ratio
      if (Math.abs(aspectRatio - cardRatio) < 0.05) {
        confidence += 20;
      }
      
      // Check image URL for card-related terms
      const urlHasCardTerms = cardKeywords.some(keyword =>
        post.display_url.toLowerCase().includes(keyword)
      );
      if (urlHasCardTerms) confidence += 15;
      
      // Lower threshold for scraped images since they might not have perfect metadata
      if (confidence >= 30) {
        detectedCards.push({
          imageUrl: post.display_url,
          confidence: Math.min(confidence, 100), // Cap at 100%
          aspectRatio,
          caption: caption || `Image from Instagram`
        });
      }
    } catch (error) {
      console.error('Error processing post:', error);
    }
  }

  // Sort by confidence and return top results
  return detectedCards
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 15); // Increased limit since we're being more permissive
};

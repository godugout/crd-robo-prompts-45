
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
      
      // Filter for images that might contain trading cards
      // Trading cards are typically 2.5:3.5 (0.714) ratio
      // We'll be lenient and check for rectangular images
      const isGoodDimensions = width >= 400 && height >= 400; // Minimum resolution
      const hasCardKeywords = post.edge_media_to_caption?.edges?.[0]?.node?.text
        ?.toLowerCase()
        .match(/(card|trading|collectible|pokemon|baseball|basketball|football|tcg|mtg|yugioh)/);

      let confidence = 0;
      
      // Scoring system
      if (isGoodDimensions) confidence += 30;
      if (hasCardKeywords) confidence += 40;
      if (aspectRatio > 0.6 && aspectRatio < 1.4) confidence += 30; // Rectangular-ish
      
      // Only include if confidence is above threshold
      if (confidence >= 50) {
        detectedCards.push({
          imageUrl: post.display_url,
          confidence,
          aspectRatio,
          caption: post.edge_media_to_caption?.edges?.[0]?.node?.text || ''
        });
      }
    } catch (error) {
      console.error('Error processing post:', error);
    }
  }

  // Sort by confidence and return top results
  return detectedCards
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 10);
};


import { supabase } from '@/lib/supabase-client';
import { CardRarity } from '@/types/card';

export interface DatabaseCardImage {
  id: string;
  title: string;
  image_url: string;
  thumbnail_url?: string;
  rarity?: CardRarity;
  description?: string;
  source_table: string;
}

// Helper function to validate and convert rarity strings to CardRarity type
const validateRarity = (rarity: string | null | undefined): CardRarity => {
  const validRarities = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
  if (rarity && validRarities.includes(rarity.toLowerCase())) {
    return rarity.toLowerCase() as CardRarity;
  }
  return 'common'; // Default fallback
};

export const fetchDatabaseCardImages = async (): Promise<DatabaseCardImage[]> => {
  const cardImages: DatabaseCardImage[] = [];

  try {
    // Fetch from main cards table
    const { data: mainCards } = await supabase
      .from('cards')
      .select('id, title, image_url, thumbnail_url, rarity, description')
      .not('image_url', 'is', null)
      .limit(20);

    if (mainCards) {
      cardImages.push(...mainCards.map(card => ({
        ...card,
        rarity: validateRarity(card.rarity),
        source_table: 'cards'
      })));
    }

    // Fetch from crd_cards table
    const { data: crdCards } = await supabase
      .from('crd_cards')
      .select('id, title, image_url, thumbnail_url, rarity, description')
      .not('image_url', 'is', null)
      .limit(20);

    if (crdCards) {
      cardImages.push(...crdCards.map(card => ({
        ...card,
        rarity: validateRarity(card.rarity),
        source_table: 'crd_cards'
      })));
    }

    // Fetch from psd_reconstructed_cards table if it exists
    try {
      const { data: psdCards } = await supabase
        .from('psd_reconstructed_cards')
        .select('id, title, image_url, thumbnail_url, reconstruction_data')
        .not('image_url', 'is', null)
        .limit(10);

      if (psdCards) {
        cardImages.push(...psdCards.map(card => ({
          id: card.id,
          title: card.title,
          image_url: card.image_url,
          thumbnail_url: card.thumbnail_url,
          rarity: 'rare' as CardRarity, // Default for PSD cards
          description: 'Reconstructed from PSD layers',
          source_table: 'psd_reconstructed_cards'
        })));
      }
    } catch (error) {
      console.log('PSD reconstructed cards table not accessible or empty');
    }

    // If we still don't have enough cards, try card_templates
    if (cardImages.length < 10) {
      const { data: templateCards } = await supabase
        .from('card_templates')
        .select('id, name, preview_images, template_data')
        .not('preview_images', 'is', null)
        .limit(10);

      if (templateCards) {
        templateCards.forEach(template => {
          if (template.preview_images && template.preview_images.length > 0) {
            cardImages.push({
              id: template.id,
              title: template.name,
              image_url: template.preview_images[0],
              thumbnail_url: template.preview_images[0],
              rarity: 'common' as CardRarity,
              description: 'Template preview',
              source_table: 'card_templates'
            });
          }
        });
      }
    }

    console.log('Found database card images:', cardImages.length);
    return cardImages.slice(0, 20); // Return max 20 cards
    
  } catch (error) {
    console.error('Error fetching database card images:', error);
    return [];
  }
};

// Fallback trading card images if database is empty
export const getFallbackCardImages = (): DatabaseCardImage[] => [
  {
    id: 'fallback-1',
    title: 'Sample Trading Card 1',
    image_url: '/lovable-uploads/3adf916a-0f96-4c37-a1bb-72235f0a299f.png',
    thumbnail_url: '/lovable-uploads/3adf916a-0f96-4c37-a1bb-72235f0a299f.png',
    rarity: 'rare' as CardRarity,
    description: 'Sample card for studio preview',
    source_table: 'fallback'
  },
  {
    id: 'fallback-2',
    title: 'Sample Trading Card 2',
    image_url: '/lovable-uploads/3adf916a-0f96-4c37-a1bb-72235f0a299f.png',
    thumbnail_url: '/lovable-uploads/3adf916a-0f96-4c37-a1bb-72235f0a299f.png',
    rarity: 'epic' as CardRarity,
    description: 'Sample card for studio preview',
    source_table: 'fallback'
  }
];

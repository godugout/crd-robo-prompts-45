
// UUID validation function
export const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// Validation function for card data
export const validateCardData = (cardData: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate required fields
  if (!cardData.title?.trim()) {
    errors.push('Title is required');
  }

  // Validate UUID fields
  if (cardData.id && !isValidUUID(cardData.id)) {
    errors.push(`Invalid card ID format: ${cardData.id}`);
  }

  if (cardData.template_id && !isValidUUID(cardData.template_id)) {
    errors.push(`Invalid template_id format: ${cardData.template_id}`);
  }

  if (cardData.shop_id && !isValidUUID(cardData.shop_id)) {
    errors.push(`Invalid shop_id format: ${cardData.shop_id}`);
  }

  if (cardData.collection_id && !isValidUUID(cardData.collection_id)) {
    errors.push(`Invalid collection_id format: ${cardData.collection_id}`);
  }

  if (cardData.team_id && !isValidUUID(cardData.team_id)) {
    errors.push(`Invalid team_id format: ${cardData.team_id}`);
  }

  // Validate rarity enum
  const validRarities = ['common', 'rare', 'legendary'];
  if (cardData.rarity && !validRarities.includes(cardData.rarity)) {
    errors.push(`Invalid rarity: ${cardData.rarity}. Must be one of: ${validRarities.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

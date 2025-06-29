
// Semantic type color mapping utility with fallbacks
export const SEMANTIC_TYPE_COLORS = {
  'player': '#3b82f6',
  'background': '#6b7280',
  'stats': '#10b981',
  'logo': '#f59e0b',
  'text': '#8b5cf6',
  'border': '#ef4444',
  'effect': '#ec4899',
  'unknown': '#64748b'
} as const;

export type SemanticType = keyof typeof SEMANTIC_TYPE_COLORS;

export const getSemanticTypeColor = (semanticType: string | undefined | null): string => {
  if (!semanticType) return SEMANTIC_TYPE_COLORS.unknown;
  
  const normalizedType = semanticType.toLowerCase() as SemanticType;
  return SEMANTIC_TYPE_COLORS[normalizedType] || SEMANTIC_TYPE_COLORS.unknown;
};

export const getSemanticTypeBadgeClass = (semanticType: string | undefined | null): string => {
  const color = getSemanticTypeColor(semanticType);
  return `bg-[${color}] text-white`;
};


export type SemanticType = 'player' | 'background' | 'stats' | 'logo' | 'effect' | 'border' | 'text' | 'image';

export const getSemanticTypeColor = (semanticType?: string): string => {
  if (!semanticType) return '#64748b'; // slate-500
  
  const colorMap: Record<string, string> = {
    'player': '#10b981', // emerald-500
    'background': '#6366f1', // indigo-500
    'stats': '#f59e0b', // amber-500
    'logo': '#ef4444', // red-500
    'effect': '#8b5cf6', // violet-500
    'border': '#06b6d4', // cyan-500
    'text': '#ec4899', // pink-500
    'image': '#22c55e', // green-500
  };
  
  return colorMap[semanticType.toLowerCase()] || '#64748b';
};

export const isValidSemanticType = (type: string): type is SemanticType => {
  const validTypes: SemanticType[] = ['player', 'background', 'stats', 'logo', 'effect', 'border', 'text', 'image'];
  return validTypes.includes(type as SemanticType);
};

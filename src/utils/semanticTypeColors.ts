
export const getSemanticTypeColor = (type?: string): string => {
  if (!type) return '#64748b'; // slate-500
  
  const colors: Record<string, string> = {
    'player': '#10b981', // emerald-500
    'background': '#6366f1', // indigo-500
    'stats': '#06b6d4', // cyan-500
    'logo': '#ec4899', // pink-500
    'border': '#f59e0b', // amber-500
    'text': '#3b82f6', // blue-500
    'effect': '#8b5cf6' // violet-500
  };
  return colors[type] || '#64748b';
};

export const getValidSemanticTypes = (): string[] => {
  return ['text', 'image', 'border', 'background', 'player', 'stats', 'logo', 'effect'];
};

export const isValidSemanticType = (type: string): boolean => {
  return getValidSemanticTypes().includes(type);
};

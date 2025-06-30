
export const useDynamicCardBackMaterials = (effectValues: Record<string, any>, card?: any) => {
  const selectedMaterial = {
    id: 'default',
    name: 'Default',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 1,
    blur: undefined as number | undefined,
    texture: undefined as string | undefined,
    logoTreatment: {
      filter: 'brightness(1.1) contrast(1.1)',
      opacity: 0.9,
      transform: 'scale(1)'
    }
  };

  // Apply effects-based material changes
  if (effectValues.holographic?.intensity > 0) {
    selectedMaterial.background = 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #7c3aed 100%)';
    selectedMaterial.borderColor = '#8b5cf6';
    selectedMaterial.texture = 'noise';
  } else if (effectValues.chrome?.intensity > 0) {
    selectedMaterial.background = 'linear-gradient(135deg, #374151 0%, #6b7280 50%, #374151 100%)';
    selectedMaterial.borderColor = '#6b7280';
    selectedMaterial.blur = 2;
  } else if (effectValues.gold?.intensity > 0) {
    selectedMaterial.background = 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #d97706 100%)';
    selectedMaterial.borderColor = '#f59e0b';
    selectedMaterial.texture = 'noise';
  }

  return { selectedMaterial };
};

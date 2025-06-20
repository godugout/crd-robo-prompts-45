
import { useCallback } from 'react';
import { useStudioState } from './useStudioState';

export const useEffectActions = () => {
  const {
    effectValues,
    setEffectValues
  } = useStudioState();

  const handleEffectChange = useCallback((effectId: string, value: any) => {
    console.log('✨ Effect changed:', effectId, value);
    const newEffectValues = {
      ...effectValues,
      [effectId]: value
    };
    setEffectValues(newEffectValues);
  }, [effectValues, setEffectValues]);

  return {
    handleEffectChange
  };
};


import { useImageActions } from './useImageActions';
import { useFrameActions } from './useFrameActions';
import { useEffectActions } from './useEffectActions';
import { usePhaseActions } from './usePhaseActions';
import { useHistoryActions } from './useHistoryActions';

export const useStudioActions = () => {
  const imageActions = useImageActions();
  const frameActions = useFrameActions();
  const effectActions = useEffectActions();
  const phaseActions = usePhaseActions();
  const historyActions = useHistoryActions();

  return {
    ...imageActions,
    ...frameActions,
    ...effectActions,
    ...phaseActions,
    ...historyActions
  };
};

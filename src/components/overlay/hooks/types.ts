
export type EnhancedDialogStep = 'upload' | 'detect' | 'refine' | 'extract';

export interface ManualRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  isManual?: boolean;
}

export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentRegion?: ManualRegion;
}

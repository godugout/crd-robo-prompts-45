
export interface DetectedFace {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  landmarks?: any;
  expressions?: Record<string, number>;
}

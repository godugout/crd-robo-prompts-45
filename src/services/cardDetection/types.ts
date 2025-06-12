
export interface ExtractedCard {
  imageBlob: Blob;
  confidence: number;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  originalImage: string;
}

export interface DetectedRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

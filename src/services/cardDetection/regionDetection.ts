
import type { DetectedRegion } from './types';

export const detectCardRegions = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Promise<DetectedRegion[]> => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const regions: DetectedRegion[] = [];

  // Simple edge detection algorithm
  const edges = detectEdges(imageData);
  const contours = findContours(edges);
  const rectangles = findRectangles(contours);

  // Filter for card-like rectangles (approximately 2.5:3.5 aspect ratio)
  const targetRatio = 2.5 / 3.5;
  const tolerance = 0.3;

  for (const rect of rectangles) {
    const ratio = rect.width / rect.height;
    const ratioDiff = Math.abs(ratio - targetRatio);
    
    if (ratioDiff <= tolerance) {
      regions.push({
        x: rect.x / canvas.width,
        y: rect.y / canvas.height,
        width: rect.width / canvas.width,
        height: rect.height / canvas.height,
        confidence: Math.max(0.1, 1 - (ratioDiff / tolerance))
      });
    }
  }

  return regions.sort((a, b) => b.confidence - a.confidence).slice(0, 8);
};

const detectEdges = (imageData: ImageData): Uint8ClampedArray => {
  const { data, width, height } = imageData;
  const edges = new Uint8ClampedArray(width * height);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const gray = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
      
      // Simple Sobel edge detection
      const gx = -data[((y-1)*width+(x-1))*4] + data[((y-1)*width+(x+1))*4] +
                 -2*data[(y*width+(x-1))*4] + 2*data[(y*width+(x+1))*4] +
                 -data[((y+1)*width+(x-1))*4] + data[((y+1)*width+(x+1))*4];
      
      const gy = -data[((y-1)*width+(x-1))*4] - 2*data[((y-1)*width+x)*4] - data[((y-1)*width+(x+1))*4] +
                 data[((y+1)*width+(x-1))*4] + 2*data[((y+1)*width+x)*4] + data[((y+1)*width+(x+1))*4];
      
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      edges[y * width + x] = magnitude > 50 ? 255 : 0;
    }
  }

  return edges;
};

const findContours = (edges: Uint8ClampedArray): Array<{x: number, y: number}[]> => {
  // Simplified contour detection - returns mock contours for now
  return [];
};

const findRectangles = (contours: Array<{x: number, y: number}[]>): Array<{x: number, y: number, width: number, height: number}> => {
  // Simplified rectangle detection - returns some mock rectangles for demonstration
  return [
    { x: 50, y: 50, width: 200, height: 280 },
    { x: 300, y: 100, width: 180, height: 252 }
  ];
};

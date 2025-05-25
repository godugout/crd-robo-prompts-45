
export interface Point {
  x: number;
  y: number;
}

export interface CardCorners {
  topLeft: Point;
  topRight: Point;
  bottomLeft: Point;
  bottomRight: Point;
}

export const detectCardCorners = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): CardCorners => {
  // Use edge detection to find more precise corners
  const imageData = ctx.getImageData(x - 10, y - 10, width + 20, height + 20);
  const data = imageData.data;
  
  // For now, return estimated corners with small inward adjustment
  const padding = Math.min(width, height) * 0.02; // 2% padding inward
  
  return {
    topLeft: { x: x + padding, y: y + padding },
    topRight: { x: x + width - padding, y: y + padding },
    bottomLeft: { x: x + padding, y: y + height - padding },
    bottomRight: { x: x + width - padding, y: y + height - padding }
  };
};

export const applyPerspectiveCorrection = (
  sourceCanvas: HTMLCanvasElement,
  corners: CardCorners,
  targetWidth: number = 350,
  targetHeight: number = 490 // 2.5x3.5 ratio at 140 DPI
): HTMLCanvasElement => {
  const correctedCanvas = document.createElement('canvas');
  correctedCanvas.width = targetWidth;
  correctedCanvas.height = targetHeight;
  const ctx = correctedCanvas.getContext('2d')!;
  
  // For now, we'll do a simple transform. In a full implementation,
  // you'd use a proper perspective transform matrix
  const sourceX = Math.min(corners.topLeft.x, corners.bottomLeft.x);
  const sourceY = Math.min(corners.topLeft.y, corners.topRight.y);
  const sourceWidth = Math.max(corners.topRight.x, corners.bottomRight.x) - sourceX;
  const sourceHeight = Math.max(corners.bottomLeft.y, corners.bottomRight.y) - sourceY;
  
  // Draw the source region to fill the entire target canvas
  ctx.drawImage(
    sourceCanvas,
    sourceX, sourceY, sourceWidth, sourceHeight,
    0, 0, targetWidth, targetHeight
  );
  
  return correctedCanvas;
};

export const enhanceCardImage = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
  const enhancedCanvas = document.createElement('canvas');
  enhancedCanvas.width = canvas.width;
  enhancedCanvas.height = canvas.height;
  const ctx = enhancedCanvas.getContext('2d')!;
  
  // Apply some basic enhancement
  ctx.filter = 'contrast(1.1) brightness(1.05) saturate(1.1)';
  ctx.drawImage(canvas, 0, 0);
  
  return enhancedCanvas;
};

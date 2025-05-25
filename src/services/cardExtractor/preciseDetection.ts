
import { CardRegion } from './types';
import { getPixelBrightness } from './imageUtils';

export const refineCardBounds = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  region: CardRegion
): CardRegion => {
  console.log('Refining bounds for region:', region);
  
  const { x, y, width, height } = region;
  
  // Sample edges more densely to find precise card boundaries
  const edgeData = {
    top: findHorizontalEdge(ctx, x, y, width, -1),
    bottom: findHorizontalEdge(ctx, x, y + height, width, 1),
    left: findVerticalEdge(ctx, x, y, height, -1),
    right: findVerticalEdge(ctx, x + width, y, height, 1)
  };
  
  // Adjust bounds based on detected edges
  const refinedX = Math.max(0, x + edgeData.left);
  const refinedY = Math.max(0, y + edgeData.top);
  const refinedWidth = Math.min(canvas.width - refinedX, width + edgeData.right - edgeData.left);
  const refinedHeight = Math.min(canvas.height - refinedY, height + edgeData.bottom - edgeData.top);
  
  // Ensure we maintain 2.5x3.5 ratio
  const targetRatio = 2.5 / 3.5;
  const currentRatio = refinedWidth / refinedHeight;
  
  let finalWidth = refinedWidth;
  let finalHeight = refinedHeight;
  let finalX = refinedX;
  let finalY = refinedY;
  
  if (Math.abs(currentRatio - targetRatio) > 0.05) {
    if (currentRatio > targetRatio) {
      // Too wide, reduce width
      finalWidth = refinedHeight * targetRatio;
      finalX = refinedX + (refinedWidth - finalWidth) / 2;
    } else {
      // Too tall, reduce height
      finalHeight = refinedWidth / targetRatio;
      finalY = refinedY + (refinedHeight - finalHeight) / 2;
    }
  }
  
  console.log('Refined bounds:', { x: finalX, y: finalY, width: finalWidth, height: finalHeight });
  
  return {
    x: finalX,
    y: finalY,
    width: finalWidth,
    height: finalHeight,
    confidence: region.confidence
  };
};

const findHorizontalEdge = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  direction: number
): number => {
  const samples = 20;
  let maxContrast = 0;
  let bestOffset = 0;
  
  for (let offset = 0; offset < 30; offset++) {
    let totalContrast = 0;
    
    for (let i = 0; i < samples; i++) {
      const px = x + (width * i) / (samples - 1);
      const py = y + (offset * direction);
      
      const inside = getPixelBrightness(ctx, px, py);
      const outside = getPixelBrightness(ctx, px, py + (10 * direction));
      
      totalContrast += Math.abs(inside - outside);
    }
    
    const avgContrast = totalContrast / samples;
    if (avgContrast > maxContrast) {
      maxContrast = avgContrast;
      bestOffset = offset * direction;
    }
  }
  
  return bestOffset;
};

const findVerticalEdge = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  height: number,
  direction: number
): number => {
  const samples = 20;
  let maxContrast = 0;
  let bestOffset = 0;
  
  for (let offset = 0; offset < 30; offset++) {
    let totalContrast = 0;
    
    for (let i = 0; i < samples; i++) {
      const py = y + (height * i) / (samples - 1);
      const px = x + (offset * direction);
      
      const inside = getPixelBrightness(ctx, px, py);
      const outside = getPixelBrightness(ctx, px + (10 * direction), py);
      
      totalContrast += Math.abs(inside - outside);
    }
    
    const avgContrast = totalContrast / samples;
    if (avgContrast > maxContrast) {
      maxContrast = avgContrast;
      bestOffset = offset * direction;
    }
  }
  
  return bestOffset;
};


export const resizeImage = async (img: HTMLImageElement, maxDimension: number): Promise<HTMLImageElement> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const scale = Math.min(maxDimension / img.width, maxDimension / img.height);
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error('Failed to resize image');
      const resizedImg = new Image();
      resizedImg.onload = () => resolve(resizedImg);
      resizedImg.src = URL.createObjectURL(blob);
    });
  });
};

export const getPixelBrightness = (ctx: CanvasRenderingContext2D, x: number, y: number): number => {
  if (x < 0 || y < 0) return 0;
  try {
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    return (pixel[0] + pixel[1] + pixel[2]) / 3;
  } catch {
    return 0;
  }
};

export const checkRectangularEdges = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): number => {
  // Simplified edge detection - check if region has clear boundaries
  const samplePoints = 10;
  let edgeScore = 0;
  
  // Check top and bottom edges
  for (let i = 0; i < samplePoints; i++) {
    const px = x + (w * i) / samplePoints;
    
    // Sample points just inside and outside the region
    const topInside = getPixelBrightness(ctx, px, y + 2);
    const topOutside = getPixelBrightness(ctx, px, y - 2);
    const bottomInside = getPixelBrightness(ctx, px, y + h - 2);
    const bottomOutside = getPixelBrightness(ctx, px, y + h + 2);
    
    if (Math.abs(topInside - topOutside) > 50) edgeScore += 0.1;
    if (Math.abs(bottomInside - bottomOutside) > 50) edgeScore += 0.1;
  }
  
  return Math.min(edgeScore, 1.0);
};

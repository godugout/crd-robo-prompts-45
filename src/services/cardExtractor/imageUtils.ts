
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
  // Enhanced edge detection for card boundaries
  const samplePoints = 8;
  let edgeScore = 0;
  
  // Check all four edges for contrast
  const edges = [
    { side: 'top', samples: [] as number[] },
    { side: 'bottom', samples: [] as number[] },
    { side: 'left', samples: [] as number[] },
    { side: 'right', samples: [] as number[] }
  ];
  
  // Sample top and bottom edges
  for (let i = 0; i < samplePoints; i++) {
    const px = x + (w * i) / (samplePoints - 1);
    
    const topInside = getPixelBrightness(ctx, px, y + 3);
    const topOutside = getPixelBrightness(ctx, px, y - 3);
    const bottomInside = getPixelBrightness(ctx, px, y + h - 3);
    const bottomOutside = getPixelBrightness(ctx, px, y + h + 3);
    
    edges[0].samples.push(Math.abs(topInside - topOutside));
    edges[1].samples.push(Math.abs(bottomInside - bottomOutside));
  }
  
  // Sample left and right edges
  for (let i = 0; i < samplePoints; i++) {
    const py = y + (h * i) / (samplePoints - 1);
    
    const leftInside = getPixelBrightness(ctx, x + 3, py);
    const leftOutside = getPixelBrightness(ctx, x - 3, py);
    const rightInside = getPixelBrightness(ctx, x + w - 3, py);
    const rightOutside = getPixelBrightness(ctx, x + w + 3, py);
    
    edges[2].samples.push(Math.abs(leftInside - leftOutside));
    edges[3].samples.push(Math.abs(rightInside - rightOutside));
  }
  
  // Calculate edge scores
  edges.forEach(edge => {
    const avgContrast = edge.samples.reduce((a, b) => a + b, 0) / edge.samples.length;
    if (avgContrast > 30) { // Threshold for significant edge
      edgeScore += 0.25; // Each edge contributes 0.25
    }
  });
  
  return Math.min(edgeScore, 1.0);
};

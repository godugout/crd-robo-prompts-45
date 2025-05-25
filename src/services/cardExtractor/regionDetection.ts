
import { CardRegion } from './types';
import { calculateRegionConfidence, removeOverlappingRegions } from './confidenceCalculator';
import { detectFaces } from '@/lib/faceDetection';
import { refineCardBounds } from './preciseDetection';

export const detectCardRegions = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Promise<CardRegion[]> => {
  console.log('Starting enhanced region detection with precise boundary detection...');
  
  // Convert canvas to file for face detection
  const canvasBlob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.8);
  });
  const imageFile = new File([canvasBlob], 'temp.jpg', { type: 'image/jpeg' });
  
  // Detect faces first
  let faces: any[] = [];
  try {
    faces = await detectFaces(imageFile);
    console.log('Detected', faces.length, 'faces in image');
  } catch (error) {
    console.warn('Face detection failed, continuing with geometric detection only:', error);
  }
  
  // Standard trading card aspect ratio: 2.5" x 3.5" = 0.714
  const targetAspectRatio = 2.5 / 3.5; // ~0.714
  const aspectTolerance = 0.08; // Tighter tolerance for better precision
  
  // Smaller grid for more precise detection
  const gridSize = Math.max(15, Math.min(canvas.width, canvas.height) / 50);
  const regions = [];
  const minCardWidth = canvas.width * 0.08; // Slightly larger minimum
  const minCardHeight = canvas.height * 0.08;
  const maxCardWidth = canvas.width * 0.4; // Smaller maximum for tighter bounds
  const maxCardHeight = canvas.height * 0.6;

  console.log('Target aspect ratio:', targetAspectRatio, 'Grid size:', gridSize);

  // More precise grid sampling
  const stepX = Math.ceil(gridSize * 0.5); // Smaller steps for better precision
  const stepY = Math.ceil(gridSize * 0.5);
  const stepW = Math.ceil(gridSize);
  const stepH = Math.ceil(gridSize);

  for (let y = 0; y < canvas.height - minCardHeight; y += stepY) {
    for (let x = 0; x < canvas.width - minCardWidth; x += stepX) {
      for (let w = minCardWidth; w <= maxCardWidth && x + w <= canvas.width; w += stepW) {
        for (let h = minCardHeight; h <= maxCardHeight && y + h <= canvas.height; h += stepH) {
          const aspectRatio = w / h;
          
          // Check if aspect ratio matches trading card dimensions
          if (Math.abs(aspectRatio - targetAspectRatio) <= aspectTolerance) {
            // Check if this region contains a face
            const containsFace = faces.some(face => {
              const faceX = face.x;
              const faceY = face.y;
              const faceRight = face.x + face.width;
              const faceBottom = face.y + face.height;
              
              // Check if face is significantly within the current region (not just touching)
              const overlapX = Math.max(0, Math.min(faceRight, x + w) - Math.max(faceX, x));
              const overlapY = Math.max(0, Math.min(faceBottom, y + h) - Math.max(faceY, y));
              const overlapArea = overlapX * overlapY;
              const faceArea = face.width * face.height;
              
              return overlapArea > faceArea * 0.5; // At least 50% of face must be in region
            });
            
            const confidence = calculateRegionConfidence(canvas, ctx, x, y, w, h, containsFace);
            
            // Adjusted thresholds
            const threshold = containsFace ? 0.35 : 0.65;
            
            if (confidence > threshold) {
              regions.push({
                x, y, width: w, height: h, confidence
              });
            }
          }
        }
      }
    }
  }

  console.log('Found', regions.length, 'potential card regions before refinement');
  
  // Remove overlapping regions first
  const filtered = removeOverlappingRegions(regions);
  console.log('Filtered to', filtered.length, 'regions');
  
  // Refine bounds for better precision
  const refined = filtered.map(region => refineCardBounds(canvas, ctx, region));
  console.log('Refined', refined.length, 'final regions');
  
  return refined;
};

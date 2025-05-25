
import { CardRegion } from './types';
import { calculateRegionConfidence, removeOverlappingRegions } from './confidenceCalculator';
import { detectFaces } from '@/lib/faceDetection';

export const detectCardRegions = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Promise<CardRegion[]> => {
  console.log('Starting enhanced region detection with face detection...');
  
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
  const aspectTolerance = 0.1; // Allow 10% variance
  
  const gridSize = Math.max(20, Math.min(canvas.width, canvas.height) / 40);
  const regions = [];
  const minCardWidth = canvas.width * 0.06;
  const minCardHeight = canvas.height * 0.06;
  const maxCardWidth = canvas.width * 0.5;
  const maxCardHeight = canvas.height * 0.7;

  console.log('Target aspect ratio:', targetAspectRatio, 'Grid size:', gridSize);

  // More precise grid for better detection
  const stepX = Math.ceil(gridSize);
  const stepY = Math.ceil(gridSize);
  const stepW = Math.ceil(gridSize * 1.5);
  const stepH = Math.ceil(gridSize * 1.5);

  for (let y = 0; y < canvas.height - minCardHeight; y += stepY) {
    for (let x = 0; x < canvas.width - minCardWidth; x += stepX) {
      for (let w = minCardWidth; w <= maxCardWidth && x + w <= canvas.width; w += stepW) {
        for (let h = minCardHeight; h <= maxCardHeight && y + h <= canvas.height; h += stepH) {
          const aspectRatio = w / h;
          
          // Check if aspect ratio matches trading card dimensions (2.5x3.5)
          if (Math.abs(aspectRatio - targetAspectRatio) <= aspectTolerance) {
            // Check if this region contains a face
            const containsFace = faces.some(face => {
              const faceX = face.x;
              const faceY = face.y;
              const faceRight = face.x + face.width;
              const faceBottom = face.y + face.height;
              
              // Check if face is within the current region
              return faceX >= x && faceY >= y && 
                     faceRight <= x + w && faceBottom <= y + h;
            });
            
            const confidence = calculateRegionConfidence(canvas, ctx, x, y, w, h, containsFace);
            
            // Higher threshold for face-containing regions, lower for geometric-only
            const threshold = containsFace ? 0.4 : 0.6;
            
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

  console.log('Found', regions.length, 'potential card regions before filtering');
  
  // Remove overlapping regions, prioritizing those with faces
  const filtered = removeOverlappingRegions(regions);
  console.log('Filtered to', filtered.length, 'final regions');
  
  return filtered;
};

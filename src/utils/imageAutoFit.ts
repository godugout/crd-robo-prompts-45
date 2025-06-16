export interface ImageFitOptions {
  containerWidth: number;
  containerHeight: number;
  imageWidth: number;
  imageHeight: number;
  fitMode: 'cover' | 'contain' | 'fill' | 'center';
}

export interface FitResult {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
}

export const calculateAutoFit = (options: ImageFitOptions): FitResult => {
  const { containerWidth, containerHeight, imageWidth, imageHeight, fitMode } = options;
  
  const containerAspect = containerWidth / containerHeight;
  const imageAspect = imageWidth / imageHeight;
  
  let scale: number;
  let width: number;
  let height: number;
  let x: number;
  let y: number;
  
  switch (fitMode) {
    case 'cover':
      // Scale to fill container, may crop image
      scale = Math.max(containerWidth / imageWidth, containerHeight / imageHeight);
      width = imageWidth * scale;
      height = imageHeight * scale;
      x = (containerWidth - width) / 2;
      y = (containerHeight - height) / 2;
      break;
      
    case 'contain':
      // Scale to fit within container, may have empty space
      scale = Math.min(containerWidth / imageWidth, containerHeight / imageHeight);
      width = imageWidth * scale;
      height = imageHeight * scale;
      x = (containerWidth - width) / 2;
      y = (containerHeight - height) / 2;
      break;
      
    case 'fill':
      // Stretch to fill container exactly
      scale = 1;
      width = containerWidth;
      height = containerHeight;
      x = 0;
      y = 0;
      break;
      
    case 'center':
    default:
      // Center image without scaling
      scale = 1;
      width = imageWidth;
      height = imageHeight;
      x = (containerWidth - width) / 2;
      y = (containerHeight - height) / 2;
      break;
  }
  
  return { x, y, width, height, scale };
};

export const detectBestFitMode = (options: ImageFitOptions): 'cover' | 'contain' => {
  const { containerWidth, containerHeight, imageWidth, imageHeight } = options;
  
  const containerAspect = containerWidth / containerHeight;
  const imageAspect = imageWidth / imageHeight;
  
  // If image aspect is close to container aspect, use cover
  // Otherwise use contain to avoid excessive cropping
  const aspectDifference = Math.abs(containerAspect - imageAspect);
  
  return aspectDifference < 0.2 ? 'cover' : 'contain';
};

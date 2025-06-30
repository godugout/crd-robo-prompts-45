
import * as THREE from 'three';

export interface AspectRatioData {
  originalWidth: number;
  originalHeight: number;
  aspectRatio: number;
  cardAspectRatio: number;
  scaleX: number;
  scaleY: number;
  offsetX: number;
  offsetY: number;
  fitMode: 'cover' | 'contain';
}

export const calculateAspectRatioFitting = (
  imageWidth: number,
  imageHeight: number,
  cardWidth: number = 2.5,
  cardHeight: number = 3.5,
  fitMode: 'cover' | 'contain' = 'cover'
): AspectRatioData => {
  const imageAspect = imageWidth / imageHeight;
  const cardAspect = cardWidth / cardHeight;
  
  let scaleX = 1;
  let scaleY = 1;
  let offsetX = 0;
  let offsetY = 0;
  
  if (fitMode === 'cover') {
    // Scale to cover entire card, crop excess
    if (imageAspect > cardAspect) {
      // Image is wider than card - fit height, crop sides
      scaleY = 1;
      scaleX = cardAspect / imageAspect;
      offsetX = (1 - scaleX) / 2;
    } else {
      // Image is taller than card - fit width, crop top/bottom
      scaleX = 1;
      scaleY = imageAspect / cardAspect;
      offsetY = (1 - scaleY) / 2;
    }
  } else {
    // Contain mode - fit entire image within card
    if (imageAspect > cardAspect) {
      // Image is wider - fit width, show bars top/bottom
      scaleX = 1;
      scaleY = imageAspect / cardAspect;
    } else {
      // Image is taller - fit height, show bars left/right
      scaleY = 1;
      scaleX = cardAspect / imageAspect;
    }
  }
  
  return {
    originalWidth: imageWidth,
    originalHeight: imageHeight,
    aspectRatio: imageAspect,
    cardAspectRatio: cardAspect,
    scaleX,
    scaleY,
    offsetX,
    offsetY,
    fitMode
  };
};

export const configureTextureForCard = (
  texture: THREE.Texture, 
  aspectData: AspectRatioData
) => {
  if (!texture) return;
  
  // Basic texture configuration
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.flipY = false;
  texture.generateMipmaps = false;
  
  // Apply aspect ratio fitting
  texture.repeat.set(aspectData.scaleX, aspectData.scaleY);
  texture.offset.set(aspectData.offsetX, aspectData.offsetY);
  texture.needsUpdate = true;
};

export const getImageDimensions = (image: HTMLImageElement): Promise<{width: number, height: number}> => {
  return new Promise((resolve) => {
    if (image.complete && image.naturalWidth !== 0) {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    } else {
      image.onload = () => {
        resolve({ width: image.naturalWidth, height: image.naturalHeight });
      };
    }
  });
};

export const loadImageWithDimensions = (url: string): Promise<{image: HTMLImageElement, width: number, height: number}> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      resolve({
        image: img,
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    
    img.onerror = reject;
    img.src = url;
  });
};

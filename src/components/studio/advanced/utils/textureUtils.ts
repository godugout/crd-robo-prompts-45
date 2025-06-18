
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
}

export const calculateAspectRatioPreservation = (
  imageWidth: number,
  imageHeight: number,
  cardWidth: number = 2.5,
  cardHeight: number = 3.5
): AspectRatioData => {
  const imageAspect = imageWidth / imageHeight;
  const cardAspect = cardWidth / cardHeight;
  
  let scaleX = 1;
  let scaleY = 1;
  let offsetX = 0;
  let offsetY = 0;
  
  if (imageAspect > cardAspect) {
    // Image is wider than card - fit height, center horizontally
    scaleY = 1;
    scaleX = cardAspect / imageAspect;
    offsetX = (1 - scaleX) / 2;
  } else {
    // Image is taller than card - fit width, center vertically
    scaleX = 1;
    scaleY = imageAspect / cardAspect;
    offsetY = (1 - scaleY) / 2;
  }
  
  return {
    originalWidth: imageWidth,
    originalHeight: imageHeight,
    aspectRatio: imageAspect,
    cardAspectRatio: cardAspect,
    scaleX,
    scaleY,
    offsetX,
    offsetY
  };
};

export const configureTextureForCard = (texture: THREE.Texture, aspectData?: AspectRatioData) => {
  if (!texture) return;
  
  // Basic texture configuration
  texture.flipY = true;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  
  // Apply aspect ratio preservation if data is provided
  if (aspectData) {
    texture.repeat.set(aspectData.scaleX, aspectData.scaleY);
    texture.offset.set(aspectData.offsetX, aspectData.offsetY);
  }
};

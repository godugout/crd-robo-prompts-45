
import { detectFaces } from '@/lib/faceDetection';
import { DETECTION_CONFIG } from './config';

export const tryFaceDetection = async (file: File): Promise<any[]> => {
  try {
    const faceTimeout = new Promise<any[]>((resolve) => {
      setTimeout(() => resolve([]), DETECTION_CONFIG.FACE_DETECTION_TIMEOUT);
    });
    
    return await Promise.race([
      detectFaces(file),
      faceTimeout
    ]);
  } catch (error) {
    console.warn('Face detection failed:', error);
    return [];
  }
};

export const checkFaceOverlap = (faces: any[], x: number, y: number, w: number, h: number): boolean => {
  return faces.some(face => {
    const overlapX = Math.max(0, Math.min(face.x + face.width, x + w) - Math.max(face.x, x));
    const overlapY = Math.max(0, Math.min(face.y + face.height, y + h) - Math.max(face.y, y));
    const overlapArea = overlapX * overlapY;
    const faceArea = face.width * face.height;
    return overlapArea > faceArea * 0.3;
  });
};

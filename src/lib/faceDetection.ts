
import * as faceapi from 'face-api.js';
import type { DetectedFace } from '@/types/face';

let modelsLoaded = false;

const MODEL_URL = '/models';

export const loadFaceDetectionModels = async (): Promise<void> => {
  if (modelsLoaded) return;

  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    ]);
    modelsLoaded = true;
  } catch (error) {
    console.error('Error loading face detection models:', error);
    throw new Error('Failed to load face detection models');
  }
};

const createImageFromFile = async (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };
    
    img.src = objectUrl;
  });
};

export const detectFaces = async (imageFile: File): Promise<DetectedFace[]> => {
  if (!modelsLoaded) {
    await loadFaceDetectionModels();
  }

  try {
    const img = await createImageFromFile(imageFile);
    const detections = await faceapi
      .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    return detections.map(detection => {
      // Convert FaceExpressions to Record<string, number>
      const expressionsObj: Record<string, number> = {};
      Object.entries(detection.expressions).forEach(([key, value]) => {
        expressionsObj[key] = value;
      });

      return {
        x: detection.detection.box.x,
        y: detection.detection.box.y,
        width: detection.detection.box.width,
        height: detection.detection.box.height,
        confidence: detection.detection.score,
        landmarks: detection.landmarks.positions,
        expressions: expressionsObj
      };
    });
  } catch (error) {
    console.error('Error detecting faces:', error);
    throw new Error('Failed to detect faces in image');
  }
};

const calculatePaddedBounds = (face: DetectedFace, sourceWidth: number, sourceHeight: number, padding = 0.15) => {
  const paddingX = face.width * padding;
  const paddingY = face.height * padding;
  
  return {
    x: Math.max(0, face.x - paddingX),
    y: Math.max(0, face.y - paddingY),
    width: Math.min(sourceWidth - face.x, face.width + (paddingX * 2)),
    height: Math.min(sourceHeight - face.y, face.height + (paddingY * 2))
  };
};

export const extractFaces = async (imageFile: File, faces: DetectedFace[]): Promise<Blob[]> => {
  const img = await createImageFromFile(imageFile);
  const blobs: Blob[] = [];

  try {
    // Create a source canvas with the full image
    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = img.width;
    sourceCanvas.height = img.height;
    const sourceCtx = sourceCanvas.getContext('2d');
    
    if (!sourceCtx) {
      throw new Error('Failed to get canvas context');
    }
    
    sourceCtx.drawImage(img, 0, 0);

    // Extract each face with padding
    for (const face of faces) {
      const bounds = calculatePaddedBounds(face, img.width, img.height);
      
      const faceCanvas = document.createElement('canvas');
      faceCanvas.width = bounds.width;
      faceCanvas.height = bounds.height;
      const faceCtx = faceCanvas.getContext('2d');
      
      if (!faceCtx) {
        throw new Error('Failed to get face canvas context');
      }

      faceCtx.drawImage(
        sourceCanvas,
        bounds.x, bounds.y, bounds.width, bounds.height,
        0, 0, bounds.width, bounds.height
      );

      const blob = await new Promise<Blob>((resolve, reject) => {
        faceCanvas.toBlob(
          blob => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
          'image/jpeg',
          0.95
        );
      });

      blobs.push(blob);
    }

    return blobs;
  } catch (error) {
    console.error('Error extracting faces:', error);
    throw new Error('Failed to extract faces from image');
  }
};

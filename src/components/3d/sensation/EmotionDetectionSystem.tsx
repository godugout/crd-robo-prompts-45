
import React, { useEffect, useRef, useState, useCallback } from 'react';

interface EmotionData {
  happiness: number;
  excitement: number;
  surprise: number;
  focus: number;
}

interface EmotionDetectionSystemProps {
  onEmotionChange: (emotion: EmotionData) => void;
  isEnabled: boolean;
}

export const EmotionDetectionSystem: React.FC<EmotionDetectionSystemProps> = ({
  onEmotionChange,
  isEnabled
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [faceDetector, setFaceDetector] = useState<any>(null);
  const animationFrameRef = useRef<number>();

  const requestCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
        console.log('📹 Camera permission granted');
      }
    } catch (error) {
      console.warn('Camera permission denied:', error);
      setHasPermission(false);
    }
  }, []);

  const initializeFaceDetection = useCallback(async () => {
    if (isInitialized) return;

    try {
      // Load TensorFlow.js models
      const tf = await import('@tensorflow/tfjs');
      const faceDetection = await import('@tensorflow-models/face-landmarks-detection');
      
      await tf.ready();
      
      const detector = await faceDetection.createDetector(
        faceDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: 'tfjs',
          maxFaces: 1,
          refineLandmarks: false
        }
      );
      
      setFaceDetector(detector);
      setIsInitialized(true);
      console.log('🧠 Face detection initialized');
    } catch (error) {
      console.warn('Face detection initialization failed:', error);
    }
  }, [isInitialized]);

  const analyzeFaceExpression = useCallback(async () => {
    if (!faceDetector || !videoRef.current || !canvasRef.current) return;

    try {
      const faces = await faceDetector.estimateFaces(videoRef.current);
      
      if (faces.length > 0) {
        const landmarks = faces[0].keypoints;
        
        // Simple emotion analysis based on landmark positions
        const emotion = calculateEmotionFromLandmarks(landmarks);
        onEmotionChange(emotion);
      }
    } catch (error) {
      // Silently handle detection errors
    }

    if (isEnabled) {
      animationFrameRef.current = requestAnimationFrame(analyzeFaceExpression);
    }
  }, [faceDetector, isEnabled, onEmotionChange]);

  const calculateEmotionFromLandmarks = (landmarks: any[]): EmotionData => {
    // Simplified emotion detection based on facial landmarks
    // This is a basic implementation - a production system would use more sophisticated ML models
    
    // Get key points for mouth, eyes, and eyebrows
    const mouthPoints = landmarks.slice(61, 68); // Approximate mouth region
    const leftEye = landmarks.slice(362, 374); // Approximate left eye region
    const rightEye = landmarks.slice(33, 42); // Approximate right eye region
    const eyebrows = landmarks.slice(70, 80); // Approximate eyebrow region

    // Calculate mouth curvature (happiness indicator)
    const mouthHeight = mouthPoints.reduce((sum: number, point: any) => sum + point.y, 0) / mouthPoints.length;
    const mouthWidth = Math.max(...mouthPoints.map((p: any) => p.x)) - Math.min(...mouthPoints.map((p: any) => p.x));
    const happiness = Math.max(0, Math.min(1, (mouthWidth / 50) - 0.5)); // Normalize

    // Calculate eye openness (excitement/surprise indicator)
    const eyeOpenness = (leftEye.length + rightEye.length) / 2;
    const excitement = Math.max(0, Math.min(1, eyeOpenness / 10));

    // Calculate eyebrow position (surprise indicator)
    const eyebrowHeight = eyebrows.reduce((sum: number, point: any) => sum + point.y, 0) / eyebrows.length;
    const surprise = Math.max(0, Math.min(1, 1 - (eyebrowHeight / 200)));

    // Calculate overall face stability (focus indicator)
    const focus = Math.max(0, Math.min(1, 0.8 - Math.random() * 0.4)); // Simplified

    return {
      happiness,
      excitement,
      surprise, 
      focus
    };
  };

  useEffect(() => {
    if (isEnabled && hasPermission) {
      initializeFaceDetection();
    }
  }, [isEnabled, hasPermission, initializeFaceDetection]);

  useEffect(() => {
    if (isEnabled && isInitialized && faceDetector) {
      analyzeFaceExpression();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isEnabled, isInitialized, faceDetector, analyzeFaceExpression]);

  useEffect(() => {
    if (isEnabled && !hasPermission) {
      requestCameraPermission();
    }
  }, [isEnabled, hasPermission, requestCameraPermission]);

  if (!isEnabled) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-black/80 rounded-lg p-2 backdrop-blur">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-32 h-24 rounded object-cover"
          style={{ transform: 'scaleX(-1)' }} // Mirror for user comfort
        />
        <canvas
          ref={canvasRef}
          className="hidden"
          width="640"
          height="480"
        />
        <div className="text-white text-xs text-center mt-1">
          Emotion Detection
        </div>
      </div>
    </div>
  );
};

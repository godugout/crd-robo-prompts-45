
interface ImageMetadata {
  width: number;
  height: number;
}

interface VideoMetadata extends ImageMetadata {
  duration: number;
}

export const extractImageMetadata = async (file: File): Promise<ImageMetadata> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = () => {
      reject(new Error('Failed to extract image metadata'));
    };
    img.src = URL.createObjectURL(file);
  });
};

export const extractVideoMetadata = async (file: File): Promise<VideoMetadata> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration
      });
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to extract video metadata'));
    };
    
    video.src = URL.createObjectURL(file);
  });
};

export const getMediaType = (mimeType: string): 'image' | 'video' | 'audio' => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'image'; // Default fallback
};

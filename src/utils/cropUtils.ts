
import { Canvas as FabricCanvas, Rect, FabricImage } from 'fabric';

export const exportCroppedImage = async (
  fabricCanvas: FabricCanvas,
  cropRect: Rect,
  originalImage: FabricImage
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a temporary canvas for the cropped result
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      if (!tempCtx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Get the crop rectangle properties
      const cropBounds = cropRect.getBoundingRect();
      const cropWidth = cropRect.width! * cropRect.scaleX!;
      const cropHeight = cropRect.height! * cropRect.scaleY!;
      const cropAngle = cropRect.angle || 0;

      // Set canvas size to the crop dimensions
      tempCanvas.width = cropWidth;
      tempCanvas.height = cropHeight;

      // Load the original image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Clear canvas with transparent background
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Calculate the transformation matrix
        const centerX = cropWidth / 2;
        const centerY = cropHeight / 2;
        
        // Save the context state
        tempCtx.save();
        
        // Move to center, apply rotation, then move back
        tempCtx.translate(centerX, centerY);
        tempCtx.rotate((cropAngle * Math.PI) / 180);
        tempCtx.translate(-centerX, -centerY);

        // Calculate the source coordinates on the original image
        const imageBounds = originalImage.getBoundingRect();
        const imageScale = originalImage.scaleX || 1;
        
        // Get the actual source coordinates from the original image
        const sourceX = (cropRect.left! - imageBounds.left) / imageScale;
        const sourceY = (cropRect.top! - imageBounds.top) / imageScale;
        const sourceWidth = cropWidth / imageScale;
        const sourceHeight = cropHeight / imageScale;

        // Draw the image portion
        tempCtx.drawImage(
          img,
          Math.max(0, sourceX), Math.max(0, sourceY), 
          Math.min(img.width - Math.max(0, sourceX), sourceWidth), 
          Math.min(img.height - Math.max(0, sourceY), sourceHeight),
          0, 0, cropWidth, cropHeight
        );

        // Restore the context state
        tempCtx.restore();

        // Convert to blob and create URL
        tempCanvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/png', 1.0);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      // Get the original image source
      img.src = originalImage.getSrc();
      
    } catch (error) {
      reject(error);
    }
  });
};

export const calculateCropBounds = (
  cropRect: Rect,
  originalImage: FabricImage
) => {
  const cropBounds = cropRect.getBoundingRect();
  const imageBounds = originalImage.getBoundingRect();
  
  return {
    x: cropBounds.left - imageBounds.left,
    y: cropBounds.top - imageBounds.top,
    width: cropBounds.width,
    height: cropBounds.height,
    rotation: cropRect.angle || 0,
  };
};

export const constrainCropToImage = (
  cropRect: Rect,
  originalImage: FabricImage
) => {
  const cropBounds = cropRect.getBoundingRect();
  const imageBounds = originalImage.getBoundingRect();
  
  // Constrain crop rectangle to stay within image bounds
  const minX = imageBounds.left;
  const minY = imageBounds.top;
  const maxX = imageBounds.left + imageBounds.width - cropBounds.width;
  const maxY = imageBounds.top + imageBounds.height - cropBounds.height;
  
  const constrainedX = Math.max(minX, Math.min(maxX, cropBounds.left));
  const constrainedY = Math.max(minY, Math.min(maxY, cropBounds.top));
  
  cropRect.set({
    left: constrainedX,
    top: constrainedY,
  });
  
  return cropRect;
};

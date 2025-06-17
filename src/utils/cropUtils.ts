
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

      // Get crop rectangle bounds in image coordinates
      const cropBounds = cropRect.getBoundingRect();
      const imageBounds = originalImage.getBoundingRect();
      
      // Calculate the crop area relative to the original image
      const relativeX = (cropBounds.left - imageBounds.left) / originalImage.scaleX!;
      const relativeY = (cropBounds.top - imageBounds.top) / originalImage.scaleY!;
      const relativeWidth = cropBounds.width / originalImage.scaleX!;
      const relativeHeight = cropBounds.height / originalImage.scaleY!;

      // Set canvas size to the crop dimensions
      tempCanvas.width = relativeWidth;
      tempCanvas.height = relativeHeight;

      // Load the original image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Clear canvas
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Apply rotation if needed
        if (cropRect.angle && cropRect.angle !== 0) {
          tempCtx.save();
          tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
          tempCtx.rotate((cropRect.angle * Math.PI) / 180);
          tempCtx.translate(-tempCanvas.width / 2, -tempCanvas.height / 2);
        }

        // Draw the cropped portion
        tempCtx.drawImage(
          img,
          relativeX, relativeY, relativeWidth, relativeHeight,
          0, 0, tempCanvas.width, tempCanvas.height
        );

        if (cropRect.angle && cropRect.angle !== 0) {
          tempCtx.restore();
        }

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


export interface CropBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropOptions {
  bounds: CropBounds;
  outputWidth?: number;
  outputHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png';
}

/**
 * Crops an image using Canvas API and returns a data URL
 */
export const cropImageFromFile = async (
  imageFile: File,
  options: CropOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        const { bounds, outputWidth = 300, outputHeight = 420, quality = 0.9, format = 'jpeg' } = options;
        
        // Set canvas to desired output dimensions (standard card ratio 2.5:3.5)
        canvas.width = outputWidth;
        canvas.height = outputHeight;
        
        // Calculate source dimensions to maintain aspect ratio
        const sourceAspectRatio = bounds.width / bounds.height;
        const targetAspectRatio = outputWidth / outputHeight;
        
        let sourceX = bounds.x;
        let sourceY = bounds.y;
        let sourceWidth = bounds.width;
        let sourceHeight = bounds.height;
        
        // Adjust crop area to match target aspect ratio
        if (sourceAspectRatio > targetAspectRatio) {
          // Source is wider, crop the width
          const newWidth = bounds.height * targetAspectRatio;
          sourceX = bounds.x + (bounds.width - newWidth) / 2;
          sourceWidth = newWidth;
        } else if (sourceAspectRatio < targetAspectRatio) {
          // Source is taller, crop the height
          const newHeight = bounds.width / targetAspectRatio;
          sourceY = bounds.y + (bounds.height - newHeight) / 2;
          sourceHeight = newHeight;
        }
        
        // Ensure crop area doesn't exceed image bounds
        sourceX = Math.max(0, Math.min(sourceX, img.naturalWidth - sourceWidth));
        sourceY = Math.max(0, Math.min(sourceY, img.naturalHeight - sourceHeight));
        sourceWidth = Math.min(sourceWidth, img.naturalWidth - sourceX);
        sourceHeight = Math.min(sourceHeight, img.naturalHeight - sourceY);
        
        // Draw the cropped region
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, canvas.width, canvas.height
        );
        
        // Convert to data URL
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        
        // Clean up
        URL.revokeObjectURL(img.src);
        
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(imageFile);
  });
};

/**
 * Crops an image from an existing image element
 */
export const cropImageFromElement = async (
  imageElement: HTMLImageElement,
  options: CropOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const { bounds, outputWidth = 300, outputHeight = 420, quality = 0.9, format = 'jpeg' } = options;
      
      // Set canvas to desired output dimensions
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      
      // Calculate source dimensions to maintain aspect ratio
      const sourceAspectRatio = bounds.width / bounds.height;
      const targetAspectRatio = outputWidth / outputHeight;
      
      let sourceX = bounds.x;
      let sourceY = bounds.y;
      let sourceWidth = bounds.width;
      let sourceHeight = bounds.height;
      
      // Adjust crop area to match target aspect ratio
      if (sourceAspectRatio > targetAspectRatio) {
        const newWidth = bounds.height * targetAspectRatio;
        sourceX = bounds.x + (bounds.width - newWidth) / 2;
        sourceWidth = newWidth;
      } else if (sourceAspectRatio < targetAspectRatio) {
        const newHeight = bounds.width / targetAspectRatio;
        sourceY = bounds.y + (bounds.height - newHeight) / 2;
        sourceHeight = newHeight;
      }
      
      // Ensure crop area doesn't exceed image bounds
      sourceX = Math.max(0, Math.min(sourceX, imageElement.naturalWidth - sourceWidth));
      sourceY = Math.max(0, Math.min(sourceY, imageElement.naturalHeight - sourceY));
      sourceWidth = Math.min(sourceWidth, imageElement.naturalWidth - sourceX);
      sourceHeight = Math.min(sourceHeight, imageElement.naturalHeight - sourceY);
      
      // Draw the cropped region
      ctx.drawImage(
        imageElement,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, canvas.width, canvas.height
      );
      
      // Convert to data URL
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, quality);
      
      resolve(dataUrl);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Adjusts crop boundaries while maintaining aspect ratio
 */
export const adjustCropBounds = (
  bounds: CropBounds,
  imageWidth: number,
  imageHeight: number,
  targetAspectRatio: number = 300 / 420 // Standard card ratio
): CropBounds => {
  const currentAspectRatio = bounds.width / bounds.height;
  
  let newBounds = { ...bounds };
  
  if (currentAspectRatio > targetAspectRatio) {
    // Too wide, reduce width
    const newWidth = bounds.height * targetAspectRatio;
    newBounds.width = newWidth;
    newBounds.x = bounds.x + (bounds.width - newWidth) / 2;
  } else if (currentAspectRatio < targetAspectRatio) {
    // Too tall, reduce height
    const newHeight = bounds.width / targetAspectRatio;
    newBounds.height = newHeight;
    newBounds.y = bounds.y + (bounds.height - newHeight) / 2;
  }
  
  // Ensure bounds stay within image
  newBounds.x = Math.max(0, Math.min(newBounds.x, imageWidth - newBounds.width));
  newBounds.y = Math.max(0, Math.min(newBounds.y, imageHeight - newBounds.height));
  newBounds.width = Math.min(newBounds.width, imageWidth - newBounds.x);
  newBounds.height = Math.min(newBounds.height, imageHeight - newBounds.y);
  
  return newBounds;
};

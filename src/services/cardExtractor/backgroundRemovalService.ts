
import { pipeline } from '@huggingface/transformers';
import { DETECTION_CONFIG } from './config';

export const tryBackgroundRemoval = async (image: HTMLImageElement): Promise<HTMLImageElement | null> => {
  try {
    console.log('Attempting background removal...');
    
    const removalTimeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Background removal timeout')), DETECTION_CONFIG.BACKGROUND_REMOVAL_TIMEOUT);
    });
    
    const segmenter = await Promise.race([
      pipeline(
        'image-segmentation', 
        'Xenova/segformer-b0-finetuned-ade-512-512',
        { device: 'webgpu' }
      ),
      removalTimeout
    ]);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    resizeImageIfNeeded(canvas, ctx, image);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.6);
    
    const result = await Promise.race([
      segmenter(imageData),
      removalTimeout
    ]);
    
    if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
      throw new Error('Invalid segmentation result');
    }
    
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) return null;
    
    outputCtx.drawImage(canvas, 0, 0);
    const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const data = outputImageData.data;
    
    const maskData = result[0].mask.data;
    const step = Math.max(1, Math.floor(maskData.length / 100000));
    
    for (let i = 0; i < maskData.length; i += step) {
      const alpha = Math.round((1 - maskData[i]) * 255);
      if (i * 4 + 3 < data.length) {
        data[i * 4 + 3] = alpha;
      }
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    
    const processedImage = new Image();
    processedImage.src = outputCanvas.toDataURL();
    await new Promise(resolve => processedImage.onload = resolve);
    
    console.log('Background removal successful');
    return processedImage;
    
  } catch (error) {
    console.warn('Background removal failed:', error);
    return null;
  }
};

const resizeImageIfNeeded = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) => {
  let width = image.naturalWidth || image.width;
  let height = image.naturalHeight || image.height;

  if (width > DETECTION_CONFIG.MAX_IMAGE_DIMENSION || height > DETECTION_CONFIG.MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * DETECTION_CONFIG.MAX_IMAGE_DIMENSION) / width);
      width = DETECTION_CONFIG.MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * DETECTION_CONFIG.MAX_IMAGE_DIMENSION) / height);
      height = DETECTION_CONFIG.MAX_IMAGE_DIMENSION;
    }
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);
};

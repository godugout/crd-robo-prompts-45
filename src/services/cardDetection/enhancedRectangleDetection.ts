export interface DetectedRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  corners: Array<{ x: number; y: number }>;
  aspectRatio: number;
}

export interface DetectionDebugInfo {
  edgeCanvas?: HTMLCanvasElement;
  contoursCanvas?: HTMLCanvasElement;
  cornersCanvas?: HTMLCanvasElement;
  processingSteps: string[];
}

export class EnhancedRectangleDetector {
  private debugMode = true;
  private debugInfo: DetectionDebugInfo = { processingSteps: [] };

  async detectCardRectangles(image: HTMLImageElement): Promise<{
    rectangles: DetectedRectangle[];
    debugInfo: DetectionDebugInfo;
  }> {
    this.debugInfo = { processingSteps: [] };
    this.log('Starting enhanced rectangle detection');

    try {
      // Step 1: Resize image if too large to prevent performance issues
      const processedImage = await this.resizeImageIfNeeded(image);
      
      // Step 2: Preprocess image
      const processedCanvas = await this.preprocessImageAsync(processedImage);
      
      // Step 3: Edge detection with yield for UI updates
      const edgeCanvas = await this.detectEdgesAsync(processedCanvas);
      this.debugInfo.edgeCanvas = edgeCanvas;
      
      // Step 4: Find rectangles with optimized algorithm
      const rectangles = await this.findRectangularContoursOptimized(edgeCanvas, processedImage.width, processedImage.height);
      
      // Step 5: Filter and rank rectangles
      const filteredRectangles = this.filterAndRankRectangles(rectangles, processedImage.width, processedImage.height);
      
      this.log(`Detection complete. Found ${filteredRectangles.length} potential cards`);
      
      return {
        rectangles: filteredRectangles,
        debugInfo: this.debugInfo
      };
    } catch (error) {
      this.log(`Detection failed: ${error.message}`);
      throw error;
    }
  }

  private async resizeImageIfNeeded(image: HTMLImageElement): Promise<HTMLImageElement> {
    const maxDimension = 800; // Limit size for performance
    
    if (image.width <= maxDimension && image.height <= maxDimension) {
      this.log(`Image size OK: ${image.width}x${image.height}`);
      return image;
    }
    
    this.log(`Resizing large image from ${image.width}x${image.height}`);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    const scale = Math.min(maxDimension / image.width, maxDimension / image.height);
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;
    
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    return new Promise((resolve) => {
      const resizedImage = new Image();
      resizedImage.onload = () => {
        this.log(`Image resized to: ${resizedImage.width}x${resizedImage.height}`);
        resolve(resizedImage);
      };
      resizedImage.src = canvas.toDataURL();
    });
  }

  private async preprocessImageAsync(image: HTMLImageElement): Promise<HTMLCanvasElement> {
    this.log('Preprocessing image - converting to grayscale and enhancing contrast');
    
    return new Promise((resolve) => {
      // Use requestAnimationFrame to yield to UI
      requestAnimationFrame(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = image.width;
        canvas.height = image.height;
        
        // Draw original image
        ctx.drawImage(image, 0, 0);
        
        // Convert to grayscale for better edge detection
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const grayscale = this.toGrayscale(imageData);
        ctx.putImageData(grayscale, 0, 0);
        
        resolve(canvas);
      });
    });
  }

  private async detectEdgesAsync(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement> {
    this.log('Applying simplified edge detection');
    
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const ctx = canvas.getContext('2d')!;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Simple edge detection using basic gradient
        const edges = this.simpleEdgeDetection(imageData);
        
        const edgeCanvas = document.createElement('canvas');
        edgeCanvas.width = canvas.width;
        edgeCanvas.height = canvas.height;
        const edgeCtx = edgeCanvas.getContext('2d')!;
        edgeCtx.putImageData(edges, 0, 0);
        
        resolve(edgeCanvas);
      });
    });
  }

  private toGrayscale(imageData: ImageData): ImageData {
    const data = imageData.data;
    const output = new ImageData(imageData.width, imageData.height);
    
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      output.data[i] = gray;
      output.data[i + 1] = gray;
      output.data[i + 2] = gray;
      output.data[i + 3] = 255;
    }
    
    return output;
  }

  private simpleEdgeDetection(imageData: ImageData): ImageData {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const output = new ImageData(width, height);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        // Simple gradient calculation
        const idx = (y * width + x) * 4;
        const rightIdx = (y * width + x + 1) * 4;
        const bottomIdx = ((y + 1) * width + x) * 4;
        
        const gx = Math.abs(data[rightIdx] - data[idx]);
        const gy = Math.abs(data[bottomIdx] - data[idx]);
        const gradient = gx + gy;
        
        const value = gradient > 30 ? 255 : 0; // Simple threshold
        
        output.data[idx] = value;
        output.data[idx + 1] = value;
        output.data[idx + 2] = value;
        output.data[idx + 3] = 255;
      }
    }
    
    return output;
  }

  private async findRectangularContoursOptimized(edgeCanvas: HTMLCanvasElement, originalWidth: number, originalHeight: number): Promise<DetectedRectangle[]> {
    this.log('Finding rectangular contours with optimized algorithm');
    
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const ctx = edgeCanvas.getContext('2d')!;
        const imageData = ctx.getImageData(0, 0, edgeCanvas.width, edgeCanvas.height);
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        const rectangles: DetectedRectangle[] = [];
        
        // Much more conservative approach - only try reasonable card sizes
        const cardAspectRatio = 2.5 / 3.5;
        const minCardWidth = Math.max(50, Math.min(originalWidth * 0.1, 100));
        const minCardHeight = minCardWidth / cardAspectRatio;
        
        // Limit the search space significantly
        const stepSize = Math.max(20, Math.min(width, height) / 20);
        const maxAttempts = 100; // Hard limit on attempts
        let attempts = 0;
        
        this.log(`Optimized search: step=${stepSize}, minSize=${minCardWidth}x${minCardHeight}`);
        
        // Try common card sizes first
        const commonSizes = [
          { w: minCardWidth, h: minCardHeight },
          { w: minCardWidth * 1.5, h: minCardHeight * 1.5 },
          { w: minCardWidth * 2, h: minCardHeight * 2 }
        ];
        
        for (const size of commonSizes) {
          if (attempts >= maxAttempts) break;
          
          for (let y = 0; y < height - size.h; y += stepSize) {
            if (attempts >= maxAttempts) break;
            
            for (let x = 0; x < width - size.w; x += stepSize) {
              if (attempts >= maxAttempts) break;
              attempts++;
              
              const confidence = this.evaluateRectangleFast(data, width, x, y, size.w, size.h);
              
              if (confidence > 0.4) {
                const aspectRatio = size.w / size.h;
                rectangles.push({
                  x,
                  y,
                  width: size.w,
                  height: size.h,
                  confidence,
                  aspectRatio,
                  corners: [
                    { x, y },
                    { x: x + size.w, y },
                    { x: x + size.w, y: y + size.h },
                    { x, y: y + size.h }
                  ]
                });
              }
            }
          }
        }
        
        this.log(`Found ${rectangles.length} potential rectangles in ${attempts} attempts`);
        resolve(rectangles);
      });
    });
  }

  private evaluateRectangleFast(data: Uint8ClampedArray, width: number, x: number, y: number, w: number, h: number): number {
    let edgePixels = 0;
    let totalChecked = 0;
    
    // Sample only a subset of perimeter points for speed
    const sampleRate = 5;
    
    // Check top and bottom edges
    for (let i = 0; i < w; i += sampleRate) {
      // Top edge
      let idx = (y * width + (x + i)) * 4;
      if (data[idx] > 200) edgePixels++;
      totalChecked++;
      
      // Bottom edge
      idx = ((y + h - 1) * width + (x + i)) * 4;
      if (data[idx] > 200) edgePixels++;
      totalChecked++;
    }
    
    // Check left and right edges
    for (let i = 0; i < h; i += sampleRate) {
      // Left edge
      let idx = ((y + i) * width + x) * 4;
      if (data[idx] > 200) edgePixels++;
      totalChecked++;
      
      // Right edge
      idx = ((y + i) * width + (x + w - 1)) * 4;
      if (data[idx] > 200) edgePixels++;
      totalChecked++;
    }
    
    const edgeRatio = totalChecked > 0 ? edgePixels / totalChecked : 0;
    
    // Bonus for card-like aspect ratios
    const aspectRatio = w / h;
    const cardAspectRatio = 2.5 / 3.5;
    const aspectBonus = 1 - Math.abs(aspectRatio - cardAspectRatio) / cardAspectRatio;
    
    return edgeRatio * 0.7 + Math.max(0, aspectBonus) * 0.3;
  }

  private filterAndRankRectangles(rectangles: DetectedRectangle[], imageWidth: number, imageHeight: number): DetectedRectangle[] {
    this.log('Filtering and ranking rectangles');
    
    // Remove overlapping rectangles (keep higher confidence)
    const filtered = this.removeOverlapping(rectangles);
    
    // Sort by confidence
    filtered.sort((a, b) => b.confidence - a.confidence);
    
    // Apply size and aspect ratio filters
    const final = filtered.filter(rect => {
      const minSize = Math.min(imageWidth, imageHeight) * 0.05;
      const maxSize = Math.max(imageWidth, imageHeight) * 0.9;
      
      if (rect.width < minSize || rect.height < minSize) return false;
      if (rect.width > maxSize || rect.height > maxSize) return false;
      
      const aspectRatio = rect.width / rect.height;
      if (aspectRatio < 0.4 || aspectRatio > 2.0) return false;
      
      return true;
    });
    
    this.log(`Final result: ${final.length} rectangles after filtering`);
    return final.slice(0, 10);
  }

  private removeOverlapping(rectangles: DetectedRectangle[]): DetectedRectangle[] {
    const result: DetectedRectangle[] = [];
    
    for (const rect of rectangles) {
      const overlapping = result.find(existing => 
        this.calculateOverlap(rect, existing) > 0.3
      );
      
      if (!overlapping) {
        result.push(rect);
      } else if (rect.confidence > overlapping.confidence) {
        const index = result.indexOf(overlapping);
        result[index] = rect;
      }
    }
    
    return result;
  }

  private calculateOverlap(rect1: DetectedRectangle, rect2: DetectedRectangle): number {
    const x1 = Math.max(rect1.x, rect2.x);
    const y1 = Math.max(rect1.y, rect2.y);
    const x2 = Math.min(rect1.x + rect1.width, rect2.x + rect2.width);
    const y2 = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);
    
    if (x2 <= x1 || y2 <= y1) return 0;
    
    const intersection = (x2 - x1) * (y2 - y1);
    const area1 = rect1.width * rect1.height;
    const area2 = rect2.width * rect2.height;
    const union = area1 + area2 - intersection;
    
    return intersection / union;
  }

  private log(message: string) {
    if (this.debugMode) {
      console.log(`[EnhancedRectangleDetector] ${message}`);
      this.debugInfo.processingSteps.push(message);
    }
  }
}

export const enhancedRectangleDetector = new EnhancedRectangleDetector();

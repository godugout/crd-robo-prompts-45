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

    // Step 1: Preprocess image
    const processedCanvas = this.preprocessImage(image);
    
    // Step 2: Edge detection
    const edgeCanvas = this.detectEdges(processedCanvas);
    this.debugInfo.edgeCanvas = edgeCanvas;
    
    // Step 3: Find contours and rectangles
    const rectangles = this.findRectangularContours(edgeCanvas, image.width, image.height);
    
    // Step 4: Filter and rank rectangles
    const filteredRectangles = this.filterAndRankRectangles(rectangles, image.width, image.height);
    
    this.log(`Detection complete. Found ${filteredRectangles.length} potential cards`);
    
    return {
      rectangles: filteredRectangles,
      debugInfo: this.debugInfo
    };
  }

  private preprocessImage(image: HTMLImageElement): HTMLCanvasElement {
    this.log('Preprocessing image - sharpening and contrast enhancement');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = image.width;
    canvas.height = image.height;
    
    // Draw original image
    ctx.drawImage(image, 0, 0);
    
    // Apply sharpening filter
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const sharpened = this.applySharpeningFilter(imageData);
    ctx.putImageData(sharpened, 0, 0);
    
    return canvas;
  }

  private applySharpeningFilter(imageData: ImageData): ImageData {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const output = new ImageData(width, height);
    
    // Sharpening kernel
    const kernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ];
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let r = 0, g = 0, b = 0;
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            const kernelIdx = (ky + 1) * 3 + (kx + 1);
            const weight = kernel[kernelIdx];
            
            r += data[idx] * weight;
            g += data[idx + 1] * weight;
            b += data[idx + 2] * weight;
          }
        }
        
        const outputIdx = (y * width + x) * 4;
        output.data[outputIdx] = Math.max(0, Math.min(255, r));
        output.data[outputIdx + 1] = Math.max(0, Math.min(255, g));
        output.data[outputIdx + 2] = Math.max(0, Math.min(255, b));
        output.data[outputIdx + 3] = 255;
      }
    }
    
    return output;
  }

  private detectEdges(canvas: HTMLCanvasElement): HTMLCanvasElement {
    this.log('Applying Canny edge detection');
    
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Convert to grayscale
    const grayscale = this.toGrayscale(imageData);
    
    // Apply Gaussian blur
    const blurred = this.gaussianBlur(grayscale, 1.4);
    
    // Apply Canny edge detection
    const edges = this.cannyEdgeDetection(blurred);
    
    const edgeCanvas = document.createElement('canvas');
    edgeCanvas.width = canvas.width;
    edgeCanvas.height = canvas.height;
    const edgeCtx = edgeCanvas.getContext('2d')!;
    edgeCtx.putImageData(edges, 0, 0);
    
    return edgeCanvas;
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

  private gaussianBlur(imageData: ImageData, sigma: number): ImageData {
    // Simple box blur approximation for performance
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const output = new ImageData(width, height);
    
    const radius = Math.ceil(sigma * 3);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sum = 0;
        let count = 0;
        
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            
            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
              sum += data[(ny * width + nx) * 4];
              count++;
            }
          }
        }
        
        const idx = (y * width + x) * 4;
        const value = sum / count;
        output.data[idx] = value;
        output.data[idx + 1] = value;
        output.data[idx + 2] = value;
        output.data[idx + 3] = 255;
      }
    }
    
    return output;
  }

  private cannyEdgeDetection(imageData: ImageData): ImageData {
    // Simplified Canny - just use Sobel operators
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const output = new ImageData(width, height);
    
    // Sobel kernels
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gx = 0, gy = 0;
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            const kernelIdx = (ky + 1) * 3 + (kx + 1);
            const pixel = data[idx];
            
            gx += pixel * sobelX[kernelIdx];
            gy += pixel * sobelY[kernelIdx];
          }
        }
        
        const magnitude = Math.sqrt(gx * gx + gy * gy);
        const outputIdx = (y * width + x) * 4;
        const value = magnitude > 50 ? 255 : 0; // Threshold
        
        output.data[outputIdx] = value;
        output.data[outputIdx + 1] = value;
        output.data[outputIdx + 2] = value;
        output.data[outputIdx + 3] = 255;
      }
    }
    
    return output;
  }

  private findRectangularContours(edgeCanvas: HTMLCanvasElement, originalWidth: number, originalHeight: number): DetectedRectangle[] {
    this.log('Finding rectangular contours');
    
    const ctx = edgeCanvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, edgeCanvas.width, edgeCanvas.height);
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    const rectangles: DetectedRectangle[] = [];
    
    // Use a sliding window approach to find rectangular regions
    const minCardWidth = Math.min(originalWidth * 0.1, 100);
    const minCardHeight = Math.min(originalHeight * 0.1, 140);
    const maxCardWidth = originalWidth * 0.8;
    const maxCardHeight = originalHeight * 0.8;
    
    const step = Math.max(10, Math.min(originalWidth, originalHeight) / 50);
    
    for (let y = 0; y < height - minCardHeight; y += step) {
      for (let x = 0; x < width - minCardWidth; x += step) {
        // Try different sizes
        for (let w = minCardWidth; w <= maxCardWidth && x + w < width; w += step) {
          for (let h = minCardHeight; h <= maxCardHeight && y + h < height; h += step) {
            const confidence = this.evaluateRectangle(data, width, x, y, w, h);
            
            if (confidence > 0.3) {
              const aspectRatio = w / h;
              rectangles.push({
                x,
                y,
                width: w,
                height: h,
                confidence,
                aspectRatio,
                corners: [
                  { x, y },
                  { x: x + w, y },
                  { x: x + w, y: y + h },
                  { x, y: y + h }
                ]
              });
            }
          }
        }
      }
    }
    
    this.log(`Found ${rectangles.length} potential rectangles`);
    return rectangles;
  }

  private evaluateRectangle(data: Uint8ClampedArray, width: number, x: number, y: number, w: number, h: number): number {
    let edgePixels = 0;
    let totalPixels = 0;
    
    // Check perimeter for edges
    const checkPositions = [
      // Top edge
      ...Array.from({ length: w }, (_, i) => ({ x: x + i, y })),
      // Bottom edge
      ...Array.from({ length: w }, (_, i) => ({ x: x + i, y: y + h - 1 })),
      // Left edge
      ...Array.from({ length: h }, (_, i) => ({ x, y: y + i })),
      // Right edge
      ...Array.from({ length: h }, (_, i) => ({ x: x + w - 1, y: y + i }))
    ];
    
    for (const pos of checkPositions) {
      if (pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < data.length / width / 4) {
        const idx = (pos.y * width + pos.x) * 4;
        if (data[idx] > 200) edgePixels++; // White pixels (edges)
        totalPixels++;
      }
    }
    
    const edgeRatio = totalPixels > 0 ? edgePixels / totalPixels : 0;
    
    // Bonus for card-like aspect ratios
    const aspectRatio = w / h;
    const cardAspectRatio = 2.5 / 3.5; // Standard trading card
    const aspectBonus = 1 - Math.abs(aspectRatio - cardAspectRatio) / cardAspectRatio;
    
    return edgeRatio * 0.7 + Math.max(0, aspectBonus) * 0.3;
  }

  private filterAndRankRectangles(rectangles: DetectedRectangle[], imageWidth: number, imageHeight: number): DetectedRectangle[] {
    this.log('Filtering and ranking rectangles');
    
    // Remove overlapping rectangles (keep higher confidence)
    const filtered = this.removeOverlapping(rectangles);
    
    // Sort by confidence
    filtered.sort((a, b) => b.confidence - a.confidence);
    
    // Apply additional filters
    const final = filtered.filter(rect => {
      // Size constraints (more relaxed)
      const minSize = Math.min(imageWidth, imageHeight) * 0.05;
      const maxSize = Math.max(imageWidth, imageHeight) * 0.9;
      
      if (rect.width < minSize || rect.height < minSize) return false;
      if (rect.width > maxSize || rect.height > maxSize) return false;
      
      // Aspect ratio constraints (more relaxed)
      const aspectRatio = rect.width / rect.height;
      if (aspectRatio < 0.4 || aspectRatio > 2.0) return false;
      
      return true;
    });
    
    this.log(`Final result: ${final.length} rectangles after filtering`);
    return final.slice(0, 10); // Limit to top 10
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
        // Replace with higher confidence rectangle
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

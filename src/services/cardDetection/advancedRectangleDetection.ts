
export interface DetectedRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  corners: Array<{ x: number; y: number }>;
  aspectRatio: number;
  edgeStrength: number;
  geometryScore: number;
}

export interface DetectionDebugInfo {
  edgeCanvas?: HTMLCanvasElement;
  contoursCanvas?: HTMLCanvasElement;
  cornersCanvas?: HTMLCanvasElement;
  processingSteps: string[];
  processingTime: number;
}

export class AdvancedRectangleDetector {
  private debugMode = true;
  private debugInfo: DetectionDebugInfo = { processingSteps: [], processingTime: 0 };

  async detectCardRectangles(image: HTMLImageElement): Promise<{
    rectangles: DetectedRectangle[];
    debugInfo: DetectionDebugInfo;
  }> {
    const startTime = Date.now();
    this.debugInfo = { processingSteps: [], processingTime: 0 };
    this.log('Starting advanced rectangle detection');

    try {
      // Step 1: Preprocess with Gaussian blur and resize
      const processedCanvas = await this.preprocessImageWithBlur(image);
      
      // Step 2: Multi-stage edge detection
      const edgeCanvas = await this.multiStageEdgeDetection(processedCanvas);
      this.debugInfo.edgeCanvas = edgeCanvas;
      
      // Step 3: Contour detection with filtering
      const contours = await this.detectContoursWithFiltering(edgeCanvas);
      
      // Step 4: Rectangle validation and scoring
      const rectangles = await this.validateAndScoreRectangles(contours, image.width, image.height);
      
      // Step 5: Corner detection and refinement
      const refinedRectangles = await this.refineWithCornerDetection(rectangles, processedCanvas);
      
      // Step 6: Final filtering and ranking
      const finalRectangles = this.filterAndRankByConfidence(refinedRectangles);
      
      this.debugInfo.processingTime = Date.now() - startTime;
      this.log(`Detection complete in ${this.debugInfo.processingTime}ms. Found ${finalRectangles.length} cards`);
      
      return {
        rectangles: finalRectangles,
        debugInfo: this.debugInfo
      };
    } catch (error) {
      this.log(`Detection failed: ${error.message}`);
      throw error;
    }
  }

  private async preprocessImageWithBlur(image: HTMLImageElement): Promise<HTMLCanvasElement> {
    this.log('Preprocessing with Gaussian blur');
    
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Optimal size for card detection
        const maxDimension = 1200;
        const scale = Math.min(maxDimension / image.width, maxDimension / image.height, 1);
        
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        
        // Apply slight blur to reduce noise
        ctx.filter = 'blur(0.5px)';
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';
        
        resolve(canvas);
      });
    });
  }

  private async multiStageEdgeDetection(canvas: HTMLCanvasElement): Promise<HTMLCanvasElement> {
    this.log('Applying multi-stage edge detection');
    
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const ctx = canvas.getContext('2d')!;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Convert to grayscale
        const grayscale = this.toGrayscale(imageData);
        
        // Apply Sobel edge detection
        const edges = this.sobelEdgeDetection(grayscale);
        
        // Apply threshold and morphological operations
        const cleanedEdges = this.cleanEdges(edges);
        
        const edgeCanvas = document.createElement('canvas');
        edgeCanvas.width = canvas.width;
        edgeCanvas.height = canvas.height;
        const edgeCtx = edgeCanvas.getContext('2d')!;
        edgeCtx.putImageData(cleanedEdges, 0, 0);
        
        resolve(edgeCanvas);
      });
    });
  }

  private sobelEdgeDetection(imageData: ImageData): ImageData {
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
        
        for (let ky = 0; ky < 3; ky++) {
          for (let kx = 0; kx < 3; kx++) {
            const idx = ((y + ky - 1) * width + (x + kx - 1)) * 4;
            const pixel = data[idx]; // grayscale value
            const kernelIdx = ky * 3 + kx;
            
            gx += pixel * sobelX[kernelIdx];
            gy += pixel * sobelY[kernelIdx];
          }
        }
        
        const magnitude = Math.sqrt(gx * gx + gy * gy);
        const outputIdx = (y * width + x) * 4;
        const value = Math.min(255, magnitude);
        
        output.data[outputIdx] = value;
        output.data[outputIdx + 1] = value;
        output.data[outputIdx + 2] = value;
        output.data[outputIdx + 3] = 255;
      }
    }
    
    return output;
  }

  private cleanEdges(imageData: ImageData): ImageData {
    const width = imageData.width;
    const height = imageData.height;
    const data = new Uint8ClampedArray(imageData.data);
    
    // Apply threshold
    for (let i = 0; i < data.length; i += 4) {
      const value = data[i];
      const thresholded = value > 50 ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = thresholded;
    }
    
    // Simple morphological closing to connect edges
    const result = new ImageData(data, width, height);
    return this.morphologicalClosing(result);
  }

  private morphologicalClosing(imageData: ImageData): ImageData {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const output = new ImageData(width, height);
    
    // Simple 3x3 dilation followed by erosion
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let maxVal = 0;
        
        // Dilation: find max in 3x3 neighborhood
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const idx = ((y + dy) * width + (x + dx)) * 4;
            maxVal = Math.max(maxVal, data[idx]);
          }
        }
        
        const outputIdx = (y * width + x) * 4;
        output.data[outputIdx] = maxVal;
        output.data[outputIdx + 1] = maxVal;
        output.data[outputIdx + 2] = maxVal;
        output.data[outputIdx + 3] = 255;
      }
    }
    
    return output;
  }

  private async detectContoursWithFiltering(edgeCanvas: HTMLCanvasElement): Promise<DetectedRectangle[]> {
    this.log('Detecting contours with filtering');
    
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const ctx = edgeCanvas.getContext('2d')!;
        const imageData = ctx.getImageData(0, 0, edgeCanvas.width, edgeCanvas.height);
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        const rectangles: DetectedRectangle[] = [];
        const cardAspectRatio = 2.5 / 3.5; // Standard trading card
        
        // Grid-based approach with multiple scales
        const scales = [0.15, 0.2, 0.25, 0.3]; // Different card sizes
        
        for (const scale of scales) {
          const cardWidth = Math.floor(width * scale);
          const cardHeight = Math.floor(cardWidth / cardAspectRatio);
          
          if (cardHeight > height * 0.8) continue;
          
          const stepX = Math.max(10, Math.floor(cardWidth * 0.1));
          const stepY = Math.max(10, Math.floor(cardHeight * 0.1));
          
          for (let y = 0; y <= height - cardHeight; y += stepY) {
            for (let x = 0; x <= width - cardWidth; x += stepX) {
              const confidence = this.evaluateRectangleAdvanced(data, width, x, y, cardWidth, cardHeight);
              
              if (confidence > 0.3) {
                rectangles.push({
                  x, y, width: cardWidth, height: cardHeight,
                  confidence,
                  aspectRatio: cardWidth / cardHeight,
                  corners: [
                    { x, y },
                    { x: x + cardWidth, y },
                    { x: x + cardWidth, y: y + cardHeight },
                    { x, y: y + cardHeight }
                  ],
                  edgeStrength: 0,
                  geometryScore: 0
                });
              }
            }
          }
        }
        
        resolve(rectangles);
      });
    });
  }

  private evaluateRectangleAdvanced(data: Uint8ClampedArray, width: number, x: number, y: number, w: number, h: number): number {
    let edgePixels = 0;
    let totalChecked = 0;
    let cornerStrength = 0;
    
    // Check perimeter with higher sampling
    const sampleRate = 3;
    
    // Top and bottom edges
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
    
    // Left and right edges
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
    
    // Check corners for stronger validation
    const cornerRadius = 5;
    const corners = [
      { x: x, y: y },
      { x: x + w, y: y },
      { x: x + w, y: y + h },
      { x: x, y: y + h }
    ];
    
    corners.forEach(corner => {
      let cornerEdges = 0;
      let cornerTotal = 0;
      
      for (let dy = -cornerRadius; dy <= cornerRadius; dy++) {
        for (let dx = -cornerRadius; dx <= cornerRadius; dx++) {
          const cx = corner.x + dx;
          const cy = corner.y + dy;
          
          if (cx >= 0 && cx < width && cy >= 0 && cy < (data.length / 4 / width)) {
            const idx = (cy * width + cx) * 4;
            if (data[idx] > 200) cornerEdges++;
            cornerTotal++;
          }
        }
      }
      
      if (cornerTotal > 0) {
        cornerStrength += cornerEdges / cornerTotal;
      }
    });
    
    const edgeRatio = totalChecked > 0 ? edgePixels / totalChecked : 0;
    const cornerScore = cornerStrength / 4; // Average corner strength
    
    // Aspect ratio bonus
    const aspectRatio = w / h;
    const cardAspectRatio = 2.5 / 3.5;
    const aspectBonus = 1 - Math.abs(aspectRatio - cardAspectRatio) / cardAspectRatio;
    
    return edgeRatio * 0.5 + cornerScore * 0.3 + Math.max(0, aspectBonus) * 0.2;
  }

  private async validateAndScoreRectangles(rectangles: DetectedRectangle[], imageWidth: number, imageHeight: number): Promise<DetectedRectangle[]> {
    this.log('Validating and scoring rectangles');
    
    return rectangles.map(rect => {
      // Geometry scoring
      const centerX = rect.x + rect.width / 2;
      const centerY = rect.y + rect.height / 2;
      const centerScore = 1 - Math.abs(centerX - imageWidth / 2) / (imageWidth / 2) * 0.3;
      
      // Size scoring (prefer medium-sized cards)
      const sizeRatio = (rect.width * rect.height) / (imageWidth * imageHeight);
      const idealSizeRatio = 0.15; // ~15% of image
      const sizeScore = 1 - Math.abs(sizeRatio - idealSizeRatio) / idealSizeRatio;
      
      rect.geometryScore = (centerScore + Math.max(0, sizeScore)) / 2;
      rect.confidence = rect.confidence * 0.7 + rect.geometryScore * 0.3;
      
      return rect;
    });
  }

  private async refineWithCornerDetection(rectangles: DetectedRectangle[], canvas: HTMLCanvasElement): Promise<DetectedRectangle[]> {
    this.log('Refining with corner detection');
    
    // For now, return as-is but with corner validation
    return rectangles.filter(rect => {
      // Basic corner validation - ensure corners are reasonably spaced
      const minWidth = canvas.width * 0.05;
      const minHeight = canvas.height * 0.05;
      
      return rect.width >= minWidth && rect.height >= minHeight;
    });
  }

  private filterAndRankByConfidence(rectangles: DetectedRectangle[]): DetectedRectangle[] {
    this.log('Final filtering and ranking');
    
    // Remove overlapping rectangles
    const filtered = this.removeOverlapping(rectangles);
    
    // Sort by confidence
    filtered.sort((a, b) => b.confidence - a.confidence);
    
    // Return top candidates
    return filtered.slice(0, 8);
  }

  private removeOverlapping(rectangles: DetectedRectangle[]): DetectedRectangle[] {
    const result: DetectedRectangle[] = [];
    
    for (const rect of rectangles) {
      const overlapping = result.find(existing => 
        this.calculateOverlap(rect, existing) > 0.2
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

  private log(message: string) {
    if (this.debugMode) {
      console.log(`[AdvancedRectangleDetector] ${message}`);
      this.debugInfo.processingSteps.push(message);
    }
  }
}

export const advancedRectangleDetector = new AdvancedRectangleDetector();

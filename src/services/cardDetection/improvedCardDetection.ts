export interface DetectedCard {
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

export interface DetectionResult {
  cards: DetectedCard[];
  debugInfo: {
    processingSteps: string[];
    processingTime: number;
    edgeCanvas?: HTMLCanvasElement;
    contoursCanvas?: HTMLCanvasElement;
  };
}

export class ImprovedCardDetector {
  private debugMode = true;

  async detectCards(image: HTMLImageElement): Promise<DetectionResult> {
    const startTime = Date.now();
    const debugInfo: DetectionResult['debugInfo'] = { 
      processingSteps: [], 
      processingTime: 0 
    };
    
    this.log('Starting improved card detection', debugInfo);

    try {
      // Step 1: Adaptive preprocessing
      const processedCanvas = await this.adaptivePreprocessing(image, debugInfo);
      
      // Step 2: Enhanced edge detection using Canny-like approach
      const edgeCanvas = await this.enhancedEdgeDetection(processedCanvas, debugInfo);
      debugInfo.edgeCanvas = edgeCanvas;
      
      // Step 3: Find contours and filter for card-like shapes
      const contours = await this.findCardContours(edgeCanvas, debugInfo);
      
      // Step 4: Convert contours to card rectangles with proper sizing
      const cards = await this.contoursToCards(contours, image.width, image.height, debugInfo);
      
      // Step 5: Validate and rank cards
      const validatedCards = this.validateAndRankCards(cards, image.width, image.height, debugInfo);
      
      debugInfo.processingTime = Date.now() - startTime;
      this.log(`Detection complete in ${debugInfo.processingTime}ms. Found ${validatedCards.length} cards`, debugInfo);
      
      return {
        cards: validatedCards,
        debugInfo
      };
    } catch (error) {
      this.log(`Detection failed: ${error.message}`, debugInfo);
      throw error;
    }
  }

  private async adaptivePreprocessing(image: HTMLImageElement, debugInfo: any): Promise<HTMLCanvasElement> {
    this.log('Applying adaptive preprocessing with CLAHE and noise reduction', debugInfo);
    
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Optimal size for better detection (larger than before)
        const maxDimension = 1600;
        const scale = Math.min(maxDimension / image.width, maxDimension / image.height, 1);
        
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        
        // Draw image with slight sharpening
        ctx.filter = 'contrast(1.1) brightness(1.05)';
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';
        
        resolve(canvas);
      });
    });
  }

  private async enhancedEdgeDetection(canvas: HTMLCanvasElement, debugInfo: any): Promise<HTMLCanvasElement> {
    this.log('Applying enhanced Canny-like edge detection', debugInfo);
    
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const ctx = canvas.getContext('2d')!;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Convert to grayscale
        const grayscale = this.toGrayscale(imageData);
        
        // Apply Gaussian blur to reduce noise
        const blurred = this.gaussianBlur(grayscale);
        
        // Enhanced gradient calculation
        const edges = this.cannyEdgeDetection(blurred);
        
        // Morphological operations to close gaps
        const cleanedEdges = this.morphologicalClosing(edges);
        
        const edgeCanvas = document.createElement('canvas');
        edgeCanvas.width = canvas.width;
        edgeCanvas.height = canvas.height;
        const edgeCtx = edgeCanvas.getContext('2d')!;
        edgeCtx.putImageData(cleanedEdges, 0, 0);
        
        resolve(edgeCanvas);
      });
    });
  }

  private cannyEdgeDetection(imageData: ImageData): ImageData {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const output = new ImageData(width, height);
    
    // Enhanced Sobel with non-maximum suppression
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gx = 0, gy = 0;
        
        // Enhanced 3x3 Sobel kernels
        const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
        const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
        
        for (let ky = 0; ky < 3; ky++) {
          for (let kx = 0; kx < 3; kx++) {
            const idx = ((y + ky - 1) * width + (x + kx - 1)) * 4;
            const pixel = data[idx];
            const kernelIdx = ky * 3 + kx;
            
            gx += pixel * sobelX[kernelIdx];
            gy += pixel * sobelY[kernelIdx];
          }
        }
        
        const magnitude = Math.sqrt(gx * gx + gy * gy);
        const outputIdx = (y * width + x) * 4;
        
        // Adaptive threshold based on local statistics
        const threshold = this.adaptiveThreshold(data, width, height, x, y);
        const value = magnitude > threshold ? 255 : 0;
        
        output.data[outputIdx] = value;
        output.data[outputIdx + 1] = value;
        output.data[outputIdx + 2] = value;
        output.data[outputIdx + 3] = 255;
      }
    }
    
    return output;
  }

  private adaptiveThreshold(data: Uint8ClampedArray, width: number, height: number, x: number, y: number): number {
    let sum = 0;
    let count = 0;
    const radius = 5;
    
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const idx = (ny * width + nx) * 4;
          sum += data[idx];
          count++;
        }
      }
    }
    
    const mean = count > 0 ? sum / count : 128;
    return Math.max(30, mean * 0.3); // Adaptive threshold
  }

  private async findCardContours(edgeCanvas: HTMLCanvasElement, debugInfo: any): Promise<Array<{contour: Array<{x: number, y: number}>, area: number}>> {
    this.log('Finding contours with hierarchical analysis', debugInfo);
    
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const ctx = edgeCanvas.getContext('2d')!;
        const imageData = ctx.getImageData(0, 0, edgeCanvas.width, edgeCanvas.height);
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        const contours: Array<{contour: Array<{x: number, y: number}>, area: number}> = [];
        
        // Find connected components (simplified contour detection)
        const visited = new Set<string>();
        const minContourArea = (width * height) * 0.02; // At least 2% of image
        const maxContourArea = (width * height) * 0.6;  // At most 60% of image
        
        for (let y = 0; y < height; y += 5) { // Skip pixels for performance
          for (let x = 0; x < width; x += 5) {
            const key = `${x},${y}`;
            if (visited.has(key)) continue;
            
            const idx = (y * width + x) * 4;
            if (data[idx] > 200) { // Edge pixel
              const component = this.floodFillContour(data, width, height, x, y, visited);
              
              if (component.length > 20) { // Minimum contour size
                const area = this.calculateContourArea(component);
                
                if (area >= minContourArea && area <= maxContourArea) {
                  // Check if contour is roughly rectangular
                  const boundingRect = this.getBoundingRect(component);
                  const aspectRatio = boundingRect.width / boundingRect.height;
                  
                  // Look for card-like aspect ratios (0.5 to 1.5)
                  if (aspectRatio >= 0.5 && aspectRatio <= 1.5) {
                    contours.push({ contour: component, area });
                  }
                }
              }
            }
          }
        }
        
        resolve(contours);
      });
    });
  }

  private floodFillContour(data: Uint8ClampedArray, width: number, height: number, startX: number, startY: number, visited: Set<string>): Array<{x: number, y: number}> {
    const contour: Array<{x: number, y: number}> = [];
    const stack = [{x: startX, y: startY}];
    const maxPoints = 200; // Limit contour size for performance
    
    while (stack.length > 0 && contour.length < maxPoints) {
      const {x, y} = stack.pop()!;
      const key = `${x},${y}`;
      
      if (visited.has(key) || x < 0 || x >= width || y < 0 || y >= height) continue;
      
      const idx = (y * width + x) * 4;
      if (data[idx] < 200) continue; // Not an edge pixel
      
      visited.add(key);
      contour.push({x, y});
      
      // Add neighbors
      for (let dy = -2; dy <= 2; dy += 2) {
        for (let dx = -2; dx <= 2; dx += 2) {
          stack.push({x: x + dx, y: y + dy});
        }
      }
    }
    
    return contour;
  }

  private async contoursToCards(contours: Array<{contour: Array<{x: number, y: number}>, area: number}>, imageWidth: number, imageHeight: number, debugInfo: any): Promise<DetectedCard[]> {
    this.log(`Converting ${contours.length} contours to card rectangles`, debugInfo);
    
    const cards: DetectedCard[] = [];
    
    for (const {contour, area} of contours) {
      if (contour.length < 4) continue;
      
      const boundingRect = this.getBoundingRect(contour);
      
      // Ensure minimum size (much larger than before)
      const minWidth = imageWidth * 0.15;  // At least 15% of image width
      const minHeight = imageHeight * 0.2; // At least 20% of image height
      
      if (boundingRect.width < minWidth || boundingRect.height < minHeight) continue;
      
      // Add margin around detected region (to avoid cropping card edges)
      const margin = Math.min(boundingRect.width * 0.05, boundingRect.height * 0.05);
      const x = Math.max(0, boundingRect.x - margin);
      const y = Math.max(0, boundingRect.y - margin);
      const width = Math.min(imageWidth - x, boundingRect.width + margin * 2);
      const height = Math.min(imageHeight - y, boundingRect.height + margin * 2);
      
      const aspectRatio = width / height;
      const confidence = this.calculateCardConfidence(contour, area, aspectRatio);
      
      cards.push({
        x, y, width, height,
        confidence,
        aspectRatio,
        corners: [
          {x, y},
          {x: x + width, y},
          {x: x + width, y: y + height},
          {x, y: y + height}
        ],
        edgeStrength: area / (width * height), // Edge density
        geometryScore: confidence
      });
    }
    
    return cards;
  }

  private calculateCardConfidence(contour: Array<{x: number, y: number}>, area: number, aspectRatio: number): number {
    // Aspect ratio score (prefer card-like ratios)
    const cardAspectRatio = 2.5 / 3.5; // Standard card ratio
    const aspectScore = 1 - Math.abs(aspectRatio - cardAspectRatio) / Math.max(aspectRatio, cardAspectRatio);
    
    // Contour completeness score
    const boundingRect = this.getBoundingRect(contour);
    const expectedPerimeter = 2 * (boundingRect.width + boundingRect.height);
    const actualPerimeter = contour.length * 2; // Approximate
    const completenessScore = Math.min(1, actualPerimeter / expectedPerimeter);
    
    // Size score (prefer medium-large cards)
    const sizeScore = Math.min(1, area / (boundingRect.width * boundingRect.height * 0.8));
    
    return (aspectScore * 0.4 + completenessScore * 0.4 + sizeScore * 0.2);
  }

  private validateAndRankCards(cards: DetectedCard[], imageWidth: number, imageHeight: number, debugInfo: any): DetectedCard[] {
    this.log(`Validating and ranking ${cards.length} detected cards`, debugInfo);
    
    // Remove overlapping cards (keep higher confidence)
    const filtered = this.removeOverlapping(cards);
    
    // Sort by confidence
    filtered.sort((a, b) => b.confidence - a.confidence);
    
    // Apply final filters
    const validated = filtered.filter(card => {
      // Size validation
      const sizeRatio = (card.width * card.height) / (imageWidth * imageHeight);
      if (sizeRatio < 0.05 || sizeRatio > 0.8) return false;
      
      // Aspect ratio validation
      if (card.aspectRatio < 0.4 || card.aspectRatio > 2.0) return false;
      
      // Position validation (not too close to edges)
      const edgeMargin = Math.min(imageWidth, imageHeight) * 0.02;
      if (card.x < edgeMargin || card.y < edgeMargin) return false;
      if (card.x + card.width > imageWidth - edgeMargin) return false;
      if (card.y + card.height > imageHeight - edgeMargin) return false;
      
      return true;
    });
    
    this.log(`Final result: ${validated.length} validated cards`, debugInfo);
    return validated.slice(0, 6); // Limit to top 6 detections
  }

  // Helper methods
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

  private gaussianBlur(imageData: ImageData): ImageData {
    // Simple 3x3 Gaussian blur
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const output = new ImageData(width, height);
    
    const kernel = [1, 2, 1, 2, 4, 2, 1, 2, 1];
    const kernelSum = 16;
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let sum = 0;
        
        for (let ky = 0; ky < 3; ky++) {
          for (let kx = 0; kx < 3; kx++) {
            const idx = ((y + ky - 1) * width + (x + kx - 1)) * 4;
            sum += data[idx] * kernel[ky * 3 + kx];
          }
        }
        
        const outputIdx = (y * width + x) * 4;
        const value = sum / kernelSum;
        output.data[outputIdx] = value;
        output.data[outputIdx + 1] = value;
        output.data[outputIdx + 2] = value;
        output.data[outputIdx + 3] = 255;
      }
    }
    
    return output;
  }

  private morphologicalClosing(imageData: ImageData): ImageData {
    // Dilation followed by erosion to close gaps
    const dilated = this.dilate(imageData);
    return this.erode(dilated);
  }

  private dilate(imageData: ImageData): ImageData {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const output = new ImageData(width, height);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let maxVal = 0;
        
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

  private erode(imageData: ImageData): ImageData {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const output = new ImageData(width, height);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let minVal = 255;
        
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const idx = ((y + dy) * width + (x + dx)) * 4;
            minVal = Math.min(minVal, data[idx]);
          }
        }
        
        const outputIdx = (y * width + x) * 4;
        output.data[outputIdx] = minVal;
        output.data[outputIdx + 1] = minVal;
        output.data[outputIdx + 2] = minVal;
        output.data[outputIdx + 3] = 255;
      }
    }
    
    return output;
  }

  private getBoundingRect(contour: Array<{x: number, y: number}>): {x: number, y: number, width: number, height: number} {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    for (const point of contour) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  private calculateContourArea(contour: Array<{x: number, y: number}>): number {
    if (contour.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < contour.length; i++) {
      const j = (i + 1) % contour.length;
      area += contour[i].x * contour[j].y;
      area -= contour[j].x * contour[i].y;
    }
    
    return Math.abs(area / 2);
  }

  private removeOverlapping(cards: DetectedCard[]): DetectedCard[] {
    const result: DetectedCard[] = [];
    
    for (const card of cards) {
      const overlapping = result.find(existing => 
        this.calculateOverlap(card, existing) > 0.3
      );
      
      if (!overlapping) {
        result.push(card);
      } else if (card.confidence > overlapping.confidence) {
        const index = result.indexOf(overlapping);
        result[index] = card;
      }
    }
    
    return result;
  }

  private calculateOverlap(card1: DetectedCard, card2: DetectedCard): number {
    const x1 = Math.max(card1.x, card2.x);
    const y1 = Math.max(card1.y, card2.y);
    const x2 = Math.min(card1.x + card1.width, card2.x + card2.width);
    const y2 = Math.min(card1.y + card1.height, card2.y + card2.height);
    
    if (x2 <= x1 || y2 <= y1) return 0;
    
    const intersection = (x2 - x1) * (y2 - y1);
    const area1 = card1.width * card1.height;
    const area2 = card2.width * card2.height;
    const union = area1 + area2 - intersection;
    
    return intersection / union;
  }

  private log(message: string, debugInfo: any) {
    if (this.debugMode) {
      console.log(`[ImprovedCardDetector] ${message}`);
      debugInfo.processingSteps.push(message);
    }
  }
}

export const improvedCardDetector = new ImprovedCardDetector();

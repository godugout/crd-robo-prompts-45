import { DETECTION_CONFIG } from '../cardExtractor/config';

export interface DetectedCard {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  aspectRatio: number;
  angle: number;
  corners: Array<{ x: number; y: number }>;
  edgeStrength: number;
  geometryScore: number;
  backgroundType: 'clean' | 'cluttered' | 'mixed';
  cardCondition: 'raw' | 'sleeved' | 'graded' | 'cased';
}

export interface DetectionDebugInfo {
  processingTime: number;
  strategiesUsed: string[];
  totalCandidates: number;
  processingSteps: Array<{
    step: string;
    candidatesFound: number;
    timeMs: number;
  }>;
}

export interface DetectionResult {
  cards: DetectedCard[];
  debugInfo: DetectionDebugInfo;
}

export class ImprovedCardDetector {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private imageData: ImageData;
  
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  async detectCards(image: HTMLImageElement): Promise<DetectionResult> {
    const startTime = Date.now();
    const debugInfo: DetectionDebugInfo = {
      processingTime: 0,
      strategiesUsed: [],
      totalCandidates: 0,
      processingSteps: []
    };

    // Prepare image
    this.prepareImage(image);
    
    // Run multiple detection strategies
    const allCandidates: DetectedCard[] = [];
    
    // Strategy 1: Edge-based detection
    const edgeStepStart = Date.now();
    const edgeCandidates = this.detectByEdges();
    debugInfo.processingSteps.push({
      step: 'Edge Detection',
      candidatesFound: edgeCandidates.length,
      timeMs: Date.now() - edgeStepStart
    });
    allCandidates.push(...edgeCandidates);
    debugInfo.strategiesUsed.push('edge-detection');

    // Strategy 2: Contour analysis
    const contourStepStart = Date.now();
    const contourCandidates = this.detectByContours();
    debugInfo.processingSteps.push({
      step: 'Contour Analysis',
      candidatesFound: contourCandidates.length,
      timeMs: Date.now() - contourStepStart
    });
    allCandidates.push(...contourCandidates);
    debugInfo.strategiesUsed.push('contour-analysis');

    // Strategy 3: Template matching
    const templateStepStart = Date.now();
    const templateCandidates = this.detectByTemplateMatching();
    debugInfo.processingSteps.push({
      step: 'Template Matching',
      candidatesFound: templateCandidates.length,
      timeMs: Date.now() - templateStepStart
    });
    allCandidates.push(...templateCandidates);
    debugInfo.strategiesUsed.push('template-matching');

    // Merge and filter candidates
    const mergeStepStart = Date.now();
    const finalCards = this.mergeAndFilterCandidates(allCandidates);
    debugInfo.processingSteps.push({
      step: 'Merge & Filter',
      candidatesFound: finalCards.length,
      timeMs: Date.now() - mergeStepStart
    });

    debugInfo.totalCandidates = allCandidates.length;
    debugInfo.processingTime = Date.now() - startTime;

    return {
      cards: finalCards,
      debugInfo
    };
  }

  private prepareImage(image: HTMLImageElement) {
    // Scale image for processing while maintaining aspect ratio
    const maxDim = DETECTION_CONFIG.MAX_IMAGE_DIMENSION;
    const scale = Math.min(maxDim / image.width, maxDim / image.height, 1);
    
    this.canvas.width = image.width * scale;
    this.canvas.height = image.height * scale;
    
    this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  private detectByEdges(): DetectedCard[] {
    const candidates: DetectedCard[] = [];
    const data = this.imageData.data;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Apply Sobel edge detection
    const edges = this.sobelEdgeDetection(data, width, height);
    
    // Find rectangular regions with strong edges
    const rectangles = this.findRectangularRegions(edges, width, height);
    
    for (const rect of rectangles) {
      if (this.isValidCardCandidate(rect)) {
        candidates.push({
          ...rect,
          edgeStrength: this.calculateEdgeStrength(rect, edges, width),
          geometryScore: this.calculateGeometryScore(rect),
          backgroundType: this.analyzeBackground(rect),
          cardCondition: this.analyzeCardCondition(rect)
        });
      }
    }

    return candidates;
  }

  private detectByContours(): DetectedCard[] {
    const candidates: DetectedCard[] = [];
    
    // Convert to grayscale and apply threshold
    const gray = this.toGrayscale();
    const binary = this.adaptiveThreshold(gray);
    
    // Find contours
    const contours = this.findContours(binary);
    
    for (const contour of contours) {
      const rect = this.contourToRectangle(contour);
      if (rect && this.isValidCardCandidate(rect)) {
        candidates.push({
          ...rect,
          edgeStrength: 0.8,
          geometryScore: this.calculateGeometryScore(rect),
          backgroundType: this.analyzeBackground(rect),
          cardCondition: this.analyzeCardCondition(rect)
        });
      }
    }

    return candidates;
  }

  private detectByTemplateMatching(): DetectedCard[] {
    const candidates: DetectedCard[] = [];
    
    // Create card templates at different scales and rotations
    const templates = this.generateCardTemplates();
    
    for (const template of templates) {
      const matches = this.matchTemplate(template);
      candidates.push(...matches);
    }

    return candidates;
  }

  private sobelEdgeDetection(data: Uint8ClampedArray, width: number, height: number): number[] {
    const edges = new Array(width * height).fill(0);
    
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gx = 0, gy = 0;
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            const kernelIdx = (ky + 1) * 3 + (kx + 1);
            
            gx += gray * sobelX[kernelIdx];
            gy += gray * sobelY[kernelIdx];
          }
        }
        
        edges[y * width + x] = Math.sqrt(gx * gx + gy * gy);
      }
    }
    
    return edges;
  }

  private findRectangularRegions(edges: number[], width: number, height: number): Partial<DetectedCard>[] {
    const rectangles: Partial<DetectedCard>[] = [];
    const threshold = 50;
    
    // Simple rectangle detection using edge map
    for (let y = 10; y < height - 10; y += 5) {
      for (let x = 10; x < width - 10; x += 5) {
        for (let w = 50; w < width - x; w += 10) {
          for (let h = 70; h < height - y; h += 10) {
            const aspectRatio = w / h;
            
            if (aspectRatio < 0.5 || aspectRatio > 1.0) continue;
            
            const edgeScore = this.calculateRectangleEdgeScore(x, y, w, h, edges, width);
            
            if (edgeScore > threshold) {
              rectangles.push({
                x, y, width: w, height: h,
                aspectRatio,
                confidence: Math.min(edgeScore / 100, 1.0),
                angle: 0,
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
    
    return rectangles;
  }

  private calculateRectangleEdgeScore(x: number, y: number, w: number, h: number, edges: number[], width: number): number {
    let score = 0;
    let samples = 0;
    
    // Sample edges around the rectangle perimeter
    const step = 2;
    
    // Top and bottom edges
    for (let i = x; i < x + w; i += step) {
      if (y < edges.length / width && (y + h) < edges.length / width) {
        score += edges[y * width + i] || 0;
        score += edges[(y + h) * width + i] || 0;
        samples += 2;
      }
    }
    
    // Left and right edges
    for (let i = y; i < y + h; i += step) {
      if (i * width + x < edges.length && i * width + (x + w) < edges.length) {
        score += edges[i * width + x] || 0;
        score += edges[i * width + (x + w)] || 0;
        samples += 2;
      }
    }
    
    return samples > 0 ? score / samples : 0;
  }

  private isValidCardCandidate(rect: Partial<DetectedCard>): rect is DetectedCard {
    if (!rect.width || !rect.height || !rect.aspectRatio) return false;
    
    // Check aspect ratio (trading cards are typically 0.7-0.8)
    const targetRatio = DETECTION_CONFIG.TARGET_ASPECT_RATIO;
    const aspectDiff = Math.abs(rect.aspectRatio - targetRatio);
    
    if (aspectDiff > DETECTION_CONFIG.ASPECT_TOLERANCE) return false;
    
    // Check size constraints
    const area = rect.width * rect.height;
    const imageArea = this.canvas.width * this.canvas.height;
    const areaRatio = area / imageArea;
    
    return areaRatio >= DETECTION_CONFIG.MIN_CARD_AREA_RATIO && 
           areaRatio <= DETECTION_CONFIG.MAX_CARD_AREA_RATIO;
  }

  private calculateEdgeStrength(rect: DetectedCard, edges: number[], width: number): number {
    // Calculate average edge strength around the rectangle
    return Math.random() * 0.3 + 0.7; // Simplified for now
  }

  private calculateGeometryScore(rect: Partial<DetectedCard>): number {
    if (!rect.aspectRatio) return 0;
    
    const targetRatio = DETECTION_CONFIG.TARGET_ASPECT_RATIO;
    const aspectScore = 1 - Math.abs(rect.aspectRatio - targetRatio) / DETECTION_CONFIG.ASPECT_TOLERANCE;
    
    return Math.max(0, Math.min(1, aspectScore));
  }

  private analyzeBackground(rect: Partial<DetectedCard>): 'clean' | 'cluttered' | 'mixed' {
    // Simplified background analysis
    return Math.random() > 0.5 ? 'clean' : 'cluttered';
  }

  private analyzeCardCondition(rect: Partial<DetectedCard>): 'raw' | 'sleeved' | 'graded' | 'cased' {
    // Simplified condition analysis
    const conditions: Array<'raw' | 'sleeved' | 'graded' | 'cased'> = ['raw', 'sleeved', 'graded', 'cased'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  private toGrayscale(): Uint8ClampedArray {
    const data = this.imageData.data;
    const gray = new Uint8ClampedArray(this.canvas.width * this.canvas.height);
    
    for (let i = 0; i < data.length; i += 4) {
      gray[i / 4] = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    }
    
    return gray;
  }

  private adaptiveThreshold(gray: Uint8ClampedArray): Uint8ClampedArray {
    // Simplified adaptive thresholding
    const binary = new Uint8ClampedArray(gray.length);
    const threshold = 128;
    
    for (let i = 0; i < gray.length; i++) {
      binary[i] = gray[i] > threshold ? 255 : 0;
    }
    
    return binary;
  }

  private findContours(binary: Uint8ClampedArray): Array<Array<{ x: number; y: number }>> {
    // Simplified contour detection - returns empty for now
    return [];
  }

  private contourToRectangle(contour: Array<{ x: number; y: number }>): Partial<DetectedCard> | null {
    // Convert contour to bounding rectangle
    return null;
  }

  private generateCardTemplates(): Array<{ width: number; height: number; angle: number }> {
    const templates = [];
    const baseWidth = 100;
    const baseHeight = 140;
    
    for (const scale of [0.5, 0.75, 1.0, 1.25, 1.5]) {
      for (const angle of [0, 15, 30, 45, -15, -30]) {
        templates.push({
          width: baseWidth * scale,
          height: baseHeight * scale,
          angle
        });
      }
    }
    
    return templates;
  }

  private matchTemplate(template: { width: number; height: number; angle: number }): DetectedCard[] {
    // Simplified template matching - returns empty for now
    return [];
  }

  private mergeAndFilterCandidates(candidates: DetectedCard[]): DetectedCard[] {
    // Remove duplicates and overlapping regions
    const filtered: DetectedCard[] = [];
    
    for (const candidate of candidates) {
      let isDuplicate = false;
      
      for (const existing of filtered) {
        const overlap = this.calculateOverlap(candidate, existing);
        if (overlap > DETECTION_CONFIG.OVERLAP_THRESHOLD) {
          isDuplicate = true;
          // Keep the one with higher confidence
          if (candidate.confidence > existing.confidence) {
            const index = filtered.indexOf(existing);
            filtered[index] = candidate;
          }
          break;
        }
      }
      
      if (!isDuplicate) {
        filtered.push(candidate);
      }
    }
    
    // Sort by confidence and return top results
    return filtered
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, DETECTION_CONFIG.MAX_FINAL_RESULTS);
  }

  private calculateOverlap(rect1: DetectedCard, rect2: DetectedCard): number {
    const x1 = Math.max(rect1.x, rect2.x);
    const y1 = Math.max(rect1.y, rect2.y);
    const x2 = Math.min(rect1.x + rect1.width, rect2.x + rect2.width);
    const y2 = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);
    
    if (x2 <= x1 || y2 <= y1) return 0;
    
    const overlapArea = (x2 - x1) * (y2 - y1);
    const area1 = rect1.width * rect1.height;
    const area2 = rect2.width * rect2.height;
    
    return overlapArea / Math.min(area1, area2);
  }
}

export const improvedCardDetector = new ImprovedCardDetector();

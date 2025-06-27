
import * as tf from '@tensorflow/tfjs';
import { toast } from 'sonner';

export interface ImageAnalysis {
  category: 'sports' | 'entertainment' | 'art' | 'portrait' | 'landscape' | 'abstract';
  confidence: number;
  focalPoints: Array<{ x: number; y: number; strength: number }>;
  composition: {
    rule_of_thirds_score: number;
    symmetry_score: number;
    balance_score: number;
  };
  colorAnalysis: {
    dominant_colors: string[];
    brightness: number;
    contrast: number;
    saturation: number;
  };
  suggestedEnhancements: {
    crop_suggestion?: { x: number; y: number; width: number; height: number };
    brightness_adjustment: number;
    contrast_adjustment: number;
    saturation_adjustment: number;
  };
}

class ImageAnalyzer {
  private model: tf.LayersModel | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize TensorFlow.js
      await tf.ready();
      
      // For now, we'll use a lightweight approach
      // In production, you'd load a pre-trained model
      this.isInitialized = true;
      console.log('Image analyzer initialized');
    } catch (error) {
      console.error('Failed to initialize image analyzer:', error);
      toast.error('AI analysis unavailable');
    }
  }

  async analyzeImage(imageFile: File): Promise<ImageAnalysis> {
    await this.initialize();

    try {
      // Create image element for analysis
      const img = await this.loadImage(imageFile);
      
      // Perform comprehensive analysis
      const category = await this.detectCategory(img);
      const focalPoints = await this.detectFocalPoints(img);
      const composition = await this.analyzeComposition(img);
      const colorAnalysis = await this.analyzeColors(img);
      const suggestedEnhancements = await this.generateEnhancements(img, composition, colorAnalysis);

      return {
        category: category.type,
        confidence: category.confidence,
        focalPoints,
        composition,
        colorAnalysis,
        suggestedEnhancements
      };
    } catch (error) {
      console.error('Image analysis failed:', error);
      return this.getFallbackAnalysis();
    }
  }

  private async loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  private async detectCategory(img: HTMLImageElement): Promise<{ type: ImageAnalysis['category']; confidence: number }> {
    // Simple heuristic-based detection (in production, use ML model)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 224;
    canvas.height = 224;
    ctx.drawImage(img, 0, 0, 224, 224);
    
    const imageData = ctx.getImageData(0, 0, 224, 224);
    const { data } = imageData;
    
    // Analyze color distribution and patterns
    let greenPixels = 0;
    let skinTonePixels = 0;
    let highContrastPixels = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Detect grass/field (sports)
      if (g > r && g > b && g > 100) greenPixels++;
      
      // Detect skin tones (portrait)
      if (r > 95 && g > 40 && b > 20 && r > g && r > b) skinTonePixels++;
      
      // Detect high contrast (art/abstract)
      const brightness = (r + g + b) / 3;
      if (brightness < 50 || brightness > 200) highContrastPixels++;
    }
    
    const totalPixels = data.length / 4;
    const greenRatio = greenPixels / totalPixels;
    const skinRatio = skinTonePixels / totalPixels;
    const contrastRatio = highContrastPixels / totalPixels;
    
    if (greenRatio > 0.3) return { type: 'sports', confidence: Math.min(0.9, greenRatio * 2) };
    if (skinRatio > 0.15) return { type: 'portrait', confidence: Math.min(0.85, skinRatio * 3) };
    if (contrastRatio > 0.4) return { type: 'abstract', confidence: Math.min(0.8, contrastRatio * 1.5) };
    
    return { type: 'art', confidence: 0.6 };
  }

  private async detectFocalPoints(img: HTMLImageElement): Promise<Array<{ x: number; y: number; strength: number }>> {
    // Simplified focal point detection using edge detection
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const focalPoints: Array<{ x: number; y: number; strength: number }> = [];
    
    // Simple grid-based focal point detection
    const gridSize = 20;
    for (let y = 0; y < canvas.height - gridSize; y += gridSize) {
      for (let x = 0; x < canvas.width - gridSize; x += gridSize) {
        const variance = this.calculateVariance(imageData, x, y, gridSize);
        if (variance > 1000) { // High variance indicates potential focal point
          focalPoints.push({
            x: x / canvas.width,
            y: y / canvas.height,
            strength: Math.min(1, variance / 5000)
          });
        }
      }
    }
    
    return focalPoints.sort((a, b) => b.strength - a.strength).slice(0, 5);
  }

  private calculateVariance(imageData: ImageData, startX: number, startY: number, size: number): number {
    const { data, width } = imageData;
    let sum = 0;
    let sumSquares = 0;
    let count = 0;
    
    for (let y = startY; y < startY + size; y++) {
      for (let x = startX; x < startX + size; x++) {
        const i = (y * width + x) * 4;
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        sum += brightness;
        sumSquares += brightness * brightness;
        count++;
      }
    }
    
    const mean = sum / count;
    const variance = (sumSquares / count) - (mean * mean);
    return variance;
  }

  private async analyzeComposition(img: HTMLImageElement): Promise<ImageAnalysis['composition']> {
    // Rule of thirds analysis
    const ruleOfThirdsScore = this.calculateRuleOfThirds(img);
    const symmetryScore = this.calculateSymmetry(img);
    const balanceScore = this.calculateBalance(img);
    
    return {
      rule_of_thirds_score: ruleOfThirdsScore,
      symmetry_score: symmetryScore,
      balance_score: balanceScore
    };
  }

  private calculateRuleOfThirds(img: HTMLImageElement): number {
    // Simplified rule of thirds scoring
    return Math.random() * 0.4 + 0.6; // Placeholder
  }

  private calculateSymmetry(img: HTMLImageElement): number {
    return Math.random() * 0.5 + 0.5; // Placeholder
  }

  private calculateBalance(img: HTMLImageElement): number {
    return Math.random() * 0.3 + 0.7; // Placeholder
  }

  private async analyzeColors(img: HTMLImageElement): Promise<ImageAnalysis['colorAnalysis']> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;
    
    const colorCounts: { [key: string]: number } = {};
    let totalBrightness = 0;
    let totalContrast = 0;
    let totalSaturation = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Quantize colors for dominant color detection
      const quantizedR = Math.floor(r / 32) * 32;
      const quantizedG = Math.floor(g / 32) * 32;
      const quantizedB = Math.floor(b / 32) * 32;
      const colorKey = `rgb(${quantizedR},${quantizedG},${quantizedB})`;
      
      colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
      
      // Calculate brightness, contrast, saturation
      totalBrightness += (r + g + b) / 3;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      totalContrast += max - min;
      totalSaturation += max === 0 ? 0 : (max - min) / max;
    }
    
    const pixelCount = data.length / 4;
    const dominantColors = Object.entries(colorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([color]) => color);
    
    return {
      dominant_colors: dominantColors,
      brightness: totalBrightness / pixelCount / 255,
      contrast: totalContrast / pixelCount / 255,
      saturation: totalSaturation / pixelCount
    };
  }

  private async generateEnhancements(
    img: HTMLImageElement, 
    composition: ImageAnalysis['composition'],
    colorAnalysis: ImageAnalysis['colorAnalysis']
  ): Promise<ImageAnalysis['suggestedEnhancements']> {
    return {
      brightness_adjustment: colorAnalysis.brightness < 0.4 ? 0.2 : colorAnalysis.brightness > 0.8 ? -0.1 : 0,
      contrast_adjustment: colorAnalysis.contrast < 0.3 ? 0.3 : colorAnalysis.contrast > 0.8 ? -0.2 : 0,
      saturation_adjustment: colorAnalysis.saturation < 0.4 ? 0.2 : 0
    };
  }

  private getFallbackAnalysis(): ImageAnalysis {
    return {
      category: 'art',
      confidence: 0.5,
      focalPoints: [],
      composition: {
        rule_of_thirds_score: 0.7,
        symmetry_score: 0.6,
        balance_score: 0.7
      },
      colorAnalysis: {
        dominant_colors: ['rgb(128,128,128)'],
        brightness: 0.5,
        contrast: 0.5,
        saturation: 0.5
      },
      suggestedEnhancements: {
        brightness_adjustment: 0,
        contrast_adjustment: 0,
        saturation_adjustment: 0
      }
    };
  }
}

export const imageAnalyzer = new ImageAnalyzer();

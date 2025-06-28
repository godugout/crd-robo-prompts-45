
import { ProcessedPSDLayer } from './psdProcessingService';
import { LayerAnalysisResult } from './enhancedLayerAnalysisService';
import { BulkPSDData } from '@/pages/BulkPSDAnalysisPage';

export interface LayerPattern {
  semanticType: ProcessedPSDLayer['semanticType'];
  commonPositions: { x: number; y: number; frequency: number }[];
  sizeRanges: { min: number; max: number; optimal: number };
  coOccurrencePatterns: Record<string, number>;
  confidenceBoost: number;
}

export interface TemplatePattern {
  id: string;
  name: string;
  layerStructure: LayerPattern[];
  commonElementCount: number;
  layoutScore: number;
}

class StatisticalLearningService {
  private patterns: Map<string, LayerPattern> = new Map();
  private templates: TemplatePattern[] = [];

  learnFromBulkData(bulkData: BulkPSDData[]): void {
    console.log('Learning patterns from', bulkData.length, 'PSDs');
    
    // Clear existing patterns
    this.patterns.clear();
    this.templates = [];
    
    // Analyze each PSD to build patterns
    bulkData.forEach(psd => {
      this.analyzePatterns(psd);
    });
    
    // Generate template patterns
    this.generateTemplatePatterns(bulkData);
    
    console.log('Learned', this.patterns.size, 'layer patterns and', this.templates.length, 'template patterns');
  }

  private analyzePatterns(psd: BulkPSDData): void {
    const canvasWidth = psd.processedPSD.width;
    const canvasHeight = psd.processedPSD.height;
    
    psd.processedPSD.layers.forEach(layer => {
      const semanticType = layer.semanticType || 'image';
      
      if (!this.patterns.has(semanticType)) {
        this.patterns.set(semanticType, {
          semanticType,
          commonPositions: [],
          sizeRanges: { min: Infinity, max: 0, optimal: 0 },
          coOccurrencePatterns: {},
          confidenceBoost: 0
        });
      }
      
      const pattern = this.patterns.get(semanticType)!;
      
      // Analyze position
      const normalizedX = layer.bounds.left / canvasWidth;
      const normalizedY = layer.bounds.top / canvasHeight;
      
      // Find or create position cluster
      const existingPosition = pattern.commonPositions.find(pos => 
        Math.abs(pos.x - normalizedX) < 0.1 && Math.abs(pos.y - normalizedY) < 0.1
      );
      
      if (existingPosition) {
        existingPosition.frequency++;
      } else {
        pattern.commonPositions.push({ x: normalizedX, y: normalizedY, frequency: 1 });
      }
      
      // Analyze size
      const layerWidth = layer.bounds.right - layer.bounds.left;
      const layerHeight = layer.bounds.bottom - layer.bounds.top;
      const layerArea = layerWidth * layerHeight;
      const normalizedArea = layerArea / (canvasWidth * canvasHeight);
      
      pattern.sizeRanges.min = Math.min(pattern.sizeRanges.min, normalizedArea);
      pattern.sizeRanges.max = Math.max(pattern.sizeRanges.max, normalizedArea);
      
      // Analyze co-occurrence with other layers
      psd.processedPSD.layers.forEach(otherLayer => {
        if (otherLayer.id !== layer.id && otherLayer.semanticType) {
          const key = otherLayer.semanticType;
          pattern.coOccurrencePatterns[key] = (pattern.coOccurrencePatterns[key] || 0) + 1;
        }
      });
    });
  }

  private generateTemplatePatterns(bulkData: BulkPSDData[]): void {
    // Group PSDs by similar structure
    const structureGroups = new Map<string, BulkPSDData[]>();
    
    bulkData.forEach(psd => {
      const structure = this.getStructureSignature(psd);
      if (!structureGroups.has(structure)) {
        structureGroups.set(structure, []);
      }
      structureGroups.get(structure)!.push(psd);
    });
    
    // Create template patterns for common structures
    structureGroups.forEach((psds, signature) => {
      if (psds.length >= 2) { // Only consider patterns that appear in multiple PSDs
        const template = this.createTemplatePattern(signature, psds);
        this.templates.push(template);
      }
    });
    
    // Sort templates by usage frequency
    this.templates.sort((a, b) => b.commonElementCount - a.commonElementCount);
  }

  private getStructureSignature(psd: BulkPSDData): string {
    const elementCounts = new Map<string, number>();
    
    psd.processedPSD.layers.forEach(layer => {
      const type = layer.semanticType || 'image';
      elementCounts.set(type, (elementCounts.get(type) || 0) + 1);
    });
    
    // Create signature from sorted element counts
    const sortedElements = Array.from(elementCounts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([type, count]) => `${type}:${count}`)
      .join(',');
    
    return sortedElements;
  }

  private createTemplatePattern(signature: string, psds: BulkPSDData[]): TemplatePattern {
    const layerStructure: LayerPattern[] = [];
    const elementTypes = new Set<string>();
    
    // Collect all element types
    psds.forEach(psd => {
      psd.processedPSD.layers.forEach(layer => {
        elementTypes.add(layer.semanticType || 'image');
      });
    });
    
    // Create patterns for each element type
    elementTypes.forEach(type => {
      if (this.patterns.has(type)) {
        layerStructure.push({ ...this.patterns.get(type)! });
      }
    });
    
    return {
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `Template (${signature})`,
      layerStructure,
      commonElementCount: psds.length,
      layoutScore: this.calculateLayoutScore(psds)
    };
  }

  private calculateLayoutScore(psds: BulkPSDData[]): number {
    // Score based on consistency of element positions across PSDs
    let totalConsistency = 0;
    let comparisons = 0;
    
    for (let i = 0; i < psds.length - 1; i++) {
      for (let j = i + 1; j < psds.length; j++) {
        totalConsistency += this.compareLayouts(psds[i], psds[j]);
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalConsistency / comparisons : 0;
  }

  private compareLayouts(psd1: BulkPSDData, psd2: BulkPSDData): number {
    const layers1 = psd1.processedPSD.layers;
    const layers2 = psd2.processedPSD.layers;
    
    let matches = 0;
    let total = 0;
    
    layers1.forEach(layer1 => {
      const semanticType = layer1.semanticType;
      if (!semanticType) return;
      
      const matchingLayer = layers2.find(layer2 => layer2.semanticType === semanticType);
      if (matchingLayer) {
        const pos1 = {
          x: layer1.bounds.left / psd1.processedPSD.width,
          y: layer1.bounds.top / psd1.processedPSD.height
        };
        const pos2 = {
          x: matchingLayer.bounds.left / psd2.processedPSD.width,
          y: matchingLayer.bounds.top / psd2.processedPSD.height
        };
        
        const distance = Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
        if (distance < 0.2) { // Consider positions within 20% as matching
          matches++;
        }
      }
      total++;
    });
    
    return total > 0 ? matches / total : 0;
  }

  enhanceAnalysis(layer: ProcessedPSDLayer, baseResult: LayerAnalysisResult, canvasWidth: number, canvasHeight: number): LayerAnalysisResult {
    const pattern = this.patterns.get(baseResult.semanticType || 'image');
    if (!pattern) return baseResult;
    
    // Boost confidence based on statistical patterns
    const normalizedX = layer.bounds.left / canvasWidth;
    const normalizedY = layer.bounds.top / canvasHeight;
    
    const positionMatch = pattern.commonPositions.find(pos => 
      Math.abs(pos.x - normalizedX) < 0.15 && Math.abs(pos.y - normalizedY) < 0.15
    );
    
    let confidenceBoost = 0;
    const enhancedReasons = [...baseResult.analysisReasons];
    
    if (positionMatch) {
      confidenceBoost += Math.min(0.2, positionMatch.frequency * 0.05);
      enhancedReasons.push(`Position matches common pattern (${positionMatch.frequency} occurrences)`);
    }
    
    // Check size consistency
    const layerWidth = layer.bounds.right - layer.bounds.left;
    const layerHeight = layer.bounds.bottom - layer.bounds.top;
    const layerArea = layerWidth * layerHeight;
    const normalizedArea = layerArea / (canvasWidth * canvasHeight);
    
    if (normalizedArea >= pattern.sizeRanges.min && normalizedArea <= pattern.sizeRanges.max) {
      confidenceBoost += 0.1;
      enhancedReasons.push('Size within expected range for this element type');
    }
    
    return {
      ...baseResult,
      confidence: Math.min(1, baseResult.confidence + confidenceBoost),
      analysisReasons: enhancedReasons
    };
  }

  getTemplatePatterns(): TemplatePattern[] {
    return [...this.templates];
  }

  getBestMatchingTemplate(layers: ProcessedPSDLayer[]): TemplatePattern | null {
    if (this.templates.length === 0) return null;
    
    const layerSignature = this.getLayerSignature(layers);
    
    let bestMatch: TemplatePattern | null = null;
    let bestScore = 0;
    
    this.templates.forEach(template => {
      const score = this.scoreTemplateMatch(layerSignature, template);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = template;
      }
    });
    
    return bestScore > 0.5 ? bestMatch : null;
  }

  private getLayerSignature(layers: ProcessedPSDLayer[]): Record<string, number> {
    const signature: Record<string, number> = {};
    layers.forEach(layer => {
      const type = layer.semanticType || 'image';
      signature[type] = (signature[type] || 0) + 1;
    });
    return signature;
  }

  private scoreTemplateMatch(layerSignature: Record<string, number>, template: TemplatePattern): number {
    const templateSignature: Record<string, number> = {};
    template.layerStructure.forEach(pattern => {
      templateSignature[pattern.semanticType || 'image'] = (templateSignature[pattern.semanticType || 'image'] || 0) + 1;
    });
    
    let matches = 0;
    let total = 0;
    
    Object.keys(templateSignature).forEach(type => {
      const templateCount = templateSignature[type];
      const layerCount = layerSignature[type] || 0;
      
      matches += Math.min(templateCount, layerCount);
      total += Math.max(templateCount, layerCount);
    });
    
    return total > 0 ? matches / total : 0;
  }
}

export const statisticalLearningService = new StatisticalLearningService();

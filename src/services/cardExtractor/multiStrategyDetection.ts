
import { CardRegion } from './types';
import { advancedCardDetection, DEFAULT_CONFIG, DetectionConfig } from './advancedDetection';

export interface DetectionStrategy {
  name: string;
  config: DetectionConfig;
  weight: number;
}

export const DETECTION_STRATEGIES: DetectionStrategy[] = [
  {
    name: 'High Precision',
    config: {
      ...DEFAULT_CONFIG,
      aspectTolerance: 0.06,
      contrastThreshold: 0.6,
      gridDensity: 15,
    },
    weight: 1.2
  },
  {
    name: 'Balanced',
    config: {
      ...DEFAULT_CONFIG,
      aspectTolerance: 0.10,
      contrastThreshold: 0.4,
      gridDensity: 20,
    },
    weight: 1.0
  },
  {
    name: 'High Recall',
    config: {
      ...DEFAULT_CONFIG,
      aspectTolerance: 0.15,
      contrastThreshold: 0.25,
      gridDensity: 30,
      minCardSize: 0.04,
    },
    weight: 0.8
  },
  {
    name: 'Edge Focused',
    config: {
      ...DEFAULT_CONFIG,
      enableFaceDetection: false,
      enableContourDetection: false,
      enableEdgeDetection: true,
      contrastThreshold: 0.5,
      gridDensity: 25,
    },
    weight: 0.9
  }
];

export const multiStrategyCardDetection = async (
  image: HTMLImageElement,
  file: File,
  strategies: DetectionStrategy[] = DETECTION_STRATEGIES
): Promise<CardRegion[]> => {
  console.log('🚀 Starting multi-strategy card detection...');
  
  const allResults: Array<{ regions: CardRegion[], strategy: DetectionStrategy }> = [];
  
  // Run each detection strategy
  for (const strategy of strategies) {
    try {
      console.log(`🔍 Running strategy: ${strategy.name}`);
      const regions = await advancedCardDetection(image, file, strategy.config);
      
      // Apply strategy weight to confidence scores
      const weightedRegions = regions.map(region => ({
        ...region,
        confidence: region.confidence * strategy.weight
      }));
      
      allResults.push({ regions: weightedRegions, strategy });
      console.log(`✅ Strategy "${strategy.name}" found ${regions.length} regions`);
    } catch (error) {
      console.warn(`❌ Strategy "${strategy.name}" failed:`, error);
    }
  }
  
  // Combine and rank results
  const combinedRegions = combineStrategyResults(allResults);
  console.log(`🎯 Multi-strategy detection completed: ${combinedRegions.length} final regions`);
  
  return combinedRegions;
};

const combineStrategyResults = (
  results: Array<{ regions: CardRegion[], strategy: DetectionStrategy }>
): CardRegion[] => {
  const allRegions: CardRegion[] = [];
  
  // Collect all regions
  for (const { regions } of results) {
    allRegions.push(...regions);
  }
  
  // Group similar regions and boost confidence for consensus
  const clusteredRegions = clusterSimilarRegions(allRegions);
  
  // Sort by confidence and return top candidates
  return clusteredRegions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 12);
};

const clusterSimilarRegions = (regions: CardRegion[]): CardRegion[] => {
  const clusters: CardRegion[][] = [];
  const processed = new Set<number>();
  
  for (let i = 0; i < regions.length; i++) {
    if (processed.has(i)) continue;
    
    const cluster = [regions[i]];
    processed.add(i);
    
    // Find similar regions
    for (let j = i + 1; j < regions.length; j++) {
      if (processed.has(j)) continue;
      
      if (areRegionsSimilar(regions[i], regions[j])) {
        cluster.push(regions[j]);
        processed.add(j);
      }
    }
    
    clusters.push(cluster);
  }
  
  // Create consensus regions from clusters
  return clusters.map(cluster => createConsensusRegion(cluster));
};

const areRegionsSimilar = (a: CardRegion, b: CardRegion): boolean => {
  const centerAx = a.x + a.width / 2;
  const centerAy = a.y + a.height / 2;
  const centerBx = b.x + b.width / 2;
  const centerBy = b.y + b.height / 2;
  
  const distance = Math.sqrt(
    Math.pow(centerAx - centerBx, 2) + Math.pow(centerAy - centerBy, 2)
  );
  
  const avgSize = (Math.max(a.width, a.height) + Math.max(b.width, b.height)) / 2;
  const threshold = avgSize * 0.3; // 30% of average size
  
  return distance < threshold;
};

const createConsensusRegion = (cluster: CardRegion[]): CardRegion => {
  if (cluster.length === 1) return cluster[0];
  
  // Calculate weighted average position and size
  const totalConfidence = cluster.reduce((sum, r) => sum + r.confidence, 0);
  
  let x = 0, y = 0, width = 0, height = 0;
  
  for (const region of cluster) {
    const weight = region.confidence / totalConfidence;
    x += region.x * weight;
    y += region.y * weight;
    width += region.width * weight;
    height += region.height * weight;
  }
  
  // Boost confidence for consensus (multiple strategies agreed)
  const consensusBoost = Math.min(0.3, cluster.length * 0.1);
  const maxConfidence = Math.max(...cluster.map(r => r.confidence));
  
  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(width),
    height: Math.round(height),
    confidence: Math.min(1.0, maxConfidence + consensusBoost)
  };
};

export const getDetectionStrategyByName = (name: string): DetectionStrategy | undefined => {
  return DETECTION_STRATEGIES.find(strategy => strategy.name === name);
};

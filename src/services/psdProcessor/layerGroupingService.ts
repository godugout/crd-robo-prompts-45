import { ProcessedPSDLayer } from './psdProcessingService';

export interface LayerGroup {
  id: string;
  name: string;
  layers: ProcessedPSDLayer[];
  groupType: 'depth' | 'semantic' | 'spatial' | 'mixed';
  cohesionScore: number;
  color: string;
}

export interface LayerGroupingResult {
  groups: LayerGroup[];
  ungroupedLayers: ProcessedPSDLayer[];
  shouldShowGroups: boolean;
  totalLayers: number;
  groupStats: {
    byDepth: number;
    bySemantic: number;
    bySpatial: number;
  };
}

class LayerGroupingService {
  private groupByDepth(layers: ProcessedPSDLayer[]): LayerGroup[] {
    const depthMap: Record<number, ProcessedPSDLayer[]> = {};
    layers.forEach(layer => {
      const depth = layer.inferredDepth || 0.5;
      if (!depthMap[depth]) {
        depthMap[depth] = [];
      }
      depthMap[depth].push(layer);
    });

    return Object.entries(depthMap).map(([depth, groupedLayers], index) => ({
      id: `depth_${depth}_${index}`,
      name: `Depth ${depth}`,
      layers: groupedLayers,
      groupType: 'depth',
      cohesionScore: this.calculateCohesionScore(groupedLayers, 'depth'),
      color: this.getGroupColor('depth', index)
    }));
  }

  private groupBySemantic(layers: ProcessedPSDLayer[]): LayerGroup[] {
    const semanticMap: Record<string, ProcessedPSDLayer[]> = {};
    layers.forEach(layer => {
      const semanticType = layer.semanticType || 'unknown';
      if (!semanticMap[semanticType]) {
        semanticMap[semanticType] = [];
      }
      semanticMap[semanticType].push(layer);
    });

    return Object.entries(semanticMap).map(([semantic, groupedLayers], index) => ({
      id: `semantic_${semantic}_${index}`,
      name: `Semantic: ${semantic}`,
      layers: groupedLayers,
      groupType: 'semantic',
      cohesionScore: this.calculateCohesionScore(groupedLayers, 'semantic'),
      color: this.getGroupColor('semantic', index)
    }));
  }

  private groupBySpatial(layers: ProcessedPSDLayer[]): LayerGroup[] {
    // Simple spatial grouping (example: group layers that are close to each other)
    const spatialMap: Record<string, ProcessedPSDLayer[]> = {};
    layers.forEach(layer => {
      const spatialKey = `${Math.floor(layer.bounds.left / 50)}_${Math.floor(layer.bounds.top / 50)}`;
      if (!spatialMap[spatialKey]) {
        spatialMap[spatialKey] = [];
      }
      spatialMap[spatialKey].push(layer);
    });

    return Object.entries(spatialMap).map(([spatialKey, groupedLayers], index) => ({
      id: `spatial_${spatialKey}_${index}`,
      name: `Spatial Group ${index + 1}`,
      layers: groupedLayers,
      groupType: 'spatial',
      cohesionScore: this.calculateCohesionScore(groupedLayers, 'spatial'),
      color: this.getGroupColor('spatial', index)
    }));
  }

  private calculateCohesionScore(layers: ProcessedPSDLayer[], groupType: string): number {
    // Implement a scoring system based on the group type
    // This is a placeholder and should be refined
    if (layers.length === 0) return 0;

    let score = layers.length;

    if (groupType === 'depth') {
      const depthValues = layers.map(layer => layer.inferredDepth || 0.5);
      const depthVariance = this.calculateVariance(depthValues);
      score = 1 / (depthVariance + 0.01); // Avoid division by zero
    } else if (groupType === 'semantic') {
      const uniqueSemantics = new Set(layers.map(layer => layer.semanticType));
      score = uniqueSemantics.size > 1 ? 0.5 : 1; // Penalize mixed semantics
    } else if (groupType === 'spatial') {
      const bounds = this.calculateGroupBounds(layers);
      const area = (bounds.right - bounds.left) * (bounds.bottom - bounds.top);
      score = 1 / (area + 1);
    }

    return score;
  }

  private calculateVariance(values: number[]): number {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
  }

  private calculateGroupBounds(layers: ProcessedPSDLayer[]): { left: number; top: number; right: number; bottom: number } {
    let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
    layers.forEach(layer => {
      left = Math.min(left, layer.bounds.left);
      top = Math.min(top, layer.bounds.top);
      right = Math.max(right, layer.bounds.right);
      bottom = Math.max(bottom, layer.bounds.bottom);
    });
    return { left, top, right, bottom };
  }

  private getGroupColor(groupType: string, index: number): string {
    const colors: Record<string, string[]> = {
      depth: ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd'],
      semantic: ['#166534', '#22c55e', '#86efac', '#bbf7d0'],
      spatial: ['#7c3aed', '#a855f7', '#d8b4fe', '#ede9fe']
    };

    const colorSet = colors[groupType] || ['#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb'];
    return colorSet[index % colorSet.length];
  }

  smartGroupLayers(layers: ProcessedPSDLayer[]): LayerGroupingResult {
    const depthGroups = this.groupByDepth(layers);
    const semanticGroups = this.groupBySemantic(layers);
    const spatialGroups = this.groupBySpatial(layers);

    // Combine groups (you can implement more sophisticated logic here)
    const allGroups = [...depthGroups, ...semanticGroups, ...spatialGroups];

    // Determine ungrouped layers (layers not part of any group)
    const groupedLayerIds = new Set(allGroups.flatMap(group => group.layers.map(layer => layer.id)));
    const ungroupedLayers = layers.filter(layer => !groupedLayerIds.has(layer.id));

    const totalLayers = layers.length;
    const shouldShowGroups = allGroups.length > 0;

    return {
      groups: allGroups,
      ungroupedLayers: ungroupedLayers,
      shouldShowGroups: shouldShowGroups,
      totalLayers: totalLayers,
      groupStats: {
        byDepth: depthGroups.length,
        bySemantic: semanticGroups.length,
        bySpatial: spatialGroups.length
      }
    };
  }
}

export const layerGroupingService = new LayerGroupingService();

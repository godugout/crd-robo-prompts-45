import { ProcessedPSDLayer } from './psdProcessingService';

export interface LayerGroup {
  id: string;
  name: string;
  type: 'background' | 'character' | 'ui' | 'effects' | 'branding' | 'mixed';
  color: string;
  layers: ProcessedPSDLayer[];
  averageDepth: number;
  bounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
}

export interface GroupingResult {
  shouldUseGrouping: boolean;
  groups: LayerGroup[];
  flatLayers: ProcessedPSDLayer[];
  groupingEfficiency: number; // 0-1, how effective the grouping is
}

export class LayerGroupingService {
  private readonly GROUP_COLORS = {
    background: '#1e40af', // blue-800
    character: '#16a34a', // green-600
    ui: '#ea580c', // orange-600
    effects: '#9333ea', // purple-600
    branding: '#dc2626', // red-600
    mixed: '#6b7280' // gray-500
  };

  private readonly MIN_GROUP_SIZE = 2; // Minimum layers needed to form a group
  private readonly MIN_GROUPING_EFFICIENCY = 0.3; // Minimum efficiency to use grouping

  analyzeAndGroupLayers(layers: ProcessedPSDLayer[]): GroupingResult {
    if (layers.length < 4) {
      // Too few layers to benefit from grouping
      return {
        shouldUseGrouping: false,
        groups: [],
        flatLayers: layers.sort((a, b) => (a.inferredDepth || 0) - (b.inferredDepth || 0)),
        groupingEfficiency: 0
      };
    }

    const potentialGroups = this.generatePotentialGroups(layers);
    const validGroups = potentialGroups.filter(group => group.layers.length >= this.MIN_GROUP_SIZE);
    
    if (validGroups.length === 0) {
      return {
        shouldUseGrouping: false,
        groups: [],
        flatLayers: layers.sort((a, b) => (a.inferredDepth || 0) - (b.inferredDepth || 0)),
        groupingEfficiency: 0
      };
    }

    const groupingEfficiency = this.calculateGroupingEfficiency(layers, validGroups);
    const shouldUseGrouping = groupingEfficiency >= this.MIN_GROUPING_EFFICIENCY && validGroups.length >= 2;

    if (!shouldUseGrouping) {
      return {
        shouldUseGrouping: false,
        groups: [],
        flatLayers: layers.sort((a, b) => (a.inferredDepth || 0) - (b.inferredDepth || 0)),
        groupingEfficiency
      };
    }

    return {
      shouldUseGrouping: true,
      groups: validGroups.sort((a, b) => a.averageDepth - b.averageDepth),
      flatLayers: layers.sort((a, b) => (a.inferredDepth || 0) - (b.inferredDepth || 0)),
      groupingEfficiency
    };
  }

  private generatePotentialGroups(layers: ProcessedPSDLayer[]): LayerGroup[] {
    const groups: LayerGroup[] = [];
    const processedLayers = new Set<string>();

    // First pass: Group by semantic type with spatial proximity
    const semanticGroups = this.groupBySemanticTypeWithProximity(layers);
    
    for (const [semanticType, semanticLayers] of Object.entries(semanticGroups)) {
      if (semanticLayers.length >= this.MIN_GROUP_SIZE) {
        // Further group by depth proximity within semantic groups
        const depthGroups = this.groupByDepthProximity(semanticLayers);
        
        for (const depthGroup of depthGroups) {
          if (depthGroup.length >= this.MIN_GROUP_SIZE) {
            const group = this.createGroup(depthGroup, semanticType);
            groups.push(group);
            depthGroup.forEach(layer => processedLayers.add(layer.id));
          }
        }
      }
    }

    // Second pass: Group remaining layers by pure spatial proximity
    const ungroupedLayers = layers.filter(layer => !processedLayers.has(layer.id));
    if (ungroupedLayers.length >= this.MIN_GROUP_SIZE) {
      const spatialGroups = this.groupBySpatialProximity(ungroupedLayers);
      
      for (const spatialGroup of spatialGroups) {
        if (spatialGroup.length >= this.MIN_GROUP_SIZE) {
          const group = this.createGroup(spatialGroup, 'mixed');
          groups.push(group);
          spatialGroup.forEach(layer => processedLayers.add(layer.id));
        }
      }
    }

    return groups;
  }

  private groupBySemanticTypeWithProximity(layers: ProcessedPSDLayer[]): Record<string, ProcessedPSDLayer[]> {
    const groups: Record<string, ProcessedPSDLayer[]> = {};
    
    layers.forEach(layer => {
      const type = this.getGroupType(layer.semanticType);
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(layer);
    });
    
    // Only keep groups that have potential for spatial relationships
    const filteredGroups: Record<string, ProcessedPSDLayer[]> = {};
    for (const [type, typeLayer] of Object.entries(groups)) {
      if (typeLayer.length >= this.MIN_GROUP_SIZE) {
        // Check if layers are spatially related
        const spatiallyRelated = this.checkSpatialCohesion(typeLayer);
        if (spatiallyRelated) {
          filteredGroups[type] = typeLayer;
        }
      }
    }
    
    return filteredGroups;
  }

  private checkSpatialCohesion(layers: ProcessedPSDLayer[]): boolean {
    if (layers.length < 2) return false;
    
    // Calculate average distance between all pairs
    let totalDistance = 0;
    let pairCount = 0;
    
    for (let i = 0; i < layers.length; i++) {
      for (let j = i + 1; j < layers.length; j++) {
        const distance = this.calculateDistance(layers[i], layers[j]);
        totalDistance += distance;
        pairCount++;
      }
    }
    
    const averageDistance = totalDistance / pairCount;
    const cohesionThreshold = 150; // pixels
    
    return averageDistance < cohesionThreshold;
  }

  private groupByDepthProximity(layers: ProcessedPSDLayer[]): ProcessedPSDLayer[][] {
    if (layers.length < this.MIN_GROUP_SIZE) return [];
    
    const sortedLayers = [...layers].sort((a, b) => (a.inferredDepth || 0) - (b.inferredDepth || 0));
    const groups: ProcessedPSDLayer[][] = [];
    let currentGroup: ProcessedPSDLayer[] = [sortedLayers[0]];
    
    for (let i = 1; i < sortedLayers.length; i++) {
      const currentDepth = sortedLayers[i].inferredDepth || 0;
      const lastDepth = sortedLayers[i - 1].inferredDepth || 0;
      
      if (Math.abs(currentDepth - lastDepth) > 0.2) {
        if (currentGroup.length >= this.MIN_GROUP_SIZE) {
          groups.push(currentGroup);
        }
        currentGroup = [sortedLayers[i]];
      } else {
        currentGroup.push(sortedLayers[i]);
      }
    }
    
    if (currentGroup.length >= this.MIN_GROUP_SIZE) {
      groups.push(currentGroup);
    }
    
    return groups;
  }

  private groupBySpatialProximity(layers: ProcessedPSDLayer[]): ProcessedPSDLayer[][] {
    if (layers.length < this.MIN_GROUP_SIZE) return [];
    
    const groups: ProcessedPSDLayer[][] = [];
    const processed = new Set<string>();
    
    layers.forEach(layer => {
      if (processed.has(layer.id)) return;
      
      const group = [layer];
      processed.add(layer.id);
      
      // Find all layers within proximity threshold
      layers.forEach(otherLayer => {
        if (processed.has(otherLayer.id)) return;
        
        if (this.areSpatiallyClose(layer, otherLayer)) {
          group.push(otherLayer);
          processed.add(otherLayer.id);
        }
      });
      
      if (group.length >= this.MIN_GROUP_SIZE) {
        groups.push(group);
      }
    });
    
    return groups;
  }

  private calculateGroupingEfficiency(layers: ProcessedPSDLayer[], groups: LayerGroup[]): number {
    const totalLayers = layers.length;
    const groupedLayers = groups.reduce((sum, group) => sum + group.layers.length, 0);
    const ungroupedLayers = totalLayers - groupedLayers;
    
    // Efficiency is based on:
    // 1. Percentage of layers that are grouped
    // 2. Average group size (larger groups are better)
    // 3. Number of meaningful groups (too many small groups is bad)
    
    const groupingRatio = groupedLayers / totalLayers;
    const avgGroupSize = groups.length > 0 ? groupedLayers / groups.length : 1;
    const groupSizeScore = Math.min(avgGroupSize / 4, 1); // Normalize to 0-1, optimal at 4+ layers per group
    const groupCountPenalty = groups.length > 4 ? 0.8 : 1; // Penalize having too many groups
    
    return groupingRatio * groupSizeScore * groupCountPenalty;
  }

  private calculateDistance(layer1: ProcessedPSDLayer, layer2: ProcessedPSDLayer): number {
    const center1 = {
      x: (layer1.bounds.left + layer1.bounds.right) / 2,
      y: (layer1.bounds.top + layer1.bounds.bottom) / 2
    };
    
    const center2 = {
      x: (layer2.bounds.left + layer2.bounds.right) / 2,
      y: (layer2.bounds.top + layer2.bounds.bottom) / 2
    };
    
    return Math.sqrt(
      Math.pow(center1.x - center2.x, 2) + Math.pow(center1.y - center2.y, 2)
    );
  }

  private areSpatiallyClose(layer1: ProcessedPSDLayer, layer2: ProcessedPSDLayer): boolean {
    const threshold = 80; // More selective threshold
    return this.calculateDistance(layer1, layer2) < threshold;
  }

  private createGroup(layers: ProcessedPSDLayer[], semanticType: string): LayerGroup {
    const groupType = this.getGroupType(semanticType);
    const averageDepth = layers.reduce((sum, layer) => sum + (layer.inferredDepth || 0), 0) / layers.length;
    
    const bounds = {
      left: Math.min(...layers.map(l => l.bounds.left)),
      top: Math.min(...layers.map(l => l.bounds.top)),
      right: Math.max(...layers.map(l => l.bounds.right)),
      bottom: Math.max(...layers.map(l => l.bounds.bottom))
    };
    
    return {
      id: `group-${groupType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: this.getGroupName(groupType, layers.length),
      type: groupType as LayerGroup['type'],
      color: this.GROUP_COLORS[groupType] || this.GROUP_COLORS.mixed,
      layers,
      averageDepth,
      bounds
    };
  }

  private getGroupType(semanticType?: string): string {
    switch (semanticType) {
      case 'background':
        return 'background';
      case 'player':
        return 'character';
      case 'stats':
      case 'text':
        return 'ui';
      case 'effect':
        return 'effects';
      case 'logo':
        return 'branding';
      default:
        return 'mixed';
    }
  }

  private getGroupName(type: string, layerCount: number): string {
    const names = {
      background: 'Background Elements',
      character: 'Character/Player',
      ui: 'UI & Text',
      effects: 'Effects & Shadows',
      branding: 'Logos & Branding',
      mixed: 'Related Elements'
    };
    
    return `${names[type] || 'Group'} (${layerCount})`;
  }
}

export const layerGroupingService = new LayerGroupingService();

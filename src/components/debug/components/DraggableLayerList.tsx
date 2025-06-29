
import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProcessedPSDLayer } from '@/types/psdTypes';
import { Eye, EyeOff, GripVertical, RotateCcw } from 'lucide-react';
import { getSemanticTypeColor } from '@/utils/semanticTypeColors';

interface DraggableLayerItemProps {
  layer: ProcessedPSDLayer;
  isSelected: boolean;
  isHidden: boolean;
  onLayerSelect: (layerId: string) => void;
  onLayerToggle: (layerId: string) => void;
  originalDepth: number;
  currentIndex: number;
}

const DraggableLayerItem: React.FC<DraggableLayerItemProps> = ({
  layer,
  isSelected,
  isHidden,
  onLayerSelect,
  onLayerToggle,
  originalDepth,
  currentIndex
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: layer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const semanticColor = getSemanticTypeColor(layer.semanticType);

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={`p-3 cursor-pointer transition-all ${
          isSelected 
            ? 'bg-crd-green/20 border-crd-green' 
            : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
        } ${isHidden ? 'opacity-50' : ''} ${isDragging ? 'shadow-lg' : ''}`}
        onClick={() => onLayerSelect(layer.id)}
      >
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <div
            {...listeners}
            {...attributes}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-600 rounded"
          >
            <GripVertical className="w-4 h-4 text-slate-400" />
          </div>

          {/* Layer Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-white truncate">
                {layer.name}
              </span>
              {layer.semanticType && (
                <Badge 
                  className="text-xs px-1.5 py-0.5 text-white"
                  style={{ backgroundColor: semanticColor }}
                >
                  {layer.semanticType}
                </Badge>
              )}
            </div>
            
            <div className="text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-4">
                <span>
                  {Math.round(layer.bounds.right - layer.bounds.left)} × {Math.round(layer.bounds.bottom - layer.bounds.top)}px
                </span>
                <span className="text-yellow-400">
                  Original Depth: {originalDepth}
                </span>
                <span className="text-blue-400">
                  Current: {currentIndex}
                </span>
              </div>
              {layer.hasRealImage && (
                <div className="text-green-400">Has image content</div>
              )}
              {layer.properties && (
                <div>Opacity: {Math.round(layer.properties.opacity * 100)}%</div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onLayerToggle(layer.id);
              }}
              className="w-8 h-8 p-0 hover:bg-slate-600"
            >
              {isHidden ? (
                <EyeOff className="w-3 h-3 text-slate-500" />
              ) : (
                <Eye className="w-3 h-3 text-slate-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Thumbnail */}
        {layer.thumbnailUrl && (
          <div className="mt-2 ml-8">
            <img 
              src={layer.thumbnailUrl} 
              alt={layer.name}
              className="w-full h-16 object-cover rounded border border-slate-600"
            />
          </div>
        )}
      </Card>
    </div>
  );
};

interface DraggableLayerListProps {
  layers: ProcessedPSDLayer[];
  selectedLayerId: string;
  hiddenLayers: Set<string>;
  onLayerSelect: (layerId: string) => void;
  onLayerToggle: (layerId: string) => void;
  onLayersReorder: (newLayers: ProcessedPSDLayer[]) => void;
  onReset: () => void;
}

export const DraggableLayerList: React.FC<DraggableLayerListProps> = ({
  layers,
  selectedLayerId,
  hiddenLayers,
  onLayerSelect,
  onLayerToggle,
  onLayersReorder,
  onReset
}) => {
  const [originalOrder] = useState(layers.map((layer, index) => ({ ...layer, originalIndex: index })));
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = layers.findIndex((layer) => layer.id === active.id);
      const newIndex = layers.findIndex((layer) => layer.id === over.id);
      
      const newLayers = arrayMove(layers, oldIndex, newIndex);
      onLayersReorder(newLayers);
    }
  };

  const getOriginalDepth = (layerId: string) => {
    const originalLayer = originalOrder.find(l => l.id === layerId);
    return originalLayer ? originalLayer.originalIndex : 0;
  };

  return (
    <div className="space-y-3">
      {/* Header with Reset Button */}
      <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700">
        <div className="text-sm text-slate-300">
          <span className="font-medium">Layer Order</span>
          <div className="text-xs text-slate-400 mt-1">
            Drag layers to reorder • Yellow = Original depth • Blue = Current position
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Order
        </Button>
      </div>

      {/* Draggable Layer List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={layers.map(l => l.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {layers.map((layer, index) => (
              <DraggableLayerItem
                key={layer.id}
                layer={layer}
                isSelected={layer.id === selectedLayerId}
                isHidden={hiddenLayers.has(layer.id)}
                onLayerSelect={onLayerSelect}
                onLayerToggle={onLayerToggle}
                originalDepth={getOriginalDepth(layer.id)}
                currentIndex={index}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

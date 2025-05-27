
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Grid, 
  List, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Eye, 
  Edit, 
  Trash2,
  CheckSquare,
  Square
} from 'lucide-react';
import { useCardCatalog } from '@/hooks/useCardCatalog';
import { DetectedCard } from '@/services/cardCatalog/CardDetectionService';

interface SmartCardGridProps {
  onCardEdit?: (card: DetectedCard) => void;
  onCardCreate?: (card: DetectedCard) => void;
}

export const SmartCardGrid = ({ onCardEdit, onCardCreate }: SmartCardGridProps) => {
  const {
    filteredCards,
    selectedCards,
    viewMode,
    sortBy,
    filters,
    toggleCardSelection,
    selectAllVisible,
    clearSelection,
    deleteSelected,
    setViewMode,
    updateSort,
    updateFilters
  } = useCardCatalog();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected': return 'bg-blue-600';
      case 'processing': return 'bg-yellow-600';
      case 'enhanced': return 'bg-green-600';
      case 'error': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatConfidence = (confidence: number) => {
    return `${Math.round(confidence * 100)}%`;
  };

  if (filteredCards.length === 0) {
    return (
      <Card className="bg-editor-dark border-editor-border">
        <CardContent className="p-12 text-center">
          <Grid className="w-16 h-16 text-crd-lightGray mx-auto mb-4" />
          <h3 className="text-white font-medium text-lg mb-2">No cards detected yet</h3>
          <p className="text-crd-lightGray mb-6">
            Upload some card images to get started with AI-powered detection
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">
              {filteredCards.length} cards detected
            </span>
            {selectedCards.size > 0 && (
              <Badge variant="secondary" className="bg-crd-green text-black">
                {selectedCards.size} selected
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Selection Controls */}
          {selectedCards.size > 0 && (
            <>
              <Button
                onClick={clearSelection}
                variant="outline"
                size="sm"
                className="border-editor-border text-white"
              >
                Clear Selection
              </Button>
              <Button
                onClick={deleteSelected}
                variant="outline"
                size="sm"
                className="border-red-500 text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
            </>
          )}

          <Button
            onClick={() => selectedCards.size === filteredCards.length ? clearSelection() : selectAllVisible()}
            variant="outline"
            size="sm"
            className="border-editor-border text-white"
          >
            {selectedCards.size === filteredCards.length ? (
              <CheckSquare className="w-4 h-4 mr-2" />
            ) : (
              <Square className="w-4 h-4 mr-2" />
            )}
            Select All
          </Button>

          {/* Sort Controls */}
          <Button
            onClick={() => updateSort({
              field: sortBy.field,
              direction: sortBy.direction === 'asc' ? 'desc' : 'asc'
            })}
            variant="outline"
            size="sm"
            className="border-editor-border text-white"
          >
            {sortBy.direction === 'asc' ? (
              <SortAsc className="w-4 h-4 mr-2" />
            ) : (
              <SortDesc className="w-4 h-4 mr-2" />
            )}
            Sort by {sortBy.field}
          </Button>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-editor-border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="border-0 rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="border-0 rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Cards Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {filteredCards.map((card) => (
            <Card 
              key={card.id} 
              className={`bg-editor-dark border-editor-border overflow-hidden group hover:border-crd-green/50 transition-all ${
                selectedCards.has(card.id) ? 'ring-2 ring-crd-green' : ''
              }`}
            >
              <div className="relative aspect-[3/4]">
                <img
                  src={URL.createObjectURL(card.imageBlob)}
                  alt={`Detected card ${card.id}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                
                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2">
                  <Checkbox
                    checked={selectedCards.has(card.id)}
                    onCheckedChange={() => toggleCardSelection(card.id)}
                    className="bg-black/70 border-white"
                  />
                </div>

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <Badge className={`${getStatusColor(card.status)} text-white text-xs`}>
                    {card.status}
                  </Badge>
                </div>

                {/* Confidence Score */}
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                    <span className={getConfidenceColor(card.confidence)}>
                      {formatConfidence(card.confidence)}
                    </span>
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <Button
                      onClick={() => onCardEdit?.(card)}
                      size="sm"
                      className="w-8 h-8 p-0 bg-black/70 hover:bg-black/90"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => onCardCreate?.(card)}
                      size="sm"
                      className="w-8 h-8 p-0 bg-crd-green/80 hover:bg-crd-green text-black"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCards.map((card) => (
            <Card 
              key={card.id} 
              className={`bg-editor-dark border-editor-border ${
                selectedCards.has(card.id) ? 'ring-2 ring-crd-green' : ''
              }`}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <Checkbox
                  checked={selectedCards.has(card.id)}
                  onCheckedChange={() => toggleCardSelection(card.id)}
                />
                
                <div className="w-16 h-20 rounded-lg overflow-hidden bg-editor-tool">
                  <img
                    src={URL.createObjectURL(card.imageBlob)}
                    alt={`Detected card ${card.id}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-medium">
                        {card.metadata?.player?.name || 'Unknown Player'}
                      </h3>
                      <p className="text-crd-lightGray text-sm">
                        {card.metadata?.team?.name || 'Unknown Team'} • {card.metadata?.year?.value || '----'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${getStatusColor(card.status)} text-white text-xs`}>
                          {card.status}
                        </Badge>
                        <span className={`text-xs ${getConfidenceColor(card.confidence)}`}>
                          {formatConfidence(card.confidence)} confidence
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onCardEdit?.(card)}
                        variant="outline"
                        size="sm"
                        className="border-editor-border text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        onClick={() => onCardCreate?.(card)}
                        size="sm"
                        className="bg-crd-green hover:bg-crd-green/80 text-black"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Create Card
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

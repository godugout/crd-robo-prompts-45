
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Award, Crown, RotateCcw, Info } from 'lucide-react';
import { NINE_EFFECT_PRESETS, type EffectPreset } from './effects/ninePresets';
import { PresetFormulaTable } from './effects/PresetFormulaTable';
import { toast } from 'sonner';

interface NinePresetEffectsPhaseProps {
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  effectValues?: Record<string, Record<string, any>>;
}

const getDifficultyIcon = (difficulty: EffectPreset['difficulty']) => {
  switch (difficulty) {
    case 'Legendary':
      return <Crown className="w-3 h-3 text-yellow-400" />;
    case 'Epic':
      return <Award className="w-3 h-3 text-purple-400" />;
    case 'Rare':
      return <Sparkles className="w-3 h-3 text-blue-400" />;
  }
};

const getDifficultyColor = (difficulty: EffectPreset['difficulty']) => {
  switch (difficulty) {
    case 'Legendary':
      return 'border-yellow-400/50 bg-yellow-400/5';
    case 'Epic':
      return 'border-purple-400/50 bg-purple-400/5';
    case 'Rare':
      return 'border-blue-400/50 bg-blue-400/5';
  }
};

export const NinePresetEffectsPhase: React.FC<NinePresetEffectsPhaseProps> = ({
  selectedPresetId,
  onPresetSelect,
  onEffectChange,
  effectValues = {}
}) => {
  const [showFormula, setShowFormula] = useState(false);
  const selectedPreset = NINE_EFFECT_PRESETS.find(p => p.id === selectedPresetId);

  const handlePresetSelect = (preset: EffectPreset) => {
    console.log('Applying preset:', preset.name, preset.formula);
    
    // Reset all effects first
    resetAllEffects();
    
    // Apply preset formula
    Object.entries(preset.formula).forEach(([effectId, parameters]) => {
      Object.entries(parameters).forEach(([parameterId, value]) => {
        onEffectChange(effectId, parameterId, value);
      });
    });
    
    onPresetSelect(preset.id);
    toast.success(`Applied ${preset.name} preset`);
  };

  const resetAllEffects = () => {
    const effectIds = ['holographic', 'foilspray', 'prizm', 'chrome', 'crystal', 'gold'];
    effectIds.forEach(effectId => {
      onEffectChange(effectId, 'intensity', 0);
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-white font-semibold text-lg mb-2">Premium Effect Presets</h3>
        <p className="text-gray-400 text-sm">
          Choose from 9 scientifically-crafted effect combinations for maximum visual impact
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black/30">
          <TabsTrigger value="all" className="text-white data-[state=active]:bg-crd-green data-[state=active]:text-black">
            All
          </TabsTrigger>
          <TabsTrigger value="Prismatic" className="text-white data-[state=active]:bg-purple-600">
            Prismatic
          </TabsTrigger>
          <TabsTrigger value="Metallic" className="text-white data-[state=active]:bg-amber-600">
            Metallic
          </TabsTrigger>
          <TabsTrigger value="Special" className="text-white data-[state=active]:bg-blue-600">
            Special
          </TabsTrigger>
        </TabsList>

        {/* All Presets */}
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-3 gap-4">
            {NINE_EFFECT_PRESETS.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                isSelected={selectedPresetId === preset.id}
                onSelect={() => handlePresetSelect(preset)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Category-specific tabs */}
        {['Prismatic', 'Metallic', 'Special'].map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid grid-cols-3 gap-4">
              {NINE_EFFECT_PRESETS
                .filter(preset => preset.category === category)
                .map((preset) => (
                  <PresetCard
                    key={preset.id}
                    preset={preset}
                    isSelected={selectedPresetId === preset.id}
                    onSelect={() => handlePresetSelect(preset)}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Control Buttons */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setShowFormula(!showFormula)}
          variant="outline"
          size="sm"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <Info className="w-4 h-4 mr-2" />
          {showFormula ? 'Hide' : 'Show'} Formula
        </Button>
        
        <Button
          onClick={() => {
            resetAllEffects();
            onPresetSelect('');
            toast.success('All effects reset');
          }}
          variant="outline"
          size="sm"
          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset All
        </Button>
      </div>

      {/* Formula Table */}
      {showFormula && selectedPreset && (
        <PresetFormulaTable preset={selectedPreset} />
      )}

      {/* Selected Preset Summary */}
      {selectedPreset && (
        <Card className="bg-crd-green/10 border-crd-green/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {getDifficultyIcon(selectedPreset.difficulty)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-crd-green font-medium text-sm mb-1">{selectedPreset.name} Applied</h4>
                <p className="text-gray-300 text-xs mb-2">{selectedPreset.visualDescription}</p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-gray-400">Shimmer: {selectedPreset.traits.shimmer}%</span>
                  <span className="text-gray-400">Depth: {selectedPreset.traits.depth}%</span>
                  <span className="text-gray-400">Color: {selectedPreset.traits.color}%</span>
                  <span className="text-gray-400">Reflection: {selectedPreset.traits.reflection}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface PresetCardProps {
  preset: EffectPreset;
  isSelected: boolean;
  onSelect: () => void;
}

const PresetCard: React.FC<PresetCardProps> = ({ preset, isSelected, onSelect }) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'bg-crd-green/10 border-crd-green/50 shadow-lg shadow-crd-green/20' 
          : `bg-black/20 border-white/10 hover:border-white/20 hover:bg-black/30 ${getDifficultyColor(preset.difficulty)}`
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Preview */}
          <div 
            className="w-full h-20 rounded-lg border border-white/20"
            style={{ background: preset.previewGradient }}
          />
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium text-sm truncate">{preset.name}</h4>
            <div className="flex items-center gap-1">
              {getDifficultyIcon(preset.difficulty)}
            </div>
          </div>
          
          {/* Category & Description */}
          <div className="space-y-2">
            <Badge 
              variant="outline" 
              className="text-xs border-gray-500 text-gray-300"
            >
              {preset.category}
            </Badge>
            <p className="text-gray-400 text-xs leading-relaxed">
              {preset.description}
            </p>
          </div>
          
          {/* Traits */}
          <div className="grid grid-cols-2 gap-1 text-xs text-gray-400">
            <div>Shimmer: {preset.traits.shimmer}%</div>
            <div>Depth: {preset.traits.depth}%</div>
            <div>Color: {preset.traits.color}%</div>
            <div>Reflect: {preset.traits.reflection}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { ENHANCED_VISUAL_EFFECTS } from '../hooks/useEnhancedCardEffects';

interface CompactEffectControlsProps {
  effectValues: EffectValues;
  onEffectChange: (effectId: string, parameterId: string, value: number | boolean | string) => void;
  onResetEffect: (effectId: string) => void;
  onResetAll: () => void;
  showOnlyActive?: boolean;
}

export const CompactEffectControls: React.FC<CompactEffectControlsProps> = ({
  effectValues,
  onEffectChange,
  onResetEffect,
  onResetAll,
  showOnlyActive = true
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['prismatic']));
  const [showAllEffects, setShowAllEffects] = useState(!showOnlyActive);

  // Group effects by category
  const effectsByCategory = ENHANCED_VISUAL_EFFECTS.reduce((acc, effect) => {
    if (!acc[effect.category]) {
      acc[effect.category] = [];
    }
    acc[effect.category].push(effect);
    return acc;
  }, {} as Record<string, typeof ENHANCED_VISUAL_EFFECTS>);

  // Filter active effects
  const getActiveEffects = () => {
    return Object.entries(effectValues).filter(([effectId, params]) => {
      const intensity = typeof params.intensity === 'number' ? params.intensity : 0;
      return intensity > 0;
    });
  };

  const activeEffects = getActiveEffects();

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getEffectIntensity = (effectId: string): number => {
    const params = effectValues[effectId];
    return typeof params?.intensity === 'number' ? params.intensity : 0;
  };

  const renderEffectRow = (effect: any) => {
    const intensity = getEffectIntensity(effect.id);
    const isActive = intensity > 0;

    return (
      <div key={effect.id} className="flex items-center space-x-2 py-1">
        {/* Effect name and intensity slider in one row */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-medium truncate ${isActive ? 'text-white' : 'text-gray-400'}`}>
              {effect.name}
            </span>
            <div className="flex-1 max-w-20">
              <Slider
                value={[intensity]}
                onValueChange={([value]) => onEffectChange(effect.id, 'intensity', value)}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            <span className="text-xs text-gray-500 w-8 text-right">
              {Math.round(intensity)}
            </span>
          </div>
        </div>

        {/* Compact controls */}
        <div className="flex items-center space-x-1">
          {/* Advanced controls popover */}
          {effect.parameters.length > 1 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                  disabled={!isActive}
                >
                  <Settings className="w-3 h-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3 bg-editor-dark border-editor-border" side="left">
                <div className="space-y-3">
                  <div className="font-medium text-white text-sm">{effect.name} Settings</div>
                  {effect.parameters.slice(1).map((param: any) => {
                    const value = effectValues[effect.id]?.[param.id] ?? param.defaultValue;
                    
                    return (
                      <div key={param.id} className="space-y-1">
                        <Label className="text-xs text-gray-300">{param.name}</Label>
                        {param.type === 'slider' ? (
                          <div className="flex items-center space-x-2">
                            <Slider
                              value={[typeof value === 'number' ? value : 0]}
                              onValueChange={([newValue]) => onEffectChange(effect.id, param.id, newValue)}
                              min={param.min || 0}
                              max={param.max || 100}
                              step={param.step || 1}
                              className="flex-1"
                            />
                            <span className="text-xs text-gray-500 w-8 text-right">
                              {typeof value === 'number' ? Math.round(value) : 0}
                            </span>
                          </div>
                        ) : param.type === 'toggle' ? (
                          <Switch
                            checked={Boolean(value)}
                            onCheckedChange={(checked) => onEffectChange(effect.id, param.id, checked)}
                          />
                        ) : param.type === 'color' ? (
                          <Input
                            type="color"
                            value={String(value)}
                            onChange={(e) => onEffectChange(effect.id, param.id, e.target.value)}
                            className="w-full h-8"
                          />
                        ) : param.type === 'select' ? (
                          <Select value={String(value)} onValueChange={(newValue) => onEffectChange(effect.id, param.id, newValue)}>
                            <SelectTrigger className="w-full h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {param.options?.map((option: any) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Reset effect button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onResetEffect(effect.id)}
            className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
            disabled={!isActive}
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium text-sm">Enhanced Effects</h4>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllEffects(!showAllEffects)}
            className="text-xs h-6 px-2"
          >
            {showAllEffects ? 'Active Only' : 'Show All'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetAll}
            className="text-xs h-6 px-2"
            disabled={activeEffects.length === 0}
          >
            Reset All
          </Button>
        </div>
      </div>

      {/* Active effects summary */}
      {!showAllEffects && activeEffects.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs text-gray-400 mb-2">Active Effects ({activeEffects.length})</div>
          {activeEffects.map(([effectId]) => {
            const effect = ENHANCED_VISUAL_EFFECTS.find(e => e.id === effectId);
            return effect ? renderEffectRow(effect) : null;
          })}
        </div>
      )}

      {/* All effects by category */}
      {showAllEffects && (
        <div className="space-y-2">
          {Object.entries(effectsByCategory).map(([category, effects]) => (
            <Collapsible
              key={category}
              open={expandedCategories.has(category)}
              onOpenChange={() => toggleCategory(category)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between h-8 px-2 text-xs font-medium text-gray-300 hover:text-white"
                >
                  <span className="capitalize">{category}</span>
                  {expandedCategories.has(category) ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 pt-1">
                {effects.map(renderEffectRow)}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!showAllEffects && activeEffects.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-400 text-xs">No active effects</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllEffects(true)}
            className="text-xs mt-2"
          >
            Browse Effects
          </Button>
        </div>
      )}
    </div>
  );
};

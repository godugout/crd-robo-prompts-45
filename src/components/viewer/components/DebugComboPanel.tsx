
import React from 'react';
import { Button } from '@/components/ui/button';
import type { EffectValues } from '../hooks/useEnhancedCardEffects';
import { usePreRenderedMaterials } from '../hooks/usePreRenderedMaterials';

interface DebugComboPanelProps {
  currentEffects: EffectValues;
  onApplyCombo: (effects: EffectValues) => void;
}

export const DebugComboPanel: React.FC<DebugComboPanelProps> = ({
  currentEffects,
  onApplyCombo
}) => {
  const { POPULAR_COMBOS, activeComboId } = usePreRenderedMaterials(currentEffects);
  const [testSequence, setTestSequence] = React.useState<string[]>([]);

  // Test sequence: A → B → A → C
  const runTestSequence = () => {
    const sequence = ['holographic-burst', 'metallic-prizm', 'holographic-burst', 'crystal-interference'];
    setTestSequence([]);
    
    console.log('🧪 Starting test sequence:', sequence);
    
    sequence.forEach((comboId, index) => {
      setTimeout(() => {
        const combo = POPULAR_COMBOS.find(c => c.id === comboId);
        if (combo) {
          console.log(`🧪 Test Step ${index + 1}: Applying ${comboId}`);
          setTestSequence(prev => [...prev, comboId]);
          onApplyCombo(combo.effects);
        }
      }, index * 2000); // 2 second intervals
    });
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3">
      <h3 className="text-white font-medium text-sm">Debug Panel</h3>
      
      <div className="space-y-2">
        <div className="text-xs text-gray-300">
          Active: <span className="text-green-400">{activeComboId}</span>
        </div>
        
        <div className="text-xs text-gray-300">
          Test Sequence: {testSequence.join(' → ')}
        </div>
        
        <Button 
          onClick={runTestSequence}
          size="sm"
          variant="outline"
          className="w-full"
        >
          Run Test: A → B → A → C
        </Button>
      </div>

      <div className="space-y-1">
        <div className="text-xs text-gray-400">Quick Test Combos:</div>
        {POPULAR_COMBOS.slice(0, 4).map((combo) => (
          <Button
            key={combo.id}
            onClick={() => {
              console.log(`🧪 Manual test: Applying ${combo.id}`);
              onApplyCombo(combo.effects);
            }}
            size="sm"
            variant={activeComboId === combo.id ? "default" : "ghost"}
            className="w-full text-xs justify-start"
          >
            {combo.name}
          </Button>
        ))}
      </div>

      <div className="text-xs text-gray-500">
        Total pre-rendered: {POPULAR_COMBOS.length}
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
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
  const { POPULAR_COMBOS, activeComboId, isComboCached } = usePreRenderedMaterials(currentEffects);
  const [testSequence, setTestSequence] = useState<string[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResults, setTestResults] = useState<Array<{step: string, success: boolean, timestamp: number}>>([]);

  // Automated test sequence: A → B → A → C
  const runTestSequence = async () => {
    const sequence = ['holographic-burst', 'metallic-prizm', 'holographic-burst', 'crystal-interference'];
    setTestSequence([]);
    setTestResults([]);
    setIsTestRunning(true);
    
    console.log('🧪 Starting Enhanced Test Sequence:', sequence);
    
    for (let index = 0; index < sequence.length; index++) {
      const comboId = sequence[index];
      const combo = POPULAR_COMBOS.find(c => c.id === comboId);
      
      if (combo) {
        console.log(`🧪 Test Step ${index + 1}/${sequence.length}: Applying ${comboId}`);
        setTestSequence(prev => [...prev, comboId]);
        
        // Apply the combo
        onApplyCombo(combo.effects);
        
        // Wait for DOM update and verify
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if the combo is actually active
        const isSuccessful = document.querySelector(`[data-combo="${comboId}"][data-is-active="true"]`) !== null;
        
        setTestResults(prev => [...prev, {
          step: `${index + 1}: ${comboId}`,
          success: isSuccessful,
          timestamp: Date.now()
        }]);
        
        console.log(`🧪 Step ${index + 1} ${isSuccessful ? '✅ SUCCESS' : '❌ FAILED'}: ${comboId}`);
      }
    }
    
    setIsTestRunning(false);
    console.log('🧪 Test sequence completed');
  };

  // Live state monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      if (process.env.NODE_ENV === 'development') {
        const visibleElements = document.querySelectorAll('[data-combo][data-is-active="true"]');
        const hiddenElements = document.querySelectorAll('[data-combo][data-is-active="false"]');
        
        console.log('🔍 Live State Monitor:', {
          activeCombo: activeComboId,
          visibleCount: visibleElements.length,
          hiddenCount: hiddenElements.length,
          domActive: Array.from(visibleElements).map(el => el.getAttribute('data-combo')),
          cached: POPULAR_COMBOS.map(c => ({ id: c.id, cached: isComboCached(c.id) }))
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeComboId, POPULAR_COMBOS, isComboCached]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3">
      <h3 className="text-white font-medium text-sm">🧪 Enhanced Debug Panel</h3>
      
      <div className="space-y-2">
        <div className="text-xs text-gray-300 space-y-1">
          <div>Active: <span className="text-green-400 font-bold">{activeComboId}</span></div>
          <div>Test Running: <span className={isTestRunning ? "text-yellow-400" : "text-gray-500"}>{isTestRunning ? 'YES' : 'NO'}</span></div>
          <div>Sequence: <span className="text-blue-400">{testSequence.join(' → ')}</span></div>
        </div>
        
        <Button 
          onClick={runTestSequence}
          disabled={isTestRunning}
          size="sm"
          variant="outline"
          className="w-full"
        >
          {isTestRunning ? 'Running Test...' : 'Run Test: A → B → A → C'}
        </Button>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs text-gray-400">Test Results:</div>
          {testResults.map((result, idx) => (
            <div key={idx} className={`text-xs ${result.success ? 'text-green-400' : 'text-red-400'}`}>
              {result.success ? '✅' : '❌'} {result.step}
            </div>
          ))}
        </div>
      )}

      {/* Quick Test Combos */}
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
            disabled={isTestRunning}
          >
            <span className={isComboCached(combo.id) ? "text-green-400" : "text-gray-400"}>
              {isComboCached(combo.id) ? '💾' : '⏳'}
            </span>
            <span className="ml-2">{combo.name}</span>
          </Button>
        ))}
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <div>Total pre-rendered: {POPULAR_COMBOS.length}</div>
        <div>Cached: {POPULAR_COMBOS.filter(c => isComboCached(c.id)).length}</div>
      </div>
    </div>
  );
};

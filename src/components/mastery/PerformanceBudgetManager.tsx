
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, Monitor, Smartphone, 
  TrendingUp, TrendingDown, AlertTriangle 
} from 'lucide-react';

interface PerformanceBudget {
  targetFPS: number;
  currentFPS: number;
  memoryUsage: number;
  memoryLimit: number;
  renderComplexity: number;
  complexityBudget: number;
  effectsLevel: 'minimal' | 'standard' | 'enhanced' | 'maximum';
  deviceTier: 'low' | 'medium' | 'high' | 'ultra';
}

interface EnhancementLadder {
  tier: string;
  features: {
    shadows: boolean;
    particles: boolean;
    reflections: boolean;
    hdr: boolean;
    antialiasing: boolean;
    postprocessing: boolean;
  };
  maxEffects: number;
  targetFPS: number;
}

export const PerformanceBudgetManager: React.FC = () => {
  const [budget, setBudget] = useState<PerformanceBudget>({
    targetFPS: 60,
    currentFPS: 60,
    memoryUsage: 128,
    memoryLimit: 512,
    renderComplexity: 45,
    complexityBudget: 100,
    effectsLevel: 'standard',
    deviceTier: 'medium'
  });

  const [enhancementLadder, setEnhancementLadder] = useState<EnhancementLadder[]>([
    {
      tier: 'Ultra (High-end Desktop)',
      features: {
        shadows: true,
        particles: true,
        reflections: true,
        hdr: true,
        antialiasing: true,
        postprocessing: true
      },
      maxEffects: 20,
      targetFPS: 120
    },
    {
      tier: 'High (Gaming Laptop)',
      features: {
        shadows: true,
        particles: true,
        reflections: true,
        hdr: false,
        antialiasing: true,
        postprocessing: false
      },
      maxEffects: 15,
      targetFPS: 60
    },
    {
      tier: 'Medium (Modern Phone)',
      features: {
        shadows: false,
        particles: true,
        reflections: false,
        hdr: false,
        antialiasing: false,
        postprocessing: false
      },
      maxEffects: 8,
      targetFPS: 30
    },
    {
      tier: 'Low (Budget Device)',
      features: {
        shadows: false,
        particles: false,
        reflections: false,
        hdr: false,
        antialiasing: false,
        postprocessing: false
      },
      maxEffects: 3,
      targetFPS: 30
    }
  ]);

  // Simulate performance monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setBudget(prev => ({
        ...prev,
        currentFPS: Math.max(20, prev.targetFPS + (Math.random() - 0.5) * 10),
        memoryUsage: Math.min(prev.memoryLimit, prev.memoryUsage + (Math.random() - 0.5) * 20),
        renderComplexity: Math.max(0, Math.min(100, prev.renderComplexity + (Math.random() - 0.5) * 5))
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const detectDeviceCapabilities = () => {
    // Simplified device detection
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) return 'low';
    
    const renderer = gl.getParameter(gl.RENDERER);
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    
    if (maxTextureSize >= 8192 && renderer.includes('NVIDIA')) return 'ultra';
    if (maxTextureSize >= 4096) return 'high';
    if (maxTextureSize >= 2048) return 'medium';
    return 'low';
  };

  const getCurrentTierFeatures = () => {
    return enhancementLadder.find(tier => 
      tier.tier.toLowerCase().includes(budget.deviceTier)
    ) || enhancementLadder[2]; // Default to medium
  };

  const getPerformanceStatus = () => {
    const fpsRatio = budget.currentFPS / budget.targetFPS;
    const memoryRatio = budget.memoryUsage / budget.memoryLimit;
    const complexityRatio = budget.renderComplexity / budget.complexityBudget;
    
    if (fpsRatio < 0.8 || memoryRatio > 0.9 || complexityRatio > 0.9) {
      return { status: 'warning', color: 'text-yellow-400', icon: AlertTriangle };
    }
    if (fpsRatio >= 1.0 && memoryRatio < 0.7 && complexityRatio < 0.7) {
      return { status: 'excellent', color: 'text-green-400', icon: TrendingUp };
    }
    return { status: 'good', color: 'text-blue-400', icon: Monitor };
  };

  const performanceStatus = getPerformanceStatus();
  const currentFeatures = getCurrentTierFeatures();

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card className="p-6 bg-gradient-to-br from-slate-900 to-gray-900 border-gray-700/50">
        <div className="flex items-center gap-3 mb-6">
          <performanceStatus.icon className={`w-6 h-6 ${performanceStatus.color}`} />
          <h3 className="text-white font-semibold text-lg">Performance Budget</h3>
          <Badge className={`${
            performanceStatus.status === 'excellent' ? 'bg-green-600/20 text-green-400' :
            performanceStatus.status === 'warning' ? 'bg-yellow-600/20 text-yellow-400' :
            'bg-blue-600/20 text-blue-400'
          }`}>
            {performanceStatus.status.toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* FPS Monitor */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Frame Rate</span>
              <span className="text-white font-medium">
                {Math.round(budget.currentFPS)} / {budget.targetFPS} FPS
              </span>
            </div>
            <Progress 
              value={(budget.currentFPS / budget.targetFPS) * 100} 
              className="h-2"
            />
          </div>

          {/* Memory Usage */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Memory Usage</span>
              <span className="text-white font-medium">
                {Math.round(budget.memoryUsage)} / {budget.memoryLimit} MB
              </span>
            </div>
            <Progress 
              value={(budget.memoryUsage / budget.memoryLimit) * 100} 
              className="h-2"
            />
          </div>

          {/* Render Complexity */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Complexity Budget</span>
              <span className="text-white font-medium">
                {Math.round(budget.renderComplexity)}%
              </span>
            </div>
            <Progress 
              value={budget.renderComplexity} 
              className="h-2"
            />
          </div>
        </div>
      </Card>

      {/* Device Tier & Features */}
      <Card className="p-6 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30">
        <div className="flex items-center gap-3 mb-4">
          <Monitor className="w-6 h-6 text-blue-400" />
          <h3 className="text-white font-semibold">Current Device Tier</h3>
          <Badge className="bg-blue-600/20 text-blue-400">
            {budget.deviceTier.toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(currentFeatures.features).map(([feature, enabled]) => (
            <div key={feature} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-400' : 'bg-gray-600'}`} />
              <span className={`text-sm ${enabled ? 'text-white' : 'text-gray-500'}`}>
                {feature.charAt(0).toUpperCase() + feature.slice(1)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-sm">
          <div>
            <span className="text-gray-300">Max Effects: </span>
            <span className="text-white font-medium">{currentFeatures.maxEffects}</span>
          </div>
          <div>
            <span className="text-gray-300">Target FPS: </span>
            <span className="text-white font-medium">{currentFeatures.targetFPS}</span>
          </div>
        </div>
      </Card>

      {/* Progressive Enhancement Ladder */}
      <Card className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-purple-400" />
          <h3 className="text-white font-semibold">Progressive Enhancement Ladder</h3>
        </div>

        <div className="space-y-4">
          {enhancementLadder.map((tier, index) => (
            <div 
              key={tier.tier}
              className={`p-4 rounded-lg border ${
                tier.tier.toLowerCase().includes(budget.deviceTier)
                  ? 'border-purple-500/50 bg-purple-900/20'
                  : 'border-gray-700/50 bg-gray-900/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">{tier.tier}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {tier.targetFPS} FPS
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {tier.maxEffects} Effects
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {Object.entries(tier.features).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${enabled ? 'bg-green-400' : 'bg-gray-600'}`} />
                    <span className="text-xs text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Adaptive Quality Controls */}
      <Card className="p-6 bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-green-400" />
          <h3 className="text-white font-semibold">Adaptive Quality System</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
            <div>
              <p className="text-white font-medium">Auto-Scaling</p>
              <p className="text-gray-400 text-sm">Automatically adjusts quality based on performance</p>
            </div>
            <Badge className="bg-green-600/20 text-green-400">ACTIVE</Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
            <div>
              <p className="text-white font-medium">Thermal Throttling Protection</p>
              <p className="text-gray-400 text-sm">Reduces effects when device gets hot</p>
            </div>
            <Badge className="bg-blue-600/20 text-blue-400">MONITORING</Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
            <div>
              <p className="text-white font-medium">Battery Optimization</p>
              <p className="text-gray-400 text-sm">Lower effects on low battery</p>
            </div>
            <Badge className="bg-yellow-600/20 text-yellow-400">READY</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

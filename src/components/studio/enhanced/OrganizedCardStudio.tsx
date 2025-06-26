
import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  Sparkles, 
  Layers, 
  Save, 
  Download, 
  Eye,
  Settings,
  Palette,
  Wand2,
  RotateCcw,
  Play,
  Pause
} from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedUploadZone } from './EnhancedUploadZone';
import { Live3DPreview } from '../Live3DPreview';
import { useEnhancedStudio } from './hooks/useEnhancedStudio';
import { ENHANCED_FRAMES } from '../data/enhancedFrames';

export const OrganizedCardStudio = () => {
  const {
    currentPhase,
    setCurrentPhase,
    completedPhases,
    uploadedImages,
    selectedFrame,
    frameData,
    effects,
    effectValues,
    layers,
    selectedLayerId,
    cardData,
    isPlaying,
    fileInputRef,
    handleImageUpload,
    selectFrame,
    completePhase,
    addEffect,
    updateEffect,
    removeEffect,
    selectLayer,
    updateLayer,
    removeLayer,
    addLayer,
    toggleAnimation,
    handleImageAdjust,
    exportCard,
    saveCard
  } = useEnhancedStudio();

  const [sidebarTab, setSidebarTab] = useState('upload');

  const phases = [
    { id: 0, name: 'Upload', icon: Upload, completed: completedPhases.has(0) },
    { id: 1, name: 'Frame', icon: Layers, completed: completedPhases.has(1) },
    { id: 2, name: 'Effects', icon: Sparkles, completed: completedPhases.has(2) },
    { id: 3, name: 'Studio', icon: Palette, completed: completedPhases.has(3) }
  ];

  const progress = (completedPhases.size / phases.length) * 100;

  // Convert string URL to File object for handleImageUpload compatibility
  const handleImageUrlUpload = (imageUrl: string) => {
    // For now, we'll handle this differently since we can't easily convert URL to File
    // This is a temporary workaround - ideally we'd restructure the data flow
    console.log('Image URL uploaded:', imageUrl);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-black/50 backdrop-blur-xl border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Card Studio</h1>
              <p className="text-sm text-gray-400">Create premium 3D cards</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Progress</span>
              <span className="text-purple-400 font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-800" />
          </div>
        </div>

        {/* Phase Navigation */}
        <div className="p-4 border-b border-white/10">
          <div className="space-y-2">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isActive = currentPhase === phase.id;
              const isCompleted = phase.completed;
              
              return (
                <button
                  key={phase.id}
                  onClick={() => setCurrentPhase(phase.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-purple-600/20 border border-purple-500/50' 
                      : isCompleted
                      ? 'bg-green-600/10 border border-green-500/30 hover:bg-green-600/20'
                      : 'bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isCompleted ? 'bg-green-500/20' : isActive ? 'bg-purple-500/20' : 'bg-gray-700/50'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      isCompleted ? 'text-green-400' : isActive ? 'text-purple-400' : 'text-gray-400'
                    }`} />
                  </div>
                  <span className={`font-medium ${
                    isCompleted ? 'text-green-300' : isActive ? 'text-purple-300' : 'text-gray-300'
                  }`}>
                    {phase.name}
                  </span>
                  {isCompleted && (
                    <Badge variant="secondary" className="ml-auto bg-green-500/20 text-green-300 border-green-500/30">
                      ✓
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex-1 flex flex-col">
          <Tabs value={sidebarTab} onValueChange={setSidebarTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 m-4 mb-0">
              <TabsTrigger value="upload" className="text-xs">Upload</TabsTrigger>
              <TabsTrigger value="frames" className="text-xs">Frames</TabsTrigger>
              <TabsTrigger value="effects" className="text-xs">Effects</TabsTrigger>
              <TabsTrigger value="layers" className="text-xs">Layers</TabsTrigger>
            </TabsList>

            {/* Upload Tab */}
            <TabsContent value="upload" className="flex-1 p-4 space-y-4">
              <EnhancedUploadZone
                onImageUpload={handleImageUrlUpload}
                uploadedImage={uploadedImages.length > 0 ? URL.createObjectURL(uploadedImages[0]) : undefined}
              />
              
              {uploadedImages.length > 0 && !completedPhases.has(0) && (
                <Button 
                  onClick={() => completePhase(0)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Continue to Frame Selection
                </Button>
              )}
            </TabsContent>

            {/* Frames Tab */}
            <TabsContent value="frames" className="flex-1 p-4">
              <div className="space-y-4">
                <h3 className="text-white font-medium">Select Frame Style</h3>
                <div className="grid grid-cols-2 gap-3">
                  {ENHANCED_FRAMES.slice(0, 6).map((frame) => (
                    <button
                      key={frame.id}
                      onClick={() => selectFrame(frame.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        selectedFrame === frame.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-white text-sm font-medium mb-1">{frame.name}</div>
                      <div className="text-gray-400 text-xs">{frame.description}</div>
                    </button>
                  ))}
                </div>
                
                {selectedFrame && !completedPhases.has(1) && (
                  <Button 
                    onClick={() => completePhase(1)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Continue to Effects
                  </Button>
                )}
              </div>
            </TabsContent>

            {/* Effects Tab */}
            <TabsContent value="effects" className="flex-1 p-4">
              <div className="space-y-4">
                <h3 className="text-white font-medium">Visual Effects</h3>
                
                <div className="space-y-3">
                  {['holographic', 'chrome', 'metallic'].map((effectType) => {
                    const effect = effects.find(e => e.type === effectType);
                    return (
                      <div key={effectType} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white text-sm capitalize">{effectType}</span>
                          {!effect && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addEffect(effectType as any)}
                              className="h-6 px-2 text-xs"
                            >
                              Add
                            </Button>
                          )}
                        </div>
                        
                        {effect && (
                          <div className="space-y-2 p-3 bg-gray-800/50 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-400">Intensity</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeEffect(effect.id)}
                                className="h-4 w-4 p-0 text-red-400 hover:text-red-300"
                              >
                                ×
                              </Button>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={typeof effect.intensity === 'number' ? effect.intensity : 0}
                              onChange={(e) => updateEffect(effect.id, { intensity: parseInt(e.target.value) })}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="text-xs text-gray-400 text-center">
                              {typeof effect.intensity === 'number' ? effect.intensity : 0}%
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {effects.some(e => typeof e.intensity === 'number' && e.intensity > 0) && !completedPhases.has(2) && (
                  <Button 
                    onClick={() => completePhase(2)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Continue to Studio
                  </Button>
                )}
              </div>
            </TabsContent>

            {/* Layers Tab */}
            <TabsContent value="layers" className="flex-1 p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-medium">Layers</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addLayer('image')}
                    className="h-6 px-2 text-xs"
                  >
                    Add Layer
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {layers.map((layer) => (
                    <div
                      key={layer.id}
                      onClick={() => selectLayer(layer.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedLayerId === layer.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-white text-sm">{layer.name}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateLayer(layer.id, { visible: !layer.visible });
                            }}
                            className="text-gray-400 hover:text-white"
                          >
                            <Eye className={`w-3 h-3 ${layer.visible ? '' : 'opacity-50'}`} />
                          </button>
                          {layer.id !== 'background' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeLayer(layer.id);
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {layer.type} • {Math.round(layer.opacity * 100)}% opacity
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <div className="flex gap-2">
            <Button
              onClick={toggleAnimation}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              {isPlaying ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
              onClick={() => exportCard('png')}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
          </div>
          <Button
            onClick={saveCard}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Card
          </Button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-black/30 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-white font-semibold">Live Preview</h2>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              {phases[currentPhase]?.name || 'Studio'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 3D Preview */}
        <div className="flex-1 p-6">
          <Live3DPreview
            frontImage={uploadedImages.length > 0 ? URL.createObjectURL(uploadedImages[0]) : undefined}
            selectedFrame={selectedFrame}
            effects={effectValues}
            cardData={cardData}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

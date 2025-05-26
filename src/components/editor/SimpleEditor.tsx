
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Share, Palette, Type, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface SimpleEditorProps {
  initialData: { photo: string; templateId: string };
}

export const SimpleEditor = ({ initialData }: SimpleEditorProps) => {
  const [cardTitle, setCardTitle] = useState('My Awesome Card');
  const [cardDescription, setCardDescription] = useState('This is my card description');
  const [brightness, setBrightness] = useState(100);
  const [effects, setEffects] = useState({
    holographic: false,
    neon: false,
    vintage: false
  });

  const handleSave = () => {
    toast.success('Card saved successfully!');
  };

  const handleShare = () => {
    toast.success('Share link copied to clipboard!');
  };

  const toggleEffect = (effectName: keyof typeof effects) => {
    setEffects(prev => ({ ...prev, [effectName]: !prev[effectName] }));
    toast.success(`${effectName} effect ${effects[effectName] ? 'disabled' : 'enabled'}`);
  };

  return (
    <div className="flex h-screen bg-editor-darker">
      {/* Left Sidebar - Minimal Tools */}
      <div className="w-64 bg-editor-dark border-r border-editor-border p-4 space-y-6">
        <h3 className="text-white font-semibold">Quick Tools</h3>
        
        {/* Effects Toggle */}
        <div className="space-y-3">
          <h4 className="text-crd-lightGray text-sm font-medium flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            Effects
          </h4>
          {Object.entries(effects).map(([effect, enabled]) => (
            <button
              key={effect}
              onClick={() => toggleEffect(effect as keyof typeof effects)}
              className={`w-full p-2 rounded text-sm transition-colors ${
                enabled 
                  ? 'bg-crd-green text-black' 
                  : 'bg-editor-tool text-white hover:bg-editor-border'
              }`}
            >
              {effect.charAt(0).toUpperCase() + effect.slice(1)}
            </button>
          ))}
        </div>

        {/* Brightness */}
        <div className="space-y-2">
          <label className="text-crd-lightGray text-sm">Brightness</label>
          <input
            type="range"
            min="50"
            max="150"
            value={brightness}
            onChange={(e) => setBrightness(parseInt(e.target.value))}
            className="w-full accent-crd-green"
          />
        </div>
      </div>

      {/* Center - Large Preview */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-editor-dark border-b border-editor-border flex items-center justify-between px-6">
          <h1 className="text-white text-lg font-semibold">Card Editor</h1>
          <div className="flex space-x-2">
            <Button onClick={handleSave} size="sm" className="bg-crd-green text-black">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleShare} size="sm" variant="outline">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Main Preview Area */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="relative">
            <div 
              className="w-80 h-[28rem] rounded-2xl shadow-2xl overflow-hidden relative"
              style={{
                filter: `brightness(${brightness}%) ${
                  effects.holographic ? 'hue-rotate(180deg)' : ''
                } ${effects.vintage ? 'sepia(0.5)' : ''}`,
                boxShadow: effects.neon ? '0 0 30px #ff006e' : undefined
              }}
            >
              <img 
                src={initialData.photo} 
                alt="Card" 
                className="w-full h-full object-cover"
              />
              
              {/* Holographic overlay */}
              {effects.holographic && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20 animate-pulse" />
              )}
              
              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h2 className="text-white text-2xl font-bold mb-2">{cardTitle}</h2>
                <p className="text-gray-200 text-sm">{cardDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Text Editing */}
      <div className="w-64 bg-editor-dark border-l border-editor-border p-4 space-y-6">
        <h3 className="text-white font-semibold flex items-center">
          <Type className="w-4 h-4 mr-2" />
          Text Content
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-crd-lightGray text-sm block mb-2">Card Title</label>
            <Input
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              className="bg-editor-tool border-editor-border text-white"
            />
          </div>
          
          <div>
            <label className="text-crd-lightGray text-sm block mb-2">Description</label>
            <textarea
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
              className="w-full p-2 bg-editor-tool border border-editor-border rounded text-white text-sm"
              rows={3}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-editor-border">
          <p className="text-crd-lightGray text-xs">
            Template: {initialData.templateId}
          </p>
        </div>
      </div>
    </div>
  );
};

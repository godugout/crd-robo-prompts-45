
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Eye, Maximize, Download, Share2, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface PreviewStepProps {
  selectedTemplate: string;
  onContinueToEffects: () => void;
}

export const PreviewStep = ({ selectedTemplate, onContinueToEffects }: PreviewStepProps) => {
  const [previewMode, setPreviewMode] = useState<'simple' | 'scene' | '3d'>('simple');

  const handleExport = () => {
    toast.success('Exporting high-resolution card...');
  };

  const handleShare = () => {
    toast.success('Generating share link...');
  };

  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-white font-medium text-lg mb-2">Card Preview</h3>
          <p className="text-crd-lightGray text-sm">
            Review your card design before adding effects
          </p>
        </div>

        {/* High Resolution Preview */}
        <div className="space-y-4">
          <h4 className="text-white font-medium text-sm uppercase tracking-wide">High Resolution Preview</h4>
          <div className="aspect-[3/4] bg-editor-dark rounded-xl border border-editor-border relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-crd-green to-crd-orange rounded-xl mb-4 mx-auto flex items-center justify-center">
                  <span className="text-black font-bold text-lg">CARD</span>
                </div>
                <p className="text-crd-lightGray text-sm">Full Resolution Preview</p>
                <p className="text-crd-lightGray text-xs mt-1">Template: {selectedTemplate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Immersive Viewer Options */}
        <div className="space-y-4">
          <h4 className="text-white font-medium text-sm uppercase tracking-wide">Immersive Viewer</h4>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'simple', name: 'Simple BG', color: 'from-gray-600 to-gray-800' },
              { id: 'scene', name: 'Custom Scene', color: 'from-blue-600 to-purple-600' },
              { id: '3d', name: '3D Environment', color: 'from-green-600 to-cyan-600' }
            ].map((mode) => (
              <div
                key={mode.id}
                className={`aspect-square rounded-lg cursor-pointer transition-all ${
                  previewMode === mode.id ? 'ring-2 ring-crd-green scale-105' : 'hover:scale-102'
                }`}
                onClick={() => setPreviewMode(mode.id as any)}
              >
                <div className={`w-full h-full bg-gradient-to-br ${mode.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white text-xs font-medium text-center">{mode.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Immersive View Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-crd-purple hover:bg-crd-purple/90 text-white">
              <Maximize className="w-4 h-4 mr-2" />
              Open Immersive Viewer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl h-[80vh] bg-black border-0">
            <div className="w-full h-full flex items-center justify-center relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${
                previewMode === 'simple' ? 'from-gray-900 to-black' :
                previewMode === 'scene' ? 'from-blue-900 to-purple-900' :
                'from-green-900 to-cyan-900'
              }`}></div>
              <div className="relative z-10 aspect-[3/4] w-80 bg-white rounded-xl shadow-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-crd-green to-crd-orange rounded-xl mb-4 mx-auto"></div>
                  <p className="text-black font-bold">Immersive Card View</p>
                  <p className="text-gray-600 text-sm">{previewMode} background</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full border-editor-border text-white hover:bg-editor-border" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export High Resolution
          </Button>
          
          <Button variant="outline" className="w-full border-editor-border text-white hover:bg-editor-border" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Preview
          </Button>
        </div>

        {/* Continue Button */}
        <div className="pt-4 border-t border-editor-border">
          <Button className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium" onClick={onContinueToEffects}>
            Continue to Effects
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

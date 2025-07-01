
import React, { useState, useRef } from 'react';
import { useCardEditor } from '@/hooks/useCardEditor';
import { Canvas as FabricCanvas } from 'fabric';
import { CanvasWrapper } from './canvas/CanvasWrapper';
import { CanvasDragArea } from './canvas/CanvasDragArea';
import { CanvasToolbar } from './canvas/CanvasToolbar';
import { CanvasControls } from './canvas/CanvasControls';
import { CanvasCreator } from './canvas/CanvasCreator';
import { FabricCanvasComponent } from './canvas/FabricCanvas';
import { CanvasDrawingTools } from './canvas/CanvasDrawingTools';
import { TemplateRenderer } from './templates/TemplateRenderer';
import { EnhancedAssetIntegration } from './assets/EnhancedAssetIntegration';
import { toast } from 'sonner';

interface CanvasProps {
  zoom: number;
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const Canvas = ({ zoom, cardEditor }: CanvasProps) => {
  const scale = zoom / 100;
  const [showGrid, setShowGrid] = useState(true);
  const [showEffects, setShowEffects] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState('select');

  const cardWidth = 320;
  const cardHeight = 420;

  const title = cardEditor?.cardData.title || 'No roads needed';
  const description = cardEditor?.cardData.description || 'Where we\'re going, there are only cards. An original digital art piece inspired by BTTF.';

  const handleCanvasReady = (canvas: FabricCanvas) => {
    setFabricCanvas(canvas);
    toast.success('Canvas ready for editing!');
  };

  const handleRotate = () => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      activeObject.rotate((activeObject.angle || 0) + 90);
      fabricCanvas.renderAll();
      toast.success('Object rotated!');
    } else {
      toast.info('Select an object to rotate');
    }
  };

  const handleShare = () => {
    if (!fabricCanvas) return;
    
    // Export canvas as image
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
    
    // Create download link
    const link = document.createElement('a');
    link.download = `${title.replace(/\s+/g, '_')}_card.png`;
    link.href = dataURL;
    link.click();
    
    toast.success('Card exported successfully!');
  };

  return (
    <CanvasWrapper 
      title={title} 
      description={description} 
      onActionClick={() => {}}
    >
      <CanvasToolbar 
        showGrid={showGrid}
        showEffects={showEffects}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onToggleEffects={() => setShowEffects(!showEffects)}
        onRotate={handleRotate}
        onShare={handleShare}
      />
      
      <div className="flex flex-col items-center gap-4">
        <CanvasDrawingTools
          fabricCanvas={fabricCanvas}
          activeTool={activeTool}
          onToolChange={setActiveTool}
        />
        
        <div 
          className="relative"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.3s ease-in-out',
            filter: `brightness(${brightness}%) contrast(${contrast}%)`
          }}
        >
          <FabricCanvasComponent
            width={cardWidth}
            height={cardHeight}
            showGrid={showGrid}
            showEffects={showEffects}
            cardEditor={cardEditor}
            onCanvasReady={handleCanvasReady}
          />
        </div>
      </div>
      
      <TemplateRenderer
        templateId={cardEditor?.cardData.design_metadata?.templateId || 'template1'}
        fabricCanvas={fabricCanvas}
        cardData={cardEditor?.cardData}
      />
      
      <EnhancedAssetIntegration fabricCanvas={fabricCanvas} />
      
      <CanvasControls 
        brightness={brightness}
        contrast={contrast}
        onBrightnessChange={(values) => setBrightness(values[0])}
        onContrastChange={(values) => setContrast(values[0])}
        title={title}
        description={description}
      />
      
      <CanvasCreator />
    </CanvasWrapper>
  );
};

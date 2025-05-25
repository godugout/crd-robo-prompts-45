
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useCardEditor } from '@/hooks/useCardEditor';
import { Button } from '@/components/ui/button';
import { Grid3x3, Share, RotateCw, Sparkles, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { CanvasElementManager } from './canvas/CanvasElementManager';

interface EditorCanvasProps {
  zoom: number;
  cardEditor?: ReturnType<typeof useCardEditor>;
  onAddElement?: (elementType: string, elementId: string) => void;
}

export const EditorCanvas = ({ zoom, cardEditor, onAddElement }: EditorCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [elementManager] = useState(() => new CanvasElementManager());
  const [showGrid, setShowGrid] = useState(true);
  const [showEffects, setShowEffects] = useState(false);
  const [selectedElement, setSelectedElement] = useState<any>(null);

  const scale = zoom / 100;
  const cardWidth = 320;
  const cardHeight = 420;

  const title = cardEditor?.cardData.title || 'Untitled Card';
  const description = cardEditor?.cardData.description || 'A beautiful custom card created with Cardshow editor.';

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: cardWidth,
      height: cardHeight,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });

    setFabricCanvas(canvas);

    // Handle object selection
    canvas.on('selection:created', (e) => {
      setSelectedElement(e.selected?.[0] || null);
    });

    canvas.on('selection:updated', (e) => {
      setSelectedElement(e.selected?.[0] || null);
    });

    canvas.on('selection:cleared', () => {
      setSelectedElement(null);
    });

    // Auto-save canvas changes
    canvas.on('object:modified', () => {
      if (cardEditor) {
        const canvasData = JSON.stringify(canvas.toJSON());
        cardEditor.updateDesignMetadata('canvasData', canvasData);
      }
    });

    toast.success('Canvas ready for editing!');

    return () => {
      canvas.dispose();
    };
  }, [cardWidth, cardHeight, cardEditor]);

  // Handle adding elements from sidebar
  useEffect(() => {
    if (onAddElement && fabricCanvas) {
      const handleAddElement = (elementType: string, elementId: string) => {
        switch (elementType) {
          case 'shape':
            elementManager.addShape(fabricCanvas, elementId);
            toast.success(`${elementId} shape added to canvas`);
            break;
          case 'text':
            elementManager.addText(fabricCanvas, elementId);
            toast.success(`${elementId} text added to canvas`);
            break;
          case 'background':
            elementManager.addBackground(fabricCanvas, elementId);
            toast.success(`${elementId} background applied`);
            break;
        }
      };

      // Store the handler reference
      (window as any).handleCanvasAddElement = handleAddElement;
    }
  }, [fabricCanvas, elementManager, onAddElement]);

  const handleRotate = () => {
    if (!fabricCanvas || !selectedElement) {
      toast.info('Select an object to rotate');
      return;
    }
    
    selectedElement.rotate((selectedElement.angle || 0) + 90);
    fabricCanvas.renderAll();
    toast.success('Object rotated!');
  };

  const handleDelete = () => {
    if (!fabricCanvas || !selectedElement) {
      toast.info('Select an object to delete');
      return;
    }
    
    fabricCanvas.remove(selectedElement);
    setSelectedElement(null);
    toast.success('Object deleted!');
  };

  const handleDuplicate = () => {
    if (!fabricCanvas || !selectedElement) {
      toast.info('Select an object to duplicate');
      return;
    }
    
    selectedElement.clone((cloned: any) => {
      cloned.set({
        left: selectedElement.left + 20,
        top: selectedElement.top + 20,
      });
      fabricCanvas.add(cloned);
      fabricCanvas.setActiveObject(cloned);
      fabricCanvas.renderAll();
      toast.success('Object duplicated!');
    });
  };

  const handleShare = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
    
    const link = document.createElement('a');
    link.download = `${title.replace(/\s+/g, '_')}_card.png`;
    link.href = dataURL;
    link.click();
    
    toast.success('Card exported successfully!');
  };

  return (
    <div className="flex-1 bg-editor-darker overflow-auto flex items-start justify-center py-8">
      <div className="flex flex-col gap-8">
        <div className="bg-editor-dark rounded-2xl p-6 w-[400px] shadow-xl border border-editor-border/20">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-white text-xl font-semibold">Canvas</h2>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-crd-lightGray hover:text-white rounded-lg ${showGrid ? "text-crd-green" : ""}`}
                onClick={() => setShowGrid(!showGrid)}
                title="Toggle Grid"
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-crd-lightGray hover:text-white rounded-lg ${showEffects ? "text-crd-orange" : ""}`}
                onClick={() => setShowEffects(!showEffects)}
                title="Toggle Effects"
              >
                <Sparkles className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-crd-lightGray hover:text-white rounded-lg"
                onClick={handleRotate}
                disabled={!selectedElement}
                title="Rotate Selected"
              >
                <RotateCw className="w-4 h-4" />
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                className="text-crd-lightGray hover:text-white rounded-lg"
                onClick={handleDuplicate}
                disabled={!selectedElement}
                title="Duplicate Selected"
              >
                <Copy className="w-4 h-4" />
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                className="text-crd-lightGray hover:text-red-400 rounded-lg"
                onClick={handleDelete}
                disabled={!selectedElement}
                title="Delete Selected"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-crd-lightGray hover:text-white rounded-lg"
                onClick={handleShare}
                title="Export Card"
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <div 
              className="relative rounded-xl overflow-hidden shadow-2xl"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                transition: 'transform 0.3s ease-in-out'
              }}
            >
              <canvas 
                ref={canvasRef} 
                className="border border-editor-border rounded-xl shadow-lg"
              />
              {showEffects && (
                <div className="absolute inset-0 pointer-events-none rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-crd-orange/5 to-transparent animate-pulse rounded-xl" />
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 text-left">
            <h3 className="text-white text-xl font-bold">{title}</h3>
            <p className="text-crd-lightGray text-sm mt-2">{description}</p>
            {selectedElement && (
              <div className="mt-3 p-2 bg-editor-darker rounded-lg">
                <p className="text-crd-green text-xs">Selected: {selectedElement.type || 'Object'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

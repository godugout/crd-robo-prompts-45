
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Circle, Rect, Path, Textbox, Image as FabricImage } from 'fabric';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { 
  Square, 
  Circle as CircleIcon, 
  Type, 
  PenTool,
  Move,
  RotateCw,
  Copy,
  Trash2,
  Layers,
  Palette,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface VectorElement {
  id: string;
  type: 'rectangle' | 'circle' | 'text' | 'path' | 'image';
  properties: any;
  fabricObject?: any;
}

interface VectorGraphicsEngineProps {
  width?: number;
  height?: number;
  onElementsChange?: (elements: VectorElement[]) => void;
  onExport?: (dataUrl: string) => void;
}

export const VectorGraphicsEngine: React.FC<VectorGraphicsEngineProps> = ({
  width = 750,
  height = 1050,
  onElementsChange,
  onExport
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [elements, setElements] = useState<VectorElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<VectorElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Element properties for editing
  const [elementProps, setElementProps] = useState({
    fill: '#3B82F6',
    stroke: '#000000',
    strokeWidth: 2,
    opacity: 1,
    fontSize: 24,
    fontFamily: 'Arial',
    text: 'Edit text'
  });

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true
    });

    // Configure drawing brush with null check
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = elementProps.stroke;
      canvas.freeDrawingBrush.width = elementProps.strokeWidth;
    }

    setFabricCanvas(canvas);

    // Event listeners
    const handleSelection = () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        const element = elements.find(el => el.fabricObject === activeObject);
        setSelectedElement(element || null);
        
        // Update property panel with selected object properties
        setElementProps({
          fill: activeObject.fill as string || '#3B82F6',
          stroke: activeObject.stroke as string || '#000000',
          strokeWidth: activeObject.strokeWidth || 2,
          opacity: activeObject.opacity || 1,
          fontSize: (activeObject as any).fontSize || 24,
          fontFamily: (activeObject as any).fontFamily || 'Arial',
          text: (activeObject as any).text || 'Edit text'
        });
      } else {
        setSelectedElement(null);
      }
    };

    const handleObjectModified = () => {
      updateElementsList();
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => setSelectedElement(null));
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', updateElementsList);
    canvas.on('object:removed', updateElementsList);

    return () => {
      canvas.dispose();
    };
  }, []);

  // Update elements list from canvas objects
  const updateElementsList = useCallback(() => {
    if (!fabricCanvas) return;
    
    const canvasObjects = fabricCanvas.getObjects();
    const newElements: VectorElement[] = canvasObjects.map((obj, index) => ({
      id: (obj as any).id || `element-${index}`,
      type: getObjectType(obj),
      properties: extractObjectProperties(obj),
      fabricObject: obj
    }));
    
    setElements(newElements);
    onElementsChange?.(newElements);
  }, [fabricCanvas, onElementsChange]);

  // Get object type
  const getObjectType = (obj: any): VectorElement['type'] => {
    if (obj.type === 'rect') return 'rectangle';
    if (obj.type === 'circle') return 'circle';
    if (obj.type === 'textbox' || obj.type === 'text') return 'text';
    if (obj.type === 'path') return 'path';
    if (obj.type === 'image') return 'image';
    return 'rectangle';
  };

  // Extract object properties
  const extractObjectProperties = (obj: any) => ({
    left: obj.left,
    top: obj.top,
    width: obj.width,
    height: obj.height,
    fill: obj.fill,
    stroke: obj.stroke,
    strokeWidth: obj.strokeWidth,
    opacity: obj.opacity,
    angle: obj.angle,
    scaleX: obj.scaleX,
    scaleY: obj.scaleY,
    text: obj.text,
    fontSize: obj.fontSize,
    fontFamily: obj.fontFamily
  });

  // Tool functions
  const handleToolSelect = (tool: string) => {
    if (!fabricCanvas) return;
    
    setSelectedTool(tool);
    fabricCanvas.isDrawingMode = tool === 'draw';
    
    if (tool === 'draw' && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = elementProps.stroke;
      fabricCanvas.freeDrawingBrush.width = elementProps.strokeWidth;
    }
  };

  // Add shapes
  const addRectangle = () => {
    if (!fabricCanvas) return;
    
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: elementProps.fill,
      stroke: elementProps.stroke,
      strokeWidth: elementProps.strokeWidth,
      opacity: elementProps.opacity
    });
    
    (rect as any).id = `rect-${Date.now()}`;
    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
    toast.success('Rectangle added!');
  };

  const addCircle = () => {
    if (!fabricCanvas) return;
    
    const circle = new Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: elementProps.fill,
      stroke: elementProps.stroke,
      strokeWidth: elementProps.strokeWidth,
      opacity: elementProps.opacity
    });
    
    (circle as any).id = `circle-${Date.now()}`;
    fabricCanvas.add(circle);
    fabricCanvas.setActiveObject(circle);
    toast.success('Circle added!');
  };

  const addText = () => {
    if (!fabricCanvas) return;
    
    const text = new Textbox(elementProps.text, {
      left: 100,
      top: 100,
      width: 200,
      fontSize: elementProps.fontSize,
      fontFamily: elementProps.fontFamily,
      fill: elementProps.fill,
      stroke: elementProps.stroke,
      strokeWidth: elementProps.strokeWidth * 0.5,
      opacity: elementProps.opacity
    });
    
    (text as any).id = `text-${Date.now()}`;
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    toast.success('Text added!');
  };

  // Update selected object properties
  const updateSelectedObject = (property: string, value: any) => {
    if (!fabricCanvas || !selectedElement?.fabricObject) return;
    
    const obj = selectedElement.fabricObject;
    obj.set(property, value);
    fabricCanvas.renderAll();
    updateElementsList();
  };

  // Property change handlers
  const handlePropertyChange = (property: string, value: any) => {
    setElementProps(prev => ({ ...prev, [property]: value }));
    updateSelectedObject(property, value);
  };

  // Layer operations - using correct Fabric.js v6 methods
  const moveLayerUp = () => {
    if (!fabricCanvas || !selectedElement?.fabricObject) return;
    
    selectedElement.fabricObject.bringForward();
    fabricCanvas.renderAll();
    toast.success('Moved forward!');
  };

  const moveLayerDown = () => {
    if (!fabricCanvas || !selectedElement?.fabricObject) return;
    
    selectedElement.fabricObject.sendBackwards();
    fabricCanvas.renderAll();
    toast.success('Moved backward!');
  };

  const duplicateElement = () => {
    if (!fabricCanvas || !selectedElement?.fabricObject) return;
    
    selectedElement.fabricObject.clone().then((cloned: any) => {
      cloned.set({
        left: cloned.left + 20,
        top: cloned.top + 20
      });
      cloned.id = `${selectedElement.type}-${Date.now()}`;
      fabricCanvas.add(cloned);
      fabricCanvas.setActiveObject(cloned);
    });
    
    toast.success('Element duplicated!');
  };

  const deleteElement = () => {
    if (!fabricCanvas || !selectedElement?.fabricObject) return;
    
    fabricCanvas.remove(selectedElement.fabricObject);
    fabricCanvas.renderAll();
    setSelectedElement(null);
    toast.success('Element deleted!');
  };

  // Export canvas
  const exportCanvas = () => {
    if (!fabricCanvas) return;
    
    const dataUrl = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2 // High resolution export
    });
    
    onExport?.(dataUrl);
    
    // Also trigger download
    const link = document.createElement('a');
    link.download = 'vector-design.png';
    link.href = dataUrl;
    link.click();
    
    toast.success('Design exported!');
  };

  return (
    <div className="flex h-full bg-editor-darker">
      {/* Tools Panel */}
      <div className="w-80 bg-editor-dark border-r border-editor-border p-4 overflow-y-auto">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-white font-bold text-lg mb-2">Vector Studio</h3>
            <p className="text-crd-lightGray text-sm">
              Professional vector graphics editing
            </p>
          </div>

          {/* Tools */}
          <Card className="bg-editor-darker border-editor-border p-4">
            <h4 className="text-white font-semibold mb-3">Tools</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedTool === 'select' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleToolSelect('select')}
                className={selectedTool === 'select' ? 'bg-crd-green text-black' : 'border-editor-border text-white'}
              >
                <Move className="w-4 h-4" />
              </Button>
              <Button
                variant={selectedTool === 'draw' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleToolSelect('draw')}
                className={selectedTool === 'draw' ? 'bg-crd-green text-black' : 'border-editor-border text-white'}
              >
                <PenTool className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Add Elements */}
          <Card className="bg-editor-darker border-editor-border p-4">
            <h4 className="text-white font-semibold mb-3">Add Elements</h4>
            <div className="space-y-2">
              <Button
                onClick={addRectangle}
                variant="outline"
                size="sm"
                className="w-full border-editor-border text-white hover:bg-editor-border"
              >
                <Square className="w-4 h-4 mr-2" />
                Rectangle
              </Button>
              <Button
                onClick={addCircle}
                variant="outline"
                size="sm"
                className="w-full border-editor-border text-white hover:bg-editor-border"
              >
                <CircleIcon className="w-4 h-4 mr-2" />
                Circle
              </Button>
              <Button
                onClick={addText}
                variant="outline"
                size="sm"
                className="w-full border-editor-border text-white hover:bg-editor-border"
              >
                <Type className="w-4 h-4 mr-2" />
                Text
              </Button>
            </div>
          </Card>

          {/* Properties */}
          {selectedElement && (
            <Card className="bg-editor-darker border-editor-border p-4">
              <h4 className="text-white font-semibold mb-3">Properties</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Fill Color</label>
                  <Input
                    type="color"
                    value={elementProps.fill}
                    onChange={(e) => handlePropertyChange('fill', e.target.value)}
                    className="w-full h-8"
                  />
                </div>
                
                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Stroke Color</label>
                  <Input
                    type="color"
                    value={elementProps.stroke}
                    onChange={(e) => handlePropertyChange('stroke', e.target.value)}
                    className="w-full h-8"
                  />
                </div>
                
                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Stroke Width</label>
                  <Slider
                    value={[elementProps.strokeWidth]}
                    onValueChange={(value) => handlePropertyChange('strokeWidth', value[0])}
                    min={0}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-crd-lightGray text-sm mb-2 block">Opacity</label>
                  <Slider
                    value={[elementProps.opacity * 100]}
                    onValueChange={(value) => handlePropertyChange('opacity', value[0] / 100)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                {selectedElement.type === 'text' && (
                  <>
                    <div>
                      <label className="text-crd-lightGray text-sm mb-2 block">Text</label>
                      <Input
                        value={elementProps.text}
                        onChange={(e) => handlePropertyChange('text', e.target.value)}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-crd-lightGray text-sm mb-2 block">Font Size</label>
                      <Slider
                        value={[elementProps.fontSize]}
                        onValueChange={(value) => handlePropertyChange('fontSize', value[0])}
                        min={8}
                        max={120}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}

          {/* Layer Controls */}
          {selectedElement && (
            <Card className="bg-editor-darker border-editor-border p-4">
              <h4 className="text-white font-semibold mb-3">Layer Controls</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={moveLayerUp}
                  variant="outline"
                  size="sm"
                  className="border-editor-border text-white hover:bg-editor-border"
                >
                  <Layers className="w-4 h-4" />
                </Button>
                <Button
                  onClick={moveLayerDown}
                  variant="outline"
                  size="sm"
                  className="border-editor-border text-white hover:bg-editor-border"
                >
                  <Layers className="w-4 h-4 rotate-180" />
                </Button>
                <Button
                  onClick={duplicateElement}
                  variant="outline"
                  size="sm"
                  className="border-editor-border text-white hover:bg-editor-border"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  onClick={deleteElement}
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )}

          {/* Export */}
          <Button
            onClick={exportCanvas}
            className="w-full bg-crd-green hover:bg-crd-green/90 text-black"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Design
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-editor-darker to-black">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="border border-editor-border rounded-lg shadow-2xl bg-white"
          />
          
          <div className="absolute -top-8 left-0 text-crd-lightGray text-sm">
            Vector Canvas ({width} × {height})
          </div>
        </div>
      </div>
    </div>
  );
};

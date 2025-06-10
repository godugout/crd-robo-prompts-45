
import React, { useRef, useEffect, useState } from 'react';
import { FabricCanvasComponent } from '../canvas/FabricCanvas';
import { Canvas as FabricCanvas, FabricImage, FabricText, Rect, Circle } from 'fabric';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  Image as ImageIcon, 
  Type, 
  Square, 
  Circle as CircleIcon,
  Upload,
  Download,
  Undo,
  Redo,
  Trash2,
  Copy,
  Move,
  RotateCw
} from 'lucide-react';
import { toast } from 'sonner';
import type { FrameTemplate } from './FrameTemplate';

interface CanvasEditorProps {
  selectedFrame: FrameTemplate;
  onSave: (canvasData: string) => void;
  onExport: (imageData: string) => void;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
  selectedFrame,
  onSave,
  onExport
}) => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'elements' | 'properties'>('elements');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (canvas) {
      // Set up frame template on canvas
      setupFrameTemplate();
      
      // Listen for selection changes
      canvas.on('selection:created', (e) => {
        setSelectedObject(e.selected?.[0]);
      });
      
      canvas.on('selection:updated', (e) => {
        setSelectedObject(e.selected?.[0]);
      });
      
      canvas.on('selection:cleared', () => {
        setSelectedObject(null);
      });
    }
  }, [canvas, selectedFrame]);

  const setupFrameTemplate = () => {
    if (!canvas) return;

    canvas.clear();
    
    // Set canvas background
    canvas.backgroundColor = selectedFrame.default_colors.background;

    // Add frame cutout guides
    selectedFrame.cutout_areas.forEach((area) => {
      const guide = new Rect({
        left: (area.x / 100) * 750,
        top: (area.y / 100) * 1050,
        width: (area.width / 100) * 750,
        height: (area.height / 100) * 1050,
        fill: 'transparent',
        stroke: area.type === 'photo' ? '#3b82f6' : area.type === 'text' ? '#10b981' : '#f59e0b',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        opacity: 0.7
      });
      
      canvas.add(guide);
    });

    canvas.renderAll();
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgElement = new Image();
      imgElement.onload = () => {
        const img = new FabricImage(imgElement, {
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5,
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        toast.success('Photo added to canvas');
      };
      imgElement.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const addTextElement = () => {
    if (!canvas) return;

    const text = new FabricText('Edit this text', {
      left: 200,
      top: 200,
      fontFamily: 'Arial',
      fontSize: 24,
      fill: selectedFrame.default_colors.text,
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    toast.success('Text element added');
  };

  const addShape = (type: 'rectangle' | 'circle') => {
    if (!canvas) return;

    let shape;
    if (type === 'rectangle') {
      shape = new Rect({
        left: 150,
        top: 150,
        width: 100,
        height: 100,
        fill: selectedFrame.default_colors.border,
      });
    } else {
      shape = new Circle({
        left: 150,
        top: 150,
        radius: 50,
        fill: selectedFrame.default_colors.border,
      });
    }
    
    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
    toast.success(`${type} added to canvas`);
  };

  const deleteSelected = () => {
    if (!canvas || !selectedObject) return;
    
    canvas.remove(selectedObject);
    canvas.renderAll();
    setSelectedObject(null);
    toast.success('Element deleted');
  };

  const duplicateSelected = () => {
    if (!canvas || !selectedObject) return;
    
    selectedObject.clone((cloned: any) => {
      cloned.set({
        left: selectedObject.left + 20,
        top: selectedObject.top + 20,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      toast.success('Element duplicated');
    });
  };

  const handleSave = () => {
    if (!canvas) return;
    
    const canvasData = JSON.stringify(canvas.toJSON());
    onSave(canvasData);
    toast.success('Design saved');
  };

  const handleExport = () => {
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });
    onExport(dataURL);
    toast.success('Design exported');
  };

  return (
    <div className="grid lg:grid-cols-4 gap-6 h-full">
      {/* Tools Sidebar */}
      <div className="space-y-4">
        {/* Element Tools */}
        <Card className="bg-editor-dark border-editor-border">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <ImageIcon className="w-4 h-4 mr-2" />
              Add Elements
            </h3>
            
            <div className="space-y-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
                className="w-full justify-start border-editor-border text-white hover:bg-editor-border"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              
              <Button
                onClick={addTextElement}
                variant="outline"
                size="sm"
                className="w-full justify-start border-editor-border text-white hover:bg-editor-border"
              >
                <Type className="w-4 h-4 mr-2" />
                Add Text
              </Button>
              
              <Button
                onClick={() => addShape('rectangle')}
                variant="outline"
                size="sm"
                className="w-full justify-start border-editor-border text-white hover:bg-editor-border"
              >
                <Square className="w-4 h-4 mr-2" />
                Rectangle
              </Button>
              
              <Button
                onClick={() => addShape('circle')}
                variant="outline"
                size="sm"
                className="w-full justify-start border-editor-border text-white hover:bg-editor-border"
              >
                <CircleIcon className="w-4 h-4 mr-2" />
                Circle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Object Properties */}
        {selectedObject && (
          <Card className="bg-editor-dark border-editor-border">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-4">Properties</h3>
              
              <div className="space-y-4">
                {selectedObject.type === 'textbox' && (
                  <>
                    <div>
                      <Label className="text-crd-lightGray text-sm">Text</Label>
                      <Input
                        value={selectedObject.text || ''}
                        onChange={(e) => {
                          selectedObject.set('text', e.target.value);
                          canvas?.renderAll();
                        }}
                        className="mt-1 bg-editor-tool border-editor-border text-white"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-crd-lightGray text-sm">Font Size</Label>
                      <Slider
                        value={[selectedObject.fontSize || 24]}
                        onValueChange={(value) => {
                          selectedObject.set('fontSize', value[0]);
                          canvas?.renderAll();
                        }}
                        min={8}
                        max={72}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </>
                )}
                
                <div>
                  <Label className="text-crd-lightGray text-sm">Opacity</Label>
                  <Slider
                    value={[(selectedObject.opacity || 1) * 100]}
                    onValueChange={(value) => {
                      selectedObject.set('opacity', value[0] / 100);
                      canvas?.renderAll();
                    }}
                    min={0}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={duplicateSelected}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-editor-border text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    onClick={deleteSelected}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card className="bg-editor-dark border-editor-border">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-4">Actions</h3>
            
            <div className="space-y-2">
              <Button
                onClick={handleSave}
                size="sm"
                className="w-full bg-crd-blue hover:bg-crd-blue/90 text-white"
              >
                Save Design
              </Button>
              
              <Button
                onClick={handleExport}
                size="sm"
                className="w-full bg-crd-green hover:bg-crd-green/90 text-black"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Card
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Canvas Area */}
      <div className="lg:col-span-3">
        <Card className="bg-editor-dark border-editor-border h-full">
          <CardContent className="p-6 flex items-center justify-center h-full">
            <FabricCanvasComponent
              width={750}
              height={1050}
              showGrid={true}
              showEffects={false}
              onCanvasReady={setCanvas}
            />
          </CardContent>
        </Card>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
    </div>
  );
};

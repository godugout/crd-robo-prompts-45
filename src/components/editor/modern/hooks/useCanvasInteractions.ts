
import { useCallback } from 'react';
import { Circle, Rect, FabricText } from 'fabric';
import { useModernEditor } from '../context/ModernEditorContext';
import { toast } from 'sonner';
import type { Canvas as FabricCanvas } from 'fabric';

export const useCanvasInteractions = (fabricCanvas: FabricCanvas | null) => {
  const { selectedTool } = useModernEditor();

  // Handle canvas clicks for shape creation
  const handleCanvasClick = useCallback((e: any) => {
    if (!fabricCanvas || selectedTool === 'select' || selectedTool === 'pen') return;

    const pointer = fabricCanvas.getPointer(e.e);
    let newObject;

    switch (selectedTool) {
      case 'rectangle':
        newObject = new Rect({
          left: pointer.x - 50,
          top: pointer.y - 25,
          width: 100,
          height: 50,
          fill: '#4ECDC4',
          stroke: '#45B7D1',
          strokeWidth: 2,
        });
        break;
      case 'circle':
        newObject = new Circle({
          left: pointer.x - 30,
          top: pointer.y - 30,
          radius: 30,
          fill: '#FF6B6B',
          stroke: '#E55353',
          strokeWidth: 2,
        });
        break;
      case 'text':
        newObject = new FabricText('Text', {
          left: pointer.x,
          top: pointer.y,
          fontSize: 20,
          fill: '#333333',
          fontFamily: 'Arial',
        });
        break;
    }

    if (newObject) {
      fabricCanvas.add(newObject);
      fabricCanvas.setActiveObject(newObject);
      fabricCanvas.renderAll();
      toast.success(`${selectedTool} added to canvas`);
    }
  }, [fabricCanvas, selectedTool]);

  // Handle drag and drop from left panel
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!fabricCanvas) return;

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = fabricCanvas.getElement().getBoundingClientRect();
      const pointer = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      let newObject;

      if (data.type === 'shape') {
        switch (data.shape) {
          case 'rectangle':
            newObject = new Rect({
              left: pointer.x - 50,
              top: pointer.y - 25,
              width: 100,
              height: 50,
              fill: '#4ECDC4',
              stroke: '#45B7D1',
              strokeWidth: 2,
            });
            break;
          case 'circle':
            newObject = new Circle({
              left: pointer.x - 30,
              top: pointer.y - 30,
              radius: 30,
              fill: '#FF6B6B',
              stroke: '#E55353',
              strokeWidth: 2,
            });
            break;
        }
      } else if (data.type === 'text') {
        const fontSize = data.textType === 'heading' ? 24 : data.textType === 'body' ? 16 : 12;
        newObject = new FabricText(data.textType === 'heading' ? 'Heading' : data.textType === 'body' ? 'Body Text' : 'Caption', {
          left: pointer.x,
          top: pointer.y,
          fontSize,
          fill: '#333333',
          fontFamily: 'Arial',
          fontWeight: data.textType === 'heading' ? 'bold' : 'normal',
        });
      }

      if (newObject) {
        fabricCanvas.add(newObject);
        fabricCanvas.setActiveObject(newObject);
        fabricCanvas.renderAll();
        toast.success(`${data.type} added to canvas`);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }, [fabricCanvas]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return {
    handleCanvasClick,
    handleDrop,
    handleDragOver
  };
};

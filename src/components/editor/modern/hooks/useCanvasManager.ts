
import { useRef, useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useModernEditor } from '../context/ModernEditorContext';

export const useCanvasManager = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  
  const { selectedTool, setSelectedElement, cardEditor } = useModernEditor();

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    // Dispose existing canvas if it exists
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
    }

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      selection: selectedTool === 'select',
    });

    // Properly initialize the drawing brush after canvas creation
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = '#000000';
      canvas.freeDrawingBrush.width = 2;
    }

    fabricCanvasRef.current = canvas;
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

    // Auto-save changes
    canvas.on('object:modified', () => {
      if (cardEditor) {
        const canvasData = JSON.stringify(canvas.toJSON());
        cardEditor.updateDesignMetadata('canvasData', canvasData);
      }
    });

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []); // Remove dependencies to prevent re-initialization

  // Update canvas based on selected tool
  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = selectedTool === 'pen';
    fabricCanvas.selection = selectedTool === 'select';
    
    // Ensure brush exists before setting properties
    if (selectedTool === 'pen' && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = '#000000';
      fabricCanvas.freeDrawingBrush.width = 2;
    }
    
    fabricCanvas.forEachObject((obj) => {
      obj.selectable = selectedTool === 'select';
      obj.evented = selectedTool === 'select';
    });
    fabricCanvas.renderAll();
  }, [selectedTool, fabricCanvas]);

  return {
    canvasRef,
    fabricCanvas
  };
};

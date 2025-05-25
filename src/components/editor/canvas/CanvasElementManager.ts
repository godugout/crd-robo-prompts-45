
import { FabricObject, Circle, Rect, FabricText, FabricImage } from 'fabric';

export interface CanvasElement {
  id: string;
  type: 'shape' | 'text' | 'background' | 'image';
  fabricObject: FabricObject;
}

export class CanvasElementManager {
  private elements: Map<string, CanvasElement> = new Map();
  
  generateId(): string {
    return `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  addShape(canvas: any, shapeType: string, options: any = {}) {
    const id = this.generateId();
    let fabricObject: FabricObject;

    const defaultOptions = {
      left: canvas.width / 2 - 25,
      top: canvas.height / 2 - 25,
      originX: 'center',
      originY: 'center',
      ...options
    };

    switch (shapeType) {
      case 'circle':
        fabricObject = new Circle({
          ...defaultOptions,
          radius: 25,
          fill: '#3b82f6',
          stroke: '#1d4ed8',
          strokeWidth: 2
        });
        break;
      case 'square':
        fabricObject = new Rect({
          ...defaultOptions,
          width: 50,
          height: 50,
          fill: '#10b981',
          stroke: '#059669',
          strokeWidth: 2
        });
        break;
      case 'triangle':
        fabricObject = new FabricText('▲', {
          ...defaultOptions,
          fontSize: 40,
          fill: '#8b5cf6',
          fontFamily: 'Arial'
        });
        break;
      case 'star':
        fabricObject = new FabricText('★', {
          ...defaultOptions,
          fontSize: 40,
          fill: '#f59e0b',
          fontFamily: 'Arial'
        });
        break;
      case 'diamond':
        fabricObject = new FabricText('◆', {
          ...defaultOptions,
          fontSize: 40,
          fill: '#ec4899',
          fontFamily: 'Arial'
        });
        break;
      case 'hexagon':
        fabricObject = new FabricText('⬢', {
          ...defaultOptions,
          fontSize: 40,
          fill: '#06b6d4',
          fontFamily: 'Arial'
        });
        break;
      default:
        fabricObject = new Circle({
          ...defaultOptions,
          radius: 25,
          fill: '#6b7280'
        });
    }

    fabricObject.set('id', id);
    canvas.add(fabricObject);
    canvas.setActiveObject(fabricObject);
    canvas.renderAll();

    const element: CanvasElement = {
      id,
      type: 'shape',
      fabricObject
    };

    this.elements.set(id, element);
    return element;
  }

  addText(canvas: any, textType: string, options: any = {}) {
    const id = this.generateId();
    
    const textContent = textType === 'title' ? 'Card Title' : 'Subtitle Text';
    const fontSize = textType === 'title' ? 24 : 16;
    
    const fabricObject = new FabricText(textContent, {
      left: canvas.width / 2,
      top: canvas.height / 2,
      originX: 'center',
      originY: 'center',
      fontSize,
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontWeight: textType === 'title' ? 'bold' : 'normal',
      ...options
    });

    fabricObject.set('id', id);
    canvas.add(fabricObject);
    canvas.setActiveObject(fabricObject);
    canvas.renderAll();

    const element: CanvasElement = {
      id,
      type: 'text',
      fabricObject
    };

    this.elements.set(id, element);
    return element;
  }

  addBackground(canvas: any, gradientName: string) {
    const gradients = {
      'galaxy-nebula': ['#581c87', '#1e3a8a', '#581c87'],
      'sunset-glow': ['#f97316', '#dc2626', '#ec4899'],
      'ocean-deep': ['#2563eb', '#06b6d4', '#14b8a6'],
      'forest-mist': ['#16a34a', '#10b981', '#22c55e']
    };

    const colors = gradients[gradientName as keyof typeof gradients] || gradients['galaxy-nebula'];
    
    canvas.setBackgroundColor({
      type: 'linear',
      coords: { x1: 0, y1: 0, x2: canvas.width, y2: canvas.height },
      colorStops: [
        { offset: 0, color: colors[0] },
        { offset: 0.5, color: colors[1] },
        { offset: 1, color: colors[2] }
      ]
    }, () => {
      canvas.renderAll();
    });
  }

  removeElement(canvas: any, elementId: string) {
    const element = this.elements.get(elementId);
    if (element) {
      canvas.remove(element.fabricObject);
      this.elements.delete(elementId);
      canvas.renderAll();
    }
  }

  getElement(elementId: string): CanvasElement | undefined {
    return this.elements.get(elementId);
  }

  getAllElements(): CanvasElement[] {
    return Array.from(this.elements.values());
  }

  clearAll(canvas: any) {
    canvas.clear();
    this.elements.clear();
  }
}

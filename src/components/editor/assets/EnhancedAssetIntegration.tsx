
import React, { useState, useEffect } from 'react';
import { Canvas as FabricCanvas, FabricImage } from 'fabric';
import { toast } from 'sonner';

interface EnhancedAssetIntegrationProps {
  fabricCanvas: FabricCanvas | null;
}

interface AssetData {
  id: string;
  name: string;
  url: string;
  category: string;
  thumbnail: string;
  tags?: string[];
  size?: { width: number; height: number };
}

export const EnhancedAssetIntegration = ({ fabricCanvas }: EnhancedAssetIntegrationProps) => {
  const [availableAssets, setAvailableAssets] = useState<AssetData[]>([]);
  const [draggedAsset, setDraggedAsset] = useState<AssetData | null>(null);

  useEffect(() => {
    loadCuratedAssets();
  }, []);

  const loadCuratedAssets = () => {
    const curatedAssets: AssetData[] = [
      // Tech & Digital
      {
        id: 'tech-circuit-1',
        name: 'Circuit Board',
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
        category: 'tech',
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80',
        tags: ['technology', 'circuit', 'electronic'],
        size: { width: 400, height: 300 }
      },
      {
        id: 'tech-matrix-1',
        name: 'Digital Matrix',
        url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80',
        category: 'tech',
        thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&q=80',
        tags: ['code', 'programming', 'digital'],
        size: { width: 400, height: 600 }
      },
      {
        id: 'tech-neon-1',
        name: 'Neon Aesthetic',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
        category: 'neon',
        thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80',
        tags: ['neon', 'glow', 'cyberpunk'],
        size: { width: 400, height: 400 }
      },
      // Nature & Landscapes
      {
        id: 'nature-mountain-1',
        name: 'Mountain Lake',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80',
        category: 'nature',
        thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&q=80',
        tags: ['mountain', 'lake', 'nature'],
        size: { width: 600, height: 400 }
      },
      {
        id: 'nature-forest-1',
        name: 'Misty Forest',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
        category: 'nature',
        thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80',
        tags: ['forest', 'mist', 'trees'],
        size: { width: 600, height: 400 }
      },
      // Abstract & Art
      {
        id: 'abstract-colorful-1',
        name: 'Abstract Colorful',
        url: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&q=80',
        category: 'abstract',
        thumbnail: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=200&q=80',
        tags: ['abstract', 'colorful', 'art'],
        size: { width: 400, height: 400 }
      },
      {
        id: 'abstract-geometric-1',
        name: 'Geometric Patterns',
        url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&q=80',
        category: 'abstract',
        thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=200&q=80',
        tags: ['geometric', 'pattern', 'digital'],
        size: { width: 400, height: 400 }
      },
      // Space & Cosmic
      {
        id: 'space-galaxy-1',
        name: 'Galaxy Nebula',
        url: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&q=80',
        category: 'space',
        thumbnail: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=200&q=80',
        tags: ['space', 'galaxy', 'nebula'],
        size: { width: 600, height: 400 }
      },
      {
        id: 'space-planet-1',
        name: 'Planet Surface',
        url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80',
        category: 'space',
        thumbnail: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200&q=80',
        tags: ['planet', 'space', 'cosmic'],
        size: { width: 600, height: 400 }
      }
    ];

    setAvailableAssets(curatedAssets);
  };

  const addAssetToCanvas = async (asset: AssetData, position?: { x: number; y: number }) => {
    if (!fabricCanvas) {
      toast.error('Canvas not ready');
      return;
    }

    try {
      const img = await FabricImage.fromURL(asset.url);
      
      // Calculate optimal size for canvas
      const canvasWidth = fabricCanvas.width || 320;
      const canvasHeight = fabricCanvas.height || 420;
      const maxWidth = canvasWidth * 0.6;
      const maxHeight = canvasHeight * 0.6;
      
      const scaleX = maxWidth / img.width!;
      const scaleY = maxHeight / img.height!;
      const scale = Math.min(scaleX, scaleY, 1); // Don't upscale
      
      img.scale(scale);
      
      // Position the image
      const x = position?.x || Math.random() * (canvasWidth - img.getScaledWidth());
      const y = position?.y || Math.random() * (canvasHeight - img.getScaledHeight());
      
      img.set({
        left: x,
        top: y,
        cornerStyle: 'circle',
        cornerColor: '#16a085',
        cornerSize: 8,
        transparentCorners: false,
        borderColor: '#16a085',
        borderScaleFactor: 2,
        // Store asset metadata
        assetId: asset.id,
        assetName: asset.name,
        assetCategory: asset.category,
      });
      
      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
      fabricCanvas.renderAll();
      
      toast.success(`Added "${asset.name}" to canvas`);
    } catch (error) {
      console.error('Failed to add asset:', error);
      toast.error(`Failed to add "${asset.name}" to canvas`);
    }
  };

  const handleDragStart = (asset: AssetData) => {
    setDraggedAsset(asset);
  };

  const handleDragEnd = () => {
    setDraggedAsset(null);
  };

  const handleCanvasDrop = (event: DragEvent) => {
    if (!draggedAsset || !fabricCanvas) return;
    
    event.preventDefault();
    
    // Get canvas coordinates
    const canvasElement = fabricCanvas.getElement();
    const rect = canvasElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    addAssetToCanvas(draggedAsset, { x, y });
  };

  // Setup canvas drop handling
  useEffect(() => {
    if (!fabricCanvas) return;
    
    const canvasElement = fabricCanvas.getElement();
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'copy';
    };
    
    canvasElement.addEventListener('dragover', handleDragOver);
    canvasElement.addEventListener('drop', handleCanvasDrop);
    
    return () => {
      canvasElement.removeEventListener('dragover', handleDragOver);
      canvasElement.removeEventListener('drop', handleCanvasDrop);
    };
  }, [fabricCanvas, draggedAsset]);

  // Make assets and functions available globally
  useEffect(() => {
    if (window) {
      (window as any).addAssetToCanvas = addAssetToCanvas;
      (window as any).availableAssets = availableAssets;
      (window as any).handleAssetDragStart = handleDragStart;
      (window as any).handleAssetDragEnd = handleDragEnd;
    }
  }, [fabricCanvas, availableAssets]);

  return null; // This component manages asset integration logic
};

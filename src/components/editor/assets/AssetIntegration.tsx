
import React, { useState, useEffect } from 'react';
import { Canvas as FabricCanvas, FabricImage } from 'fabric';
import { toast } from 'sonner';

interface AssetIntegrationProps {
  fabricCanvas: FabricCanvas | null;
}

export const AssetIntegration = ({ fabricCanvas }: AssetIntegrationProps) => {
  const [availableAssets, setAvailableAssets] = useState<any[]>([]);

  useEffect(() => {
    // Load curated assets from Unsplash and local sources
    loadAssets();
  }, []);

  const loadAssets = () => {
    const unsplashAssets = [
      {
        id: 'tech-1',
        name: 'Circuit Board',
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
        category: 'tech',
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80'
      },
      {
        id: 'nature-1',
        name: 'Mountain Lake',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80',
        category: 'nature',
        thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&q=80'
      },
      {
        id: 'abstract-1',
        name: 'Digital Art',
        url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&q=80',
        category: 'abstract',
        thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=200&q=80'
      },
      {
        id: 'neon-1',
        name: 'Neon Aesthetic',
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
        category: 'neon',
        thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80'
      },
      {
        id: 'code-1',
        name: 'Programming',
        url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80',
        category: 'tech',
        thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&q=80'
      },
      {
        id: 'colorful-1',
        name: 'Abstract Colorful',
        url: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&q=80',
        category: 'abstract',
        thumbnail: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=200&q=80'
      }
    ];

    setAvailableAssets(unsplashAssets);
  };

  const addAssetToCanvas = async (asset: any) => {
    if (!fabricCanvas) {
      toast.error('Canvas not ready');
      return;
    }

    try {
      const img = await FabricImage.fromURL(asset.url);
      
      // Scale image to fit canvas while maintaining aspect ratio
      const canvasWidth = fabricCanvas.width || 320;
      const canvasHeight = fabricCanvas.height || 420;
      const maxWidth = canvasWidth * 0.4;
      const maxHeight = canvasHeight * 0.4;
      
      const scaleX = maxWidth / img.width!;
      const scaleY = maxHeight / img.height!;
      const scale = Math.min(scaleX, scaleY);
      
      img.scale(scale);
      img.set({
        left: 50,
        top: 50,
        cornerStyle: 'circle',
        cornerColor: '#16a085',
        cornerSize: 8,
        transparentCorners: false,
      });
      
      fabricCanvas.add(img);
      fabricCanvas.setActiveObject(img);
      fabricCanvas.renderAll();
      
      toast.success(`Added ${asset.name} to canvas`);
    } catch (error) {
      console.error('Failed to add asset:', error);
      toast.error('Failed to add asset to canvas');
    }
  };

  // Make assets available globally for the asset cards to use
  useEffect(() => {
    if (window) {
      (window as any).addAssetToCanvas = addAssetToCanvas;
      (window as any).availableAssets = availableAssets;
    }
  }, [fabricCanvas, availableAssets]);

  return null; // This component manages asset integration logic
};

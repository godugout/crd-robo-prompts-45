import React, { useEffect } from 'react';
import { Canvas as FabricCanvas, FabricImage, FabricText, Rect } from 'fabric';
import { toast } from 'sonner';

interface TemplateRendererProps {
  templateId: string;
  fabricCanvas: FabricCanvas | null;
  cardData: any;
}

export const TemplateRenderer = ({ templateId, fabricCanvas, cardData }: TemplateRendererProps) => {
  useEffect(() => {
    if (!fabricCanvas) return;
    
    renderTemplate(templateId, fabricCanvas, cardData);
  }, [templateId, fabricCanvas, cardData]);

  const renderTemplate = async (template: string, canvas: FabricCanvas, data: any) => {
    // Clear existing template elements (but keep user-added elements)
    const objects = canvas.getObjects();
    objects.forEach(obj => {
      if (obj.get('isTemplate')) {
        canvas.remove(obj);
      }
    });

    let templateConfig;
    
    switch (template) {
      case 'template1': // Cardshow Nostalgia
        templateConfig = {
          background: '#1a1a2e',
          primaryColor: '#16a085',
          accent: '#eee',
          layout: 'vintage'
        };
        break;
      case 'template2': // Classic Cardboard
        templateConfig = {
          background: '#f4f1de',
          primaryColor: '#e07a5f',
          accent: '#3d405b',
          layout: 'classic'
        };
        break;
      case 'template3': // Nifty Framework
        templateConfig = {
          background: '#2d1b69',
          primaryColor: '#8e44ad',
          accent: '#f39c12',
          layout: 'modern'
        };
        break;
      case 'template4': // Synthwave Dreams
        templateConfig = {
          background: '#0f0f23',
          primaryColor: '#ff006e',
          accent: '#8338ec',
          layout: 'synthwave'
        };
        break;
      default:
        templateConfig = {
          background: '#ffffff',
          primaryColor: '#000000',
          accent: '#666666',
          layout: 'basic'
        };
    }

    // Set background
    canvas.backgroundColor = templateConfig.background;

    // Add template-specific elements
    await addTemplateElements(canvas, templateConfig, data);
    
    canvas.renderAll();
    toast.success(`Template "${template}" applied`);
  };

  const addTemplateElements = async (canvas: FabricCanvas, config: any, data: any) => {
    const { width, height } = canvas;
    
    // Add border
    const border = new Rect({
      left: 10,
      top: 10,
      width: width - 20,
      height: height - 20,
      fill: 'transparent',
      stroke: config.primaryColor,
      strokeWidth: 3,
      isTemplate: true,
      selectable: false,
    });
    canvas.add(border);

    // Add title area
    if (data.title) {
      const titleText = new FabricText(data.title, {
        left: 30,
        top: 30,
        fontSize: 24,
        fill: config.primaryColor,
        fontFamily: 'Arial Black',
        fontWeight: 'bold',
        isTemplate: true,
      });
      canvas.add(titleText);
    }

    // Add description area
    if (data.description) {
      const descText = new FabricText(data.description, {
        left: 30,
        top: height - 80,
        fontSize: 12,
        fill: config.accent,
        fontFamily: 'Arial',
        width: width - 60,
        isTemplate: true,
      });
      canvas.add(descText);
    }

    // Add series/type indicator
    if (data.series) {
      const seriesText = new FabricText(data.series.toUpperCase(), {
        left: 30,
        top: 70,
        fontSize: 10,
        fill: config.accent,
        fontFamily: 'Arial',
        letterSpacing: 2,
        isTemplate: true,
      });
      canvas.add(seriesText);
    }

    // Add rarity indicator
    if (data.rarity) {
      const rarityColor = getRarityColor(data.rarity);
      const rarityBadge = new Rect({
        left: width - 80,
        top: 20,
        width: 60,
        height: 20,
        fill: rarityColor,
        rx: 10,
        ry: 10,
        isTemplate: true,
        selectable: false,
      });
      canvas.add(rarityBadge);

      const rarityText = new FabricText(data.rarity.toUpperCase(), {
        left: width - 75,
        top: 25,
        fontSize: 8,
        fill: '#ffffff',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        isTemplate: true,
      });
      canvas.add(rarityText);
    }
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: '#8e8e93',
      uncommon: '#32d74b',
      rare: '#007aff',
      legendary: '#af52de',
      mythic: '#ff9500'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  return null; // This component doesn't render anything directly
};

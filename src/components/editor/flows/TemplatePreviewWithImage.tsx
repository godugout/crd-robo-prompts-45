
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface TemplatePreviewWithImageProps {
  templateId: string;
  templateName: string;
  currentImageUrl?: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const TemplatePreviewWithImage: React.FC<TemplatePreviewWithImageProps> = ({
  templateId,
  templateName,
  currentImageUrl,
  isSelected,
  onSelect
}) => {
  const getTemplateStyle = (id: string) => {
    const styles: Record<string, any> = {
      'template1': {
        background: 'linear-gradient(135deg, #16a085 0%, #3498db 100%)',
        headerColor: '#16a085',
        footerColor: '#34495e',
        textColor: '#fff'
      },
      'template2': {
        background: 'linear-gradient(135deg, #e67e22 0%, #e74c3c 100%)',
        headerColor: '#e67e22',
        footerColor: '#34495e',
        textColor: '#fff'
      },
      'template3': {
        background: 'linear-gradient(135deg, #8e44ad 0%, #e91e63 100%)',
        headerColor: '#8e44ad',
        footerColor: '#f39c12',
        textColor: '#fff'
      },
      'template4': {
        background: 'linear-gradient(135deg, #00bcd4 0%, #9c27b0 100%)',
        headerColor: '#ff006e',
        footerColor: '#8338ec',
        textColor: '#fff'
      }
    };
    return styles[id] || styles['template1'];
  };

  const style = getTemplateStyle(templateId);

  return (
    <Card 
      className={`relative cursor-pointer transition-all duration-200 overflow-hidden ${
        isSelected 
          ? 'ring-2 ring-crd-green shadow-lg scale-105' 
          : 'hover:scale-102 hover:shadow-md border-editor-border'
      }`}
      onClick={onSelect}
    >
      <div className="aspect-[3/4] relative" style={{ background: style.background }}>
        {/* Template Frame */}
        <div className="absolute inset-2 border-2 border-white/20 rounded-lg overflow-hidden">
          {/* User's Image */}
          {currentImageUrl ? (
            <div className="w-full h-full relative">
              <img 
                src={currentImageUrl}
                alt="Your image"
                className="w-full h-full object-cover"
              />
              {/* Frame overlay */}
              <div className="absolute inset-0 bg-black/5"></div>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-800/50 flex items-center justify-center">
              <div className="text-center text-white/70">
                <div className="text-xs">Your Image</div>
                <div className="text-xs">Will Appear Here</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Header */}
        <div 
          className="absolute top-2 left-2 right-2 h-6 rounded flex items-center justify-center"
          style={{ backgroundColor: style.headerColor }}
        >
          <span className="text-white text-xs font-bold">HEADER</span>
        </div>
        
        {/* Footer */}
        <div 
          className="absolute bottom-2 left-2 right-2 h-4 rounded flex items-center justify-center"
          style={{ backgroundColor: style.footerColor }}
        >
          <span className="text-white text-xs">Footer</span>
        </div>
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        )}
        
        {/* Template name overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <p className="text-white text-xs font-medium truncate">{templateName}</p>
        </div>
      </div>
    </Card>
  );
};

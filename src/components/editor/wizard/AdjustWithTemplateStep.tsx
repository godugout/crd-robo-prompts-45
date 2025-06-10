
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Crop, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Move3D,
  Search,
  Sparkles,
  ArrowRight,
  Target,
  Eye
} from 'lucide-react';
import { SmartCardFitter } from '@/components/card-editor/enhanced/SmartCardFitter';
import { TemplateFilters } from './TemplateFilters';
import type { TemplateConfig } from './wizardConfig';
import { toast } from 'sonner';

interface ImageAdjustments {
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  enhancements: {
    brightness: number;
    contrast: number;
    saturation: number;
  };
}

interface AdjustWithTemplateStepProps {
  selectedPhoto: string;
  templates: TemplateConfig[];
  selectedTemplate: TemplateConfig | null;
  onTemplateSelect: (template: TemplateConfig) => void;
  onImageAdjusted: (adjustedImageUrl: string) => void;
}

export const AdjustWithTemplateStep: React.FC<AdjustWithTemplateStepProps> = ({
  selectedPhoto,
  templates,
  selectedTemplate,
  onTemplateSelect,
  onImageAdjusted
}) => {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
    enhancements: {
      brightness: 100,
      contrast: 100,
      saturation: 100
    }
  });
  const [showGrid, setShowGrid] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  // Load image
  useEffect(() => {
    if (selectedPhoto) {
      const img = new Image();
      img.onload = () => setImageElement(img);
      img.src = selectedPhoto;
    }
  }, [selectedPhoto]);

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(templates.map(t => t.category))).sort();
  }, [templates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      if (selectedCategory && template.category !== selectedCategory) return false;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          template.name.toLowerCase().includes(search) ||
          template.description.toLowerCase().includes(search) ||
          template.tags.some(tag => tag.toLowerCase().includes(search))
        );
      }
      if (showPremiumOnly && !template.is_premium) return false;
      return true;
    });
  }, [templates, selectedCategory, searchTerm, showPremiumOnly]);

  const handleAdjustmentsChange = useCallback((updates: Partial<ImageAdjustments>) => {
    setAdjustments(prev => ({ ...prev, ...updates }));
  }, []);

  const handleTemplateSelect = useCallback((template: TemplateConfig) => {
    onTemplateSelect(template);
    toast.success(`${template.name} template selected!`);
  }, [onTemplateSelect]);

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSearchTerm('');
    setShowPremiumOnly(false);
  };

  const handleApplyAdjustments = () => {
    if (!imageElement) return;

    // Create canvas to apply adjustments
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size to card aspect ratio
    const targetAspectRatio = 2.5 / 3.5;
    const outputWidth = 750;
    const outputHeight = outputWidth / targetAspectRatio;
    
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Apply transformations
    ctx.save();
    
    // Apply enhancements
    const { brightness, contrast, saturation } = adjustments.enhancements;
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    
    // Apply rotation and position
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.translate(centerX, centerY);
    ctx.rotate((adjustments.rotation * Math.PI) / 180);
    ctx.scale(adjustments.scale, adjustments.scale);
    ctx.translate(-centerX + adjustments.position.x, -centerY + adjustments.position.y);
    
    // Draw image
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // Convert to data URL and pass to parent
    const adjustedImageUrl = canvas.toDataURL('image/png', 0.9);
    onImageAdjusted(adjustedImageUrl);
    toast.success('Image adjusted and ready!');
  };

  const renderTemplatePreview = (template: TemplateConfig) => (
    <Card
      key={template.id}
      className={`cursor-pointer transition-all duration-300 ${
        selectedTemplate?.id === template.id 
          ? 'ring-2 ring-crd-green scale-105 bg-editor-tool' 
          : 'bg-editor-dark hover:bg-editor-tool'
      } border-editor-border`}
      onClick={() => handleTemplateSelect(template)}
    >
      <CardContent className="p-3">
        <div className="aspect-[3/4] bg-gradient-to-br from-crd-mediumGray to-crd-lightGray rounded-lg mb-3 relative overflow-hidden">
          {/* Show user's image in template if selected */}
          {selectedTemplate?.id === template.id && imageElement ? (
            <div className="w-full h-full relative">
              <img 
                src={selectedPhoto} 
                alt="Your image"
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(${adjustments.scale}) rotate(${adjustments.rotation}deg) translate(${adjustments.position.x}px, ${adjustments.position.y}px)`,
                  filter: `brightness(${adjustments.enhancements.brightness}%) contrast(${adjustments.enhancements.contrast}%) saturate(${adjustments.enhancements.saturation}%)`
                }}
              />
              <div className="absolute inset-2 border-4 rounded" style={{ borderColor: template.default_colors.border }} />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-crd-mediumGray to-crd-lightGray flex items-center justify-center">
              <Eye className="w-8 h-8 text-crd-lightGray" />
            </div>
          )}
          
          {selectedTemplate?.id === template.id && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-crd-green rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-crd-dark" />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-crd-white font-semibold text-sm mb-1">{template.name}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-editor-border text-crd-lightGray">
              {template.category}
            </Badge>
            {template.is_premium && (
              <Badge className="text-xs bg-yellow-500/20 text-yellow-500 border-yellow-500">
                Premium
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-crd-white mb-2">Adjust Your Image & Choose Template</h2>
        <p className="text-crd-lightGray">Perfect your image while previewing it in different templates</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Image Editor - Left Side */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-editor-dark border-editor-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Image Adjustment</h3>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={showGrid ? "default" : "outline"}
                    onClick={() => setShowGrid(!showGrid)}
                    className={showGrid ? "bg-crd-green text-crd-dark" : "border-editor-border text-crd-lightGray"}
                  >
                    <Target className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {imageElement ? (
                <SmartCardFitter
                  image={imageElement}
                  adjustments={adjustments}
                  onAdjustmentsChange={handleAdjustmentsChange}
                  showGrid={showGrid}
                  targetAspectRatio={2.5 / 3.5}
                />
              ) : (
                <div className="aspect-[4/3] bg-editor-tool rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Crop className="w-8 h-8 text-crd-lightGray mx-auto mb-2" />
                    <p className="text-crd-lightGray">Loading image...</p>
                  </div>
                </div>
              )}

              {/* Quick Adjustment Controls */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAdjustmentsChange({ scale: Math.min(3, adjustments.scale * 1.1) })}
                  className="border-editor-border text-crd-lightGray"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAdjustmentsChange({ scale: Math.max(0.1, adjustments.scale * 0.9) })}
                  className="border-editor-border text-crd-lightGray"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAdjustmentsChange({ rotation: adjustments.rotation + 90 })}
                  className="border-editor-border text-crd-lightGray"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAdjustmentsChange({ position: { x: 0, y: 0 }, scale: 1, rotation: 0 })}
                  className="border-editor-border text-crd-lightGray"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Template Selection - Right Side */}
        <div className="space-y-4">
          <Card className="bg-editor-dark border-editor-border">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-4">Choose Template</h3>
              
              {/* Compact Filters */}
              <div className="space-y-3 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-crd-lightGray" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-editor-tool border-editor-border text-crd-white text-sm"
                  />
                </div>
                
                <div className="flex flex-wrap gap-1">
                  <Button
                    size="sm"
                    variant={selectedCategory === null ? "default" : "outline"}
                    onClick={() => setSelectedCategory(null)}
                    className={selectedCategory === null ? "bg-crd-green text-crd-dark text-xs" : "border-editor-border text-crd-lightGray text-xs"}
                  >
                    All
                  </Button>
                  {categories.slice(0, 3).map((category) => (
                    <Button
                      key={category}
                      size="sm"
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "bg-crd-green text-crd-dark text-xs" : "border-editor-border text-crd-lightGray text-xs"}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {filteredTemplates.slice(0, 8).map(renderTemplatePreview)}
              </div>
              
              <p className="text-xs text-crd-lightGray mt-2 text-center">
                {filteredTemplates.length} templates available
              </p>
            </CardContent>
          </Card>

          {/* Selected Template Info */}
          {selectedTemplate && (
            <Card className="bg-editor-tool border-editor-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-crd-green" />
                  <h4 className="text-crd-white font-medium text-sm">Selected Template</h4>
                </div>
                <p className="text-crd-green text-sm font-medium">{selectedTemplate.name}</p>
                <p className="text-crd-lightGray text-xs">{selectedTemplate.description}</p>
                
                <Button
                  onClick={handleApplyAdjustments}
                  className="w-full mt-3 bg-crd-green hover:bg-crd-green/90 text-crd-dark text-sm"
                >
                  Apply & Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Instructions */}
      <Card className="bg-editor-darker border-editor-border">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-crd-blue/20 rounded-lg flex-shrink-0 flex items-center justify-center">
              <Move3D className="w-4 h-4 text-crd-blue" />
            </div>
            <div>
              <h4 className="text-crd-white font-medium text-sm mb-1">How to use</h4>
              <ul className="text-crd-lightGray text-xs space-y-1">
                <li>• Click and drag the image to reposition it</li>
                <li>• Scroll to zoom in/out on the image</li>
                <li>• Select a template to see how your image looks</li>
                <li>• Use the adjustment buttons for quick changes</li>
                <li>• Green boundary shows the final card area</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

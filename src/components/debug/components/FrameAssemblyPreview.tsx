
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CRDFrameRenderer } from '@/components/frames/crd/CRDFrameRenderer';
import { Eye, Grid, Info } from 'lucide-react';

interface CRDElementDraft {
  id: string;
  layerId: string;
  name: string;
  type: 'border' | 'logo' | 'label' | 'decorative' | 'corner' | 'accent';
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  zIndex: number;
  opacity: number;
  rotation: number;
  scale: number;
  imageUrl: string;
}

interface FrameAssemblyPreviewProps {
  elements: CRDElementDraft[];
  debugMode: boolean;
}

export const FrameAssemblyPreview: React.FC<FrameAssemblyPreviewProps> = ({
  elements,
  debugMode
}) => {
  // Convert CRD elements to frame format
  const previewFrame = {
    id: 'preview-frame',
    name: 'Preview Frame',
    description: 'Live preview of assembled frame',
    category: 'preview',
    rarity: 'common' as const,
    totalDimensions: { width: 400, height: 560 },
    placeholderDimensions: { x: 30, y: 40, width: 340, height: 280 },
    elements: elements.map(element => ({
      id: element.id,
      name: element.name,
      type: element.type,
      imageUrl: element.imageUrl,
      zIndex: element.zIndex,
      position: element.position,
      dimensions: element.dimensions,
      opacity: element.opacity,
      rotation: element.rotation,
      scale: element.scale
    }))
  };

  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Frame Preview */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Assembled Frame Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="relative">
            <CRDFrameRenderer
              frame={previewFrame}
              userImage="/lovable-uploads/50e48a4f-d7f6-46df-b6bb-93287588484d.png"
              width={300}
              height={420}
              interactive={false}
            />

            {/* Debug Overlay */}
            {debugMode && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Placeholder Area Outline */}
                <div 
                  className="absolute border-2 border-dashed border-crd-green"
                  style={{
                    left: `${(previewFrame.placeholderDimensions.x / previewFrame.totalDimensions.width) * 100}%`,
                    top: `${(previewFrame.placeholderDimensions.y / previewFrame.totalDimensions.height) * 100}%`,
                    width: `${(previewFrame.placeholderDimensions.width / previewFrame.totalDimensions.width) * 100}%`,
                    height: `${(previewFrame.placeholderDimensions.height / previewFrame.totalDimensions.height) * 100}%`
                  }}
                />

                {/* Element Outlines */}
                {elements.map((element) => (
                  <div
                    key={element.id}
                    className="absolute border border-red-400 bg-red-400/10"
                    style={{
                      left: `${(element.position.x / previewFrame.totalDimensions.width) * 100}%`,
                      top: `${(element.position.y / previewFrame.totalDimensions.height) * 100}%`,
                      width: `${(element.dimensions.width / previewFrame.totalDimensions.width) * 100}%`,
                      height: `${(element.dimensions.height / previewFrame.totalDimensions.height) * 100}%`,
                      zIndex: element.zIndex
                    }}
                  >
                    <div className="absolute -top-6 left-0 bg-red-400 text-white text-xs px-1 rounded">
                      {element.name} (Z:{element.zIndex})
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Element Stack Order */}
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Grid className="w-5 h-5" />
            Layer Stack Order
          </CardTitle>
          <p className="text-gray-400 text-sm">Elements ordered by Z-index (bottom to top)</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedElements.map((element, index) => (
            <div
              key={element.id}
              className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white text-sm font-mono">
                  {index + 1}
                </div>
                
                <div>
                  <div className="text-white font-medium">{element.name}</div>
                  <div className="text-gray-400 text-sm">
                    {element.dimensions.width} × {element.dimensions.height} px
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-gray-300 border-gray-500">
                  {element.type}
                </Badge>
                <Badge className="bg-crd-green text-black">
                  Z: {element.zIndex}
                </Badge>
              </div>
            </div>
          ))}

          {elements.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No elements to display</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Frame Statistics */}
      <Card className="border-gray-700 bg-gray-800/50 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Info className="w-5 h-5" />
            Frame Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-crd-green">{elements.length}</div>
              <div className="text-gray-400 text-sm">Total Elements</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {elements.filter(el => el.type === 'border').length}
              </div>
              <div className="text-gray-400 text-sm">Borders</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {elements.filter(el => el.type === 'logo').length}
              </div>
              <div className="text-gray-400 text-sm">Logos</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {elements.filter(el => el.type === 'decorative').length}
              </div>
              <div className="text-gray-400 text-sm">Decorative</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
            <h4 className="text-white font-medium mb-2">Frame Dimensions</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Total Size:</span>
                <span className="text-white ml-2">400 × 560 px</span>
              </div>
              <div>
                <span className="text-gray-400">Placeholder:</span>
                <span className="text-white ml-2">340 × 280 px</span>
              </div>
              <div>
                <span className="text-gray-400">Placeholder Position:</span>
                <span className="text-white ml-2">X: 30, Y: 40</span>
              </div>
              <div>
                <span className="text-gray-400">Aspect Ratio:</span>
                <span className="text-white ml-2">5:7 (Standard Card)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

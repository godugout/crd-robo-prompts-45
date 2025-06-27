
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Copy, RefreshCw, AlertTriangle } from 'lucide-react';

interface PSDLayer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'group';
  visible: boolean;
  opacity: number;
  bounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  zIndex: number;
  imageData?: string;
}

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

interface DebugToolsProps {
  layers: PSDLayer[];
  elements: CRDElementDraft[];
  onElementsChange: (elements: CRDElementDraft[]) => void;
}

export const DebugTools: React.FC<DebugToolsProps> = ({
  layers,
  elements,
  onElementsChange
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const resetElements = () => {
    const resetElements = elements.map(element => ({
      ...element,
      rotation: 0,
      scale: 1,
      opacity: 1
    }));
    onElementsChange(resetElements);
  };

  const validateElements = () => {
    const issues: string[] = [];

    elements.forEach(element => {
      if (!element.imageUrl) {
        issues.push(`${element.name}: Missing image URL`);
      }
      if (element.dimensions.width <= 0 || element.dimensions.height <= 0) {
        issues.push(`${element.name}: Invalid dimensions`);
      }
      if (element.position.x < 0 || element.position.y < 0) {
        issues.push(`${element.name}: Negative position values`);
      }
    });

    return issues;
  };

  const issues = validateElements();

  const generateCRDFrameCode = () => {
    const frame = {
      id: `generated-${Date.now()}`,
      name: 'Generated Frame',
      description: 'Generated from PSD layers',
      category: 'generated',
      rarity: 'common',
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

    return `export const GENERATED_FRAME: CRDFrame = ${JSON.stringify(frame, null, 2)};`;
  };

  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Code className="w-5 h-5" />
          Debug Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Validation Issues */}
        {issues.length > 0 && (
          <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h4 className="text-red-400 font-medium">Validation Issues</h4>
            </div>
            <ul className="space-y-1">
              {issues.map((issue, index) => (
                <li key={index} className="text-red-300 text-sm">• {issue}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={resetElements}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Transforms
          </Button>

          <Button
            onClick={() => copyToClipboard(JSON.stringify(elements, null, 2))}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy JSON
          </Button>

          <Button
            onClick={() => copyToClipboard(generateCRDFrameCode())}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Code className="w-4 h-4 mr-2" />
            Copy Frame Code
          </Button>
        </div>

        {/* Element Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-white font-medium mb-3">Element Types</h4>
            <div className="space-y-2">
              {['border', 'logo', 'label', 'decorative', 'corner', 'accent'].map(type => {
                const count = elements.filter(el => el.type === type).length;
                return (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-gray-300 capitalize">{type}</span>
                    <Badge variant="outline" className="text-gray-400 border-gray-600">
                      {count}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Layer Statistics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Total Layers:</span>
                <span className="text-white">{layers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Visible Layers:</span>
                <span className="text-white">{layers.filter(l => l.visible).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Elements Generated:</span>
                <span className="text-white">{elements.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Validation Issues:</span>
                <span className={issues.length > 0 ? 'text-red-400' : 'text-green-400'}>
                  {issues.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Raw JSON Output */}
        <div>
          <h4 className="text-white font-medium mb-3">Generated Frame JSON</h4>
          <div className="bg-gray-900 border border-gray-600 rounded-lg p-4 overflow-auto max-h-60">
            <pre className="text-gray-300 text-xs">
              {JSON.stringify({
                elements: elements.map(el => ({
                  id: el.id,
                  name: el.name,
                  type: el.type,
                  position: el.position,
                  dimensions: el.dimensions,
                  zIndex: el.zIndex
                }))
              }, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DebugEffectValuesProps {
  effectValues: Record<string, Record<string, any>>;
  selectedFrame?: string;
  uploadedImage?: string;
}

export const DebugEffectValues: React.FC<DebugEffectValuesProps> = ({ 
  effectValues, 
  selectedFrame, 
  uploadedImage 
}) => {
  const activeEffects = Object.entries(effectValues).filter(([_, params]) => 
    params?.intensity && params.intensity > 0
  );

  return (
    <Card className="bg-red-900/20 border-red-500/30 text-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-red-400 text-sm flex items-center gap-2">
          🐛 Debug Info
          <Badge variant="outline" className="border-red-500/50 text-red-300 text-xs">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-red-300">
        <div>
          <strong>Image:</strong> {uploadedImage ? '✅ Loaded' : '❌ None'}
        </div>
        <div>
          <strong>Frame:</strong> {selectedFrame || '❌ None'}
        </div>
        <div>
          <strong>Effects Count:</strong> {Object.keys(effectValues).length}
        </div>
        <div>
          <strong>Active Effects:</strong> {activeEffects.length}
        </div>
        {activeEffects.length > 0 && (
          <div className="mt-2">
            <strong>Active:</strong>
            {activeEffects.map(([effectId, params]) => (
              <div key={effectId} className="ml-2 text-xs">
                • {effectId}: {params.intensity}%
              </div>
            ))}
          </div>
        )}
        <div className="mt-2 p-2 bg-black/30 rounded text-xs">
          <strong>Raw Data:</strong>
          <pre className="whitespace-pre-wrap text-xs">
            {JSON.stringify(effectValues, null, 1)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

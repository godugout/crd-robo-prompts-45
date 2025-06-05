
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import type { EnvironmentScene } from '../types';

export interface EnvironmentComboSectionProps {
  selectedScene?: EnvironmentScene;
  onSceneChange?: (scene: EnvironmentScene) => void;
}

export const EnvironmentComboSection: React.FC<EnvironmentComboSectionProps> = ({
  selectedScene,
  onSceneChange
}) => {
  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm flex items-center">
          <Settings className="w-4 h-4 mr-2 text-blue-400" />
          Environment Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-crd-lightGray text-xs">
          Environment controls will be available in a future update.
        </p>
      </CardContent>
    </Card>
  );
};

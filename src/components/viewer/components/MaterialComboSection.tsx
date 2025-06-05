
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette } from 'lucide-react';

export interface MaterialComboSectionProps {
  materialSettings?: any;
  onMaterialSettingsChange?: (settings: any) => void;
}

export const MaterialComboSection: React.FC<MaterialComboSectionProps> = ({
  materialSettings,
  onMaterialSettingsChange
}) => {
  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm flex items-center">
          <Palette className="w-4 h-4 mr-2 text-purple-400" />
          Material Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-crd-lightGray text-xs">
          Material settings will be available in a future update.
        </p>
      </CardContent>
    </Card>
  );
};

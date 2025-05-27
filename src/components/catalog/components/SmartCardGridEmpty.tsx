
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Grid } from 'lucide-react';

export const SmartCardGridEmpty: React.FC = () => {
  return (
    <Card className="bg-editor-dark border-editor-border">
      <CardContent className="p-12 text-center">
        <Grid className="w-16 h-16 text-crd-lightGray mx-auto mb-4" />
        <h3 className="text-white font-medium text-lg mb-2">No cards detected yet</h3>
        <p className="text-crd-lightGray mb-6">
          Upload some card images to get started with AI-powered detection
        </p>
      </CardContent>
    </Card>
  );
};

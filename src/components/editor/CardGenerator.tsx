
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export const CardGenerator: React.FC = () => {
  return (
    <Card className="p-4 bg-editor-darker border-editor-border">
      <div className="text-center space-y-4">
        <Sparkles className="w-8 h-8 mx-auto text-crd-green" />
        <h3 className="text-white font-medium">AI Card Generator</h3>
        <p className="text-sm text-cardshow-lightGray">
          Generate cards with AI assistance
        </p>
        <Button className="w-full bg-crd-green text-black hover:bg-crd-green/90">
          Generate Card
        </Button>
      </div>
    </Card>
  );
};

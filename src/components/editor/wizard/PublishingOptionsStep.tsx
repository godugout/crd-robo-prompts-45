
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { PublishingOptions, DesignTemplate } from '@/hooks/useCardEditor';

interface PublishingOptionsStepProps {
  publishingOptions: PublishingOptions;
  selectedTemplate: DesignTemplate | null;
  onPublishingUpdate: (key: keyof PublishingOptions, value: any) => void;
}

export const PublishingOptionsStep = ({ publishingOptions, selectedTemplate, onPublishingUpdate }: PublishingOptionsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Publishing Options</h2>
        <p className="text-crd-lightGray">Configure how your card will be shared and distributed</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-editor-tool border-editor-border">
          <CardHeader>
            <CardTitle className="text-white text-lg">Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Marketplace Listing</Label>
                <p className="text-xs text-crd-lightGray">List on CRD marketplace</p>
              </div>
              <Switch
                checked={publishingOptions.marketplace_listing}
                onCheckedChange={(checked) => onPublishingUpdate('marketplace_listing', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">CRD Catalog</Label>
                <p className="text-xs text-crd-lightGray">Include in main catalog</p>
              </div>
              <Switch
                checked={publishingOptions.crd_catalog_inclusion}
                onCheckedChange={(checked) => onPublishingUpdate('crd_catalog_inclusion', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Print Available</Label>
                <p className="text-xs text-crd-lightGray">Allow physical printing</p>
              </div>
              <Switch
                checked={publishingOptions.print_available}
                onCheckedChange={(checked) => onPublishingUpdate('print_available', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-editor-tool border-editor-border">
          <CardHeader>
            <CardTitle className="text-white text-lg">Edition Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Limited Edition</Label>
                <p className="text-xs text-crd-lightGray">Restrict number of copies</p>
              </div>
              <Switch
                checked={publishingOptions.distribution?.limited_edition}
                onCheckedChange={(checked) => onPublishingUpdate('distribution', {
                  ...publishingOptions.distribution,
                  limited_edition: checked
                })}
              />
            </div>

            {publishingOptions.distribution?.limited_edition && (
              <div>
                <Label className="text-white">Edition Size</Label>
                <Input
                  type="number"
                  min="1"
                  max="10000"
                  placeholder="100"
                  className="bg-editor-darker border-editor-border text-white"
                  onChange={(e) => onPublishingUpdate('distribution', {
                    ...publishingOptions.distribution,
                    edition_size: parseInt(e.target.value) || undefined
                  })}
                />
              </div>
            )}

            <div className="pt-4 border-t border-editor-border">
              <div className="text-sm text-crd-lightGray space-y-1">
                <p>Status: <span className="text-crd-green">Ready to publish</span></p>
                <p>Template: <span className="text-white">{selectedTemplate?.name}</span></p>
                <p>Verification: <span className="text-yellow-500">Pending review</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

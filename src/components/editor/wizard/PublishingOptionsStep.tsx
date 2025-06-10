
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, Globe, ShoppingCart, Printer, Eye, EyeOff, DollarSign } from 'lucide-react';
import type { TemplateConfig } from './wizardConfig';

interface PublishingOptionsStepProps {
  publishingOptions: any;
  selectedTemplate: TemplateConfig | null;
  onPublishingUpdate: (options: any) => void;
}

export const PublishingOptionsStep = ({
  publishingOptions,
  selectedTemplate,
  onPublishingUpdate
}: PublishingOptionsStepProps) => {
  const updateOption = (key: string, value: any) => {
    onPublishingUpdate({
      ...publishingOptions,
      [key]: value
    });
  };

  const updatePricing = (key: string, value: any) => {
    onPublishingUpdate({
      ...publishingOptions,
      pricing: {
        ...publishingOptions.pricing,
        [key]: value
      }
    });
  };

  const updateDistribution = (key: string, value: any) => {
    onPublishingUpdate({
      ...publishingOptions,
      distribution: {
        ...publishingOptions.distribution,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-crd-white mb-2">Publishing & Distribution</h2>
        <p className="text-crd-lightGray">Choose how you want to share and distribute your card</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visibility & Sharing */}
        <Card className="bg-editor-dark border-editor-border">
          <CardHeader>
            <CardTitle className="text-crd-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Visibility & Sharing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-crd-white">Public Gallery</Label>
                <p className="text-xs text-crd-lightGray">Show in CRD public catalog</p>
              </div>
              <Switch
                checked={publishingOptions.crd_catalog_inclusion}
                onCheckedChange={(checked) => updateOption('crd_catalog_inclusion', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-crd-white">Marketplace Listing</Label>
                <p className="text-xs text-crd-lightGray">Allow others to purchase copies</p>
              </div>
              <Switch
                checked={publishingOptions.marketplace_listing}
                onCheckedChange={(checked) => updateOption('marketplace_listing', checked)}
              />
            </div>

            {publishingOptions.marketplace_listing && (
              <div className="bg-editor-tool p-3 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-crd-green text-sm">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Marketplace Settings</span>
                </div>
                
                <div>
                  <Label className="text-crd-lightGray text-sm">Base Price</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-crd-lightGray" />
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={publishingOptions.pricing?.base_price || ''}
                      onChange={(e) => updatePricing('base_price', parseFloat(e.target.value))}
                      placeholder="9.99"
                      className="pl-10 bg-editor-border border-editor-border text-crd-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Print Options */}
        <Card className="bg-editor-dark border-editor-border">
          <CardHeader>
            <CardTitle className="text-crd-white flex items-center gap-2">
              <Printer className="w-5 h-5" />
              Print Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-crd-white">Print Available</Label>
                <p className="text-xs text-crd-lightGray">Allow physical card printing</p>
              </div>
              <Switch
                checked={publishingOptions.print_available}
                onCheckedChange={(checked) => updateOption('print_available', checked)}
              />
            </div>

            {publishingOptions.print_available && (
              <div className="bg-editor-tool p-3 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-crd-green text-sm">
                  <Printer className="w-4 h-4" />
                  <span>Print Settings</span>
                </div>
                
                <div>
                  <Label className="text-crd-lightGray text-sm">Print Price</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-crd-lightGray" />
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={publishingOptions.pricing?.print_price || ''}
                      onChange={(e) => updatePricing('print_price', parseFloat(e.target.value))}
                      placeholder="4.99"
                      className="pl-10 bg-editor-border border-editor-border text-crd-white"
                    />
                  </div>
                  <p className="text-xs text-crd-lightGray mt-1">Includes shipping and handling</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-crd-lightGray text-sm">Limited Edition</Label>
                    <p className="text-xs text-crd-lightGray">Restrict number of prints</p>
                  </div>
                  <Switch
                    checked={publishingOptions.distribution?.limited_edition}
                    onCheckedChange={(checked) => updateDistribution('limited_edition', checked)}
                  />
                </div>

                {publishingOptions.distribution?.limited_edition && (
                  <div>
                    <Label className="text-crd-lightGray text-sm">Edition Size</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10000"
                      value={publishingOptions.distribution?.edition_size || ''}
                      onChange={(e) => updateDistribution('edition_size', parseInt(e.target.value))}
                      placeholder="100"
                      className="mt-1 bg-editor-border border-editor-border text-crd-white"
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card className="bg-editor-tool border-editor-border">
        <CardContent className="p-4">
          <h4 className="text-crd-white font-medium mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Publishing Summary
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center ${
                publishingOptions.crd_catalog_inclusion ? 'bg-crd-green/20' : 'bg-editor-border'
              }`}>
                {publishingOptions.crd_catalog_inclusion ? (
                  <Eye className="w-6 h-6 text-crd-green" />
                ) : (
                  <EyeOff className="w-6 h-6 text-crd-lightGray" />
                )}
              </div>
              <p className="text-xs text-crd-lightGray">
                {publishingOptions.crd_catalog_inclusion ? 'Public' : 'Private'}
              </p>
            </div>

            <div className="text-center">
              <div className={`w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center ${
                publishingOptions.marketplace_listing ? 'bg-crd-green/20' : 'bg-editor-border'
              }`}>
                <ShoppingCart className={`w-6 h-6 ${
                  publishingOptions.marketplace_listing ? 'text-crd-green' : 'text-crd-lightGray'
                }`} />
              </div>
              <p className="text-xs text-crd-lightGray">
                {publishingOptions.marketplace_listing ? 'For Sale' : 'Not for Sale'}
              </p>
            </div>

            <div className="text-center">
              <div className={`w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center ${
                publishingOptions.print_available ? 'bg-crd-green/20' : 'bg-editor-border'
              }`}>
                <Printer className={`w-6 h-6 ${
                  publishingOptions.print_available ? 'text-crd-green' : 'text-crd-lightGray'
                }`} />
              </div>
              <p className="text-xs text-crd-lightGray">
                {publishingOptions.print_available ? 'Printable' : 'Digital Only'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center bg-crd-green/20">
                <Badge className="bg-crd-green text-crd-dark text-xs">
                  {selectedTemplate?.category || 'Custom'}
                </Badge>
              </div>
              <p className="text-xs text-crd-lightGray">Template</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Information */}
      {(publishingOptions.marketplace_listing || publishingOptions.print_available) && (
        <Card className="bg-editor-darker border-editor-border">
          <CardContent className="p-4">
            <h4 className="text-crd-white font-medium mb-3">💰 Revenue Sharing</h4>
            <div className="space-y-2 text-sm text-crd-lightGray">
              <p>• You keep 85% of digital sales revenue</p>
              <p>• You keep 70% of print sales revenue (covers production costs)</p>
              <p>• Payments processed weekly via your preferred method</p>
              <p>• Full sales analytics and reporting included</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Lock, Eye, EyeOff, DollarSign, Users } from 'lucide-react';
import type { PublishingOptions } from '@/hooks/useCardEditor';
import type { TemplateConfig } from './wizardConfig';

interface PublishingOptionsStepProps {
  publishingOptions: PublishingOptions;
  selectedTemplate: TemplateConfig | null;
  onPublishingUpdate: (key: keyof PublishingOptions, value: any) => void;
}

export const PublishingOptionsStep = ({ 
  publishingOptions, 
  selectedTemplate,
  onPublishingUpdate 
}: PublishingOptionsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-crd-white mb-2">Publishing Options</h2>
        <p className="text-crd-lightGray">Choose how you want to share and distribute your card</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Publishing Settings */}
        <div className="space-y-6">
          {/* Visibility */}
          <Card className="bg-editor-dark border-editor-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-crd-blue" />
                  <div>
                    <h3 className="text-crd-white font-semibold">Public Gallery</h3>
                    <p className="text-crd-lightGray text-sm">Make your card discoverable by others</p>
                  </div>
                </div>
                <Switch
                  checked={publishingOptions.crd_catalog_inclusion}
                  onCheckedChange={(checked) => onPublishingUpdate('crd_catalog_inclusion', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Marketplace Listing */}
          <Card className="bg-editor-dark border-editor-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-crd-green" />
                  <div>
                    <h3 className="text-crd-white font-semibold">Marketplace Listing</h3>
                    <p className="text-crd-lightGray text-sm">List your card for sale</p>
                  </div>
                </div>
                <Switch
                  checked={publishingOptions.marketplace_listing}
                  onCheckedChange={(checked) => onPublishingUpdate('marketplace_listing', checked)}
                />
              </div>
              
              {publishingOptions.marketplace_listing && (
                <div className="space-y-4 mt-4 pt-4 border-t border-editor-border">
                  <div>
                    <Label className="text-crd-lightGray text-sm">Base Price</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={publishingOptions.pricing?.base_price || ''}
                        onChange={(e) => onPublishingUpdate('pricing', {
                          ...publishingOptions.pricing,
                          base_price: e.target.value ? parseFloat(e.target.value) : undefined
                        })}
                        placeholder="0.00"
                        className="bg-editor-tool border-editor-border text-crd-white"
                      />
                      <Select 
                        value={publishingOptions.pricing?.currency || 'USD'}
                        onValueChange={(value) => onPublishingUpdate('pricing', {
                          ...publishingOptions.pricing,
                          currency: value
                        })}
                      >
                        <SelectTrigger className="w-24 bg-editor-tool border-editor-border text-crd-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Print Options */}
          <Card className="bg-editor-dark border-editor-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-crd-purple" />
                  <div>
                    <h3 className="text-crd-white font-semibold">Print Available</h3>
                    <p className="text-crd-lightGray text-sm">Allow physical printing of your card</p>
                  </div>
                </div>
                <Switch
                  checked={publishingOptions.print_available}
                  onCheckedChange={(checked) => onPublishingUpdate('print_available', checked)}
                />
              </div>
              
              {publishingOptions.print_available && (
                <div className="space-y-4 mt-4 pt-4 border-t border-editor-border">
                  <div>
                    <Label className="text-crd-lightGray text-sm">Print Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={publishingOptions.pricing?.print_price || ''}
                      onChange={(e) => onPublishingUpdate('pricing', {
                        ...publishingOptions.pricing,
                        print_price: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                      placeholder="0.00"
                      className="bg-editor-tool border-editor-border text-crd-white mt-1"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={publishingOptions.distribution?.limited_edition}
                      onCheckedChange={(checked) => onPublishingUpdate('distribution', {
                        ...publishingOptions.distribution,
                        limited_edition: checked
                      })}
                    />
                    <Label className="text-crd-lightGray text-sm">Limited Edition</Label>
                  </div>
                  
                  {publishingOptions.distribution?.limited_edition && (
                    <div>
                      <Label className="text-crd-lightGray text-sm">Edition Size</Label>
                      <Input
                        type="number"
                        min="1"
                        max="10000"
                        value={publishingOptions.distribution?.edition_size || ''}
                        onChange={(e) => onPublishingUpdate('distribution', {
                          ...publishingOptions.distribution,
                          edition_size: e.target.value ? parseInt(e.target.value) : undefined
                        })}
                        placeholder="100"
                        className="bg-editor-tool border-editor-border text-crd-white mt-1"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview Summary */}
        <div className="space-y-6">
          <Card className="bg-editor-dark border-editor-border">
            <CardContent className="p-6">
              <h3 className="text-crd-white font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Publishing Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-editor-tool rounded-lg">
                  <span className="text-crd-lightGray">Gallery Visibility</span>
                  <span className={`font-medium ${
                    publishingOptions.crd_catalog_inclusion ? 'text-crd-green' : 'text-crd-lightGray'
                  }`}>
                    {publishingOptions.crd_catalog_inclusion ? 'Public' : 'Private'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-editor-tool rounded-lg">
                  <span className="text-crd-lightGray">Marketplace</span>
                  <span className={`font-medium ${
                    publishingOptions.marketplace_listing ? 'text-crd-green' : 'text-crd-lightGray'
                  }`}>
                    {publishingOptions.marketplace_listing ? 'Listed' : 'Not Listed'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-editor-tool rounded-lg">
                  <span className="text-crd-lightGray">Print Available</span>
                  <span className={`font-medium ${
                    publishingOptions.print_available ? 'text-crd-green' : 'text-crd-lightGray'
                  }`}>
                    {publishingOptions.print_available ? 'Yes' : 'No'}
                  </span>
                </div>

                {(publishingOptions.pricing?.base_price || publishingOptions.pricing?.print_price) && (
                  <div className="border-t border-editor-border pt-4">
                    <h4 className="text-crd-white font-medium mb-2">Pricing</h4>
                    {publishingOptions.pricing.base_price && (
                      <div className="flex justify-between text-sm">
                        <span className="text-crd-lightGray">Digital:</span>
                        <span className="text-crd-white">${publishingOptions.pricing.base_price}</span>
                      </div>
                    )}
                    {publishingOptions.pricing.print_price && (
                      <div className="flex justify-between text-sm">
                        <span className="text-crd-lightGray">Print:</span>
                        <span className="text-crd-white">${publishingOptions.pricing.print_price}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {selectedTemplate && (
            <Card className="bg-editor-dark border-editor-border">
              <CardContent className="p-6">
                <h3 className="text-crd-white font-semibold mb-4">Selected Template</h3>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-editor-tool rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div>
                    <h4 className="text-crd-white font-medium">{selectedTemplate.name}</h4>
                    <p className="text-crd-lightGray text-sm">{selectedTemplate.category}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

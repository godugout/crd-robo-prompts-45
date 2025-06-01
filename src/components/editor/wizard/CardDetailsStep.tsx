
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Lock, Users, Sparkles } from 'lucide-react';
import type { CardData, CardRarity, CardVisibility, CreatorAttribution } from '@/hooks/useCardEditor';

interface CardDetailsStepProps {
  cardData: CardData;
  onFieldUpdate: <K extends keyof CardData>(field: K, value: CardData[K]) => void;
  onCreatorAttributionUpdate: (key: keyof CreatorAttribution, value: any) => void;
  aiAnalysisComplete?: boolean;
}

export const CardDetailsStep = ({ 
  cardData, 
  onFieldUpdate, 
  onCreatorAttributionUpdate,
  aiAnalysisComplete = false 
}: CardDetailsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Card Details</h2>
        <p className="text-crd-lightGray">
          {aiAnalysisComplete 
            ? 'Review the AI-suggested details below and make any adjustments'
            : 'Add information about your card'
          }
        </p>
        {aiAnalysisComplete && (
          <div className="flex items-center justify-center gap-2 mt-2 text-crd-green text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Fields have been pre-filled with AI suggestions</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="text-white flex items-center gap-2">
              Card Title *
              {aiAnalysisComplete && <Sparkles className="w-3 h-3 text-crd-green" />}
            </Label>
            <Input
              value={cardData.title}
              onChange={(e) => onFieldUpdate('title', e.target.value)}
              placeholder="Enter card title"
              className="bg-editor-tool border-editor-border text-white"
            />
          </div>

          <div>
            <Label className="text-white flex items-center gap-2">
              Description
              {aiAnalysisComplete && <Sparkles className="w-3 h-3 text-crd-green" />}
            </Label>
            <Textarea
              value={cardData.description || ''}
              onChange={(e) => onFieldUpdate('description', e.target.value)}
              placeholder="Describe your card..."
              className="bg-editor-tool border-editor-border text-white"
              rows={3}
            />
          </div>

          <div>
            <Label className="text-white flex items-center gap-2">
              Rarity
              {aiAnalysisComplete && <Sparkles className="w-3 h-3 text-crd-green" />}
            </Label>
            <Select value={cardData.rarity} onValueChange={(value) => onFieldUpdate('rarity', value as CardRarity)}>
              <SelectTrigger className="bg-editor-tool border-editor-border text-white">
                <SelectValue placeholder="Select rarity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="common">Common</SelectItem>
                <SelectItem value="uncommon">Uncommon</SelectItem>
                <SelectItem value="rare">Rare</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="legendary">Legendary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-white">Creator Attribution</Label>
            <Select 
              value={cardData.creator_attribution.collaboration_type} 
              onValueChange={(value) => onCreatorAttributionUpdate('collaboration_type', value)}
            >
              <SelectTrigger className="bg-editor-tool border-editor-border text-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solo">Solo Creation</SelectItem>
                <SelectItem value="collaboration">Collaboration</SelectItem>
                <SelectItem value="commission">Commission</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white flex items-center gap-2">
              Tags
              {aiAnalysisComplete && <Sparkles className="w-3 h-3 text-crd-green" />}
            </Label>
            <Input
              value={cardData.tags.join(', ')}
              placeholder="Add tags (comma separated)"
              className="bg-editor-tool border-editor-border text-white"
              onChange={(e) => {
                const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                onFieldUpdate('tags', tags);
              }}
            />
          </div>

          <div>
            <Label className="text-white">Visibility</Label>
            <Select value={cardData.visibility} onValueChange={(value) => onFieldUpdate('visibility', value as CardVisibility)}>
              <SelectTrigger className="bg-editor-tool border-editor-border text-white">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Private
                  </div>
                </SelectItem>
                <SelectItem value="public">
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Public
                  </div>
                </SelectItem>
                <SelectItem value="shared">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Shared
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {aiAnalysisComplete && (
        <div className="bg-editor-tool p-4 rounded-lg border border-crd-green/30">
          <h4 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-crd-green" />
            AI Analysis Summary
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-crd-lightGray">Type:</span>
              <span className="text-white ml-2">{cardData.type}</span>
            </div>
            <div>
              <span className="text-crd-lightGray">Series:</span>
              <span className="text-white ml-2">{cardData.series}</span>
            </div>
            <div>
              <span className="text-crd-lightGray">Tags:</span>
              <span className="text-white ml-2">{cardData.tags.length} generated</span>
            </div>
            <div>
              <span className="text-crd-lightGray">Rarity:</span>
              <span className="text-white ml-2">{cardData.rarity}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

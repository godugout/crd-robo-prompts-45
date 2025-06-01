
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Settings, Save, Share2, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useCardEditor } from '@/hooks/useCardEditor';
import { toast } from 'sonner';
import type { CardRarity } from '@/hooks/useCardEditor';

interface EditorPropertiesPanelProps {
  cardEditor?: ReturnType<typeof useCardEditor>;
}

export const EditorPropertiesPanel = ({ cardEditor }: EditorPropertiesPanelProps) => {
  const handleSave = async () => {
    if (cardEditor) {
      const success = await cardEditor.saveCard();
      if (success) {
        toast.success('Card saved successfully');
      }
    }
  };

  const handlePublish = async () => {
    if (cardEditor) {
      const success = await cardEditor.publishCard();
      if (success) {
        toast.success('Card published successfully');
      }
    }
  };

  const handleAddTag = (value: string) => {
    if (value.trim() && cardEditor) {
      cardEditor.addTag(value.trim());
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (cardEditor) {
      cardEditor.removeTag(tagToRemove);
    }
  };

  return (
    <div className="w-96 bg-editor-dark border-l border-editor-border overflow-y-auto rounded-xl">
      <div className="p-6">
        <h2 className="text-white text-xl font-semibold mb-6">Card Properties</h2>
        
        {/* Card Details Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-white font-medium mb-4 text-lg">Details</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Title</Label>
                <Input 
                  className="mt-1 bg-gray-700 border-gray-600 text-white rounded-lg"
                  placeholder="Enter card title"
                  value={cardEditor?.cardData.title || ''}
                  onChange={(e) => cardEditor?.updateCardField('title', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-gray-300">Description</Label>
                <Textarea 
                  className="mt-1 bg-gray-700 border-gray-600 text-white h-20 rounded-lg"
                  placeholder="Card description..."
                  value={cardEditor?.cardData.description || ''}
                  onChange={(e) => cardEditor?.updateCardField('description', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Properties Section */}
          <div>
            <h3 className="text-white font-medium mb-4 text-lg">Properties</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Type</Label>
                <select 
                  className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  value={cardEditor?.cardData.type || 'Handcrafted'}
                  onChange={(e) => cardEditor?.updateCardField('type', e.target.value)}
                >
                  <option>Digital</option>
                  <option>Handcrafted</option>
                  <option>AI Generated</option>
                </select>
              </div>
              <div>
                <Label className="text-gray-300">Rarity</Label>
                <select 
                  className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  value={cardEditor?.cardData.rarity || 'common'}
                  onChange={(e) => cardEditor?.updateCardField('rarity', e.target.value as CardRarity)}
                >
                  <option value="common">Common</option>
                  <option value="rare">Rare</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>
              <div>
                <Label className="text-gray-300">Series</Label>
                <select 
                  className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  value={cardEditor?.cardData.series || ''}
                  onChange={(e) => cardEditor?.updateCardField('series', e.target.value)}
                >
                  <option value="">Select Series</option>
                  <option value="80s-vcr">80s VCR</option>
                  <option value="neon-dreams">Neon Dreams</option>
                  <option value="retro-wave">Retro Wave</option>
                </select>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Tags Section */}
          <div>
            <h3 className="text-white font-medium mb-4 text-lg">Tags</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {cardEditor?.tags?.map(tag => (
                <span 
                  key={tag} 
                  className="bg-blue-600 text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-white/70 hover:text-white ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <Input 
              className="bg-gray-700 border-gray-600 text-white rounded-lg"
              placeholder="Add a tag..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const value = (e.target as HTMLInputElement).value.trim();
                  if (value) {
                    handleAddTag(value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
          </div>

          <Separator className="bg-gray-700" />

          {/* Publishing Settings */}
          <div>
            <h3 className="text-white font-medium mb-4 text-lg">Publishing</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Visibility</Label>
                <select 
                  className="w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  value={cardEditor?.cardData.visibility || 'private'}
                  onChange={(e) => cardEditor?.updateCardField('visibility', e.target.value as any)}
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                  <option value="shared">Shared</option>
                </select>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-editor-darker rounded-lg">
                <div>
                  <p className="text-white font-medium">Edition Size</p>
                  <p className="text-gray-400 text-xs">How many copies will exist</p>
                </div>
                <div className="h-8 w-16 px-3 bg-editor-tool text-white flex items-center justify-center rounded-md font-mono">
                  1/1
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl"
              onClick={handleSave}
              disabled={cardEditor?.isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {cardEditor?.isSaving ? 'Saving...' : 'Save Card'}
            </Button>
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-xl"
              onClick={handlePublish}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Publish Card
            </Button>
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 rounded-xl">
              <Settings className="w-4 h-4 mr-2" />
              Advanced Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

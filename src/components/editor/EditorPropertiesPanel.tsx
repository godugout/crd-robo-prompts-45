
import React from 'react';
import { useCardEditor } from '@/hooks/useCardEditor';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

interface EditorPropertiesPanelProps {
  cardEditor: ReturnType<typeof useCardEditor>;
}

export const EditorPropertiesPanel = ({ cardEditor }: EditorPropertiesPanelProps) => {
  const { 
    cardData, 
    updateCardField, 
    saveCard, 
    publishCard, 
    isSaving, 
    isDirty,
    tags, 
    handleTagInput, 
    removeTag, 
    hasMaxTags 
  } = cardEditor;

  const handleCreateCard = async () => {
    const success = await saveCard();
    if (success) {
      toast.success('Card created successfully!');
    }
  };
  
  const handlePublishCard = async () => {
    const success = await publishCard();
    if (success) {
      toast.success('Card published successfully!');
    }
  };

  const rarityOptions = [
    { value: 'common', label: 'Common', color: 'bg-gray-400' },
    { value: 'uncommon', label: 'Uncommon', color: 'bg-green-500' },
    { value: 'rare', label: 'Rare', color: 'bg-blue-500' },
    { value: 'legendary', label: 'Legendary', color: 'bg-purple-500' },
    { value: 'mythic', label: 'Mythic', color: 'bg-crd-orange' }
  ];

  return (
    <div className="w-80 h-full bg-editor-dark border-l border-editor-border overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Card Details */}
        <div>
          <h3 className="text-white font-semibold mb-4">Card Details</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm text-crd-lightGray uppercase">Title</Label>
              <Input 
                id="title"
                className="mt-1 bg-editor-darker border-editor-border text-white"
                placeholder="Card title" 
                value={cardData.title}
                onChange={(e) => updateCardField('title', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-sm text-crd-lightGray uppercase">Description</Label>
              <Textarea 
                id="description"
                className="mt-1 bg-editor-darker border-editor-border text-white min-h-[80px] resize-none"
                placeholder="Card description"
                value={cardData.description}
                onChange={(e) => updateCardField('description', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Properties */}
        <div>
          <h3 className="text-white font-semibold mb-4">Properties</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-crd-lightGray uppercase">Type</Label>
              <Select value={cardData.type} onValueChange={(value) => updateCardField('type', value)}>
                <SelectTrigger className="mt-1 bg-editor-darker border-editor-border text-white">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Handcrafted">Handcrafted</SelectItem>
                    <SelectItem value="Digital">Digital</SelectItem>
                    <SelectItem value="AI Generated">AI Generated</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-crd-lightGray uppercase">Series</Label>
              <Select value={cardData.series} onValueChange={(value) => updateCardField('series', value)}>
                <SelectTrigger className="mt-1 bg-editor-darker border-editor-border text-white">
                  <SelectValue placeholder="Select Series" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="80s VCR">80s VCR</SelectItem>
                    <SelectItem value="Neon Dreams">Neon Dreams</SelectItem>
                    <SelectItem value="Retro Wave">Retro Wave</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-crd-lightGray uppercase">Category</Label>
              <Select value={cardData.category} onValueChange={(value) => updateCardField('category', value)}>
                <SelectTrigger className="mt-1 bg-editor-darker border-editor-border text-white">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Movies">Movies</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Art">Art</SelectItem>
                    <SelectItem value="Gaming">Gaming</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Rarity */}
        <div>
          <h3 className="text-white font-semibold mb-4">Rarity</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-crd-lightGray uppercase">Card Rarity</Label>
              <Select value={cardData.rarity} onValueChange={(value: any) => updateCardField('rarity', value)}>
                <SelectTrigger className="mt-1 bg-editor-darker border-editor-border text-white">
                  <SelectValue placeholder="Select rarity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {rarityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full ${option.color} mr-2`}></div>
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <h3 className="text-white font-semibold mb-4">Tags</h3>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} className="bg-editor-darker text-white hover:bg-editor-darker">
                  #{tag}
                  <button 
                    onClick={() => removeTag(tag)} 
                    className="ml-1 text-crd-lightGray hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input 
              className="bg-editor-darker border-editor-border text-white"
              placeholder={hasMaxTags ? "Maximum tags reached" : "Add a tag and press Enter"} 
              onKeyDown={handleTagInput}
              disabled={hasMaxTags}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            className="w-full py-3 bg-crd-green hover:bg-crd-green/90 text-white rounded-full"
            onClick={handleCreateCard}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : isDirty ? 'Save Card' : 'Create Card'}
          </Button>

          <Button 
            className="w-full py-3 bg-crd-orange hover:bg-crd-orange/90 text-white rounded-full"
            onClick={handlePublishCard}
          >
            Publish Card
          </Button>
        </div>
      </div>
    </div>
  );
};

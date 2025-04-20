
import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarSection } from '../SidebarSection';
import { useCardEditor } from '@/hooks/useCardEditor';

interface PropertiesSectionProps {
  cardEditor: ReturnType<typeof useCardEditor>;
}

export const PropertiesSection = ({ cardEditor }: PropertiesSectionProps) => {
  const { 
    cardData, 
    updateCardField, 
    tags, 
    handleTagInput, 
    removeTag, 
    hasMaxTags 
  } = cardEditor;

  // Card property types
  const typeOptions = ['Handcrafted', 'Digital', 'Hybrid', 'AI Generated', 'Photography'];
  const seriesOptions = ['80s VCR', 'Neon Dreams', 'Retro Wave', 'Cyberpunk', 'Vaporwave'];
  const categoryOptions = ['Movies', 'Music', 'Art', 'Sports', 'Gaming', 'Collectibles'];

  return (
    <SidebarSection title="Properties">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <Label htmlFor="type" className="text-xs text-cardshow-lightGray uppercase">Type</Label>
          <Select value={cardData.type} onValueChange={(value) => updateCardField('type', value)}>
            <SelectTrigger className="input-dark mt-1 text-sm">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Type</SelectLabel>
                {typeOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1">
          <Label htmlFor="series" className="text-xs text-cardshow-lightGray uppercase">Series</Label>
          <Select value={cardData.series} onValueChange={(value) => updateCardField('series', value)}>
            <SelectTrigger className="input-dark mt-1 text-sm">
              <SelectValue placeholder="Select Series" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Series</SelectLabel>
                {seriesOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1">
          <Label htmlFor="category" className="text-xs text-cardshow-lightGray uppercase">Category</Label>
          <Select value={cardData.category} onValueChange={(value) => updateCardField('category', value)}>
            <SelectTrigger className="input-dark mt-1 text-sm">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                {categoryOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mt-4">
        <Label htmlFor="tags" className="text-xs text-cardshow-lightGray uppercase">Tags</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <Badge key={tag} className="bg-editor-darker text-cardshow-white hover:bg-editor-darker">
              #{tag}
              <button 
                onClick={() => removeTag(tag)} 
                className="ml-1 text-cardshow-lightGray hover:text-cardshow-white"
                aria-label={`Remove tag ${tag}`}
              >
                <X size={12} />
              </button>
            </Badge>
          ))}
        </div>
        <Input 
          id="tags"
          className="input-dark mt-2"
          placeholder={hasMaxTags ? "Maximum tags reached" : "Add a tag and press Enter"} 
          onKeyDown={handleTagInput}
          disabled={hasMaxTags}
          aria-label="Add tag"
        />
      </div>
    </SidebarSection>
  );
};


import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from 'sonner';
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

interface CardProperty {
  name: string;
  value: string;
  options: string[];
}

export const PropertiesSection = () => {
  const [properties, setProperties] = useState<CardProperty[]>([
    { name: 'Type', value: 'Handcrafted', options: ['Handcrafted', 'Digital', 'Hybrid', 'AI Generated', 'Photography'] },
    { name: 'Series', value: '80s VCR', options: ['80s VCR', 'Neon Dreams', 'Retro Wave', 'Cyberpunk', 'Vaporwave'] },
    { name: 'Category', value: 'Movies', options: ['Movies', 'Music', 'Art', 'Sports', 'Gaming', 'Collectibles'] },
  ]);
  
  const [tags, setTags] = useState(['MOVIES', 'HANDCRAFTED', '80sVCR']);
  const [newTag, setNewTag] = useState('');

  const handlePropertyChange = (name: string, value: string) => {
    setProperties(prev => prev.map(prop => 
      prop.name === name ? { ...prop, value } : prop
    ));
    toast.success(`${name} updated to ${value}`);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim() !== '') {
      if (!tags.includes(newTag.trim().toUpperCase())) {
        setTags([...tags, newTag.trim().toUpperCase()]);
        setNewTag('');
        toast.success(`Tag "${newTag.trim().toUpperCase()}" added`);
      } else {
        toast.error('Tag already exists');
      }
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
    toast(`Tag "${tag}" removed`);
  };

  return (
    <SidebarSection title="Properties">
      <div className="grid grid-cols-2 gap-4">
        {properties.map((prop, index) => (
          <div key={index} className="col-span-1">
            <Label htmlFor={`prop-${index}`} className="text-xs text-cardshow-lightGray uppercase">{prop.name}</Label>
            <Select value={prop.value} onValueChange={(value) => handlePropertyChange(prop.name, value)}>
              <SelectTrigger className="input-dark mt-1 text-sm">
                <SelectValue placeholder={`Select ${prop.name}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{prop.name}</SelectLabel>
                  {prop.options.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <Label htmlFor="tags" className="text-xs text-cardshow-lightGray uppercase">Tags</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <Badge key={tag} className="bg-editor-darker text-cardshow-white hover:bg-editor-darker">
              #{tag}
              <button onClick={() => handleRemoveTag(tag)} className="ml-1 text-cardshow-lightGray hover:text-cardshow-white">
                <X size={12} />
              </button>
            </Badge>
          ))}
        </div>
        <Input 
          id="tags"
          className="input-dark mt-2"
          placeholder="Add a tag and press Enter" 
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleAddTag}
        />
      </div>
    </SidebarSection>
  );
};



import React, { useState } from 'react';
import { SidebarSection } from './SidebarSection';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Crown, Star, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface CardProperty {
  name: string;
  value: string;
  options: string[];
}

export const RightSidebar = () => {
  const [title, setTitle] = useState('No roads needed');
  const [description, setDescription] = useState('Where we\'re going, there are only cards. An original digital art piece inspired by BTTF.');
  const [properties, setProperties] = useState<CardProperty[]>([
    { name: 'Type', value: 'Handcrafted', options: ['Handcrafted', 'Digital', 'Hybrid', 'AI Generated', 'Photography'] },
    { name: 'Series', value: '80s VCR', options: ['80s VCR', 'Neon Dreams', 'Retro Wave', 'Cyberpunk', 'Vaporwave'] },
    { name: 'Category', value: 'Movies', options: ['Movies', 'Music', 'Art', 'Sports', 'Gaming', 'Collectibles'] },
  ]);
  
  const [tags, setTags] = useState(['MOVIES', 'HANDCRAFTED', '80sVCR']);
  const [newTag, setNewTag] = useState('');
  
  const [isAvailableForPrinting, setIsAvailableForPrinting] = useState(true);
  const [isForSale, setIsForSale] = useState(false);
  const [isInCatalog, setIsInCatalog] = useState(false);
  const [isLimited, setIsLimited] = useState(false);
  const [rarityLevel, setRarityLevel] = useState(0);
  const [previewCount, setPreviewCount] = useState(0);
  
  const rarityLabels = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  
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
  
  const handleCreateCard = () => {
    toast.success('Card created successfully!', {
      description: 'Your card has been saved and is ready for publishing.',
      action: {
        label: 'View Card',
        onClick: () => console.log('Viewing card')
      }
    });
  };
  
  return (
    <div className="w-80 h-full bg-editor-dark border-l border-editor-border overflow-y-auto">
      <SidebarSection title="Card Details">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm text-cardshow-lightGray uppercase">Title</Label>
            <Input 
              id="title"
              className="input-dark mt-1"
              placeholder="Card title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-sm text-cardshow-lightGray uppercase">Description</Label>
            <Textarea 
              id="description"
              className="input-dark mt-1 min-h-[80px] resize-none"
              placeholder="Card description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </SidebarSection>
      
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
      
      <SidebarSection title="Rarity & Edition">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-cardshow-white font-medium">Limited Edition</h4>
              <p className="text-xs text-cardshow-lightGray mt-1">Create a limited number of this card</p>
            </div>
            <Switch checked={isLimited} onCheckedChange={setIsLimited} />
          </div>
          
          {isLimited && (
            <div className="space-y-4 p-3 bg-editor-darker rounded-lg">
              <div>
                <Label htmlFor="edition-size" className="text-xs text-cardshow-lightGray">EDITION SIZE</Label>
                <Input 
                  id="edition-size"
                  className="input-dark mt-1"
                  type="number" 
                  min="1"
                  defaultValue="50"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-cardshow-lightGray">RARITY LEVEL</Label>
                  <span className="text-xs font-medium" style={{ color: rarityLevel >= 4 ? '#FFD700' : rarityLevel >= 3 ? '#9b87f5' : rarityLevel >= 2 ? '#1E90FF' : rarityLevel >= 1 ? '#32CD32' : '#white' }}>
                    {rarityLabels[rarityLevel]}
                  </span>
                </div>
                <Slider 
                  value={[rarityLevel]} 
                  onValueChange={(val) => setRarityLevel(val[0])} 
                  min={0} 
                  max={4} 
                  step={1}
                  className="py-0"
                />
                <div className="flex justify-between mt-1 text-[10px] text-cardshow-lightGray">
                  <span>Common</span>
                  <span>Uncommon</span>
                  <span>Rare</span>
                  <span>Epic</span>
                  <span>Legendary</span>
                </div>
              </div>
              
              {rarityLevel === 4 && (
                <div className="flex items-center p-2 bg-gradient-to-r from-yellow-900/30 to-yellow-600/30 rounded border border-yellow-600/50">
                  <Crown className="text-yellow-500 mr-2" size={18} />
                  <span className="text-xs text-yellow-400">Legendary cards have special effects</span>
                </div>
              )}
            </div>
          )}
        </div>
      </SidebarSection>
      
      <SidebarSection title="Publishing Options">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-cardshow-white font-medium">Make available for printing</h4>
              <p className="text-xs text-cardshow-lightGray mt-1">See if there is any fan interest in prints of your card.</p>
            </div>
            <Switch checked={isAvailableForPrinting} onCheckedChange={setIsAvailableForPrinting} />
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-cardshow-white font-medium">Add to the market for sale</h4>
              <p className="text-xs text-cardshow-lightGray mt-1">Put up for purchase as a digital download.</p>
            </div>
            <Switch checked={isForSale} onCheckedChange={setIsForSale} />
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-cardshow-white font-medium">Include in CRD Catalog</h4>
              <p className="text-xs text-cardshow-lightGray mt-1">Contribute to our official CRD Catalog.</p>
            </div>
            <Switch checked={isInCatalog} onCheckedChange={setIsInCatalog} />
          </div>
        </div>
      </SidebarSection>
      
      <SidebarSection title="Customize Design">
        <p className="text-cardshow-lightGray text-sm mb-4">Customize your card with a new card frame and elements</p>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="template-item active aspect-square bg-editor-darker flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-editor-dark text-lg font-bold">+</span>
            </div>
          </div>
          
          <div className="template-item aspect-square bg-editor-darker flex items-center justify-center">
            <div className="w-10 h-10 bg-cardshow-green rounded"></div>
          </div>
          
          <div className="template-item aspect-square bg-editor-darker flex items-center justify-center">
            <div className="w-10 h-10 bg-cardshow-orange rounded"></div>
          </div>
          
          <div className="template-item aspect-square bg-editor-darker flex items-center justify-center">
            <div className="w-10 h-10 bg-cardshow-purple rounded"></div>
          </div>
        </div>
      </SidebarSection>
      
      <div className="p-6">
        <button 
          className="btn-primary w-full bg-cardshow-green hover:bg-cardshow-green/90 text-white py-3 rounded-full font-medium transition-colors"
          onClick={handleCreateCard}
        >
          Create Card
        </button>
      </div>
    </div>
  );
};

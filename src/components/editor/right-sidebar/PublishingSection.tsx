
import React from 'react';
import { Globe, Lock, Users, Eye, EyeOff } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SidebarSection } from '../SidebarSection';
import { useCardEditor } from '@/hooks/useCardEditor';

interface PublishingSectionProps {
  cardEditor: ReturnType<typeof useCardEditor>;
}

export const PublishingSection = ({ cardEditor }: PublishingSectionProps) => {
  const { cardData, updateCardField } = cardEditor;
  
  const handlePublicToggle = (isPublic: boolean) => {
    updateCardField('is_public', isPublic);
    // Also update visibility for consistency
    updateCardField('visibility', isPublic ? 'public' : 'private');
  };
  
  return (
    <SidebarSection title="Publishing">
      <div className="space-y-4">
        {/* Public/Private Toggle */}
        <div className="space-y-2">
          <Label className="text-sm text-cardshow-lightGray uppercase">Card Visibility</Label>
          <div className="flex items-center justify-between p-3 bg-editor-darker rounded-lg">
            <div className="flex items-center space-x-2">
              {cardData.is_public ? (
                <Eye className="h-4 w-4 text-green-500" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-500" />
              )}
              <div>
                <p className="text-cardshow-white font-medium">
                  {cardData.is_public ? 'Public' : 'Private'}
                </p>
                <p className="text-cardshow-lightGray text-xs">
                  {cardData.is_public 
                    ? 'Visible in gallery and discoverable by others' 
                    : 'Only visible to you in your profile'
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={cardData.is_public || false}
              onCheckedChange={handlePublicToggle}
            />
          </div>
        </div>

        {/* Legacy Visibility Selector (kept for compatibility) */}
        <div>
          <Label className="text-sm text-cardshow-lightGray uppercase">Access Level</Label>
          <Select 
            value={cardData.visibility} 
            onValueChange={(value: 'private' | 'public' | 'shared') => {
              updateCardField('visibility', value);
              // Update is_public based on visibility
              updateCardField('is_public', value === 'public');
            }}
          >
            <SelectTrigger className="input-dark mt-1">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="private">
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    <span>Private</span>
                  </div>
                </SelectItem>
                <SelectItem value="public">
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>Public</span>
                  </div>
                </SelectItem>
                <SelectItem value="shared">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Shared</span>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between px-4 py-3 bg-editor-darker rounded-lg">
          <div>
            <p className="text-cardshow-white font-medium">Publish Status</p>
            <p className="text-cardshow-lightGray text-xs">
              {cardData.is_public ? 'Published and visible to everyone' : 'Draft - only visible to you'}
            </p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs ${
            cardData.is_public 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-cardshow-mediumGray text-cardshow-lightGray'
          }`}>
            {cardData.is_public ? 'Published' : 'Draft'}
          </div>
        </div>
      </div>
    </SidebarSection>
  );
};

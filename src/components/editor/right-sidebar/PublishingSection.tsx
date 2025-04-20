
import React from 'react';
import { Globe, Lock, Users } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { SidebarSection } from '../SidebarSection';
import { useCardEditor } from '@/hooks/useCardEditor';

interface PublishingSectionProps {
  cardEditor: ReturnType<typeof useCardEditor>;
}

export const PublishingSection = ({ cardEditor }: PublishingSectionProps) => {
  const { cardData, updateCardField } = cardEditor;
  
  return (
    <SidebarSection title="Publishing">
      <div className="space-y-4">
        <div>
          <Label className="text-sm text-cardshow-lightGray uppercase">Visibility</Label>
          <Select 
            value={cardData.visibility} 
            onValueChange={(value: 'private' | 'public' | 'shared') => updateCardField('visibility', value)}
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
            <p className="text-cardshow-lightGray text-xs">Card is currently a draft</p>
          </div>
          <div className="px-2 py-1 bg-cardshow-mediumGray rounded-full text-xs text-cardshow-lightGray">
            Draft
          </div>
        </div>
      </div>
    </SidebarSection>
  );
};

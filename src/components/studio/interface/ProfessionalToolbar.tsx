
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  Share2, 
  Settings, 
  Clock,
  Folder,
  Star
} from 'lucide-react';

interface ProfessionalToolbarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onSave: () => void;
  onExport: () => void;
  onShare: () => void;
  onBack: () => void;
}

export const ProfessionalToolbar: React.FC<ProfessionalToolbarProps> = ({
  projectName,
  onProjectNameChange,
  onSave,
  onExport,
  onShare,
  onBack
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);

  const handleNameSave = () => {
    onProjectNameChange(tempName);
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(projectName);
    setIsEditingName(false);
  };

  return (
    <div className="border-b border-editor-border bg-editor-dark/95 backdrop-blur-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 h-16">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-editor-border"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="h-6 w-px bg-editor-border"></div>
          
          {isEditingName ? (
            <div className="flex items-center space-x-2">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSave();
                  if (e.key === 'Escape') handleNameCancel();
                }}
                className="w-64 bg-editor-border border-editor-border text-white"
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleNameSave}
                className="bg-crd-green hover:bg-crd-green/90 text-black"
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleNameCancel}
                className="text-white hover:bg-editor-border"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Folder className="w-4 h-4 text-crd-lightGray" />
              <button
                onClick={() => setIsEditingName(true)}
                className="text-white font-medium hover:text-crd-green transition-colors"
              >
                {projectName}
              </button>
              <Star className="w-4 h-4 text-crd-lightGray hover:text-yellow-400 cursor-pointer transition-colors" />
            </div>
          )}
        </div>

        {/* Center Section */}
        <div className="flex items-center space-x-1 text-crd-lightGray text-sm">
          <Clock className="w-4 h-4" />
          <span>Auto-saved • {new Date().toLocaleTimeString()}</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={onSave}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-editor-border"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          
          <div className="h-6 w-px bg-editor-border"></div>
          
          <Button
            onClick={onShare}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-editor-border"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          
          <Button
            onClick={onExport}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-editor-border"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

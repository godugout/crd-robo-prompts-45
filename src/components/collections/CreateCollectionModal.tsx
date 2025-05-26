
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (collectionData: any) => void;
}

const coverTemplates = [
  { id: 'retro', name: 'Retro', preview: '/placeholder.svg', gradient: 'from-purple-500 to-pink-500' },
  { id: 'vintage', name: 'Vintage', preview: '/placeholder.svg', gradient: 'from-amber-500 to-orange-500' },
  { id: 'modern', name: 'Modern', preview: '/placeholder.svg', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'neon', name: 'Neon', preview: '/placeholder.svg', gradient: 'from-green-400 to-blue-500' },
  { id: 'classic', name: 'Classic', preview: '/placeholder.svg', gradient: 'from-gray-600 to-gray-800' },
  { id: 'minimal', name: 'Minimal', preview: '/placeholder.svg', gradient: 'from-slate-400 to-slate-600' }
];

export const CreateCollectionModal = ({ isOpen, onClose, onCreate }: CreateCollectionModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'personal',
    visibility: 'private'
  });
  const [selectedCover, setSelectedCover] = useState<string>('retro');
  const [customCoverImage, setCustomCoverImage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomCoverImage(reader.result as string);
        setSelectedCover('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a collection title');
      return;
    }

    setIsCreating(true);
    try {
      const coverImageUrl = selectedCover === 'custom' ? customCoverImage : null;
      const coverTemplate = selectedCover !== 'custom' ? selectedCover : null;

      await onCreate({
        ...formData,
        coverImageUrl,
        coverTemplate
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        type: 'personal',
        visibility: 'private'
      });
      setSelectedCover('retro');
      setCustomCoverImage(null);
      onClose();
      toast.success('Collection created successfully!');
    } catch (error) {
      toast.error('Failed to create collection');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-crd-dark border-crd-mediumGray">
        <DialogHeader>
          <DialogTitle className="text-crd-white text-xl">Create New Collection</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Form */}
          <div className="space-y-6">
            <div>
              <Label className="text-crd-white">Collection Name *</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter collection name"
                className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
              />
            </div>

            <div>
              <Label className="text-crd-white">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your collection..."
                className="bg-crd-mediumGray border-crd-lightGray text-crd-white min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-crd-white">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-crd-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-crd-white">Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-crd-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="collaborative">Collaborative</SelectItem>
                    <SelectItem value="curated">Curated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-crd-white">Visibility</Label>
              <Select value={formData.visibility} onValueChange={(value) => handleInputChange('visibility', value)}>
                <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-crd-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="shared">Shared</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Panel - Cover Selection */}
          <div className="space-y-4">
            <Label className="text-crd-white text-lg">Choose Cover Design</Label>
            
            {/* Template Options */}
            <div className="grid grid-cols-3 gap-3">
              {coverTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    selectedCover === template.id 
                      ? 'ring-2 ring-crd-green' 
                      : 'hover:ring-1 hover:ring-crd-lightGray'
                  }`}
                  onClick={() => setSelectedCover(template.id)}
                >
                  <CardContent className="p-2">
                    <div className={`h-16 rounded bg-gradient-to-br ${template.gradient} flex items-center justify-center relative`}>
                      {selectedCover === template.id && (
                        <Check className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <p className="text-xs text-crd-white text-center mt-1">{template.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Custom Upload */}
            <div>
              <Label className="text-crd-white">Or Upload Custom Cover</Label>
              <div className="mt-2">
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('cover-upload')?.click()}
                  className="w-full border-crd-lightGray text-crd-white hover:bg-crd-mediumGray"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              </div>
              
              {customCoverImage && (
                <div className="mt-3">
                  <img 
                    src={customCoverImage} 
                    alt="Custom cover" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Preview */}
            <div className="mt-6">
              <Label className="text-crd-white">Preview</Label>
              <Card className="mt-2 bg-crd-mediumGray border-crd-lightGray">
                <CardContent className="p-4">
                  {selectedCover === 'custom' && customCoverImage ? (
                    <img src={customCoverImage} alt="Preview" className="w-full h-24 object-cover rounded mb-3" />
                  ) : (
                    <div className={`w-full h-24 rounded mb-3 bg-gradient-to-br ${coverTemplates.find(t => t.id === selectedCover)?.gradient}`} />
                  )}
                  <h3 className="text-crd-white font-semibold">{formData.title || 'Collection Name'}</h3>
                  <p className="text-crd-lightGray text-sm">{formData.description || 'Collection description'}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-crd-mediumGray">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-crd-lightGray text-crd-white hover:bg-crd-mediumGray"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating || !formData.title.trim()}
            className="bg-crd-green hover:bg-crd-green/90 text-black"
          >
            {isCreating ? 'Creating...' : 'Create Collection'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

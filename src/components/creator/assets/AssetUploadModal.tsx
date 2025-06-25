
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useDesignAssets } from '@/hooks/creator/useDesignAssets';
import { Upload, X } from 'lucide-react';

interface AssetUploadModalProps {
  onClose: () => void;
}

export const AssetUploadModal: React.FC<AssetUploadModalProps> = ({ onClose }) => {
  const { createAsset } = useDesignAssets();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    asset_type: '' as any,
    usage_rights: 'free' as any,
    price: 0,
    tags: '',
    categories: '',
    is_public: true,
  });
  const [file, setFile] = useState<File | null>(null);

  const assetTypes = [
    { value: 'texture', label: 'Texture' },
    { value: 'pattern', label: 'Pattern' },
    { value: 'shape', label: 'Shape' },
    { value: 'icon', label: 'Icon' },
    { value: 'font', label: 'Font' },
    { value: 'template_element', label: 'Template Element' },
    { value: '3d_model', label: '3D Model' },
    { value: 'animation', label: 'Animation' },
  ];

  const usageRights = [
    { value: 'free', label: 'Free' },
    { value: 'premium', label: 'Premium' },
    { value: 'exclusive', label: 'Exclusive' },
    { value: 'commercial', label: 'Commercial' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!formData.title) {
        setFormData(prev => ({ ...prev, title: selectedFile.name.split('.')[0] }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !formData.asset_type) return;

    try {
      // In a real implementation, you would upload the file to storage first
      // For now, we'll simulate with a placeholder URL
      const fileUrl = `https://example.com/assets/${file.name}`;
      
      await createAsset.mutateAsync({
        ...formData,
        file_url: fileUrl,
        file_size: file.size,
        mime_type: file.type,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        categories: formData.categories.split(',').map(cat => cat.trim()).filter(Boolean),
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to upload asset:', error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-crd-dark border-crd-mediumGray text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Design Asset
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <Label htmlFor="file">Asset File</Label>
            <div className="mt-2">
              <input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept="image/*,application/*"
                className="block w-full text-sm text-crd-lightGray
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-crd-green file:text-black
                          hover:file:bg-green-600"
              />
            </div>
            {file && (
              <div className="mt-2 flex items-center gap-2 text-sm text-crd-lightGray">
                <span>{file.name}</span>
                <span>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-crd-mediumGray border-crd-lightGray text-white"
                placeholder="Enter asset title"
              />
            </div>
            <div>
              <Label htmlFor="asset_type">Asset Type</Label>
              <Select 
                value={formData.asset_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, asset_type: value as any }))}
              >
                <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-white">
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent className="bg-crd-mediumGray border-crd-lightGray">
                  {assetTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-white">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-crd-mediumGray border-crd-lightGray text-white"
              placeholder="Describe your asset..."
              rows={3}
            />
          </div>

          {/* Usage Rights and Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="usage_rights">Usage Rights</Label>
              <Select 
                value={formData.usage_rights} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, usage_rights: value as any }))}
              >
                <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-crd-mediumGray border-crd-lightGray">
                  {usageRights.map((right) => (
                    <SelectItem key={right.value} value={right.value} className="text-white">
                      {right.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                className="bg-crd-mediumGray border-crd-lightGray text-white"
                placeholder="0.00"
                disabled={formData.usage_rights === 'free'}
              />
            </div>
          </div>

          {/* Tags and Categories */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="bg-crd-mediumGray border-crd-lightGray text-white"
                placeholder="vintage, sports, texture"
              />
            </div>
            <div>
              <Label htmlFor="categories">Categories (comma-separated)</Label>
              <Input
                id="categories"
                value={formData.categories}
                onChange={(e) => setFormData(prev => ({ ...prev, categories: e.target.value }))}
                className="bg-crd-mediumGray border-crd-lightGray text-white"
                placeholder="backgrounds, effects, overlays"
              />
            </div>
          </div>

          {/* Visibility */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_public">Make Public</Label>
              <p className="text-sm text-crd-lightGray">Allow other creators to discover and use this asset</p>
            </div>
            <Switch
              id="is_public"
              checked={formData.is_public}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={!file || !formData.asset_type || createAsset.isPending}
              className="bg-crd-green hover:bg-green-600 text-black"
            >
              {createAsset.isPending ? 'Uploading...' : 'Upload Asset'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { Image, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface PhotoUploadStepProps {
  selectedPhoto: string;
  onPhotoSelect: (photo: string) => void;
}

export const PhotoUploadStep = ({ selectedPhoto, onPhotoSelect }: PhotoUploadStepProps) => {
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onPhotoSelect(e.target?.result as string);
        toast.success('Photo uploaded!');
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Upload Your Photo</h2>
        <p className="text-crd-lightGray">Choose the image that will be featured on your card</p>
      </div>
      
      <div className="border-2 border-dashed border-editor-border rounded-xl p-8 text-center">
        {selectedPhoto ? (
          <div className="space-y-4">
            <img src={selectedPhoto} alt="Selected" className="w-48 h-48 object-cover rounded-lg mx-auto" />
            <p className="text-crd-green">Photo selected!</p>
            <Button
              onClick={() => document.getElementById('photo-input')?.click()}
              variant="outline"
              className="border-editor-border text-white hover:bg-editor-border"
            >
              Choose Different Photo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Image className="w-16 h-16 text-gray-400 mx-auto" />
            <div>
              <p className="text-crd-lightGray mb-4">Drag and drop or click to upload</p>
              <Button
                onClick={() => document.getElementById('photo-input')?.click()}
                className="bg-crd-green hover:bg-crd-green/90 text-black"
              >
                <Upload className="w-4 h-4 mr-2" />
                Select Photo
              </Button>
            </div>
          </div>
        )}
        <input
          id="photo-input"
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

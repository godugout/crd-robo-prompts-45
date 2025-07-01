
import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image, Crop, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface SmartImageUploadProps {
  selectedFrame: string;
  uploadedImage: string;
  onImageUpload: (imageUrl: string) => void;
}

export const SmartImageUpload: React.FC<SmartImageUploadProps> = ({
  selectedFrame,
  uploadedImage,
  onImageUpload
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [imageSettings, setImageSettings] = useState({
    scale: 1,
    rotation: 0,
    offsetX: 0,
    offsetY: 0
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageUpload(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Upload Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-[#FCFCFD] mb-2">Smart Image Upload</h2>
            <p className="text-[#777E90]">Upload your image and we'll automatically fit it to your selected frame</p>
          </div>

          {/* Upload Zone */}
          <Card
            className={`border-2 border-dashed transition-all duration-300 cursor-pointer ${
              isDragging 
                ? 'border-[#3772FF] bg-[#3772FF]/10' 
                : 'border-[#353945] bg-[#23262F] hover:border-[#3772FF]/50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="p-12 text-center">
              <Upload className="w-16 h-16 text-[#777E90] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#FCFCFD] mb-2">
                Drop your image here
              </h3>
              <p className="text-[#777E90] mb-4">
                or click to browse your files
              </p>
              <Button className="bg-[#3772FF] hover:bg-[#3772FF]/90 text-white font-extrabold">
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </Card>

          {/* Image Controls */}
          {uploadedImage && (
            <Card className="p-6 bg-[#23262F] border-[#353945]">
              <h3 className="text-lg font-bold text-[#FCFCFD] mb-4 flex items-center">
                <Crop className="w-5 h-5 mr-2" />
                Smart Cropping
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[#777E90] mb-2 block">Scale</label>
                  <Slider
                    value={[imageSettings.scale]}
                    onValueChange={(value) => setImageSettings({...imageSettings, scale: value[0]})}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#777E90] mb-2 block">Rotation</label>
                  <Slider
                    value={[imageSettings.rotation]}
                    onValueChange={(value) => setImageSettings({...imageSettings, rotation: value[0]})}
                    min={-180}
                    max={180}
                    step={15}
                    className="w-full"
                  />
                </div>

                <Button
                  onClick={() => setImageSettings({ scale: 1, rotation: 0, offsetX: 0, offsetY: 0 })}
                  variant="outline"
                  className="w-full border-[#353945] text-[#777E90] hover:text-[#FCFCFD] hover:bg-[#353945]"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Settings
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#FCFCFD] mb-2">Live Preview</h3>
            <p className="text-[#777E90]">See how your image fits within the selected frame</p>
          </div>

          {/* Frame Preview */}
          <Card className="aspect-[5/7] bg-gradient-to-br from-[#353945] to-[#23262F] border-[#353945] overflow-hidden relative">
            {selectedFrame ? (
              <div className="w-full h-full flex items-center justify-center p-8">
                {uploadedImage ? (
                  <div className="relative w-full h-full bg-[#141416] rounded-lg overflow-hidden">
                    <img
                      src={uploadedImage}
                      alt="Preview"
                      className="w-full h-full object-cover transition-all duration-300"
                      style={{
                        transform: `scale(${imageSettings.scale}) rotate(${imageSettings.rotation}deg) translate(${imageSettings.offsetX}px, ${imageSettings.offsetY}px)`
                      }}
                    />
                    {/* Frame Overlay */}
                    <div className="absolute inset-0 border-4 border-[#3772FF]/30 rounded-lg pointer-events-none" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-[#141416] rounded-lg flex items-center justify-center">
                    <div className="text-center text-[#777E90]">
                      <Image className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">Upload an image to see preview</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#777E90]">
                <p>Select a frame first</p>
              </div>
            )}
          </Card>

          {/* Smart Suggestions */}
          {uploadedImage && (
            <Card className="p-4 bg-[#23262F] border-[#353945]">
              <h4 className="text-sm font-bold text-[#FCFCFD] mb-2">Smart Suggestions</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#777E90]">Optimal crop detected</span>
                  <Button size="sm" variant="ghost" className="text-[#3772FF] hover:bg-[#3772FF]/10">
                    Apply
                  </Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#777E90]">Portrait orientation recommended</span>
                  <Button size="sm" variant="ghost" className="text-[#3772FF] hover:bg-[#3772FF]/10">
                    Rotate
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MediaUploader } from '@/components/media/MediaUploader';
import { MediaGallery } from '@/components/media/MediaGallery';
import { v4 as uuidv4 } from 'uuid';
import { ImageIcon, Wand2, Layers, Palette } from 'lucide-react';

const Editor = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [memoryId] = useState(uuidv4());

  const handleUploadComplete = (mediaItem) => {
    setSelectedMedia(prev => [...prev, mediaItem]);
  };

  const handleMediaDeletion = async (mediaId) => {
    setSelectedMedia(prev => prev.filter(item => item.id !== mediaId));
  };

  return (
    <div className="min-h-screen bg-[#141416]">
      <div className="container mx-auto p-6 max-w-7xl">
        <Card className="bg-[#23262F] border-[#353945]">
          <CardHeader className="border-b border-[#353945]">
            <CardTitle className="text-[#FCFCFD] text-2xl">Create New Card</CardTitle>
            <CardDescription className="text-[#777E90]">Design and customize your digital card</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Preview Section */}
              <div className="lg:col-span-7 space-y-6">
                <div className="aspect-w-4 aspect-h-3 bg-[#353945] rounded-2xl overflow-hidden">
                  {selectedMedia.length > 0 ? (
                    <MediaGallery mediaItems={selectedMedia} onDelete={handleMediaDeletion} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center space-y-4">
                        <ImageIcon className="w-16 h-16 mx-auto text-[#777E90]" />
                        <p className="text-[#777E90]">Upload your card artwork</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" className="border-[#353945] text-[#FCFCFD]">
                    <Wand2 className="w-4 h-4 mr-2" />
                    AI Enhance
                  </Button>
                  <Button variant="outline" className="border-[#353945] text-[#FCFCFD]">
                    <Layers className="w-4 h-4 mr-2" />
                    Add Layer
                  </Button>
                  <Button variant="outline" className="border-[#353945] text-[#FCFCFD]">
                    <Palette className="w-4 h-4 mr-2" />
                    Effects
                  </Button>
                </div>
              </div>

              {/* Settings Section */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#FCFCFD] mb-2 block">Card Title</label>
                    <Input 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-[#353945] border-[#353945] text-[#FCFCFD]"
                      placeholder="Enter card title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#FCFCFD] mb-2 block">Description</label>
                    <Textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-[#353945] border-[#353945] text-[#FCFCFD]"
                      placeholder="Describe your card"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#FCFCFD] mb-2 block">Upload Media</label>
                    <MediaUploader 
                      memoryId={memoryId}
                      userId="demo-user"
                      onUploadComplete={handleUploadComplete}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-[#353945] space-y-4">
                  <Button className="w-full bg-[#3772FF] hover:bg-[#3772FF]/90">
                    Publish Card
                  </Button>
                  <Button variant="outline" className="w-full border-[#353945] text-[#FCFCFD]">
                    Save as Draft
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Editor;

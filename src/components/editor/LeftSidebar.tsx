
import React, { useState } from 'react';
import { SidebarSection } from './SidebarSection';
import { Upload, Image, Type, Plus, Square, LayoutGrid, Layers, Move, Pencil, Star } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface TemplateProps {
  selectedTemplate: string;
  onSelectTemplate: (template: string) => void;
}

export const LeftSidebar = ({ selectedTemplate, onSelectTemplate }: TemplateProps) => {
  const [selectedTab, setSelectedTab] = useState('upload');
  const [searchQuery, setSearchQuery] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  
  const templates = [
    { id: 'template1', name: 'Cardshow Nostalgia', color: 'bg-cardshow-green', category: 'featured' },
    { id: 'template2', name: 'Classic Cardboard', color: 'bg-cardshow-orange', category: 'featured' },
    { id: 'template3', name: 'Nifty Framework', color: 'bg-cardshow-purple', category: 'featured' },
    { id: 'template4', name: 'Synthwave Dreams', color: 'bg-pink-500', category: 'popular' },
    { id: 'template5', name: 'Minimal Clean', color: 'bg-gray-300', category: 'popular' },
    { id: 'template6', name: 'Pixel Perfect', color: 'bg-blue-500', category: 'popular' },
  ];
  
  const assets = [
    { id: 'asset1', name: 'Icon Pack', thumb: 'public/lovable-uploads/236a8721-7f3f-49da-8787-7696565ff342.png', category: 'stickers' },
    { id: 'asset2', name: 'Backgrounds', thumb: 'public/lovable-uploads/28723390-e5ca-4efe-b231-e1dd87f8639a.png', category: 'backgrounds' },
    { id: 'asset3', name: 'Textures', thumb: 'public/lovable-uploads/4267414c-44f6-420c-8d56-383691359ce6.png', category: 'textures' },
    { id: 'asset4', name: '3D Elements', thumb: 'public/lovable-uploads/4db063a6-f43a-42c6-8670-41f27f772be8.png', category: 'elements' },
  ];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileToUpload(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast.success('File selected', { 
        description: file.name
      });
    }
  };
  
  const handleUpload = () => {
    if (fileToUpload) {
      toast.success('File uploaded successfully', { 
        description: fileToUpload.name,
        action: {
          label: 'View',
          onClick: () => console.log('Viewing uploaded file')
        }
      });
      // Reset after upload
      setFileToUpload(null);
      setUploadPreview(null);
    }
  };
  
  const handleAssetSelect = (asset: any) => {
    toast(`${asset.name} added to canvas`);
  };
  
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'upload':
        return (
          <div className="space-y-4">
            {!fileToUpload ? (
              <div className="p-4 border-2 border-dashed border-editor-border rounded-lg text-center">
                <div className="flex flex-col items-center justify-center py-8">
                  <Upload className="w-10 h-10 text-cardshow-lightGray mb-3" />
                  <p className="text-cardshow-white font-medium">Upload Card Files</p>
                  <p className="text-xs text-cardshow-lightGray mt-1">Drag or choose your file to upload</p>
                  <Input 
                    type="file" 
                    className="hidden" 
                    id="file-upload" 
                    onChange={handleFileChange} 
                    accept="image/*"
                  />
                  <label 
                    htmlFor="file-upload" 
                    className="mt-4 px-4 py-2 bg-editor-dark border border-editor-border rounded-lg text-cardshow-white text-sm hover:bg-editor-tool cursor-pointer"
                  >
                    Browse Files
                  </label>
                </div>
              </div>
            ) : (
              <div className="p-4 border-2 border-editor-border rounded-lg">
                <div className="flex flex-col items-center">
                  <div className="relative w-full aspect-square mb-4 bg-editor-darker rounded-lg overflow-hidden">
                    <img 
                      src={uploadPreview || ''} 
                      alt="Upload preview" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-cardshow-white font-medium text-center truncate w-full">
                    {fileToUpload.name}
                  </p>
                  <p className="text-xs text-cardshow-lightGray">
                    {(fileToUpload.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="flex gap-2 mt-4 w-full">
                    <Button 
                      variant="outline" 
                      className="flex-1 text-cardshow-lightGray"
                      onClick={() => {
                        setFileToUpload(null);
                        setUploadPreview(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="default" 
                      className="flex-1 bg-cardshow-green text-white"
                      onClick={handleUpload}
                    >
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'templates':
        return (
          <div className="space-y-4">
            <Tabs defaultValue="featured">
              <TabsList className="bg-editor-darker w-full">
                <TabsTrigger value="featured" className="flex-1">Featured</TabsTrigger>
                <TabsTrigger value="popular" className="flex-1">Popular</TabsTrigger>
                <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
              </TabsList>
              <TabsContent value="featured" className="mt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {filteredTemplates.filter(t => t.category === 'featured').map((template) => (
                      <div 
                        key={template.id}
                        className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${
                          selectedTemplate === template.id 
                            ? 'bg-editor-tool border border-editor-border' 
                            : 'hover:bg-editor-tool/50'
                        }`}
                        onClick={() => {
                          onSelectTemplate(template.id);
                          toast(`Template selected: ${template.name}`);
                        }}
                      >
                        <div className={`w-10 h-10 rounded ${template.color}`}></div>
                        <div className="flex-1">
                          <p className="text-cardshow-white font-medium">{template.name}</p>
                        </div>
                        {selectedTemplate === template.id && (
                          <div className="w-4 h-4 bg-cardshow-green rounded-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="popular" className="mt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {filteredTemplates.filter(t => t.category === 'popular').map((template) => (
                      <div 
                        key={template.id}
                        className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${
                          selectedTemplate === template.id 
                            ? 'bg-editor-tool border border-editor-border' 
                            : 'hover:bg-editor-tool/50'
                        }`}
                        onClick={() => {
                          onSelectTemplate(template.id);
                          toast(`Template selected: ${template.name}`);
                        }}
                      >
                        <div className={`w-10 h-10 rounded ${template.color}`}></div>
                        <div className="flex-1">
                          <p className="text-cardshow-white font-medium">{template.name}</p>
                        </div>
                        {selectedTemplate === template.id && (
                          <div className="w-4 h-4 bg-cardshow-green rounded-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="recent" className="mt-4">
                <div className="flex flex-col items-center justify-center py-8 text-cardshow-lightGray">
                  <p>No recent templates</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );
      case 'assets':
        return (
          <div className="space-y-4">
            <Tabs defaultValue="stickers">
              <TabsList className="bg-editor-darker w-full">
                <TabsTrigger value="stickers" className="flex-1">Stickers</TabsTrigger>
                <TabsTrigger value="backgrounds" className="flex-1">Backgrounds</TabsTrigger>
                <TabsTrigger value="textures" className="flex-1">Textures</TabsTrigger>
              </TabsList>
              <TabsContent value="stickers" className="mt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid grid-cols-2 gap-4">
                    {filteredAssets.filter(a => a.category === 'stickers' || a.category === 'elements').map((asset) => (
                      <div 
                        key={asset.id}
                        className="p-3 rounded-lg cursor-pointer flex flex-col items-center bg-editor-darker hover:bg-editor-tool/50 transition-colors"
                        onClick={() => handleAssetSelect(asset)}
                      >
                        <img src={asset.thumb} alt={asset.name} className="w-full aspect-square rounded bg-editor-tool object-cover mb-2" />
                        <p className="text-cardshow-white font-medium text-sm text-center">{asset.name}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="backgrounds" className="mt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid grid-cols-2 gap-4">
                    {filteredAssets.filter(a => a.category === 'backgrounds').map((asset) => (
                      <div 
                        key={asset.id}
                        className="p-3 rounded-lg cursor-pointer flex flex-col items-center bg-editor-darker hover:bg-editor-tool/50 transition-colors"
                        onClick={() => handleAssetSelect(asset)}
                      >
                        <img src={asset.thumb} alt={asset.name} className="w-full aspect-square rounded bg-editor-tool object-cover mb-2" />
                        <p className="text-cardshow-white font-medium text-sm text-center">{asset.name}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="textures" className="mt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid grid-cols-2 gap-4">
                    {filteredAssets.filter(a => a.category === 'textures').map((asset) => (
                      <div 
                        key={asset.id}
                        className="p-3 rounded-lg cursor-pointer flex flex-col items-center bg-editor-darker hover:bg-editor-tool/50 transition-colors"
                        onClick={() => handleAssetSelect(asset)}
                      >
                        <img src={asset.thumb} alt={asset.name} className="w-full aspect-square rounded bg-editor-tool object-cover mb-2" />
                        <p className="text-cardshow-white font-medium text-sm text-center">{asset.name}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="w-80 h-full bg-editor-dark border-r border-editor-border overflow-y-auto">
      {/* Search bar */}
      <div className="p-4 border-b border-editor-border">
        <Input
          placeholder="Search templates & assets..."
          className="bg-editor-darker border-editor-border text-white focus-visible:ring-cardshow-blue"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Tab navigation */}
      <div className="flex border-b border-editor-border">
        <button 
          className={`flex-1 py-3 text-sm font-medium ${selectedTab === 'upload' ? 'text-cardshow-white border-b-2 border-cardshow-blue' : 'text-cardshow-lightGray'}`}
          onClick={() => setSelectedTab('upload')}
        >
          Upload
        </button>
        <button 
          className={`flex-1 py-3 text-sm font-medium ${selectedTab === 'templates' ? 'text-cardshow-white border-b-2 border-cardshow-blue' : 'text-cardshow-lightGray'}`}
          onClick={() => setSelectedTab('templates')}
        >
          Templates
        </button>
        <button 
          className={`flex-1 py-3 text-sm font-medium ${selectedTab === 'assets' ? 'text-cardshow-white border-b-2 border-cardshow-blue' : 'text-cardshow-lightGray'}`}
          onClick={() => setSelectedTab('assets')}
        >
          Assets
        </button>
      </div>
      
      <div className="p-6 space-y-6">
        {renderTabContent()}
      </div>
      
      <SidebarSection title="Card Design Elements">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-cardshow-lightGray uppercase">Background</Label>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i}
                  className={`aspect-square rounded cursor-pointer hover:ring-1 hover:ring-cardshow-blue transition-all ${
                    i === 0 ? 'bg-gradient-to-br from-editor-darker to-editor-tool border-2 border-cardshow-green' :
                    i === 1 ? 'bg-gradient-to-br from-purple-800 to-blue-600' :
                    i === 2 ? 'bg-gradient-to-br from-red-600 to-orange-500' :
                    i === 3 ? 'bg-gradient-to-br from-green-600 to-teal-500' :
                    'bg-gradient-to-br from-blue-700 to-indigo-800'
                  }`}
                  onClick={() => toast(`Background ${i+1} selected`)}
                ></div>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-xs text-cardshow-lightGray uppercase">Elements</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button variant="outline" size="icon" className="p-2 rounded bg-editor-darker hover:bg-editor-tool text-cardshow-lightGray" onClick={() => toast('Image tool selected')}>
                <Image size={20} />
              </Button>
              <Button variant="outline" size="icon" className="p-2 rounded bg-editor-darker hover:bg-editor-tool text-cardshow-lightGray" onClick={() => toast('Text tool selected')}>
                <Type size={20} />
              </Button>
              <Button variant="outline" size="icon" className="p-2 rounded bg-editor-darker hover:bg-editor-tool text-cardshow-lightGray" onClick={() => toast('Shape tool selected')}>
                <Square size={20} />
              </Button>
              <Button variant="outline" size="icon" className="p-2 rounded bg-editor-darker hover:bg-editor-tool text-cardshow-lightGray" onClick={() => toast('Grid tool selected')}>
                <LayoutGrid size={20} />
              </Button>
              <Button variant="outline" size="icon" className="p-2 rounded bg-editor-darker hover:bg-editor-tool text-cardshow-lightGray" onClick={() => toast('Sticker tool selected')}>
                <Star size={20} />
              </Button>
            </div>
          </div>
        </div>
      </SidebarSection>
      
      {/* Layer section */}
      <SidebarSection title="Layers">
        <div className="space-y-2">
          <div className="p-2 rounded bg-editor-darker flex items-center justify-between">
            <span className="text-cardshow-white text-sm">Background</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-cardshow-lightGray hover:text-cardshow-white" onClick={() => toast('Add to background')}>
                <Plus size={14} />
              </Button>
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-cardshow-lightGray hover:text-cardshow-white" onClick={() => toast('Delete background')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </Button>
            </div>
          </div>
          
          <div className="p-2 rounded bg-editor-tool flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-cardshow-green hover:bg-cardshow-green text-white px-1 py-0 h-4">
                <Image size={10} className="mr-1" />
                <span className="text-[10px]">IMG</span>
              </Badge>
              <span className="text-cardshow-white text-sm">Card Art</span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-cardshow-lightGray hover:text-cardshow-white" onClick={() => toast('Duplicate card art')}>
                <Copy size={14} />
              </Button>
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-cardshow-lightGray hover:text-cardshow-white" onClick={() => toast('Delete card art')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </Button>
            </div>
          </div>
          
          <div className="p-2 rounded bg-editor-darker flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-cardshow-orange hover:bg-cardshow-orange text-white px-1 py-0 h-4">
                <Square size={10} className="mr-1" />
                <span className="text-[10px]">FRM</span>
              </Badge>
              <span className="text-cardshow-white text-sm">Frame</span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-cardshow-lightGray hover:text-cardshow-white" onClick={() => toast('Edit frame')}>
                <Pencil size={14} />
              </Button>
              <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-cardshow-lightGray hover:text-cardshow-white" onClick={() => toast('Delete frame')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </Button>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2 text-xs font-medium border-dashed border-editor-border hover:bg-editor-darker"
            onClick={() => toast('Adding new layer')}
          >
            <Plus size={14} className="mr-1" />
            Add Layer
          </Button>
        </div>
      </SidebarSection>
    </div>
  );
};

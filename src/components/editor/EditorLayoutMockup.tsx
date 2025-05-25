
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Image, 
  Upload, 
  Grid, 
  Save, 
  Share, 
  Settings,
  Palette,
  Type,
  Square,
  Circle
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const EditorLayoutMockup = () => {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-white text-xl font-semibold">Card Editor</h1>
          <div className="text-sm text-gray-400">Auto-saving...</div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-gray-300">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            Publish
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Collapsible Left Panel */}
        <div className={`bg-gray-800 border-r border-gray-700 transition-all duration-300 ${
          leftPanelOpen ? 'w-80' : 'w-12'
        }`}>
          <div className="p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftPanelOpen(!leftPanelOpen)}
              className="w-full justify-start text-gray-300"
            >
              {leftPanelOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              {leftPanelOpen && <span className="ml-2">Templates & Assets</span>}
            </Button>
          </div>
          
          {leftPanelOpen && (
            <div className="px-4 space-y-6">
              {/* Templates Section */}
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center">
                  <Grid className="w-4 h-4 mr-2" />
                  Templates
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-[3/4] bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg cursor-pointer hover:scale-105 transition-transform">
                      <div className="p-2">
                        <div className="text-xs text-white">Template {i}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assets Section */}
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center">
                  <Image className="w-4 h-4 mr-2" />
                  Assets
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="aspect-square bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors">
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Assets
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 bg-gray-900 flex flex-col">
          {/* Toolbar */}
          <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-2">
            <Button variant="ghost" size="sm" className="text-gray-300">
              <Type className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-300">
              <Square className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-300">
              <Circle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-300">
              <Palette className="w-4 h-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Zoom:</span>
              <span className="text-white text-sm">100%</span>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="bg-white rounded-lg shadow-2xl p-4" style={{ width: '320px', height: '420px' }}>
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-600 rounded flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-lg font-bold">Your Card</div>
                  <div className="text-sm opacity-80">Design Preview</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wide Right Sidebar - Card Studio */}
        <div className="w-96 bg-gray-800 border-l border-gray-700 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-white text-xl font-semibold mb-6">Card Studio</h2>
            
            {/* Card Details Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-medium mb-4 text-lg">Details</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Title</Label>
                    <Input 
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                      placeholder="Enter card title"
                      defaultValue="Awesome Card"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Description</Label>
                    <Textarea 
                      className="mt-1 bg-gray-700 border-gray-600 text-white h-20"
                      placeholder="Card description..."
                      defaultValue="A beautiful card created with advanced tools"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Properties Section */}
              <div>
                <h3 className="text-white font-medium mb-4 text-lg">Properties</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Type</Label>
                    <select className="w-full mt-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                      <option>Digital</option>
                      <option>Handcrafted</option>
                      <option>AI Generated</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Rarity</Label>
                    <select className="w-full mt-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
                      <option>Common</option>
                      <option>Rare</option>
                      <option>Legendary</option>
                    </select>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Effects Section */}
              <div>
                <h3 className="text-white font-medium mb-4 text-lg">Effects & Style</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Background</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {['bg-gradient-to-r from-purple-500 to-pink-500', 'bg-gradient-to-r from-blue-500 to-green-500', 'bg-gradient-to-r from-yellow-500 to-red-500', 'bg-gradient-to-r from-indigo-500 to-purple-500'].map((bg, i) => (
                        <div key={i} className={`aspect-square rounded cursor-pointer border-2 border-transparent hover:border-white ${bg}`}></div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Border Style</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {['None', 'Solid', 'Glow'].map(style => (
                        <Button key={style} variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                          {style}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Tags Section */}
              <div>
                <h3 className="text-white font-medium mb-4 text-lg">Tags</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['retro', 'synthwave', 'digital-art'].map(tag => (
                    <span key={tag} className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
                <Input 
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Add a tag..."
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button className="w-full bg-green-600 hover:bg-green-700 py-3">
                  Save Card
                </Button>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 py-3">
                  Publish Card
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

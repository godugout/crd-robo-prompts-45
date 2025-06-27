
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Video, Camera, Settings } from 'lucide-react';

interface ExportControlsProps {
  viewMode: '2d' | '3d';
}

const EXPORT_FORMATS = [
  { type: 'image', format: 'PNG', size: '4K', icon: Camera },
  { type: 'image', format: 'JPG', size: '1080p', icon: Camera },
  { type: 'video', format: 'MP4', size: '4K', icon: Video },
  { type: 'video', format: 'GIF', size: '720p', icon: Video }
];

export const ExportControls: React.FC<ExportControlsProps> = ({ viewMode }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-green-400">Export</h3>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
          {viewMode.toUpperCase()}
        </Badge>
      </div>

      {/* Export Formats */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Formats</h4>
        <div className="grid grid-cols-2 gap-2">
          {EXPORT_FORMATS.map((format, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="border-white/20 hover:border-white/40 text-white hover:bg-white/10 flex-col h-auto p-3"
            >
              <format.icon className="w-6 h-6 mb-2 text-green-400" />
              <div className="text-center">
                <div className="text-xs font-medium">{format.format}</div>
                <div className="text-xs text-gray-400">{format.size}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Export Settings */}
      <Card className="p-4 bg-black/20 border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-white">Settings</h4>
          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-1">
            <Settings className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Quality:</span>
            <span className="text-green-400">Ultra</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Resolution:</span>
            <span className="text-green-400">3840×2160</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Duration:</span>
            <span className="text-green-400">5 seconds</span>
          </div>
        </div>
      </Card>

      {/* Export Actions */}
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1 text-white border-white/20">
          Preview
        </Button>
        <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600 text-white">
          <Download className="w-3 h-3 mr-1" />
          Export
        </Button>
      </div>
    </div>
  );
};

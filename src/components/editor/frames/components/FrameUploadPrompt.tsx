
import React from 'react';
import { Upload } from 'lucide-react';

interface FrameUploadPromptProps {
  show: boolean;
}

export const FrameUploadPrompt: React.FC<FrameUploadPromptProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="text-center p-6 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/50">
      <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
      <p className="text-gray-300 mb-2">Drop your image here or click to upload</p>
      <p className="text-gray-500 text-sm">Your image will appear in the selected frame above</p>
    </div>
  );
};

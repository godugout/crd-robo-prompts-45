
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FullPageOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const FullPageOverlay = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  actions 
}: FullPageOverlayProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900">
      {/* Header */}
      <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
        <h1 className="text-white text-xl font-semibold">{title}</h1>
        <div className="flex items-center gap-4">
          {actions}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100vh-4rem)] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

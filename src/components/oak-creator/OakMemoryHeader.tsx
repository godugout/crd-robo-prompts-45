
import React from 'react';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardshowLogo } from '@/assets/brand';

interface OakMemoryHeaderProps {
  onBack?: () => void;
  onShare?: () => void;
  onSave?: () => void;
}

export const OakMemoryHeader: React.FC<OakMemoryHeaderProps> = ({
  onBack,
  onShare,
  onSave
}) => {
  return (
    <header className="h-[60px] bg-[#0f4c3a] border-b border-[#0f4c3a]/20 flex items-center justify-between px-4 z-10">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBack}
          className="text-[#ffd700] hover:bg-[#0f4c3a]/80 hover:text-[#ffd700]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <div className="w-8 h-8 rounded-full bg-[#ffd700] flex items-center justify-center">
          <span className="text-[#0f4c3a] font-bold text-sm">A</span>
        </div>
        
        <h1 className="text-[#ffd700] font-semibold text-lg hidden sm:block">
          Oakland A's Memory Creator
        </h1>
        <h1 className="text-[#ffd700] font-semibold text-sm sm:hidden">
          A's Memories
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="border-[#ffd700] text-[#ffd700] hover:bg-[#ffd700] hover:text-[#0f4c3a] hidden md:flex"
        >
          2D Preview
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onShare}
          className="border-[#ffd700] text-[#ffd700] hover:bg-[#ffd700] hover:text-[#0f4c3a]"
        >
          <Share2 className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Share</span>
        </Button>
        <Button 
          size="sm"
          onClick={onSave}
          className="bg-[#ffd700] text-[#0f4c3a] hover:bg-[#ffd700]/90 font-medium"
        >
          <Download className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Save Memory</span>
        </Button>
      </div>
    </header>
  );
};

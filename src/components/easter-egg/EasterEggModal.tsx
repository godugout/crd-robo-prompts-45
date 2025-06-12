
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleEnterOakCreator = () => {
    navigate('/oak-memory-creator');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#0f4c3a] border-[#ffd700] border-2 text-center">
        <div className="py-6">
          {/* Oakland A's Logo */}
          <div className="w-20 h-20 rounded-full bg-[#ffd700] flex items-center justify-center mx-auto mb-6">
            <span className="text-[#0f4c3a] font-bold text-4xl">A</span>
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-[#ffd700] mb-4">
            🎉 Easter Egg Discovered!
          </h2>
          
          {/* Description */}
          <p className="text-[#ffd700]/90 mb-6 leading-relaxed">
            Welcome to the secret Oakland A's Memory Creator! 
            Create custom A's themed cards and memories.
          </p>
          
          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#ffd700] text-[#ffd700] hover:bg-[#ffd700] hover:text-[#0f4c3a]"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleEnterOakCreator}
              className="bg-[#ffd700] text-[#0f4c3a] hover:bg-[#ffd700]/90 font-bold"
            >
              Enter A's Creator ⚾
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Instagram, Download, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { scrapeInstagramFeed } from '@/services/instagramScraper';
import { detectTradingCards, DetectedCard } from '@/services/cardDetector';

interface InstagramImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportCards: (cards: DetectedCard[]) => void;
}

export const InstagramImportModal = ({ isOpen, onClose, onImportCards }: InstagramImportModalProps) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedCards, setDetectedCards] = useState<DetectedCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

  const handleScrape = async () => {
    if (!username.trim()) {
      toast.error('Please enter an Instagram username');
      return;
    }

    setIsLoading(true);
    try {
      toast.info('Scanning Instagram feed...');
      const posts = await scrapeInstagramFeed(username.trim());
      
      toast.info('Detecting trading cards...');
      const cards = await detectTradingCards(posts);
      
      if (cards.length === 0) {
        toast.warning('No trading cards detected in recent posts');
      } else {
        toast.success(`Found ${cards.length} potential trading cards!`);
      }
      
      setDetectedCards(cards);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to scan Instagram feed');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCardSelection = (imageUrl: string) => {
    const newSelected = new Set(selectedCards);
    if (newSelected.has(imageUrl)) {
      newSelected.delete(imageUrl);
    } else {
      newSelected.add(imageUrl);
    }
    setSelectedCards(newSelected);
  };

  const handleImport = () => {
    const cardsToImport = detectedCards.filter(card => selectedCards.has(card.imageUrl));
    if (cardsToImport.length === 0) {
      toast.error('Please select at least one card to import');
      return;
    }
    
    onImportCards(cardsToImport);
    toast.success(`Importing ${cardsToImport.length} cards as frames...`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-editor-dark text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Instagram className="w-5 h-5 text-pink-500" />
            Import from Instagram
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Username Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter Instagram username (e.g., cardcollector123)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-editor-darker border-editor-border text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
            />
            <Button 
              onClick={handleScrape} 
              disabled={isLoading}
              className="bg-crd-green hover:bg-crd-green/80"
            >
              {isLoading ? 'Scanning...' : 'Scan Feed'}
            </Button>
          </div>

          {/* Info */}
          <div className="flex items-center gap-2 text-crd-lightGray text-sm">
            <AlertCircle className="w-4 h-4" />
            Only public Instagram accounts can be scanned
          </div>

          {/* Results */}
          {detectedCards.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">
                  Detected Cards ({detectedCards.length})
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCards(new Set(detectedCards.map(c => c.imageUrl)))}
                    className="border-editor-border text-white hover:bg-editor-darker"
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCards(new Set())}
                    className="border-editor-border text-white hover:bg-editor-darker"
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-96">
                <div className="grid grid-cols-3 gap-3 pr-4">
                  {detectedCards.map((card, index) => (
                    <div
                      key={card.imageUrl}
                      className={`relative group cursor-pointer rounded-lg overflow-hidden transition-all ${
                        selectedCards.has(card.imageUrl)
                          ? 'ring-2 ring-crd-green shadow-lg scale-105'
                          : 'hover:scale-102 hover:shadow-md'
                      }`}
                      onClick={() => toggleCardSelection(card.imageUrl)}
                    >
                      <img
                        src={card.imageUrl}
                        alt={`Detected card ${index + 1}`}
                        className="w-full aspect-[3/4] object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute top-2 right-2">
                        <div className="bg-black/60 text-white text-xs px-2 py-1 rounded">
                          {Math.round(card.confidence)}%
                        </div>
                      </div>
                      {selectedCards.has(card.imageUrl) && (
                        <div className="absolute top-2 left-2 w-5 h-5 bg-crd-green rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="border-editor-border text-white hover:bg-editor-darker"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={selectedCards.size === 0}
                  className="bg-crd-green hover:bg-crd-green/80"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Import {selectedCards.size} Cards
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};


import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Eye, Download, RotateCcw } from 'lucide-react';

interface DetectedCard {
  id: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
}

export const CardDetectionTester: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [detectedCards, setDetectedCards] = useState<DetectedCard[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setDetectedCards([]);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const detectCards = useCallback(async () => {
    if (!image) return;
    
    setIsProcessing(true);
    
    // Simulate card detection
    setTimeout(() => {
      const mockCards: DetectedCard[] = [
        { id: '1', bounds: { x: 50, y: 50, width: 200, height: 280 }, confidence: 0.95 },
        { id: '2', bounds: { x: 300, y: 100, width: 200, height: 280 }, confidence: 0.88 }
      ];
      setDetectedCards(mockCards);
      setIsProcessing(false);
    }, 2000);
  }, [image]);

  const reset = useCallback(() => {
    setImage(null);
    setDetectedCards([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="min-h-screen bg-crd-darkest p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Card Detection Tester</h1>
          <p className="text-crd-lightGray">Upload an image to test card detection algorithms</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <Card className="p-6 bg-crd-dark border-crd-mediumGray">
            <h2 className="text-xl font-semibold text-white mb-4">Upload Image</h2>
            
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-crd-green hover:bg-crd-green/90 text-black"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </Button>

              {image && (
                <div className="space-y-3">
                  <Button
                    onClick={detectCards}
                    disabled={isProcessing}
                    className="w-full bg-crd-blue hover:bg-crd-blue/90 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Detecting...' : 'Detect Cards'}
                  </Button>

                  <Button
                    onClick={reset}
                    variant="outline"
                    className="w-full border-crd-mediumGray text-crd-lightGray hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Results Section */}
          <Card className="p-6 bg-crd-dark border-crd-mediumGray">
            <h2 className="text-xl font-semibold text-white mb-4">Detection Results</h2>
            
            {image ? (
              <div className="relative">
                <img
                  src={image}
                  alt="Uploaded"
                  className="w-full h-auto rounded-lg"
                />
                
                {detectedCards.map((card) => (
                  <div
                    key={card.id}
                    className="absolute border-2 border-crd-green bg-crd-green/10"
                    style={{
                      left: `${(card.bounds.x / 600) * 100}%`,
                      top: `${(card.bounds.y / 400) * 100}%`,
                      width: `${(card.bounds.width / 600) * 100}%`,
                      height: `${(card.bounds.height / 400) * 100}%`,
                    }}
                  >
                    <div className="absolute -top-6 left-0 bg-crd-green text-black px-2 py-1 rounded text-xs font-medium">
                      {Math.round(card.confidence * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-crd-lightGray">
                <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Upload an image to see detection results</p>
              </div>
            )}
          </Card>
        </div>

        {detectedCards.length > 0 && (
          <Card className="mt-6 p-6 bg-crd-dark border-crd-mediumGray">
            <h2 className="text-xl font-semibold text-white mb-4">Detected Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {detectedCards.map((card) => (
                <div key={card.id} className="bg-crd-mediumGray p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Card {card.id}</span>
                    <span className="text-crd-green text-sm">{Math.round(card.confidence * 100)}%</span>
                  </div>
                  <div className="text-sm text-crd-lightGray">
                    <div>Position: {card.bounds.x}, {card.bounds.y}</div>
                    <div>Size: {card.bounds.width} × {card.bounds.height}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

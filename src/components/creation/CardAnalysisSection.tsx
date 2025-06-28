
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Upload, Eye, CheckCircle } from 'lucide-react';
import { useCardAnalysis } from '@/hooks/useCardAnalysis';
import type { CardMetadata } from '@/services/cardAnalyzer/CardMetadataAnalyzer';

interface CardAnalysisSectionProps {
  onMetadataExtracted: (metadata: CardMetadata) => void;
  existingImageUrl?: string;
}

export const CardAnalysisSection: React.FC<CardAnalysisSectionProps> = ({
  onMetadataExtracted,
  existingImageUrl
}) => {
  const [imageUrl, setImageUrl] = useState(existingImageUrl || '');
  const { isAnalyzing, analysisResult, analyzeCard } = useCardAnalysis();

  const handleAnalyze = async () => {
    if (!imageUrl.trim()) {
      return;
    }

    const metadata = await analyzeCard(imageUrl);
    if (metadata) {
      onMetadataExtracted(metadata);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  return (
    <Card className="p-6 bg-gray-800/50 border-gray-600">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-crd-green" />
          <h3 className="text-lg font-semibold text-white">AI Card Analysis</h3>
        </div>
        
        <p className="text-gray-400 text-sm">
          Upload or provide a URL to your card image for automatic metadata extraction
        </p>

        <div className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-white">Card Image</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="bg-gray-800/50 border-gray-600 text-white"
              />
              <Button
                variant="outline"
                size="icon"
                className="border-gray-600 text-gray-300"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <Label className="text-white">Or Image URL</Label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/card-image.jpg"
              className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>

          {/* Image Preview */}
          {imageUrl && (
            <div className="space-y-2">
              <Label className="text-white">Preview</Label>
              <div className="relative w-full h-48 bg-gray-900 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Card preview"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={!imageUrl || isAnalyzing}
            className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Card...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Analyze Card with AI
              </>
            )}
          </Button>

          {/* Analysis Results */}
          {analysisResult && (
            <div className="space-y-3 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium">Analysis Results</h4>
                <Badge
                  variant={analysisResult.confidence > 0.7 ? 'default' : 'outline'}
                  className={analysisResult.confidence > 0.7 ? 'bg-green-500 text-white' : 'border-yellow-500 text-yellow-400'}
                >
                  {Math.round(analysisResult.confidence * 100)}% confidence
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {analysisResult.metadata.player && (
                  <div>
                    <span className="text-gray-400">Player:</span>
                    <span className="text-white ml-2">{analysisResult.metadata.player}</span>
                  </div>
                )}
                {analysisResult.metadata.team && (
                  <div>
                    <span className="text-gray-400">Team:</span>
                    <span className="text-white ml-2">{analysisResult.metadata.team}</span>
                  </div>
                )}
                {analysisResult.metadata.year && (
                  <div>
                    <span className="text-gray-400">Year:</span>
                    <span className="text-white ml-2">{analysisResult.metadata.year}</span>
                  </div>
                )}
                {analysisResult.metadata.brand && (
                  <div>
                    <span className="text-gray-400">Brand:</span>
                    <span className="text-white ml-2">{analysisResult.metadata.brand}</span>
                  </div>
                )}
                {analysisResult.metadata.cardNumber && (
                  <div>
                    <span className="text-gray-400">Card #:</span>
                    <span className="text-white ml-2">{analysisResult.metadata.cardNumber}</span>
                  </div>
                )}
                {analysisResult.metadata.position && (
                  <div>
                    <span className="text-gray-400">Position:</span>
                    <span className="text-white ml-2">{analysisResult.metadata.position}</span>
                  </div>
                )}
              </div>

              {analysisResult.metadata.isRookie && (
                <Badge className="bg-yellow-500 text-black">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Rookie Card
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

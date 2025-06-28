
import { useState } from 'react';
import { toast } from 'sonner';
import { cardMetadataAnalyzer, type CardMetadata, type AnalysisResult } from '@/services/cardAnalyzer/CardMetadataAnalyzer';

export const useCardAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const analyzeCard = async (imageUrl: string): Promise<CardMetadata | null> => {
    setIsAnalyzing(true);
    
    try {
      toast.loading('Analyzing card image with AI...');
      
      const result = await cardMetadataAnalyzer.analyzeCard(imageUrl);
      setAnalysisResult(result);
      
      toast.dismiss();
      
      if (result.confidence > 0.3) {
        toast.success(`Card analyzed successfully! Confidence: ${Math.round(result.confidence * 100)}%`);
      } else {
        toast.warning('Card analysis completed with low confidence. Please review the results.');
      }
      
      return result.metadata;
    } catch (error) {
      console.error('Card analysis failed:', error);
      toast.dismiss();
      toast.error('Failed to analyze card. Please try again.');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveAnalysis = async (cardId: string) => {
    if (analysisResult) {
      await cardMetadataAnalyzer.saveAnalysisResult(cardId, analysisResult);
    }
  };

  return {
    isAnalyzing,
    analysisResult,
    analyzeCard,
    saveAnalysis
  };
};

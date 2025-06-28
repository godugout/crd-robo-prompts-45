
import { supabase } from '@/integrations/supabase/client';

export interface CardMetadata {
  player?: string;
  team?: string;
  sport?: string;
  year?: number;
  brand?: string;
  series?: string;
  cardNumber?: string;
  position?: string;
  rarity?: string;
  isRookie?: boolean;
  stats?: Record<string, any>;
  confidence?: number;
}

export interface AnalysisResult {
  metadata: CardMetadata;
  confidence: number;
  source: 'ocr' | 'ai_vision' | 'pattern_match';
  processingTime: number;
}

export class CardMetadataAnalyzer {
  private async analyzeWithAI(imageUrl: string): Promise<AnalysisResult> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('card-metadata-analyzer', {
        body: { imageUrl }
      });

      if (error) throw error;

      return {
        metadata: data.metadata,
        confidence: data.confidence || 0.8,
        source: 'ai_vision',
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      console.error('AI analysis failed:', error);
      return this.fallbackAnalysis(imageUrl, startTime);
    }
  }

  private async fallbackAnalysis(imageUrl: string, startTime: number): Promise<AnalysisResult> {
    // Basic pattern matching and OCR fallback
    const metadata: CardMetadata = {
      confidence: 0.3
    };

    // Simple pattern matching for common card features
    if (imageUrl.includes('rookie') || imageUrl.includes('RC')) {
      metadata.isRookie = true;
    }

    return {
      metadata,
      confidence: 0.3,
      source: 'pattern_match',
      processingTime: Date.now() - startTime
    };
  }

  async analyzeCard(imageUrl: string): Promise<AnalysisResult> {
    return this.analyzeWithAI(imageUrl);
  }

  async saveAnalysisResult(cardId: string, result: AnalysisResult): Promise<void> {
    const { error } = await supabase
      .from('card_analysis_results')
      .insert({
        card_id: cardId,
        analysis_type: result.source,
        confidence_score: result.confidence,
        extracted_data: result.metadata,
        processing_time_ms: result.processingTime
      });

    if (error) {
      console.error('Failed to save analysis result:', error);
    }
  }

  async getBrands(): Promise<Array<{ id: string; name: string }>> {
    const { data, error } = await supabase
      .from('card_brands')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Failed to fetch brands:', error);
      return [];
    }

    return data || [];
  }

  async getTeams(sport?: string): Promise<Array<{ id: string; name: string; sport: string; league: string }>> {
    let query = supabase
      .from('sports_teams')
      .select('id, name, sport, league')
      .order('name');

    if (sport) {
      query = query.eq('sport', sport);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch teams:', error);
      return [];
    }

    return data || [];
  }
}

export const cardMetadataAnalyzer = new CardMetadataAnalyzer();

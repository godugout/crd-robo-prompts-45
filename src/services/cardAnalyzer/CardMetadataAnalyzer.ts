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
  [key: string]: any; // Add index signature for Json compatibility
}

export interface AnalysisResult {
  metadata: CardMetadata;
  confidence: number;
  source: 'pattern_match' | 'ai_vision' | 'huggingface';
  processingTime: number;
}

export class CardMetadataAnalyzer {
  private async analyzeWithHuggingFace(imageUrl: string): Promise<AnalysisResult> {
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('card-metadata-analyzer', {
        body: { imageUrl }
      });

      if (error) throw error;

      return {
        metadata: data.metadata,
        confidence: data.confidence || 0.3,
        source: 'huggingface',
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      console.error('Hugging Face analysis failed:', error);
      return this.fallbackAnalysis(imageUrl, startTime);
    }
  }

  private async fallbackAnalysis(imageUrl: string, startTime: number): Promise<AnalysisResult> {
    // Enhanced pattern matching and OCR fallback
    const metadata: CardMetadata = {
      confidence: 0.2
    };

    const urlLower = imageUrl.toLowerCase();
    
    // Enhanced pattern matching
    if (urlLower.includes('rookie') || urlLower.includes('rc')) {
      metadata.isRookie = true;
    }

    // Sport detection
    if (urlLower.includes('basketball') || urlLower.includes('nba')) {
      metadata.sport = 'Basketball';
    } else if (urlLower.includes('baseball') || urlLower.includes('mlb')) {
      metadata.sport = 'Baseball';
    } else if (urlLower.includes('football') || urlLower.includes('nfl')) {
      metadata.sport = 'Football';
    } else if (urlLower.includes('hockey') || urlLower.includes('nhl')) {
      metadata.sport = 'Hockey';
    }

    // Brand detection
    const brands = ['topps', 'panini', 'upper-deck', 'bowman', 'fleer', 'donruss'];
    for (const brand of brands) {
      if (urlLower.includes(brand)) {
        metadata.brand = brand.replace('-', ' ').split(' ').map(w => 
          w.charAt(0).toUpperCase() + w.slice(1)
        ).join(' ');
        break;
      }
    }

    // Default rarity
    metadata.rarity = 'common';

    return {
      metadata,
      confidence: 0.2,
      source: 'pattern_match',
      processingTime: Date.now() - startTime
    };
  }

  async analyzeCard(imageUrl: string): Promise<AnalysisResult> {
    return this.analyzeWithHuggingFace(imageUrl);
  }

  async saveAnalysisResult(cardId: string, result: AnalysisResult): Promise<void> {
    const { error } = await supabase
      .from('card_analysis_results')
      .insert({
        card_id: cardId,
        analysis_type: result.source,
        confidence_score: result.confidence,
        extracted_data: result.metadata as any, // Cast to any for Json compatibility
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

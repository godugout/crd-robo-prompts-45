
import { supabase } from '@/lib/supabase-client';
import { EnhancedProcessedPSD } from '@/types/psdTypes';
import { toast } from 'sonner';

export interface SavePSDCardData {
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  processedPSD: EnhancedProcessedPSD;
  selectedLayerIds?: string[];
}

export const savePSDAsCard = async (data: SavePSDCardData) => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Authentication required to save cards');
    }

    // Prepare reconstruction data
    const reconstructionData = {
      originalDimensions: {
        width: data.processedPSD.width,
        height: data.processedPSD.height
      },
      layerStructure: data.processedPSD.layers.map(layer => ({
        id: layer.id,
        name: layer.name,
        bounds: layer.bounds,
        semanticType: layer.semanticType,
        hasRealImage: layer.hasRealImage,
        opacity: layer.opacity
      })),
      selectedLayers: data.selectedLayerIds || [],
      extractedImages: {
        flattenedImageUrl: data.processedPSD.flattenedImageUrl,
        layerCount: data.processedPSD.layers.length
      }
    };

    // Save to psd_reconstructed_cards table
    // This will automatically trigger the creation of a main card entry
    const { data: savedCard, error } = await supabase
      .from('psd_reconstructed_cards')
      .insert({
        user_id: user.id,
        original_psd_name: data.processedPSD.fileName,
        title: data.title,
        description: data.description,
        image_url: data.imageUrl,
        thumbnail_url: data.thumbnailUrl || data.imageUrl,
        reconstruction_data: reconstructionData,
        layer_count: data.processedPSD.layers.length,
        processing_metadata: {
          totalLayers: data.processedPSD.totalLayers,
          processedAt: new Date().toISOString(),
          hasExtractedImages: !!data.processedPSD.extractedImages
        }
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast.success('🎉 Card saved to CRD Catalog successfully!');
    return savedCard;
    
  } catch (error) {
    console.error('Error saving PSD as card:', error);
    toast.error('Failed to save card. Please try again.');
    throw error;
  }
};

export const getUserPSDCards = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Authentication required');
    }

    const { data: cards, error } = await supabase
      .from('psd_reconstructed_cards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return cards || [];
    
  } catch (error) {
    console.error('Error fetching user PSD cards:', error);
    return [];
  }
};

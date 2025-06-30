
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const huggingFaceApiKey = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();

    console.log('Analyzing card image:', imageUrl);

    // If no Hugging Face API key, use basic pattern matching
    if (!huggingFaceApiKey) {
      console.log('No Hugging Face API key found, using pattern matching');
      return basicPatternAnalysis(imageUrl);
    }

    try {
      // Use Hugging Face's image-to-text model for card analysis
      const response = await fetch('https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingFaceApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: imageUrl,
          parameters: {
            max_length: 200
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Hugging Face response:', data);

      // Extract metadata from the generated caption
      const caption = data[0]?.generated_text || '';
      const analysisResult = extractMetadataFromCaption(caption, imageUrl);

      return new Response(JSON.stringify(analysisResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('Hugging Face API failed, falling back to pattern matching:', error);
      return basicPatternAnalysis(imageUrl);
    }

  } catch (error) {
    console.error('Error in card-metadata-analyzer:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        metadata: {},
        confidence: 0.0
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function extractMetadataFromCaption(caption: string, imageUrl: string) {
  const metadata: any = {};
  let confidence = 0.3;

  // Basic keyword extraction from caption
  const lowerCaption = caption.toLowerCase();
  
  // Sports detection
  if (lowerCaption.includes('basketball') || lowerCaption.includes('ball')) {
    metadata.sport = 'Basketball';
    confidence += 0.2;
  } else if (lowerCaption.includes('baseball') || lowerCaption.includes('bat')) {
    metadata.sport = 'Baseball';
    confidence += 0.2;
  } else if (lowerCaption.includes('football') || lowerCaption.includes('helmet')) {
    metadata.sport = 'Football';
    confidence += 0.2;
  } else if (lowerCaption.includes('hockey') || lowerCaption.includes('puck')) {
    metadata.sport = 'Hockey';
    confidence += 0.2;
  }

  // Player detection
  if (lowerCaption.includes('player') || lowerCaption.includes('man') || lowerCaption.includes('person')) {
    confidence += 0.1;
  }

  // Team colors and brands
  if (lowerCaption.includes('jersey') || lowerCaption.includes('uniform')) {
    confidence += 0.1;
  }

  // Card-specific terms
  if (lowerCaption.includes('card') || lowerCaption.includes('trading')) {
    confidence += 0.2;
  }

  // Check URL for additional hints
  const urlLower = imageUrl.toLowerCase();
  if (urlLower.includes('rookie') || urlLower.includes('rc')) {
    metadata.isRookie = true;
    confidence += 0.1;
  }

  // Brand detection from common patterns
  const brands = ['topps', 'panini', 'upper deck', 'bowman', 'fleer', 'donruss'];
  for (const brand of brands) {
    if (lowerCaption.includes(brand) || urlLower.includes(brand)) {
      metadata.brand = brand.charAt(0).toUpperCase() + brand.slice(1);
      confidence += 0.15;
      break;
    }
  }

  // Rarity assessment based on visual cues mentioned in caption
  if (lowerCaption.includes('shiny') || lowerCaption.includes('metallic') || lowerCaption.includes('gold')) {
    metadata.rarity = 'rare';
    confidence += 0.1;
  } else if (lowerCaption.includes('special') || lowerCaption.includes('premium')) {
    metadata.rarity = 'epic';
    confidence += 0.1;
  } else {
    metadata.rarity = 'common';
  }

  return {
    metadata,
    confidence: Math.min(confidence, 0.85) // Cap confidence at 85%
  };
}

function basicPatternAnalysis(imageUrl: string) {
  const metadata: any = {};
  let confidence = 0.2;

  const urlLower = imageUrl.toLowerCase();
  
  // Basic URL pattern matching
  if (urlLower.includes('rookie') || urlLower.includes('rc')) {
    metadata.isRookie = true;
    confidence += 0.1;
  }

  if (urlLower.includes('basketball')) {
    metadata.sport = 'Basketball';
    confidence += 0.2;
  } else if (urlLower.includes('baseball') || urlLower.includes('mlb')) {
    metadata.sport = 'Baseball';
    confidence += 0.2;
  } else if (urlLower.includes('football') || urlLower.includes('nfl')) {
    metadata.sport = 'Football';
    confidence += 0.2;
  } else if (urlLower.includes('hockey') || urlLower.includes('nhl')) {
    metadata.sport = 'Hockey';
    confidence += 0.2;
  }

  // Brand detection
  const brands = ['topps', 'panini', 'upper-deck', 'bowman', 'fleer', 'donruss'];
  for (const brand of brands) {
    if (urlLower.includes(brand)) {
      metadata.brand = brand.replace('-', ' ').split(' ').map(w => 
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join(' ');
      confidence += 0.15;
      break;
    }
  }

  // Default rarity
  metadata.rarity = 'common';

  return new Response(JSON.stringify({
    metadata,
    confidence
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

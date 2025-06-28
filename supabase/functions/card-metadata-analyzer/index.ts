
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Analyzing card image:', imageUrl);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a sports card expert. Analyze the provided card image and extract detailed metadata. Return a JSON object with the following structure:
            {
              "metadata": {
                "player": "Player Name",
                "team": "Team Name",
                "sport": "Basketball/Baseball/Football/Hockey",
                "year": 2023,
                "brand": "Topps/Panini/Upper Deck/etc",
                "series": "Series Name",
                "cardNumber": "Card Number",
                "position": "Player Position",
                "rarity": "common/uncommon/rare/epic/legendary",
                "isRookie": true/false,
                "stats": {"points": 25.5, "rebounds": 8.2}
              },
              "confidence": 0.9
            }
            
            Be as accurate as possible. If you can't determine a field, omit it. Focus on extracting text from the card image.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this sports card and extract all visible metadata.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('OpenAI response:', content);

    // Parse the JSON response from OpenAI
    let analysisResult;
    try {
      analysisResult = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      // Fallback with basic structure
      analysisResult = {
        metadata: {},
        confidence: 0.1
      };
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

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

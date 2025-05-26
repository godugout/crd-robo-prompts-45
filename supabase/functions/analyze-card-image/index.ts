
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
    const { imageData } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert trading card analyzer. Analyze the uploaded image and provide card details in JSON format. Focus on:
            - What's depicted in the image (character, object, scene)
            - Visual style and artistic elements
            - Potential rarity based on artwork quality
            - Appropriate categories and tags
            
            Return JSON with: title, description, rarity (common/uncommon/rare/epic/legendary), tags (array), category, type, series`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this trading card image and provide suggested details:'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      }),
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('No response from AI');
    }

    const aiResponse = data.choices[0].message.content;
    
    // Try to parse JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(aiResponse);
    } catch {
      // If JSON parsing fails, create structured response from text
      analysisResult = {
        title: 'AI-Analyzed Card',
        description: aiResponse.substring(0, 200) + '...',
        rarity: 'common',
        tags: ['ai-analyzed', 'custom'],
        category: 'Custom',
        type: 'Character',
        series: 'AI Collection'
      };
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Return default values on error
    const defaultResponse = {
      title: 'Custom Trading Card',
      description: 'A unique collectible card with custom artwork.',
      rarity: 'common',
      tags: ['custom', 'trading-card'],
      category: 'Trading Card',
      type: 'Character',
      series: 'Custom Collection'
    };

    return new Response(JSON.stringify(defaultResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

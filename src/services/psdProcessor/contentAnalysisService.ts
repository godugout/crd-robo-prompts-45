
interface ContentAnalysis {
  type: 'player' | 'logo' | 'text' | 'unknown';
  subject?: string;
  fontFamily?: string;
  wikipediaInfo?: {
    title: string;
    summary: string;
    url: string;
  };
}

export const analyzeLayerContent = async (layer: any): Promise<ContentAnalysis> => {
  const layerName = layer.name?.toLowerCase() || '';
  
  // Basic type detection based on layer name and properties
  let type: ContentAnalysis['type'] = 'unknown';
  let subject: string | undefined;
  let fontFamily: string | undefined;

  // Detect font information for text layers
  if (layer.type === 'text' || layerName.includes('text') || layerName.includes('name')) {
    type = 'text';
    // Try to extract font family from layer properties
    if (layer.textProperties?.font) {
      fontFamily = layer.textProperties.font;
    } else if (layer.textStyle?.font) {
      fontFamily = layer.textStyle.font;
    }
  }

  // Detect player names or subjects
  if (layerName.includes('player') || layerName.includes('name') || 
      layerName.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/)) {
    type = 'player';
    subject = extractSubjectFromName(layerName);
  }

  // Detect logos
  if (layerName.includes('logo') || layerName.includes('team') || layerName.includes('brand')) {
    type = 'logo';
    subject = extractSubjectFromName(layerName);
  }

  // Get Wikipedia info if we have a subject
  let wikipediaInfo;
  if (subject && (type === 'player' || type === 'logo')) {
    try {
      wikipediaInfo = await fetchWikipediaInfo(subject);
    } catch (error) {
      console.warn('Failed to fetch Wikipedia info:', error);
    }
  }

  return {
    type,
    subject,
    fontFamily,
    wikipediaInfo
  };
};

const extractSubjectFromName = (name: string): string => {
  // Clean up layer name to extract meaningful subject
  return name
    .replace(/layer|_|\d+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const fetchWikipediaInfo = async (subject: string) => {
  try {
    // Search for the subject
    const searchResponse = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(subject)}`
    );
    
    if (!searchResponse.ok) {
      throw new Error('Wikipedia search failed');
    }
    
    const data = await searchResponse.json();
    
    return {
      title: data.title,
      summary: data.extract || 'No summary available',
      url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(subject)}`
    };
  } catch (error) {
    // Fallback: try a more generic search
    try {
      const fallbackResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/random`
      );
      return {
        title: subject,
        summary: 'Information not found. This might be a sports card player or brand.',
        url: `https://en.wikipedia.org/wiki/Special:Search/${encodeURIComponent(subject)}`
      };
    } catch {
      throw error;
    }
  }
};

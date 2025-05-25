
interface InstagramPost {
  id: string;
  display_url: string;
  edge_media_to_caption?: {
    edges: Array<{
      node: {
        text: string;
      };
    }>;
  };
  dimensions: {
    height: number;
    width: number;
  };
}

interface InstagramUser {
  edge_owner_to_timeline_media: {
    edges: Array<{
      node: InstagramPost;
    }>;
  };
}

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/'
];

export const scrapeInstagramFeed = async (username: string): Promise<InstagramPost[]> => {
  // Clean the username - remove @ symbol and any URL parts
  const cleanUsername = username.replace(/^@?/, '').replace(/^.*instagram\.com\//, '').replace(/\/$/, '');
  
  if (!cleanUsername) {
    throw new Error('Please enter a valid Instagram username');
  }

  console.log(`Attempting to scrape Instagram profile: ${cleanUsername}`);

  // Try different approaches
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      switch (attempt) {
        case 0:
          return await scrapeWithCorsProxy(cleanUsername);
        case 1:
          return await scrapeDirectly(cleanUsername);
        case 2:
          return await scrapeWithAlternativeEndpoint(cleanUsername);
        default:
          break;
      }
    } catch (error) {
      console.log(`Attempt ${attempt + 1} failed:`, error);
      if (attempt === 2) {
        throw new Error(`Failed to load Instagram profile "${cleanUsername}". This could be due to:\n- Account is private\n- Username doesn't exist\n- Instagram is blocking requests\n\nTry with a different public account.`);
      }
    }
  }

  return [];
};

const scrapeWithCorsProxy = async (username: string): Promise<InstagramPost[]> => {
  const proxyUrl = CORS_PROXIES[0];
  const targetUrl = `https://www.instagram.com/${username}/`;
  
  console.log('Trying CORS proxy approach...');
  
  const response = await fetch(`${proxyUrl}${encodeURIComponent(targetUrl)}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch via proxy');
  }

  const html = await response.text();
  return extractImagesFromHtml(html, username);
};

const scrapeDirectly = async (username: string): Promise<InstagramPost[]> => {
  console.log('Trying direct approach...');
  
  const response = await fetch(`https://www.instagram.com/${username}/?__a=1&__d=dis`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Instagram data directly');
  }

  const data = await response.json();
  const user: InstagramUser = data.graphql?.user || data.data?.user;
  
  if (!user?.edge_owner_to_timeline_media) {
    throw new Error('No posts found or private account');
  }

  return user.edge_owner_to_timeline_media.edges
    .map(edge => edge.node)
    .slice(0, 20);
};

const scrapeWithAlternativeEndpoint = async (username: string): Promise<InstagramPost[]> => {
  console.log('Trying alternative endpoint...');
  
  const response = await fetch(`https://www.instagram.com/web/search/topsearch/?query=${username}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });

  if (!response.ok) {
    throw new Error('Alternative endpoint failed');
  }

  const html = await response.text();
  return extractImagesFromHtml(html, username);
};

const extractImagesFromHtml = (html: string, username: string): InstagramPost[] => {
  console.log('Extracting images from HTML...');
  
  // Look for various patterns where Instagram embeds image URLs
  const patterns = [
    /"display_url":"([^"]+)"/g,
    /"src":"(https:\/\/[^"]*instagram[^"]*\.jpg[^"]*)"/g,
    /content="(https:\/\/[^"]*cdninstagram[^"]*\.jpg[^"]*)"/g,
    /data-src="(https:\/\/[^"]*instagram[^"]*\.jpg[^"]*)"/g,
  ];

  const imageUrls = new Set<string>();
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      let url = match[1];
      // Decode escaped characters
      url = url.replace(/\\u0026/g, '&').replace(/\\/g, '');
      
      // Filter for actual image URLs
      if (url.includes('instagram') && (url.includes('.jpg') || url.includes('.png'))) {
        imageUrls.add(url);
      }
    }
  });

  console.log(`Found ${imageUrls.size} potential images`);

  // Convert to InstagramPost format
  const posts: InstagramPost[] = Array.from(imageUrls).slice(0, 20).map((url, index) => ({
    id: `extracted-${username}-${index}`,
    display_url: url,
    dimensions: {
      height: 1080, // Default dimensions
      width: 1080,
    },
    edge_media_to_caption: {
      edges: [{
        node: {
          text: `Image from @${username}`,
        },
      }],
    },
  }));

  if (posts.length === 0) {
    throw new Error('No images found in the profile. The account might be private or have no posts.');
  }

  return posts;
};

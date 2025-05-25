
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

export const scrapeInstagramFeed = async (username: string): Promise<InstagramPost[]> => {
  try {
    // Instagram's public endpoint - this may need to be proxied in production
    const response = await fetch(`https://www.instagram.com/${username}/?__a=1&__d=dis`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Instagram data');
    }

    const data = await response.json();
    const user: InstagramUser = data.graphql?.user || data.data?.user;
    
    if (!user?.edge_owner_to_timeline_media) {
      throw new Error('No posts found or private account');
    }

    return user.edge_owner_to_timeline_media.edges
      .map(edge => edge.node)
      .slice(0, 20); // Get up to 20 recent posts
  } catch (error) {
    console.error('Instagram scraping error:', error);
    throw new Error('Failed to load Instagram feed. Make sure the username is correct and the account is public.');
  }
};

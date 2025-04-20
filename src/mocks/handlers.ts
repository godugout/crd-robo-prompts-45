
import { http } from 'msw';
import { memories, users, teams, mediaItems, reactions, comments } from './data';

// Helper function for pagination and filtering
const paginateAndFilter = <T extends { id: string }>(
  items: T[],
  page: number = 1,
  limit: number = 10,
  filters: Record<string, string> = {}
) => {
  let filteredItems = [...items];

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (key === 'search' && 'title' in filteredItems[0]) {
      filteredItems = filteredItems.filter((item: any) => 
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.description?.toLowerCase().includes(value.toLowerCase())
      );
    } else if (key !== 'page' && key !== 'limit') {
      filteredItems = filteredItems.filter((item: any) => item[key] === value);
    }
  });

  // Calculate pagination
  const start = (page - 1) * limit;
  const paginatedItems = filteredItems.slice(start, start + limit);

  return {
    items: paginatedItems,
    total: filteredItems.length,
    page,
    limit,
    hasMore: start + limit < filteredItems.length
  };
};

export const handlers = [
  // Memories (Cards) endpoints
  http.get('/api/cards', ({ request }) => {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '10');
    
    const result = paginateAndFilter(memories, page, limit, searchParams);
    return Response.json(result);
  }),

  http.get('/api/cards/:id', ({ params }) => {
    const { id } = params;
    const memory = memories.find(m => m.id === id);
    
    if (!memory) {
      return new Response('Card not found', { status: 404 });
    }

    // Enhance memory with related data
    const enhancedMemory = {
      ...memory,
      media: mediaItems.filter(m => m.memoryId === id),
      reactions: reactions.filter(r => r.memoryId === id),
      comments: comments.filter(c => c.memoryId === id)
    };

    return Response.json(enhancedMemory);
  }),

  http.post('/api/cards', async ({ request }) => {
    const body = await request.json();
    const newMemory = {
      id: String(memories.length + 1),
      createdAt: new Date().toISOString(),
      ...body
    };
    memories.push(newMemory);
    return Response.json(newMemory, { status: 201 });
  }),

  http.put('/api/cards/:id', async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    const index = memories.findIndex(m => m.id === id);
    
    if (index === -1) {
      return new Response('Card not found', { status: 404 });
    }
    
    memories[index] = { ...memories[index], ...body };
    return Response.json(memories[index]);
  }),

  http.delete('/api/cards/:id', ({ params }) => {
    const { id } = params;
    const index = memories.findIndex(m => m.id === id);
    
    if (index === -1) {
      return new Response('Card not found', { status: 404 });
    }
    
    memories.splice(index, 1);
    return new Response(null, { status: 204 });
  }),

  // Feed endpoints
  http.get('/api/feed/for-you', ({ request }) => {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '10');
    
    const result = paginateAndFilter(memories, page, limit, searchParams);
    return Response.json(result);
  }),

  http.get('/api/feed/following', ({ request }) => {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '10');
    
    // Simulating following feed by filtering memories
    const followingMemories = memories.filter(m => m.userId === '2'); // Example filter
    const result = paginateAndFilter(followingMemories, page, limit, searchParams);
    return Response.json(result);
  }),

  http.get('/api/feed/trending', ({ request }) => {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '10');
    
    // Simulating trending by sorting by reaction count
    const trendingMemories = [...memories].sort((a, b) => {
      const aReactions = reactions.filter(r => r.memoryId === a.id).length;
      const bReactions = reactions.filter(r => r.memoryId === b.id).length;
      return bReactions - aReactions;
    });
    
    const result = paginateAndFilter(trendingMemories, page, limit, searchParams);
    return Response.json(result);
  }),

  // Comments endpoints
  http.get('/api/comments', ({ request }) => {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '10');
    
    const result = paginateAndFilter(comments, page, limit, searchParams);
    return Response.json(result);
  }),

  // Reactions endpoints
  http.get('/api/reactions', ({ request }) => {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '10');
    
    const result = paginateAndFilter(reactions, page, limit, searchParams);
    return Response.json(result);
  }),
];


import { rest } from 'msw';
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
  rest.get('/api/cards', (req, res, ctx) => {
    const searchParams = Object.fromEntries(req.url.searchParams);
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '10');
    
    const result = paginateAndFilter(memories, page, limit, searchParams);
    return res(ctx.status(200), ctx.json(result));
  }),

  rest.get('/api/cards/:id', (req, res, ctx) => {
    const { id } = req.params;
    const memory = memories.find(m => m.id === id);
    
    if (!memory) {
      return res(ctx.status(404), ctx.json({ error: 'Card not found' }));
    }

    // Enhance memory with related data
    const enhancedMemory = {
      ...memory,
      media: mediaItems.filter(m => m.memoryId === id),
      reactions: reactions.filter(r => r.memoryId === id),
      comments: comments.filter(c => c.memoryId === id)
    };

    return res(ctx.status(200), ctx.json(enhancedMemory));
  }),

  rest.post('/api/cards', async (req, res, ctx) => {
    const body = await req.json();
    const newMemory = {
      id: String(memories.length + 1),
      createdAt: new Date().toISOString(),
      ...body
    };
    memories.push(newMemory);
    return res(ctx.status(201), ctx.json(newMemory));
  }),

  rest.put('/api/cards/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json();
    const index = memories.findIndex(m => m.id === id);
    
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Card not found' }));
    }
    
    memories[index] = { ...memories[index], ...body };
    return res(ctx.status(200), ctx.json(memories[index]));
  }),

  rest.delete('/api/cards/:id', (req, res, ctx) => {
    const { id } = req.params;
    const index = memories.findIndex(m => m.id === id);
    
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Card not found' }));
    }
    
    memories.splice(index, 1);
    return res(ctx.status(204));
  }),

  // Feed endpoint
  rest.get('/api/feed', (req, res, ctx) => {
    const searchParams = Object.fromEntries(req.url.searchParams);
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '10');
    
    const result = paginateAndFilter(memories, page, limit, searchParams);
    return res(ctx.status(200), ctx.json(result));
  }),

  // Comments endpoints
  rest.get('/api/comments', (req, res, ctx) => {
    const searchParams = Object.fromEntries(req.url.searchParams);
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '10');
    
    const result = paginateAndFilter(comments, page, limit, searchParams);
    return res(ctx.status(200), ctx.json(result));
  }),

  // Reactions endpoints
  rest.get('/api/reactions', (req, res, ctx) => {
    const searchParams = Object.fromEntries(req.url.searchParams);
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '10');
    
    const result = paginateAndFilter(reactions, page, limit, searchParams);
    return res(ctx.status(200), ctx.json(result));
  }),
];


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

// Mock decks data
const decks = [
  {
    id: '1',
    title: 'Sports Collection',
    description: 'My favorite sports cards',
    ownerId: '1',
    cardCount: 12,
    coverImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80',
    createdAt: '2023-01-01T00:00:00.000Z',
    cards: ['1', '2', '3']
  },
  {
    id: '2',
    title: 'Art Collection',
    description: 'Beautiful art cards',
    ownerId: '1',
    cardCount: 8,
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&q=80',
    createdAt: '2023-02-01T00:00:00.000Z',
    cards: ['4', '5']
  },
  {
    id: '3',
    title: 'Travel Memories',
    description: 'Cards from my travels',
    ownerId: '2',
    cardCount: 15,
    coverImage: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500&q=80',
    createdAt: '2023-03-01T00:00:00.000Z',
    cards: ['6', '7', '8']
  }
];

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
      comments: comments.filter(c => c.cardId === id) // Changed from memoryId to cardId
    };

    return Response.json(enhancedMemory);
  }),

  http.post('/api/cards', async ({ request }) => {
    const body = await request.json();
    const newMemory = {
      id: String(memories.length + 1),
      createdAt: new Date().toISOString(),
      ...body as any // Fixed spread type
    };
    memories.push(newMemory as typeof memories[0]);
    return Response.json(newMemory, { status: 201 });
  }),

  http.put('/api/cards/:id', async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    const index = memories.findIndex(m => m.id === id);
    
    if (index === -1) {
      return new Response('Card not found', { status: 404 });
    }
    
    const updatedMemory = { ...memories[index], ...body as any }; // Fixed spread type
    memories[index] = updatedMemory as typeof memories[0];
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

  // Decks endpoints
  http.get('/api/decks', ({ request }) => {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '10');
    
    // Filter decks by owner if userId is provided
    let filteredDecks = [...decks];
    if (searchParams.userId) {
      filteredDecks = decks.filter(deck => deck.ownerId === searchParams.userId);
    }
    
    const result = paginateAndFilter(filteredDecks, page, limit, searchParams);
    return Response.json(result);
  }),

  http.get('/api/decks/:id', ({ params }) => {
    const { id } = params;
    const deck = decks.find(d => d.id === id);
    
    if (!deck) {
      return new Response('Deck not found', { status: 404 });
    }

    // Enhance deck with card details
    const deckCards = deck.cards ? deck.cards.map(cardId => 
      memories.find(m => m.id === cardId)
    ).filter(Boolean) : [];

    const enhancedDeck = {
      ...deck,
      cards: deckCards
    };

    return Response.json(enhancedDeck);
  }),

  http.post('/api/decks', async ({ request }) => {
    const body = await request.json() as any;
    const newDeck = {
      id: String(decks.length + 1),
      createdAt: new Date().toISOString(),
      cardCount: body.cards?.length || 0,
      ...body as any // Fixed spread type
    };
    
    decks.push(newDeck as typeof decks[0]);
    return Response.json(newDeck, { status: 201 });
  }),

  http.put('/api/decks/:id', async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as any;
    const index = decks.findIndex(d => d.id === id);
    
    if (index === -1) {
      return new Response('Deck not found', { status: 404 });
    }
    
    const updatedDeck = { 
      ...decks[index], 
      ...body as any, // Fixed spread type
      cardCount: body.cards?.length || decks[index].cardCount
    };
    
    decks[index] = updatedDeck as typeof decks[0];
    return Response.json(decks[index]);
  }),

  http.delete('/api/decks/:id', ({ params }) => {
    const { id } = params;
    const index = decks.findIndex(d => d.id === id);
    
    if (index === -1) {
      return new Response('Deck not found', { status: 404 });
    }
    
    decks.splice(index, 1);
    return new Response(null, { status: 204 });
  }),

  // User endpoints
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params;
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return new Response('User not found', { status: 404 });
    }
    
    return Response.json(user);
  }),

  http.put('/api/users/:id', async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as any;
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return new Response('User not found', { status: 404 });
    }
    
    users[index] = { ...users[index], ...body as any }; // Fixed spread type
    return Response.json(users[index]);
  })
];

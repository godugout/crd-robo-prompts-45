import { v4 as uuidv4 } from 'uuid';
import type { User } from '@/types/user';
import type { Team } from '@/types/team';
import type { Memory } from '@/types/memory';
import type { MediaItem } from '@/types/media';
import type { Comment, Reaction } from '@/types/social';
import { Visibility } from '@/types/common';

// Helper to generate timestamps within the last month
const getRecentDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date.toISOString();
};

export const users: User[] = [
  {
    id: '1',
    username: 'cardmaster',
    email: 'cardmaster@example.com',
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    bio: 'Passionate card collector and trader',
    createdAt: '2024-01-01T00:00:00Z',
    preferences: { theme: 'dark', notifications: true }
  },
  {
    id: '2',
    username: 'tradepro',
    email: 'tradepro@example.com',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    bio: 'Professional sports card collector',
    createdAt: '2024-02-01T00:00:00Z',
    preferences: { theme: 'light', notifications: true }
  }
];

export const teams: Team[] = [
  {
    id: '1',
    name: 'Los Angeles Lakers',
    abbreviation: 'LAL',
    primaryColor: '#552583',
    secondaryColor: '#FDB927',
    logoUrl: 'https://example.com/lakers-logo.png',
    stadiumInfo: { name: 'Crypto.com Arena', location: 'Los Angeles, CA' }
  },
  {
    id: '2',
    name: 'Golden State Warriors',
    abbreviation: 'GSW',
    primaryColor: '#1D428A',
    secondaryColor: '#FFC72C',
    logoUrl: 'https://example.com/warriors-logo.png',
    stadiumInfo: { name: 'Chase Center', location: 'San Francisco, CA' }
  }
];

export const memories: Memory[] = [
  {
    id: '1',
    userId: '1',
    title: 'Rare Rookie Card Collection',
    description: 'My prized collection of rookie cards from the 2023 season',
    teamId: '1',
    visibility: 'public' as Visibility,
    createdAt: getRecentDate(),
    tags: ['rookie', 'rare', '2023'],
    metadata: { certification: 'PSA 10', edition: 'First Edition' },
    user: users[0],
    reactions: [],
    commentCount: 2
  },
  {
    id: '2',
    userId: '2',
    title: 'Championship Series Collection',
    description: 'Special edition cards from the championship series',
    teamId: '2',
    visibility: 'public' as Visibility,
    createdAt: getRecentDate(),
    tags: ['championship', 'special-edition'],
    metadata: { certification: 'BGS 9.5', edition: 'Limited' },
    user: users[1],
    reactions: [],
    commentCount: 1
  }
];

export const mediaItems: MediaItem[] = [
  {
    id: '1',
    memoryId: '1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&q=80',
    originalFilename: 'rookie-card-front.jpg',
    size: 1024 * 1024,
    mimeType: 'image/jpeg',
    width: 1920,
    height: 1080,
    duration: null,
    metadata: null,
    createdAt: getRecentDate()
  },
  {
    id: '2',
    memoryId: '1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=200&q=80',
    originalFilename: 'rookie-card-back.jpg',
    size: 1024 * 1024,
    mimeType: 'image/jpeg',
    width: 1920,
    height: 1080,
    duration: null,
    metadata: null,
    createdAt: getRecentDate()
  }
];

export const reactions: Reaction[] = [
  {
    id: '1',
    userId: '2',
    memoryId: '1',
    type: 'heart',
    createdAt: getRecentDate()
  },
  {
    id: '2',
    userId: '1',
    memoryId: '2',
    type: 'thumbs-up',
    createdAt: getRecentDate()
  }
];

export const comments: Comment[] = [
  {
    id: '1',
    userId: '2',
    cardId: '1',
    content: 'Incredible collection! Love the mint condition.',
    createdAt: getRecentDate(),
    updatedAt: getRecentDate(),
    user: users[1],
    replyCount: 0
  },
  {
    id: '2',
    userId: '1',
    cardId: '2',
    content: 'These championship cards are amazing!',
    createdAt: getRecentDate(),
    updatedAt: getRecentDate(),
    user: users[0],
    replyCount: 0
  }
];

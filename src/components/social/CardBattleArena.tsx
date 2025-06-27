
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sword, Crown, Users, Timer, Trophy, Star } from 'lucide-react';

interface BattleCard {
  id: string;
  title: string;
  creator: string;
  imageUrl: string;
  votes: number;
  effects: string[];
  rarity: string;
}

interface Battle {
  id: string;
  title: string;
  theme: string;
  status: 'upcoming' | 'active' | 'judging' | 'completed';
  timeRemaining: number;
  totalVotes: number;
  participants: BattleCard[];
  winner?: BattleCard;
  prizes: string[];
}

interface CardBattleArenaProps {
  onBattleJoin: (battleId: string) => void;
  onVote: (battleId: string, cardId: string) => void;
}

export const CardBattleArena: React.FC<CardBattleArenaProps> = ({
  onBattleJoin,
  onVote
}) => {
  const [activeBattles, setActiveBattles] = useState<Battle[]>([]);
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);

  useEffect(() => {
    // Initialize mock battles
    const mockBattles: Battle[] = [
      {
        id: 'battle-1',
        title: 'Cosmic Legends Showdown',
        theme: 'Space & Sci-Fi',
        status: 'active',
        timeRemaining: 3600, // 1 hour in seconds
        totalVotes: 234,
        participants: [
          {
            id: 'card-1',
            title: 'Nebula Guardian',
            creator: 'SpaceArtist',
            imageUrl: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png',
            votes: 89,
            effects: ['holographic', 'particles'],
            rarity: 'legendary'
          },
          {
            id: 'card-2',
            title: 'Stellar Warrior',
            creator: 'CosmicCreator',
            imageUrl: '/lovable-uploads/b3f6335f-9e0a-4a64-a665-15d04f456d50.png',
            votes: 76,
            effects: ['chrome', 'glow'],
            rarity: 'epic'
          },
          {
            id: 'card-3',
            title: 'Galaxy Explorer',
            creator: 'StarDesigner',
            imageUrl: '/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png',
            votes: 69,
            effects: ['shimmer', 'aura'],
            rarity: 'rare'
          }
        ],
        prizes: ['Exclusive Cosmic Template', 'Legendary Effects Pack', '100 CRD Tokens']
      },
      {
        id: 'battle-2',
        title: 'Fantasy Realm Championship',
        theme: 'Fantasy & Magic',
        status: 'judging',
        timeRemaining: 0,
        totalVotes: 456,
        participants: [
          {
            id: 'card-4',
            title: 'Dragon Lord',
            creator: 'FantasyMaster',
            imageUrl: '/lovable-uploads/4db063a6-f43a-42c6-8670-41f27f772be8.png',
            votes: 167,
            effects: ['flame', 'legendary-glow'],
            rarity: 'mythic'
          },
          {
            id: 'card-5',
            title: 'Mystic Sorceress',
            creator: 'MagicArtist',
            imageUrl: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png',
            votes: 143,
            effects: ['mystical', 'sparkle'],
            rarity: 'legendary'
          }
        ],
        winner: {
          id: 'card-4',
          title: 'Dragon Lord',
          creator: 'FantasyMaster',
          imageUrl: '/lovable-uploads/4db063a6-f43a-42c6-8670-41f27f772be8.png',
          votes: 167,
          effects: ['flame', 'legendary-glow'],
          rarity: 'mythic'
        },
        prizes: ['Dragon Template Collection', 'Fire Effects Bundle', '200 CRD Tokens']
      }
    ];

    setActiveBattles(mockBattles);
    setSelectedBattle(mockBattles[0]);
  }, []);

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'judging': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const handleVote = (cardId: string) => {
    if (!selectedBattle) return;

    setSelectedBattle(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        participants: prev.participants.map(card =>
          card.id === cardId ? { ...card, votes: card.votes + 1 } : card
        ),
        totalVotes: prev.totalVotes + 1
      };
    });

    onVote(selectedBattle.id, cardId);
  };

  const getWinningCard = (battle: Battle) => {
    return battle.participants.reduce((winner, current) =>
      current.votes > winner.votes ? current : winner
    );
  };

  return (
    <div className="space-y-6">
      {/* Battle Selection */}
      <Card className="p-6 bg-gradient-to-br from-slate-900 to-red-900 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sword className="w-6 h-6 text-red-400" />
            Card Battle Arena
          </h2>
          <Button
            onClick={() => onBattleJoin('new')}
            className="bg-red-600 hover:bg-red-700"
          >
            Enter Battle
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeBattles.map((battle) => (
            <div
              key={battle.id}
              onClick={() => setSelectedBattle(battle)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedBattle?.id === battle.id
                  ? 'border-red-400 bg-red-900/50'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">{battle.title}</h3>
                <Badge className={`${getStatusColor(battle.status)} text-white`}>
                  {battle.status}
                </Badge>
              </div>
              <p className="text-sm opacity-75 mb-2">Theme: {battle.theme}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {battle.participants.length} entries
                </span>
                {battle.status === 'active' && (
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Timer className="w-4 h-4" />
                    {formatTimeRemaining(battle.timeRemaining)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Battle Details */}
      {selectedBattle && (
        <Card className="p-6 bg-gradient-to-br from-slate-900 to-purple-900 text-white">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">{selectedBattle.title}</h2>
              <p className="text-lg opacity-75">Theme: {selectedBattle.theme}</p>
              {selectedBattle.status === 'active' && (
                <div className="mt-4">
                  <div className="text-2xl font-bold text-yellow-400">
                    {formatTimeRemaining(selectedBattle.timeRemaining)} Remaining
                  </div>
                  <div className="text-sm opacity-75">{selectedBattle.totalVotes} total votes</div>
                </div>
              )}
            </div>

            {/* Battle Results or Voting */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedBattle.participants.map((card, index) => {
                const votePercentage = selectedBattle.totalVotes > 0 
                  ? (card.votes / selectedBattle.totalVotes) * 100 
                  : 0;
                const isLeader = card.votes === Math.max(...selectedBattle.participants.map(c => c.votes));

                return (
                  <div
                    key={card.id}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      isLeader ? 'border-yellow-400 bg-yellow-900/20' : 'border-white/20'
                    }`}
                  >
                    {isLeader && selectedBattle.status === 'active' && (
                      <div className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full p-1">
                        <Crown className="w-4 h-4" />
                      </div>
                    )}

                    <div className="aspect-[3/4] bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="font-bold text-lg mb-1">{card.title}</h3>
                    <p className="text-sm opacity-75 mb-2">by {card.creator}</p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {card.effects.map((effect, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {effect}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{card.votes} votes</span>
                        <span>{Math.round(votePercentage)}%</span>
                      </div>
                      <Progress value={votePercentage} className="h-2" />
                    </div>

                    {selectedBattle.status === 'active' && (
                      <Button
                        onClick={() => handleVote(card.id)}
                        className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
                        size="sm"
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Vote
                      </Button>
                    )}

                    {selectedBattle.status === 'completed' && selectedBattle.winner?.id === card.id && (
                      <Badge className="w-full mt-3 bg-yellow-400 text-black justify-center">
                        <Trophy className="w-4 h-4 mr-1" />
                        WINNER
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Prizes */}
            <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Battle Prizes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedBattle.prizes.map((prize, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl mb-2">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div className="text-sm">{prize}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

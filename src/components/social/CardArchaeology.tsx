
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Map, Search, Puzzle, Crown, Users, Clock } from 'lucide-react';

interface ArtifactPiece {
  id: string;
  name: string;
  description: string;
  discoveredBy?: string;
  discoveredAt?: string;
  rarity: 'common' | 'rare' | 'legendary';
}

interface LegendaryCard {
  id: string;
  name: string;
  era: string;
  description: string;
  totalPieces: number;
  discoveredPieces: ArtifactPiece[];
  completionPercentage: number;
  discoveryMap: string[];
  communityChallenge: {
    title: string;
    description: string;
    progress: number;
    target: number;
  };
  rewards: string[];
}

interface CardArchaeologyProps {
  onDiscovery: (cardId: string, pieceId: string) => void;
  onChallengeParticipate: (challengeId: string) => void;
}

export const CardArchaeology: React.FC<CardArchaeologyProps> = ({
  onDiscovery,
  onChallengeParticipate
}) => {
  const [legendaryCards, setLegendaryCards] = useState<LegendaryCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<LegendaryCard | null>(null);
  const [searchProgress, setSearchProgress] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Initialize legendary cards with archaeological data
    const mockLegendaryCards: LegendaryCard[] = [
      {
        id: 'ancient-dragon',
        name: 'The Ancient Dragon Emperor',
        era: 'First Dynasty (Year 1-50)',
        description: 'A mythical card said to contain the essence of the first digital dragon ever created. Lost during the Great Server Migration of Year 23.',
        totalPieces: 12,
        discoveredPieces: [
          {
            id: 'piece-1',
            name: 'Dragon Scale Fragment',
            description: 'A shimmering scale texture with ancient code embedded',
            discoveredBy: 'ArcheoHunter',
            discoveredAt: '2024-01-15',
            rarity: 'common'
          },
          {
            id: 'piece-2',
            name: 'Imperial Crown Piece',
            description: 'Golden crown fragment with embedded royal algorithms',
            discoveredBy: 'TreasureSeeker',
            discoveredAt: '2024-01-18',
            rarity: 'rare'
          },
          {
            id: 'piece-3',
            name: 'Fire Breath Core',
            description: 'The legendary flame effect source code',
            discoveredBy: 'CodeDigger',
            discoveredAt: '2024-01-20',
            rarity: 'legendary'
          }
        ],
        completionPercentage: 25,
        discoveryMap: [
          'The Forgotten Archives',
          'Database Ruins Level 3',
          'The Lost Backup Sector',
          'Ancient Code Repository'
        ],
        communityChallenge: {
          title: 'Decode the Dragon Script',
          description: 'Community must collectively solve 1000 code fragments',
          progress: 347,
          target: 1000
        },
        rewards: ['Ancient Dragon Template', 'Legendary Fire Effects', 'Dragon Emperor Title', '500 CRD Tokens']
      },
      {
        id: 'cosmic-wanderer',
        name: 'The Cosmic Wanderer',
        era: 'Space Age (Year 75-100)',
        description: 'A traveler from the digital cosmos, this card was lost when its creator\'s account vanished into the void of deleted data.',
        totalPieces: 8,
        discoveredPieces: [
          {
            id: 'piece-4',
            name: 'Stellar Map Fragment',
            description: 'Contains coordinates to lost digital galaxies',
            discoveredBy: 'StarHunter',
            discoveredAt: '2024-01-22',
            rarity: 'rare'
          }
        ],
        completionPercentage: 12.5,
        discoveryMap: [
          'The Deleted User Cache',
          'Orphaned Data Clusters',
          'The Void Archives'
        ],
        communityChallenge: {
          title: 'Map the Lost Galaxies',
          description: 'Reconstruct the cosmic navigation system',
          progress: 89,
          target: 500
        },
        rewards: ['Cosmic Template Pack', 'Space Effects Bundle', 'Wanderer Badge']
      }
    ];

    setLegendaryCards(mockLegendaryCards);
    setSelectedCard(mockLegendaryCards[0]);
  }, []);

  const startSearch = async () => {
    setIsSearching(true);
    setSearchProgress(0);

    // Simulate archaeological search
    const searchInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) {
          clearInterval(searchInterval);
          setIsSearching(false);
          
          // Simulate finding a piece
          if (Math.random() > 0.7) {
            discoverNewPiece();
          }
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const discoverNewPiece = () => {
    if (!selectedCard) return;

    const possiblePieces = [
      { name: 'Memory Fragment', rarity: 'common' as const },
      { name: 'Code Relic', rarity: 'rare' as const },
      { name: 'Data Crystal', rarity: 'legendary' as const }
    ];

    const newPiece = possiblePieces[Math.floor(Math.random() * possiblePieces.length)];
    const piece: ArtifactPiece = {
      id: `piece-${Date.now()}`,
      name: newPiece.name,
      description: 'Recently discovered artifact piece',
      discoveredBy: 'You',
      discoveredAt: new Date().toISOString().split('T')[0],
      rarity: newPiece.rarity
    };

    setSelectedCard(prev => {
      if (!prev) return prev;
      const updatedPieces = [...prev.discoveredPieces, piece];
      return {
        ...prev,
        discoveredPieces: updatedPieces,
        completionPercentage: (updatedPieces.length / prev.totalPieces) * 100
      };
    });

    onDiscovery(selectedCard.id, piece.id);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Card Selection */}
      <Card className="p-6 bg-gradient-to-br from-slate-900 to-amber-900 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Map className="w-6 h-6 text-amber-400" />
            Card Archaeology
          </h2>
          <Badge variant="outline" className="text-amber-400 border-amber-400">
            {legendaryCards.length} Lost Legends
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {legendaryCards.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedCard?.id === card.id
                  ? 'border-amber-400 bg-amber-900/50'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <h3 className="font-bold mb-2">{card.name}</h3>
              <p className="text-sm opacity-75 mb-2">{card.era}</p>
              <div className="flex items-center justify-between text-sm">
                <span>{card.discoveredPieces.length}/{card.totalPieces} pieces</span>
                <span>{Math.round(card.completionPercentage)}% complete</span>
              </div>
              <Progress value={card.completionPercentage} className="mt-2 h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Selected Card Details */}
      {selectedCard && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card Information */}
          <Card className="p-6 bg-gradient-to-br from-slate-900 to-purple-900 text-white">
            <h3 className="text-2xl font-bold mb-4">{selectedCard.name}</h3>
            <p className="text-amber-400 font-medium mb-2">{selectedCard.era}</p>
            <p className="text-sm opacity-75 mb-4">{selectedCard.description}</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Discovery Progress</span>
                  <span>{Math.round(selectedCard.completionPercentage)}%</span>
                </div>
                <Progress value={selectedCard.completionPercentage} className="h-3" />
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search Locations
                </h4>
                <div className="space-y-1">
                  {selectedCard.discoveryMap.map((location, index) => (
                    <div key={index} className="text-sm opacity-75 flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-400 rounded-full" />
                      {location}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={startSearch}
                  disabled={isSearching}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  {isSearching ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Searching... {searchProgress}%
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Begin Archaeological Search
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Discovered Pieces */}
          <Card className="p-6 bg-gradient-to-br from-slate-900 to-green-900 text-white">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Puzzle className="w-5 h-5 text-green-400" />
              Discovered Artifacts
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {selectedCard.discoveredPieces.map((piece) => (
                <div
                  key={piece.id}
                  className="p-3 bg-white/10 rounded-lg border border-white/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{piece.name}</h4>
                    <Badge variant="outline" className={getRarityColor(piece.rarity)}>
                      {piece.rarity}
                    </Badge>
                  </div>
                  <p className="text-sm opacity-75 mb-2">{piece.description}</p>
                  {piece.discoveredBy && (
                    <div className="text-xs opacity-50">
                      Found by {piece.discoveredBy} on {piece.discoveredAt}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedCard.discoveredPieces.length === 0 && (
              <div className="text-center py-8 opacity-50">
                <Puzzle className="w-12 h-12 mx-auto mb-4" />
                <p>No artifacts discovered yet</p>
                <p className="text-sm">Begin searching to find pieces!</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Community Challenge */}
      {selectedCard && (
        <Card className="p-6 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Community Challenge
            </h3>
            <Button
              onClick={() => onChallengeParticipate(selectedCard.id)}
              variant="outline"
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
            >
              Participate
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{selectedCard.communityChallenge.title}</h4>
              <p className="text-sm opacity-75 mb-3">{selectedCard.communityChallenge.description}</p>
              
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>
                  {selectedCard.communityChallenge.progress} / {selectedCard.communityChallenge.target}
                </span>
              </div>
              <Progress 
                value={(selectedCard.communityChallenge.progress / selectedCard.communityChallenge.target) * 100} 
                className="h-3"
              />
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                Completion Rewards
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedCard.rewards.map((reward, index) => (
                  <div key={index} className="text-sm bg-white/10 rounded px-3 py-2">
                    {reward}
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

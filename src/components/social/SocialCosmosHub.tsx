
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardEvolutionSystem } from './CardEvolutionSystem';
import { CollaborativeEditor } from './CollaborativeEditor';
import { CardBattleArena } from './CardBattleArena';
import { CardArchaeology } from './CardArchaeology';
import { CardBreedingLab } from './CardBreedingLab';
import { 
  Sparkles, Users, Sword, Map, Dna, 
  TrendingUp, Heart, Trophy, Search, Shuffle 
} from 'lucide-react';

interface SocialCosmosHubProps {
  className?: string;
}

export const SocialCosmosHub: React.FC<SocialCosmosHubProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('evolution');

  // Mock data for demonstration
  const mockCard = {
    id: 'demo-card-1',
    title: 'Cosmic Warrior',
    rarity: 'epic',
    creator: 'DigitalArtist'
  };

  const mockBreedableCards = [
    {
      id: 'breed-1',
      title: 'Fire Dragon',
      imageUrl: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png',
      genes: {
        rarity: 'rare',
        effects: ['flame', 'glow'],
        colors: ['red', 'orange'],
        patterns: ['scales', 'wings'],
        mutations: []
      },
      generation: 1,
      compatibility: 85,
      breedingCooldown: 0
    }
  ];

  const handleEvolutionUpdate = (evolution: any) => {
    console.log('Card evolved:', evolution);
  };

  const handleCollaborationChange = (session: any) => {
    console.log('Collaboration session updated:', session);
  };

  const handleBattleJoin = (battleId: string) => {
    console.log('Joining battle:', battleId);
  };

  const handleVote = (battleId: string, cardId: string) => {
    console.log('Voting for card:', cardId, 'in battle:', battleId);
  };

  const handleDiscovery = (cardId: string, pieceId: string) => {
    console.log('Discovered piece:', pieceId, 'for card:', cardId);
  };

  const handleChallengeParticipate = (challengeId: string) => {
    console.log('Participating in challenge:', challengeId);
  };

  const handleBreeding = (parent1: string, parent2: string, result: any) => {
    console.log('Breeding result:', result);
  };

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-400" />
          The Social Cosmos
          <Sparkles className="w-8 h-8 text-purple-400" />
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Where cards become living digital entities with their own behaviors, relationships, and evolutionary paths. 
          Collaborate, compete, discover, and create in the ultimate card ecosystem.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 h-auto">
          <TabsTrigger 
            value="evolution" 
            className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-purple-600"
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">Evolution</span>
          </TabsTrigger>
          <TabsTrigger 
            value="collaboration" 
            className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-blue-600"
          >
            <Users className="w-5 h-5" />
            <span className="text-sm">Collaborate</span>
          </TabsTrigger>
          <TabsTrigger 
            value="battles" 
            className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-red-600"
          >
            <Sword className="w-5 h-5" />
            <span className="text-sm">Battles</span>
          </TabsTrigger>
          <TabsTrigger 
            value="archaeology" 
            className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-amber-600"
          >
            <Map className="w-5 h-5" />
            <span className="text-sm">Archaeology</span>
          </TabsTrigger>
          <TabsTrigger 
            value="breeding" 
            className="flex flex-col items-center gap-2 py-4 data-[state=active]:bg-pink-600"
          >
            <Dna className="w-5 h-5" />
            <span className="text-sm">Breeding</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="evolution" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                Card Evolution System
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Watch your cards grow and evolve based on community interactions. Popular cards gain new effects, 
                traded cards develop unique patinas, and ancient cards acquire legendary status.
              </p>
            </div>
            <CardEvolutionSystem
              card={mockCard}
              onEvolutionUpdate={handleEvolutionUpdate}
            />
          </TabsContent>

          <TabsContent value="collaboration" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <Users className="w-6 h-6 text-blue-400" />
                Collaborative Creation
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Work together with other creators in real-time. See each other's cursors as colorful spirits 
                while you design the next generation of legendary cards.
              </p>
            </div>
            <CollaborativeEditor
              cardId="demo-card"
              onCollaborationChange={handleCollaborationChange}
            />
          </TabsContent>

          <TabsContent value="battles" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <Sword className="w-6 h-6 text-red-400" />
                Card Battle Arena
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Enter your creations into epic visual spectacles judged by the community. 
                Winners earn exclusive effects, templates, and eternal glory.
              </p>
            </div>
            <CardBattleArena
              onBattleJoin={handleBattleJoin}
              onVote={handleVote}
            />
          </TabsContent>

          <TabsContent value="archaeology" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <Map className="w-6 h-6 text-amber-400" />
                Card Archaeology
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Discover lost legendary cards hidden throughout the platform. Assemble them piece by piece 
                through community challenges and archaeological expeditions.
              </p>
            </div>
            <CardArchaeology
              onDiscovery={handleDiscovery}
              onChallengeParticipate={handleChallengeParticipate}
            />
          </TabsContent>

          <TabsContent value="breeding" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <Dna className="w-6 h-6 text-pink-400" />
                Card Breeding Laboratory
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Combine compatible cards to produce offspring with inherited traits and rare mutations. 
                Create entirely new generations of cards with unique characteristics.
              </p>
            </div>
            <CardBreedingLab
              userCards={mockBreedableCards}
              onBreeding={handleBreeding}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Quick Stats Overview */}
      <Card className="mt-8 p-6 bg-gradient-to-br from-slate-900 to-gray-900 text-white">
        <h3 className="text-xl font-bold mb-4 text-center">Social Cosmos Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">1,247</div>
            <div className="text-sm opacity-75">Cards Evolved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">89</div>
            <div className="text-sm opacity-75">Active Collaborations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">23</div>
            <div className="text-sm opacity-75">Battle Tournaments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">156</div>
            <div className="text-sm opacity-75">Artifacts Discovered</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

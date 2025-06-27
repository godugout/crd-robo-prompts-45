
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dna, Heart, Shuffle, Sparkles, Plus } from 'lucide-react';

interface CardGenes {
  rarity: string;
  effects: string[];
  colors: string[];
  patterns: string[];
  mutations: string[];
}

interface BreedableCard {
  id: string;
  title: string;
  imageUrl: string;
  genes: CardGenes;
  generation: number;
  compatibility: number;
  breedingCooldown: number;
  lastBred?: string;
}

interface BreedingResult {
  success: boolean;
  offspring?: BreedableCard;
  inheritedTraits: string[];
  mutations: string[];
  rarityUpgrade: boolean;
}

interface CardBreedingLabProps {
  userCards: BreedableCard[];
  onBreeding: (parent1: string, parent2: string, result: BreedingResult) => void;
}

export const CardBreedingLab: React.FC<CardBreedingLabProps> = ({
  userCards,
  onBreeding
}) => {
  const [selectedParents, setSelectedParents] = useState<[BreedableCard | null, BreedableCard | null]>([null, null]);
  const [breedingProgress, setBreedingProgress] = useState(0);
  const [isBreeding, setIsBreeding] = useState(false);
  const [breedingResult, setBreedingResult] = useState<BreedingResult | null>(null);
  const [mockCards, setMockCards] = useState<BreedableCard[]>([]);

  useEffect(() => {
    // Initialize mock breedable cards
    const mockBreedableCards: BreedableCard[] = [
      {
        id: 'card-breed-1',
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
      },
      {
        id: 'card-breed-2',
        title: 'Ice Phoenix',
        imageUrl: '/lovable-uploads/b3f6335f-9e0a-4a64-a665-15d04f456d50.png',
        genes: {
          rarity: 'epic',
          effects: ['frost', 'shimmer'],
          colors: ['blue', 'white'],
          patterns: ['feathers', 'crystal'],
          mutations: ['eternal_ice']
        },
        generation: 2,
        compatibility: 92,
        breedingCooldown: 0
      },
      {
        id: 'card-breed-3',
        title: 'Earth Guardian',
        imageUrl: '/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png',
        genes: {
          rarity: 'legendary',
          effects: ['earth', 'protection'],
          colors: ['green', 'brown'],
          patterns: ['bark', 'roots'],
          mutations: ['ancient_wisdom']
        },
        generation: 1,
        compatibility: 78,
        breedingCooldown: 0
      },
      {
        id: 'card-breed-4',
        title: 'Storm Elemental',
        imageUrl: '/lovable-uploads/4db063a6-f43a-42c6-8670-41f27f772be8.png',
        genes: {
          rarity: 'epic',
          effects: ['lightning', 'wind'],
          colors: ['purple', 'yellow'],
          patterns: ['clouds', 'electricity'],
          mutations: ['storm_call']
        },
        generation: 3,
        compatibility: 95,
        breedingCooldown: 0
      }
    ];

    setMockCards(mockBreedableCards);
  }, []);

  const selectParent = (card: BreedableCard, parentIndex: 0 | 1) => {
    const newParents = [...selectedParents] as [BreedableCard | null, BreedableCard | null];
    newParents[parentIndex] = card;
    setSelectedParents(newParents);
  };

  const calculateCompatibility = (parent1: BreedableCard, parent2: BreedableCard): number => {
    // Calculate compatibility based on various factors
    let compatibility = 50; // Base compatibility

    // Same rarity bonus
    if (parent1.genes.rarity === parent2.genes.rarity) {
      compatibility += 20;
    }

    // Complementary effects bonus
    const sharedEffects = parent1.genes.effects.filter(effect => 
      parent2.genes.effects.includes(effect)
    );
    compatibility += sharedEffects.length * 10;

    // Generation difference penalty
    const genDiff = Math.abs(parent1.generation - parent2.generation);
    compatibility -= genDiff * 5;

    // Mutation bonus
    compatibility += (parent1.genes.mutations.length + parent2.genes.mutations.length) * 5;

    return Math.max(0, Math.min(100, compatibility));
  };

  const simulateBreeding = async () => {
    if (!selectedParents[0] || !selectedParents[1]) return;

    setIsBreeding(true);
    setBreedingProgress(0);
    setBreedingResult(null);

    // Simulate breeding process
    const breedingInterval = setInterval(() => {
      setBreedingProgress(prev => {
        if (prev >= 100) {
          clearInterval(breedingInterval);
          generateOffspring();
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const generateOffspring = () => {
    if (!selectedParents[0] || !selectedParents[1]) return;

    const parent1 = selectedParents[0];
    const parent2 = selectedParents[1];
    const compatibility = calculateCompatibility(parent1, parent2);

    // Determine breeding success
    const success = Math.random() * 100 < compatibility;

    if (!success) {
      setBreedingResult({
        success: false,
        inheritedTraits: [],
        mutations: [],
        rarityUpgrade: false
      });
      setIsBreeding(false);
      return;
    }

    // Generate offspring
    const inheritedEffects = [
      ...parent1.genes.effects.filter(() => Math.random() > 0.5),
      ...parent2.genes.effects.filter(() => Math.random() > 0.5)
    ];

    const inheritedColors = [
      ...parent1.genes.colors.filter(() => Math.random() > 0.5),
      ...parent2.genes.colors.filter(() => Math.random() > 0.5)
    ];

    const inheritedPatterns = [
      ...parent1.genes.patterns.filter(() => Math.random() > 0.5),
      ...parent2.genes.patterns.filter(() => Math.random() > 0.5)
    ];

    // Potential mutations
    const possibleMutations = [
      'prismatic_glow', 'void_touch', 'time_distortion', 'soul_bond',
      'dimensional_shift', 'cosmic_energy', 'divine_blessing', 'chaos_spark'
    ];

    const newMutations = [];
    if (Math.random() > 0.8) { // 20% chance for new mutation
      const mutation = possibleMutations[Math.floor(Math.random() * possibleMutations.length)];
      newMutations.push(mutation);
    }

    // Inherit parent mutations
    const inheritedMutations = [
      ...parent1.genes.mutations.filter(() => Math.random() > 0.7),
      ...parent2.genes.mutations.filter(() => Math.random() > 0.7)
    ];

    // Determine rarity (chance for upgrade)
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
    const parent1RarityIndex = rarities.indexOf(parent1.genes.rarity);
    const parent2RarityIndex = rarities.indexOf(parent2.genes.rarity);
    const maxParentRarity = Math.max(parent1RarityIndex, parent2RarityIndex);
    
    let offspringRarityIndex = maxParentRarity;
    const rarityUpgrade = Math.random() > 0.85; // 15% chance for rarity upgrade
    if (rarityUpgrade && offspringRarityIndex < rarities.length - 1) {
      offspringRarityIndex++;
    }

    const offspring: BreedableCard = {
      id: `offspring-${Date.now()}`,
      title: `${parent1.title.split(' ')[0]} ${parent2.title.split(' ')[1] || 'Hybrid'}`,
      imageUrl: Math.random() > 0.5 ? parent1.imageUrl : parent2.imageUrl,
      genes: {
        rarity: rarities[offspringRarityIndex],
        effects: [...new Set(inheritedEffects)],
        colors: [...new Set(inheritedColors)],
        patterns: [...new Set(inheritedPatterns)],
        mutations: [...new Set([...inheritedMutations, ...newMutations])]
      },
      generation: Math.max(parent1.generation, parent2.generation) + 1,
      compatibility: Math.floor(Math.random() * 20) + 80,
      breedingCooldown: 24 // 24 hour cooldown
    };

    const result: BreedingResult = {
      success: true,
      offspring,
      inheritedTraits: [
        ...inheritedEffects,
        ...inheritedColors,
        ...inheritedPatterns
      ],
      mutations: [...inheritedMutations, ...newMutations],
      rarityUpgrade
    };

    setBreedingResult(result);
    setIsBreeding(false);
    onBreeding(parent1.id, parent2.id, result);
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'text-gray-400',
      uncommon: 'text-green-400',
      rare: 'text-blue-400',
      epic: 'text-purple-400',
      legendary: 'text-yellow-400',
      mythic: 'text-red-400'
    };
    return colors[rarity as keyof typeof colors] || 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Breeding Interface */}
      <Card className="p-6 bg-gradient-to-br from-slate-900 to-pink-900 text-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Dna className="w-6 h-6 text-pink-400" />
            Card Breeding Laboratory
          </h2>
          <Badge variant="outline" className="text-pink-400 border-pink-400">
            Generation Lab
          </Badge>
        </div>

        {/* Parent Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[0, 1].map((parentIndex) => (
            <div key={parentIndex} className="space-y-4">
              <h3 className="text-lg font-medium">
                Parent {parentIndex + 1}
                {selectedParents[parentIndex] && (
                  <Badge className="ml-2 bg-pink-600">
                    Gen {selectedParents[parentIndex]!.generation}
                  </Badge>
                )}
              </h3>
              
              {selectedParents[parentIndex] ? (
                <div className="border-2 border-pink-400 rounded-lg p-4 bg-pink-900/30">
                  <div className="aspect-[3/4] bg-gradient-to-br from-purple-500 to-blue-500 rounded mb-3 overflow-hidden">
                    <img
                      src={selectedParents[parentIndex]!.imageUrl}
                      alt={selectedParents[parentIndex]!.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold">{selectedParents[parentIndex]!.title}</h4>
                  <p className={`text-sm ${getRarityColor(selectedParents[parentIndex]!.genes.rarity)}`}>
                    {selectedParents[parentIndex]!.genes.rarity}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedParents[parentIndex]!.genes.effects.map((effect, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
                  <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-75">Select a parent card</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Compatibility & Breeding */}
        {selectedParents[0] && selectedParents[1] && (
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Breeding Compatibility</span>
              <span className="text-lg font-bold">
                {calculateCompatibility(selectedParents[0], selectedParents[1])}%
              </span>
            </div>
            <Progress 
              value={calculateCompatibility(selectedParents[0], selectedParents[1])} 
              className="h-3 mb-4"
            />
            
            {!isBreeding && !breedingResult && (
              <Button
                onClick={simulateBreeding}
                className="w-full bg-pink-600 hover:bg-pink-700"
              >
                <Heart className="w-4 h-4 mr-2" />
                Begin Breeding Process
              </Button>
            )}
            
            {isBreeding && (
              <div className="text-center">
                <div className="text-lg font-bold mb-2">
                  Breeding in Progress... {breedingProgress}%
                </div>
                <Progress value={breedingProgress} className="h-3" />
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Available Cards */}
      <Card className="p-6 bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Shuffle className="w-5 h-5 text-indigo-400" />
          Available for Breeding
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockCards.map((card) => (
            <div
              key={card.id}
              className="group cursor-pointer border border-white/20 rounded-lg p-3 hover:border-white/40 transition-all"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-purple-500 to-blue-500 rounded mb-2 overflow-hidden">
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              
              <h4 className="font-medium text-sm mb-1">{card.title}</h4>
              <p className={`text-xs ${getRarityColor(card.genes.rarity)}`}>
                {card.genes.rarity} • Gen {card.generation}
              </p>
              
              <div className="mt-2 flex gap-1">
                <Button
                  onClick={() => selectParent(card, 0)}
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs h-6"
                >
                  P1
                </Button>
                <Button
                  onClick={() => selectParent(card, 1)}
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs h-6"
                >
                  P2
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Breeding Result */}
      {breedingResult && (
        <Card className="p-6 bg-gradient-to-br from-slate-900 to-green-900 text-white">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-400" />
            Breeding Result
          </h3>
          
          {breedingResult.success ? (
            <div className="space-y-4">
              <div className="text-center">
                <Badge className="bg-green-600 text-white text-lg px-4 py-2">
                  SUCCESS!
                </Badge>
                {breedingResult.rarityUpgrade && (
                  <Badge className="ml-2 bg-yellow-600 text-white">
                    Rarity Upgrade!
                  </Badge>
                )}
              </div>
              
              {breedingResult.offspring && (
                <div className="flex justify-center">
                  <div className="border-2 border-green-400 rounded-lg p-4 bg-green-900/30 max-w-xs">
                    <div className="aspect-[3/4] bg-gradient-to-br from-purple-500 to-blue-500 rounded mb-3 overflow-hidden">
                      <img
                        src={breedingResult.offspring.imageUrl}
                        alt={breedingResult.offspring.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-bold">{breedingResult.offspring.title}</h4>
                    <p className={`text-sm ${getRarityColor(breedingResult.offspring.genes.rarity)}`}>
                      {breedingResult.offspring.genes.rarity} • Gen {breedingResult.offspring.generation}
                    </p>
                    
                    <div className="mt-2">
                      <p className="text-xs font-medium mb-1">Inherited Traits:</p>
                      <div className="flex flex-wrap gap-1">
                        {breedingResult.offspring.genes.effects.map((effect, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {breedingResult.offspring.genes.mutations.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium mb-1 text-yellow-400">Mutations:</p>
                        <div className="flex flex-wrap gap-1">
                          {breedingResult.offspring.genes.mutations.map((mutation, i) => (
                            <Badge key={i} className="bg-yellow-600 text-black text-xs">
                              {mutation}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Breeding Failed
              </Badge>
              <p className="text-sm opacity-75 mt-2">
                The cards were not compatible enough for successful breeding.
                Try different combinations or wait for cooldown periods to reset.
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

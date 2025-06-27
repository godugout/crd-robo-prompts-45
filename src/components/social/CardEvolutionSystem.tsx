
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Trophy, Heart, Users } from 'lucide-react';

interface CardEvolution {
  id: string;
  cardId: string;
  evolutionLevel: number;
  communityScore: number;
  tradeCount: number;
  ageInDays: number;
  uniqueEffects: string[];
  patina: 'none' | 'bronze' | 'silver' | 'gold' | 'legendary';
  status: 'common' | 'popular' | 'ancient' | 'legendary';
  lastEvolutionDate: string;
}

interface CardEvolutionSystemProps {
  card: any;
  onEvolutionUpdate: (evolution: CardEvolution) => void;
}

export const CardEvolutionSystem: React.FC<CardEvolutionSystemProps> = ({
  card,
  onEvolutionUpdate
}) => {
  const [evolution, setEvolution] = useState<CardEvolution>({
    id: `evo-${card.id}`,
    cardId: card.id,
    evolutionLevel: 1,
    communityScore: 0,
    tradeCount: 0,
    ageInDays: 0,
    uniqueEffects: [],
    patina: 'none',
    status: 'common',
    lastEvolutionDate: new Date().toISOString()
  });

  const [evolutionProgress, setEvolutionProgress] = useState(0);

  useEffect(() => {
    // Calculate evolution progress based on multiple factors
    const ageBonus = Math.min(evolution.ageInDays * 2, 100);
    const communityBonus = Math.min(evolution.communityScore * 5, 200);
    const tradeBonus = Math.min(evolution.tradeCount * 10, 150);
    
    const totalProgress = (ageBonus + communityBonus + tradeBonus) / 4.5;
    setEvolutionProgress(Math.min(totalProgress, 100));
    
    // Trigger evolution when thresholds are met
    checkForEvolution(totalProgress);
  }, [evolution.ageInDays, evolution.communityScore, evolution.tradeCount]);

  const checkForEvolution = (progress: number) => {
    let newLevel = evolution.evolutionLevel;
    let newStatus = evolution.status;
    let newPatina = evolution.patina;
    let newEffects = [...evolution.uniqueEffects];

    // Evolution level progression
    if (progress >= 80 && evolution.evolutionLevel < 5) {
      newLevel = Math.min(5, Math.floor(progress / 20));
    }

    // Status evolution based on community interaction
    if (evolution.communityScore > 100) newStatus = 'popular';
    if (evolution.ageInDays > 365) newStatus = 'ancient';
    if (evolution.communityScore > 500 && evolution.ageInDays > 180) newStatus = 'legendary';

    // Patina development from trading
    if (evolution.tradeCount > 5) newPatina = 'bronze';
    if (evolution.tradeCount > 15) newPatina = 'silver';
    if (evolution.tradeCount > 30) newPatina = 'gold';
    if (evolution.tradeCount > 50 && evolution.communityScore > 200) newPatina = 'legendary';

    // Add unique effects based on evolution
    if (newLevel >= 2 && !newEffects.includes('shimmer')) {
      newEffects.push('shimmer');
    }
    if (newLevel >= 3 && !newEffects.includes('aura')) {
      newEffects.push('aura');
    }
    if (newLevel >= 4 && !newEffects.includes('particles')) {
      newEffects.push('particles');
    }
    if (newLevel >= 5 && !newEffects.includes('legendary-glow')) {
      newEffects.push('legendary-glow');
    }

    // Update evolution if changes occurred
    if (newLevel !== evolution.evolutionLevel || 
        newStatus !== evolution.status || 
        newPatina !== evolution.patina ||
        newEffects.length !== evolution.uniqueEffects.length) {
      
      const updatedEvolution = {
        ...evolution,
        evolutionLevel: newLevel,
        status: newStatus,
        patina: newPatina,
        uniqueEffects: newEffects,
        lastEvolutionDate: new Date().toISOString()
      };

      setEvolution(updatedEvolution);
      onEvolutionUpdate(updatedEvolution);
    }
  };

  const simulateInteraction = (type: 'like' | 'trade' | 'age') => {
    setEvolution(prev => {
      const updated = { ...prev };
      switch (type) {
        case 'like':
          updated.communityScore += 1;
          break;
        case 'trade':
          updated.tradeCount += 1;
          break;
        case 'age':
          updated.ageInDays += 30; // Simulate aging
          break;
      }
      return updated;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'ancient': return 'bg-gradient-to-r from-purple-400 to-purple-600';
      case 'popular': return 'bg-gradient-to-r from-blue-400 to-blue-600';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900 to-purple-900 text-white">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Card Evolution
          </h3>
          <Badge className={`${getStatusColor(evolution.status)} text-white`}>
            {evolution.status.toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{evolution.evolutionLevel}</div>
            <div className="text-sm opacity-75">Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{evolution.communityScore}</div>
            <div className="text-sm opacity-75">Community</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{evolution.tradeCount}</div>
            <div className="text-sm opacity-75">Trades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{evolution.ageInDays}</div>
            <div className="text-sm opacity-75">Days Old</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Evolution Progress</span>
            <span>{Math.round(evolutionProgress)}%</span>
          </div>
          <Progress value={evolutionProgress} className="h-2" />
        </div>

        {evolution.patina !== 'none' && (
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">Trade Patina: {evolution.patina}</span>
          </div>
        )}

        {evolution.uniqueEffects.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Unique Effects:</div>
            <div className="flex flex-wrap gap-2">
              {evolution.uniqueEffects.map((effect, index) => (
                <Badge key={index} variant="outline" className="text-yellow-400 border-yellow-400">
                  {effect}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <button
            onClick={() => simulateInteraction('like')}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            <Heart className="w-3 h-3" />
            Like (+1)
          </button>
          <button
            onClick={() => simulateInteraction('trade')}
            className="flex items-center gap-1 px-3 py-1 bg-green-600 rounded text-sm hover:bg-green-700 transition-colors"
          >
            <Users className="w-3 h-3" />
            Trade (+1)
          </button>
          <button
            onClick={() => simulateInteraction('age')}
            className="flex items-center gap-1 px-3 py-1 bg-purple-600 rounded text-sm hover:bg-purple-700 transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            Age (+30d)
          </button>
        </div>
      </div>
    </Card>
  );
};

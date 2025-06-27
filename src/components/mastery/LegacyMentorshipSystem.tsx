
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, Crown, Star, Zap, 
  ArrowRight, Heart, Trophy, Gift 
} from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  specialties: string[];
  legacyTechniques: LegacyTechnique[];
  protegeCounts: number;
  masteryLevel: number;
  isRetired: boolean;
}

interface LegacyTechnique {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'master';
  rarity: 'common' | 'rare' | 'legendary' | 'transcendent';
  inheritanceChain: string[];
  effects: string[];
}

interface MentorshipChain {
  id: string;
  originalMaster: string;
  currentGeneration: number;
  techniques: LegacyTechnique[];
  lineage: string[];
}

export const LegacyMentorshipSystem: React.FC = () => {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [activeChains, setActiveChains] = useState<MentorshipChain[]>([]);

  // Mock data for legendary mentors
  const mentors: Mentor[] = [
    {
      id: 'master-aurora',
      name: 'Master Aurora',
      avatar: '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png',
      title: 'The Light Weaver',
      specialties: ['Holographic Effects', 'Light Manipulation', 'Aurora Particles'],
      protegeCounts: 47,
      masteryLevel: 100,
      isRetired: true,
      legacyTechniques: [
        {
          id: 'aurora-dance',
          name: 'Aurora Dance',
          description: 'Creates flowing aurora effects that dance across card surfaces',
          difficulty: 'master',
          rarity: 'transcendent',
          inheritanceChain: ['Master Aurora', 'Student of Light', 'Aurora Keeper'],
          effects: ['shimmer', 'color-shift', 'ethereal-glow']
        }
      ]
    },
    {
      id: 'forge-master',
      name: 'The Forge Master',
      avatar: '/lovable-uploads/25cbcac9-64c0-4969-9baa-7a3fdf9eb00a.png',
      title: 'Keeper of Metallics',
      specialties: ['Metallic Textures', 'Chrome Effects', 'Surface Crafting'],
      protegeCounts: 23,
      masteryLevel: 95,
      isRetired: false,
      legacyTechniques: [
        {
          id: 'liquid-chrome',
          name: 'Liquid Chrome',
          description: 'Creates flowing metallic surfaces that reflect reality',
          difficulty: 'advanced',
          rarity: 'legendary',
          inheritanceChain: ['The Forge Master', 'Chrome Apprentice'],
          effects: ['mirror-reflection', 'liquid-flow', 'chrome-finish']
        }
      ]
    }
  ];

  const handleInheritTechnique = (technique: LegacyTechnique, mentor: Mentor) => {
    // Simulate technique inheritance
    const newChain: MentorshipChain = {
      id: `chain-${Date.now()}`,
      originalMaster: mentor.name,
      currentGeneration: technique.inheritanceChain.length + 1,
      techniques: [technique],
      lineage: [...technique.inheritanceChain, 'You']
    };

    setActiveChains(prev => [...prev, newChain]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Crown className="w-8 h-8 text-yellow-400" />
          Legacy Mentorship System
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Learn from retired masters and carry forward their legendary techniques. 
          Each technique passed down becomes part of an eternal creative lineage.
        </p>
      </div>

      {/* Available Mentors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mentors.map(mentor => (
          <Card 
            key={mentor.id} 
            className={`p-6 bg-gradient-to-br from-slate-900 to-gray-900 border cursor-pointer transition-all duration-300 ${
              selectedMentor?.id === mentor.id 
                ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/20' 
                : 'border-gray-700/50 hover:border-gray-600/50'
            }`}
            onClick={() => setSelectedMentor(mentor)}
          >
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={mentor.avatar} />
                <AvatarFallback>{mentor.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold">{mentor.name}</h3>
                  {mentor.isRetired && (
                    <Badge className="bg-yellow-600/20 text-yellow-400 text-xs">
                      RETIRED MASTER
                    </Badge>
                  )}
                </div>
                <p className="text-gray-400 text-sm">{mentor.title}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-gray-300 text-xs mb-2">Specialties</p>
                <div className="flex flex-wrap gap-1">
                  {mentor.specialties.map(specialty => (
                    <Badge key={specialty} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <div className="text-white font-medium">{mentor.protegeCounts}</div>
                  <div className="text-gray-400 text-xs">Proteges</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-medium">{mentor.masteryLevel}%</div>
                  <div className="text-gray-400 text-xs">Mastery</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-medium">{mentor.legacyTechniques.length}</div>
                  <div className="text-gray-400 text-xs">Techniques</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Selected Mentor Details */}
      {selectedMentor && (
        <Card className="p-6 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={selectedMentor.avatar} />
              <AvatarFallback>{selectedMentor.name[0]}</AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{selectedMentor.name}</h3>
              <p className="text-yellow-400 mb-2">{selectedMentor.title}</p>
              <p className="text-gray-300 text-sm">
                Master of {selectedMentor.specialties.length} legendary techniques
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold text-lg">Legacy Techniques</h4>
            
            {selectedMentor.legacyTechniques.map(technique => (
              <div key={technique.id} className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h5 className="text-white font-medium">{technique.name}</h5>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        technique.rarity === 'transcendent' ? 'border-yellow-500 text-yellow-400' :
                        technique.rarity === 'legendary' ? 'border-purple-500 text-purple-400' :
                        technique.rarity === 'rare' ? 'border-blue-500 text-blue-400' :
                        'border-gray-500 text-gray-400'
                      }`}
                    >
                      {technique.rarity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <Button
                    onClick={() => handleInheritTechnique(technique, selectedMentor)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    size="sm"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Inherit
                  </Button>
                </div>

                <p className="text-gray-300 text-sm mb-3">{technique.description}</p>

                {/* Inheritance Chain */}
                <div className="mb-3">
                  <p className="text-gray-400 text-xs mb-2">Inheritance Chain</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {technique.inheritanceChain.map((master, index) => (
                      <React.Fragment key={master}>
                        <span className="text-yellow-400 text-xs">{master}</span>
                        {index < technique.inheritanceChain.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-gray-500" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Effects */}
                <div>
                  <p className="text-gray-400 text-xs mb-2">Technique Effects</p>
                  <div className="flex flex-wrap gap-1">
                    {technique.effects.map(effect => (
                      <Badge key={effect} className="bg-purple-600/20 text-purple-300 text-xs">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Active Inheritance Chains */}
      {activeChains.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-red-400" />
            <h3 className="text-white font-semibold">Your Inherited Techniques</h3>
          </div>

          <div className="space-y-3">
            {activeChains.map(chain => (
              <div key={chain.id} className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">
                    Generation {chain.currentGeneration} of {chain.originalMaster}'s Legacy
                  </h4>
                  <Badge className="bg-green-600/20 text-green-400">ACTIVE</Badge>
                </div>
                
                <div className="text-sm text-gray-300 mb-2">
                  Lineage: {chain.lineage.join(' → ')}
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {chain.techniques.map(technique => (
                    <Badge key={technique.id} variant="outline" className="text-xs">
                      {technique.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

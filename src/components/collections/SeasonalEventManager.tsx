
import React, { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

interface SeasonalEvent {
  id: string;
  name: string;
  type: 'seasonal' | 'astronomical' | 'anniversary' | 'special';
  start_date: Date;
  end_date: Date;
  effects: SeasonalEffect[];
  trigger_conditions: string[];
}

interface SeasonalEffect {
  type: 'visual' | 'lighting' | 'particle' | 'animation';
  name: string;
  intensity: number;
  color_scheme: string[];
  duration: number;
}

interface SeasonalEventManagerProps {
  collections: any[];
  onSeasonalEffect: (effect: any) => void;
}

export const SeasonalEventManager: React.FC<SeasonalEventManagerProps> = ({
  collections,
  onSeasonalEffect
}) => {
  const [activeEvents, setActiveEvents] = useState<SeasonalEvent[]>([]);
  const [currentSeason, setCurrentSeason] = useState<string>('');
  const [astronomicalEvents, setAstronomicalEvents] = useState<any[]>([]);

  // Detect current season and events
  useEffect(() => {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();

    // Determine season
    let season = '';
    if (month >= 2 && month <= 4) season = 'spring';
    else if (month >= 5 && month <= 7) season = 'summer';
    else if (month >= 8 && month <= 10) season = 'autumn';
    else season = 'winter';

    setCurrentSeason(season);

    // Check for special dates
    const events: SeasonalEvent[] = [];

    // Halloween
    if (month === 9 && day >= 25) {
      events.push({
        id: 'halloween',
        name: 'Halloween Transformation',
        type: 'seasonal',
        start_date: new Date(now.getFullYear(), 9, 25),
        end_date: new Date(now.getFullYear(), 10, 2),
        effects: [
          {
            type: 'visual',
            name: 'spooky_glow',
            intensity: 0.8,
            color_scheme: ['#ff4400', '#660066', '#000000'],
            duration: 5000
          },
          {
            type: 'particle',
            name: 'floating_spirits',
            intensity: 0.6,
            color_scheme: ['#ffffff', '#cccccc'],
            duration: 3000
          }
        ],
        trigger_conditions: ['collection_viewed', 'card_interaction']
      });
    }

    // Winter Solstice
    if (month === 11 && day >= 20 && day <= 22) {
      events.push({
        id: 'winter_solstice',
        name: 'Cosmic Alignment',
        type: 'astronomical',
        start_date: new Date(now.getFullYear(), 11, 20),
        end_date: new Date(now.getFullYear(), 11, 23),
        effects: [
          {
            type: 'lighting',
            name: 'cosmic_illumination',
            intensity: 1.0,
            color_scheme: ['#4a90e2', '#ffffff', '#e6f3ff'],
            duration: 8000
          },
          {
            type: 'animation',
            name: 'stellar_rotation',
            intensity: 0.5,
            color_scheme: ['#ffffff'],
            duration: 10000
          }
        ],
        trigger_conditions: ['any_interaction']
      });
    }

    // Spring Equinox
    if (month === 2 && day >= 19 && day <= 21) {
      events.push({
        id: 'spring_equinox',
        name: 'Renewal Celebration',
        type: 'seasonal',
        start_date: new Date(now.getFullYear(), 2, 19),
        end_date: new Date(now.getFullYear(), 2, 22),
        effects: [
          {
            type: 'visual',
            name: 'growth_aura',
            intensity: 0.7,
            color_scheme: ['#22c55e', '#84cc16', '#65a30d'],
            duration: 6000
          },
          {
            type: 'particle',
            name: 'blooming_petals',
            intensity: 0.9,
            color_scheme: ['#ff69b4', '#ffb6c1', '#ffffff'],
            duration: 4000
          }
        ],
        trigger_conditions: ['collection_opened']
      });
    }

    setActiveEvents(events);
  }, []);

  // Generate seasonal particles
  const generateSeasonalParticles = (season: string, count: number = 50) => {
    const particles = [];
    
    for (let i = 0; i < count; i++) {
      const position = [
        (Math.random() - 0.5) * 100,
        Math.random() * 50,
        (Math.random() - 0.5) * 100
      ] as [number, number, number];

      let particleProps = {};
      
      switch (season) {
        case 'winter':
          particleProps = {
            color: '#ffffff',
            size: 0.05 + Math.random() * 0.05,
            opacity: 0.8
          };
          break;
        case 'spring':
          particleProps = {
            color: ['#ff69b4', '#ffb6c1', '#98fb98'][Math.floor(Math.random() * 3)],
            size: 0.03 + Math.random() * 0.04,
            opacity: 0.6
          };
          break;
        case 'summer':
          particleProps = {
            color: '#ffd700',
            size: 0.02 + Math.random() * 0.03,
            opacity: 0.7
          };
          break;
        case 'autumn':
          particleProps = {
            color: ['#ff4500', '#ffa500', '#ff6347'][Math.floor(Math.random() * 3)],
            size: 0.04 + Math.random() * 0.06,
            opacity: 0.5
          };
          break;
      }

      particles.push({ position, ...particleProps });
    }
    
    return particles;
  };

  // Animate seasonal effects
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    activeEvents.forEach(event => {
      event.effects.forEach(effect => {
        if (effect.type === 'animation') {
          onSeasonalEffect({
            type: 'animation_update',
            name: effect.name,
            time,
            intensity: effect.intensity
          });
        }
      });
    });
  });

  const seasonalParticles = generateSeasonalParticles(currentSeason);

  return (
    <group>
      {/* Seasonal Particles */}
      {seasonalParticles.map((particle, index) => (
        <Sphere
          key={index}
          args={[particle.size]}
          position={particle.position}
        >
          <meshBasicMaterial
            color={particle.color}
            transparent
            opacity={particle.opacity}
          />
        </Sphere>
      ))}

      {/* Active Event Indicators */}
      {activeEvents.map((event, index) => (
        <group key={event.id} position={[-40 + index * 10, 20, 0]}>
          <Box args={[4, 2, 0.2]} onClick={() => onSeasonalEffect(event)}>
            <meshPhysicalMaterial
              color={event.effects[0]?.color_scheme[0] || '#4a90e2'}
              emissive={event.effects[0]?.color_scheme[0] || '#4a90e2'}
              emissiveIntensity={0.3}
              transparent
              opacity={0.8}
            />
          </Box>
          
          <Text
            position={[0, 0, 0.15]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {event.name}
          </Text>
          
          <Text
            position={[0, -0.5, 0.15]}
            fontSize={0.2}
            color="#cccccc"
            anchorX="center"
            anchorY="middle"
          >
            {event.type.toUpperCase()}
          </Text>
        </group>
      ))}

      {/* Season Indicator */}
      <group position={[0, 30, 0]}>
        <Text
          fontSize={2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {currentSeason.toUpperCase()} COLLECTION UNIVERSE
        </Text>
        
        <Text
          position={[0, -2, 0]}
          fontSize={0.8}
          color="#a0a0a0"
          anchorX="center"
          anchorY="middle"
        >
          {activeEvents.length} Active Events
        </Text>
      </group>

      {/* Astronomical Event Markers */}
      {astronomicalEvents.map((astroEvent, index) => (
        <group key={index} position={[
          Math.cos(index * Math.PI / 4) * 60,
          40,
          Math.sin(index * Math.PI / 4) * 60
        ]}>
          <Sphere args={[2]}>
            <meshBasicMaterial color="#ffffff" emissive="#4a90e2" emissiveIntensity={0.5} />
          </Sphere>
          
          <Text
            position={[0, -3, 0]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {astroEvent.name}
          </Text>
        </group>
      ))}
    </group>
  );
};


import { supabase } from '@/lib/supabase-client';

interface PlayerStats {
  height: string;
  weight: string;
  bats: string;
  throws: string;
  birthDate: string;
  hometown: string;
}

interface CardGenerationData {
  playerName: string;
  position: string;
  team: string;
  stats: PlayerStats;
  cardNumber: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythic';
  cardType: string;
}

export class CardGenerator {
  private playerNames = [
    'Shane Patel', 'Adrian Perez', 'Cody Trejo', 'Jaden Patel', 'AJ Troxell',
    'Marcus Johnson', 'Tyler Rodriguez', 'Jake Smith', 'Luis Garcia', 'Ryan Wilson',
    'Carlos Martinez', 'David Brown', 'Michael Davis', 'Anthony Lopez', 'Brandon Lee',
    'Kevin Thompson', 'Jordan White', 'Austin Harris', 'Connor Clark', 'Trevor Lewis',
    'Dylan Walker', 'Mason Hall', 'Noah Young', 'Ethan King', 'Caleb Wright',
    'Hunter Green', 'Colton Adams', 'Blake Baker', 'Cameron Hill', 'Logan Scott'
  ];

  private teams = [
    'Oakland Athletics', 'San Francisco Giants', 'Los Angeles Dodgers', 'Anaheim Angels',
    'San Diego Padres', 'Arizona Diamondbacks', 'Colorado Rockies', 'Seattle Mariners',
    'Portland Beavers', 'Sacramento River Cats', 'Fresno Grizzlies', 'Stockton Ports'
  ];

  private positions = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'P', 'DH'];

  private cardTypes = [
    'Rookie Card', 'All-Star', 'MVP Candidate', 'Team Leader', 'Prospect',
    'Veteran', 'Hall of Fame', 'Record Breaker', 'Championship', 'Special Edition'
  ];

  private rarities: Array<'common' | 'uncommon' | 'rare' | 'legendary' | 'mythic'> = [
    'common', 'common', 'common', 'common', 'common', 'common',
    'uncommon', 'uncommon', 'uncommon', 'uncommon',
    'rare', 'rare', 'rare',
    'legendary', 'legendary',
    'mythic'
  ];

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private generateStats(): PlayerStats {
    const heights = ["5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\""];
    const weights = Array.from({length: 40}, (_, i) => `${160 + i * 5} LBS`);
    const handedness = ['R', 'L', 'S']; // Right, Left, Switch

    return {
      height: this.getRandomElement(heights),
      weight: this.getRandomElement(weights),
      bats: this.getRandomElement(handedness),
      throws: this.getRandomElement(['R', 'L']),
      birthDate: this.generateRandomDate(),
      hometown: this.generateHometown()
    };
  }

  private generateRandomDate(): string {
    const year = 1995 + Math.floor(Math.random() * 10);
    const month = 1 + Math.floor(Math.random() * 12);
    const day = 1 + Math.floor(Math.random() * 28);
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
  }

  private generateHometown(): string {
    const cities = [
      'San Jose, CA', 'Los Angeles, CA', 'San Francisco, CA', 'Sacramento, CA',
      'Oakland, CA', 'Fresno, CA', 'San Diego, CA', 'Long Beach, CA',
      'Phoenix, AZ', 'Las Vegas, NV', 'Portland, OR', 'Seattle, WA'
    ];
    return this.getRandomElement(cities);
  }

  generateCardData(cardNumber: number): CardGenerationData {
    return {
      playerName: this.getRandomElement(this.playerNames),
      position: this.getRandomElement(this.positions),
      team: this.getRandomElement(this.teams),
      stats: this.generateStats(),
      cardNumber,
      rarity: this.getRandomElement(this.rarities),
      cardType: this.getRandomElement(this.cardTypes)
    };
  }

  generateDesignMetadata(cardData: CardGenerationData) {
    const teamColors = {
      'Oakland Athletics': { primary: '#003831', secondary: '#EFB21E' },
      'San Francisco Giants': { primary: '#FD5A1E', secondary: '#27251F' },
      'Los Angeles Dodgers': { primary: '#005A9C', secondary: '#FFFFFF' },
      'Anaheim Angels': { primary: '#BA0021', secondary: '#C4CED4' },
      'San Diego Padres': { primary: '#2F241D', secondary: '#FFC425' },
      'Arizona Diamondbacks': { primary: '#A71930', secondary: '#E3D4A3' }
    };

    const colors = teamColors[cardData.team as keyof typeof teamColors] || { primary: '#003831', secondary: '#EFB21E' };

    return {
      templateId: 'template1',
      backgroundColor: colors.primary,
      accentColor: colors.secondary,
      textColor: '#FFFFFF',
      borderStyle: 'solid',
      borderWidth: 3,
      elements: [
        {
          type: 'text',
          content: cardData.playerName,
          style: { fontSize: 24, fontWeight: 'bold', color: colors.secondary },
          position: { x: 30, y: 30 }
        },
        {
          type: 'text',
          content: cardData.position,
          style: { fontSize: 16, color: colors.secondary },
          position: { x: 30, y: 60 }
        },
        {
          type: 'text',
          content: cardData.team,
          style: { fontSize: 14, color: '#FFFFFF' },
          position: { x: 30, y: 85 }
        },
        {
          type: 'text',
          content: `#${cardData.cardNumber}`,
          style: { fontSize: 20, fontWeight: 'bold', color: colors.secondary },
          position: { x: 250, y: 30 }
        },
        {
          type: 'text',
          content: `HEIGHT: ${cardData.stats.height}  WEIGHT: ${cardData.stats.weight}`,
          style: { fontSize: 10, color: '#FFFFFF' },
          position: { x: 30, y: 320 }
        },
        {
          type: 'text',
          content: `BATS: ${cardData.stats.bats}  THROWS: ${cardData.stats.throws}`,
          style: { fontSize: 10, color: '#FFFFFF' },
          position: { x: 30, y: 340 }
        },
        {
          type: 'text',
          content: `BORN: ${cardData.stats.birthDate}  HOME: ${cardData.stats.hometown}`,
          style: { fontSize: 10, color: '#FFFFFF' },
          position: { x: 30, y: 360 }
        },
        {
          type: 'text',
          content: cardData.cardType.toUpperCase(),
          style: { fontSize: 12, fontWeight: 'bold', color: colors.secondary },
          position: { x: 30, y: 390 }
        }
      ]
    };
  }

  async generateAndSaveCards(count: number = 101): Promise<string[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be authenticated to generate cards');
    }

    const cardIds: string[] = [];
    
    for (let i = 1; i <= count; i++) {
      const cardData = this.generateCardData(i);
      const designMetadata = this.generateDesignMetadata(cardData);
      
      const { data, error } = await supabase
        .from('cards')
        .insert({
          title: `${cardData.playerName} - ${cardData.cardType}`,
          description: `${cardData.position} for ${cardData.team}. Card #${cardData.cardNumber}`,
          creator_id: user.id,
          rarity: cardData.rarity,
          design_metadata: designMetadata,
          tags: [cardData.team, cardData.position, cardData.cardType, 'Sports', 'Baseball'],
          is_public: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating card:', error);
        continue;
      }

      if (data) {
        cardIds.push(data.id);
      }
    }

    return cardIds;
  }
}

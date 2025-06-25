
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, Eye } from 'lucide-react';

interface UserCard {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  rarity: string;
  tags: string[];
  created_at: string;
  is_public: boolean;
}

export const UserCardsGallery: React.FC = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState<UserCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserCards();
    }
  }, [user]);

  const fetchUserCards = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('crd_cards')
        .select('id, title, description, image_url, rarity, tags, created_at, is_public')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cards:', error);
        return;
      }

      setCards(data || []);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-100 text-gray-800',
      uncommon: 'bg-green-100 text-green-800',
      rare: 'bg-blue-100 text-blue-800',
      epic: 'bg-purple-100 text-purple-800',
      legendary: 'bg-yellow-100 text-yellow-800'
    };
    return colors[rarity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please sign in to view your cards</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No cards yet</h3>
        <p className="text-gray-600">Create your first card to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Cards ({cards.length})</h2>
        <p className="text-gray-600">Manage and view all your created cards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[3/4] relative">
              {card.image_url ? (
                <img
                  src={card.image_url}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              
              <div className="absolute top-2 right-2">
                <Badge className={getRarityColor(card.rarity)}>
                  {card.rarity}
                </Badge>
              </div>

              {!card.is_public && (
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary">
                    <Eye className="w-3 h-3 mr-1" />
                    Private
                  </Badge>
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1 truncate">{card.title}</h3>
              
              {card.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {card.description}
                </p>
              )}

              {card.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {card.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {card.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{card.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(card.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

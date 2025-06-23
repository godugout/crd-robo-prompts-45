
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTradeOffers } from '@/hooks/trading/useTradeOffers';
import { TradeCard } from '@/hooks/trading/types';
import { Plus, X, DollarSign } from 'lucide-react';

interface TradeOfferBuilderProps {
  recipientId: string;
  onComplete?: () => void;
}

export const TradeOfferBuilder: React.FC<TradeOfferBuilderProps> = ({
  recipientId,
  onComplete
}) => {
  const [offeredCards, setOfferedCards] = useState<TradeCard[]>([]);
  const [requestedCards, setRequestedCards] = useState<TradeCard[]>([]);
  const [notes, setNotes] = useState('');
  
  const { createTradeOffer } = useTradeOffers();

  const addCard = (type: 'offered' | 'requested') => {
    const newCard: TradeCard = {
      id: '',
      title: '',
      rarity: 'common',
      estimated_value: 0
    };

    if (type === 'offered') {
      setOfferedCards(prev => [...prev, newCard]);
    } else {
      setRequestedCards(prev => [...prev, newCard]);
    }
  };

  const updateCard = (
    type: 'offered' | 'requested',
    index: number,
    field: keyof TradeCard,
    value: string | number
  ) => {
    const setter = type === 'offered' ? setOfferedCards : setRequestedCards;
    setter(prev => prev.map((card, i) => 
      i === index ? { ...card, [field]: value } : card
    ));
  };

  const removeCard = (type: 'offered' | 'requested', index: number) => {
    const setter = type === 'offered' ? setOfferedCards : setRequestedCards;
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotalValue = (cards: TradeCard[]) => {
    return cards.reduce((sum, card) => sum + (card.estimated_value || 0), 0);
  };

  const handleSubmit = () => {
    if (offeredCards.length === 0 || requestedCards.length === 0) {
      return;
    }

    createTradeOffer.mutate({
      recipientId,
      offeredCards,
      requestedCards,
      notes
    }, {
      onSuccess: () => {
        onComplete?.();
      }
    });
  };

  const offeredValue = calculateTotalValue(offeredCards);
  const requestedValue = calculateTotalValue(requestedCards);
  const valueDifference = requestedValue - offeredValue;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white">Create Trade Offer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Offered Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Cards You're Offering</h3>
              <Button
                onClick={() => addCard('offered')}
                size="sm"
                className="bg-crd-green hover:bg-crd-green/90 text-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </div>
            
            <div className="space-y-3">
              {offeredCards.map((card, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-crd-mediumGray rounded-lg">
                  <Input
                    placeholder="Card title"
                    value={card.title}
                    onChange={(e) => updateCard('offered', index, 'title', e.target.value)}
                    className="flex-1 bg-crd-darkest border-crd-mediumGray text-white"
                  />
                  <select
                    value={card.rarity}
                    onChange={(e) => updateCard('offered', index, 'rarity', e.target.value)}
                    className="bg-crd-darkest border border-crd-mediumGray text-white rounded-md px-3 py-2"
                  >
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                    <option value="mythic">Mythic</option>
                  </select>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-crd-lightGray" />
                    <Input
                      type="number"
                      placeholder="Value"
                      value={card.estimated_value || ''}
                      onChange={(e) => updateCard('offered', index, 'estimated_value', parseFloat(e.target.value) || 0)}
                      className="w-20 bg-crd-darkest border-crd-mediumGray text-white"
                    />
                  </div>
                  <Button
                    onClick={() => removeCard('offered', index)}
                    size="sm"
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-3 text-right">
              <span className="text-crd-lightGray">Total Value: </span>
              <span className="text-crd-green font-semibold">${offeredValue}</span>
            </div>
          </div>

          {/* Requested Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Cards You Want</h3>
              <Button
                onClick={() => addCard('requested')}
                size="sm"
                className="bg-crd-green hover:bg-crd-green/90 text-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </div>
            
            <div className="space-y-3">
              {requestedCards.map((card, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-crd-mediumGray rounded-lg">
                  <Input
                    placeholder="Card title"
                    value={card.title}
                    onChange={(e) => updateCard('requested', index, 'title', e.target.value)}
                    className="flex-1 bg-crd-darkest border-crd-mediumGray text-white"
                  />
                  <select
                    value={card.rarity}
                    onChange={(e) => updateCard('requested', index, 'rarity', e.target.value)}
                    className="bg-crd-darkest border border-crd-mediumGray text-white rounded-md px-3 py-2"
                  >
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                    <option value="mythic">Mythic</option>
                  </select>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-crd-lightGray" />
                    <Input
                      type="number"
                      placeholder="Value"
                      value={card.estimated_value || ''}
                      onChange={(e) => updateCard('requested', index, 'estimated_value', parseFloat(e.target.value) || 0)}
                      className="w-20 bg-crd-darkest border-crd-mediumGray text-white"
                    />
                  </div>
                  <Button
                    onClick={() => removeCard('requested', index)}
                    size="sm"
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-3 text-right">
              <span className="text-crd-lightGray">Total Value: </span>
              <span className="text-crd-green font-semibold">${requestedValue}</span>
            </div>
          </div>

          {/* Value Difference */}
          {valueDifference !== 0 && (
            <div className={`p-4 rounded-lg ${
              valueDifference > 0 ? 'bg-red-500/20 border border-red-500/50' : 'bg-green-500/20 border border-green-500/50'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Value Difference:</span>
                <span className={`font-bold ${valueDifference > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {valueDifference > 0 ? '+' : ''}${valueDifference}
                </span>
              </div>
              {valueDifference > 0 && (
                <p className="text-sm text-red-300 mt-2">
                  You're requesting ${valueDifference} more value than you're offering.
                </p>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-white font-medium mb-2">Notes (Optional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details about this trade..."
              className="bg-crd-mediumGray border-crd-mediumGray text-white placeholder:text-crd-lightGray"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={
                offeredCards.length === 0 || 
                requestedCards.length === 0 || 
                createTradeOffer.isPending ||
                offeredCards.some(card => !card.title.trim()) ||
                requestedCards.some(card => !card.title.trim())
              }
              className="bg-crd-green hover:bg-crd-green/90 text-black px-8"
            >
              {createTradeOffer.isPending ? 'Creating...' : 'Send Trade Offer'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

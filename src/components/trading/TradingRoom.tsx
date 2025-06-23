
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTradingRealtime } from '@/hooks/trading/useTradingRealtime';
import { useTradeOffers } from '@/hooks/trading/useTradeOffers';
import { TradeChat } from './TradeChat';
import { TradeOfferBuilder } from './TradeOfferBuilder';
import { TradeHistory } from './TradeHistory';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users,
  Wifi,
  WifiOff
} from 'lucide-react';
import { TradeOffer } from '@/hooks/trading/types';

interface TradingRoomProps {
  tradeOffer?: TradeOffer;
  onClose?: () => void;
}

export const TradingRoom: React.FC<TradingRoomProps> = ({ tradeOffer, onClose }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const { 
    isConnected, 
    typingUsers, 
    onlineUsers,
    broadcastTyping,
    sendMessage 
  } = useTradingRealtime(tradeOffer?.id);
  
  const { 
    acceptTradeOffer, 
    rejectTradeOffer, 
    completeTradeOffer 
  } = useTradeOffers();

  const getStatusColor = (status: TradeOffer['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      case 'expired': return 'bg-gray-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: TradeOffer['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  };

  if (!tradeOffer) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Trade Selected</h2>
          <p className="text-crd-lightGray">Select a trade to view details and chat.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="w-5 h-5 text-crd-green" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm text-crd-lightGray">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-crd-lightGray" />
              <span className="text-sm text-crd-lightGray">
                {onlineUsers.length} online
              </span>
            </div>

            <Badge 
              className={`${getStatusColor(tradeOffer.status)} text-white`}
            >
              <div className="flex items-center gap-1">
                {getStatusIcon(tradeOffer.status)}
                {tradeOffer.status}
              </div>
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {tradeOffer.status === 'pending' && (
              <>
                <Button
                  onClick={() => acceptTradeOffer.mutate(tradeOffer.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={acceptTradeOffer.isPending}
                >
                  Accept Trade
                </Button>
                <Button
                  onClick={() => rejectTradeOffer.mutate(tradeOffer.id)}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  disabled={rejectTradeOffer.isPending}
                >
                  Reject
                </Button>
              </>
            )}
            
            {tradeOffer.status === 'accepted' && (
              <Button
                onClick={() => completeTradeOffer.mutate(tradeOffer.id)}
                className="bg-crd-green hover:bg-crd-green/90 text-black"
                disabled={completeTradeOffer.isPending}
              >
                Mark Complete
              </Button>
            )}

            {onClose && (
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            )}
          </div>
        </div>

        {/* Trade Info */}
        <Card className="bg-crd-dark border-crd-mediumGray mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Trade Details</span>
              <span className="text-sm font-normal text-crd-lightGray">
                {formatTimeRemaining(tradeOffer.expires_at)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Offered Cards */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Offered Cards</h3>
                <div className="space-y-2">
                  {tradeOffer.offered_cards.map((card, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-crd-mediumGray rounded-lg">
                      {card.image_url && (
                        <img 
                          src={card.image_url} 
                          alt={card.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-white font-medium">{card.title}</p>
                        <p className="text-sm text-crd-lightGray">{card.rarity}</p>
                      </div>
                      <span className="text-crd-green font-semibold">
                        ${card.estimated_value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requested Cards */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Requested Cards</h3>
                <div className="space-y-2">
                  {tradeOffer.requested_cards.map((card, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-crd-mediumGray rounded-lg">
                      {card.image_url && (
                        <img 
                          src={card.image_url} 
                          alt={card.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-white font-medium">{card.title}</p>
                        <p className="text-sm text-crd-lightGray">{card.rarity}</p>
                      </div>
                      <span className="text-crd-green font-semibold">
                        ${card.estimated_value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trade Value Summary */}
            {tradeOffer.trade_value_difference !== 0 && (
              <div className="mt-6 p-4 bg-crd-mediumGray rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-white">Value Difference:</span>
                  <span className={`font-semibold ${
                    tradeOffer.trade_value_difference > 0 ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {tradeOffer.trade_value_difference > 0 ? '+' : ''}
                    ${tradeOffer.trade_value_difference}
                  </span>
                </div>
                {tradeOffer.cash_included > 0 && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-white">Cash Included:</span>
                    <span className="text-crd-green font-semibold">
                      ${tradeOffer.cash_included}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-crd-mediumGray mb-6">
            <TabsTrigger 
              value="chat" 
              className="data-[state=active]:bg-crd-green data-[state=active]:text-black"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
              {typingUsers.length > 0 && (
                <span className="ml-2 text-xs bg-crd-green-secondary text-black px-2 py-1 rounded">
                  {typingUsers.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-crd-green data-[state=active]:text-black"
            >
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <TradeChat 
              tradeId={tradeOffer.id}
              typingUsers={typingUsers}
              onTyping={(isTyping) => broadcastTyping(tradeOffer.messages_channel_id, isTyping)}
              onSendMessage={(message) => sendMessage(tradeOffer.id, message)}
            />
          </TabsContent>

          <TabsContent value="history">
            <TradeHistory tradeId={tradeOffer.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

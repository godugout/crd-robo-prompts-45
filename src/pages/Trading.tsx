
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TradingRoom } from '@/components/trading/TradingRoom';
import { TradeOfferBuilder } from '@/components/trading/TradeOfferBuilder';
import { useTradeOffers } from '@/hooks/trading/useTradeOffers';
import { useTradingRealtime } from '@/hooks/trading/useTradingRealtime';
import { TradeOffer } from '@/hooks/trading/types';
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Users
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Trading = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedTrade, setSelectedTrade] = useState<TradeOffer | null>(null);
  const [showCreateOffer, setShowCreateOffer] = useState(false);
  
  const { userTrades, isLoadingTrades } = useTradeOffers();
  const { isConnected } = useTradingRealtime();

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

  const filterTradesByStatus = (status: string) => {
    if (!userTrades) return [];
    
    switch (status) {
      case 'active':
        return userTrades.filter(trade => ['pending', 'accepted'].includes(trade.status));
      case 'completed':
        return userTrades.filter(trade => trade.status === 'completed');
      case 'history':
        return userTrades.filter(trade => ['rejected', 'cancelled', 'expired'].includes(trade.status));
      default:
        return userTrades;
    }
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m left`;
  };

  if (selectedTrade) {
    return (
      <TradingRoom
        tradeOffer={selectedTrade}
        onClose={() => setSelectedTrade(null)}
      />
    );
  }

  if (showCreateOffer) {
    return (
      <div className="min-h-screen bg-crd-darkest p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              onClick={() => setShowCreateOffer(false)}
              variant="outline"
              className="mb-4"
            >
              ← Back to Trading
            </Button>
            <h1 className="text-3xl font-bold text-white">Create Trade Offer</h1>
          </div>
          <TradeOfferBuilder
            recipientId="placeholder" // This would be selected from a user picker
            onComplete={() => setShowCreateOffer(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Trading Center</h1>
              <p className="text-crd-lightGray">
                Trade cards with other collectors
                {isConnected && (
                  <span className="ml-2 inline-flex items-center text-xs text-crd-green">
                    <div className="w-2 h-2 bg-crd-green rounded-full mr-1 animate-pulse" />
                    Live
                  </span>
                )}
              </p>
            </div>
            
            <Button
              onClick={() => setShowCreateOffer(true)}
              className="bg-crd-green text-black hover:bg-crd-green/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Trade Offer
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-crd-green/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-crd-green" />
                  </div>
                  <div>
                    <p className="text-sm text-crd-lightGray">Active Trades</p>
                    <p className="text-xl font-bold text-white">
                      {filterTradesByStatus('active').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-crd-lightGray">Completed</p>
                    <p className="text-xl font-bold text-white">
                      {filterTradesByStatus('completed').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-crd-lightGray">Trade Partners</p>
                    <p className="text-xl font-bold text-white">
                      {new Set([
                        ...userTrades?.map(t => t.initiator_id) || [],
                        ...userTrades?.map(t => t.recipient_id) || []
                      ]).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-crd-lightGray">Pending</p>
                    <p className="text-xl font-bold text-white">
                      {userTrades?.filter(t => t.status === 'pending').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-crd-mediumGray mb-6">
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-crd-green data-[state=active]:text-black"
            >
              Active Trades ({filterTradesByStatus('active').length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-crd-green data-[state=active]:text-black"
            >
              Completed ({filterTradesByStatus('completed').length})
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-crd-green data-[state=active]:text-black"
            >
              History ({filterTradesByStatus('history').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {isLoadingTrades ? (
              <div className="text-center py-12">
                <div className="text-crd-lightGray">Loading trades...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filterTradesByStatus(activeTab).map((trade) => (
                  <Card key={trade.id} className="bg-crd-dark border-crd-mediumGray hover:border-crd-green/50 transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-lg">
                          Trade #{trade.id.slice(0, 8)}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(trade.status)} text-white`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(trade.status)}
                              {trade.status}
                            </div>
                          </Badge>
                        </div>
                      </div>
                      {trade.status === 'pending' && (
                        <p className="text-sm text-crd-lightGray">
                          {formatTimeRemaining(trade.expires_at)}
                        </p>
                      )}
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-crd-lightGray mb-2">Offering</p>
                            <div className="space-y-1">
                              {trade.offered_cards.slice(0, 2).map((card, index) => (
                                <p key={index} className="text-sm text-white truncate">
                                  {card.title}
                                </p>
                              ))}
                              {trade.offered_cards.length > 2 && (
                                <p className="text-xs text-crd-lightGray">
                                  +{trade.offered_cards.length - 2} more
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-crd-lightGray mb-2">Requesting</p>
                            <div className="space-y-1">
                              {trade.requested_cards.slice(0, 2).map((card, index) => (
                                <p key={index} className="text-sm text-white truncate">
                                  {card.title}
                                </p>
                              ))}
                              {trade.requested_cards.length > 2 && (
                                <p className="text-xs text-crd-lightGray">
                                  +{trade.requested_cards.length - 2} more
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-crd-mediumGray">
                          <span className="text-sm text-crd-lightGray">
                            {formatDistanceToNow(new Date(trade.created_at), { addSuffix: true })}
                          </span>
                          <Button
                            onClick={() => setSelectedTrade(trade)}
                            size="sm"
                            className="bg-crd-green hover:bg-crd-green/90 text-black"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            View Trade
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoadingTrades && filterTradesByStatus(activeTab).length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔄</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No {activeTab} trades
                </h3>
                <p className="text-crd-lightGray mb-4">
                  {activeTab === 'active' 
                    ? "You don't have any active trades right now."
                    : `No ${activeTab} trades to display.`
                  }
                </p>
                {activeTab === 'active' && (
                  <Button
                    onClick={() => setShowCreateOffer(true)}
                    className="bg-crd-green hover:bg-crd-green/90 text-black"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Trade
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Trading;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuctionSystem } from '@/hooks/marketplace/useAuctionSystem';
import { Hammer, TrendingUp, Timer, Users, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileAuctionInterfaceProps {
  listingId: string;
  currentPrice: number;
  endTime: string;
  minimumBidIncrement?: number;
}

export const MobileAuctionInterface: React.FC<MobileAuctionInterfaceProps> = ({
  listingId,
  currentPrice,
  endTime,
  minimumBidIncrement = 1
}) => {
  const { bids, placeBid, isPlacingBid } = useAuctionSystem(listingId);
  const [bidAmount, setBidAmount] = useState(currentPrice + minimumBidIncrement);
  const [quickBidMultiplier, setQuickBidMultiplier] = useState(1);
  const isMobile = useIsMobile();

  const timeRemaining = new Date(endTime).getTime() - new Date().getTime();
  const isAuctionActive = timeRemaining > 0;

  const quickBidAmounts = [
    currentPrice + minimumBidIncrement,
    currentPrice + (minimumBidIncrement * 2),
    currentPrice + (minimumBidIncrement * 5),
    currentPrice + (minimumBidIncrement * 10)
  ];

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const handleQuickBid = (amount: number) => {
    placeBid.mutate({ amount });
  };

  const handleCustomBid = () => {
    if (bidAmount > currentPrice) {
      placeBid.mutate({ amount: bidAmount });
    }
  };

  if (!isMobile) {
    return null; // Use regular auction interface on desktop
  }

  return (
    <div className="space-y-4">
      {/* Current Status */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Hammer className="w-5 h-5 text-crd-green" />
              <span className="font-semibold text-white">Live Auction</span>
            </div>
            {isAuctionActive ? (
              <Badge variant="outline" className="border-crd-green text-crd-green animate-pulse">
                <Timer className="w-3 h-3 mr-1" />
                {formatTime(timeRemaining)}
              </Badge>
            ) : (
              <Badge variant="destructive">Ended</Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-crd-lightGray">Current Bid</span>
              <span className="text-2xl font-bold text-white">${currentPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-crd-lightGray flex items-center gap-1">
                <Users className="w-3 h-3" />
                {bids.length} bids
              </span>
              <span className="text-crd-lightGray">
                Min bid: ${(currentPrice + minimumBidIncrement).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {isAuctionActive && (
        <>
          {/* Quick Bid Buttons */}
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Quick Bid
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 pt-0">
              {quickBidAmounts.map((amount, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="border-crd-mediumGray text-white hover:border-crd-green hover:text-crd-green"
                  onClick={() => handleQuickBid(amount)}
                  disabled={isPlacingBid}
                >
                  ${amount.toFixed(2)}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Custom Bid */}
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">Custom Bid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    min={currentPrice + minimumBidIncrement}
                    step={minimumBidIncrement}
                    className="bg-crd-mediumGray border-crd-lightGray text-white"
                    placeholder="Enter bid amount"
                  />
                </div>
                <Button
                  onClick={handleCustomBid}
                  disabled={isPlacingBid || bidAmount <= currentPrice}
                  className="bg-crd-green hover:bg-green-600 text-black font-semibold px-6"
                >
                  {isPlacingBid ? 'Bidding...' : 'Bid'}
                </Button>
              </div>
              
              {bidAmount <= currentPrice && (
                <p className="text-red-400 text-xs">
                  Bid must be higher than current price
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Recent Bids */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {bids.slice(0, 5).map((bid, index) => (
              <div key={bid.id} className="flex justify-between items-center py-2 border-b border-crd-mediumGray last:border-b-0">
                <div className="flex items-center gap-2">
                  {index === 0 && (
                    <Badge variant="outline" className="border-crd-green text-crd-green text-xs">
                      Winning
                    </Badge>
                  )}
                  <span className="text-sm text-crd-lightGray">
                    Bid #{bids.length - index}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white">${bid.amount.toFixed(2)}</div>
                  <div className="text-xs text-crd-lightGray">
                    {new Date(bid.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {bids.length === 0 && (
              <p className="text-center text-crd-lightGray py-4">
                No bids yet. Be the first to bid!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

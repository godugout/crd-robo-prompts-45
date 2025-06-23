
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuctionSystem } from '@/hooks/marketplace/useAuctionSystem';
import { formatDistanceToNow } from 'date-fns';
import { Gavel, Clock, TrendingUp, Users, DollarSign, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface AuctionInterfaceProps {
  listingId: string;
  listing: {
    id: string;
    title: string;
    starting_bid?: number;
    current_bid?: number;
    auction_end_time?: string;
    reserve_price?: number;
    watchers_count?: number;
  };
}

export const AuctionInterface: React.FC<AuctionInterfaceProps> = ({
  listingId,
  listing
}) => {
  const { bids, winningBid, currentPrice, bidsLoading, placeBid, isPlacingBid } = useAuctionSystem(listingId);
  const [bidAmount, setBidAmount] = useState('');
  const [proxyMaxAmount, setProxyMaxAmount] = useState('');
  const [bidType, setBidType] = useState<'manual' | 'proxy'>('manual');
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Calculate minimum bid
  const minimumBid = currentPrice > 0 ? currentPrice + 1 : (listing.starting_bid || 1);

  // Update countdown timer
  useEffect(() => {
    if (!listing.auction_end_time) return;

    const updateTimer = () => {
      const endTime = new Date(listing.auction_end_time!);
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining(`${minutes}m ${seconds}s`);
        }
      } else {
        setTimeRemaining('Auction ended');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [listing.auction_end_time]);

  const handlePlaceBid = async () => {
    const amount = parseFloat(bidAmount);
    const proxyMax = proxyMaxAmount ? parseFloat(proxyMaxAmount) : undefined;

    if (!amount || amount < minimumBid) {
      toast.error(`Bid must be at least $${minimumBid}`);
      return;
    }

    if (bidType === 'proxy' && (!proxyMax || proxyMax <= amount)) {
      toast.error('Maximum proxy bid must be higher than current bid');
      return;
    }

    try {
      await placeBid.mutateAsync({
        amount,
        proxyMaxAmount: proxyMax,
        bidType
      });

      setBidAmount('');
      setProxyMaxAmount('');
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };

  const isAuctionEnded = listing.auction_end_time && new Date(listing.auction_end_time) < new Date();

  return (
    <div className="space-y-6">
      {/* Auction Header */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Gavel className="w-5 h-5 text-crd-green" />
              Live Auction
            </CardTitle>
            <Badge variant={isAuctionEnded ? "destructive" : "default"} className="bg-crd-green text-black">
              {isAuctionEnded ? 'Ended' : 'Active'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Bid & Time Remaining */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-crd-mediumGray rounded-lg">
              <div className="text-sm text-crd-lightGray mb-1">Current Bid</div>
              <div className="text-2xl font-bold text-crd-green">
                ${currentPrice.toFixed(2)}
              </div>
              {listing.reserve_price && currentPrice < listing.reserve_price && (
                <div className="text-xs text-orange-400 mt-1">
                  Reserve not met
                </div>
              )}
            </div>

            <div className="text-center p-4 bg-crd-mediumGray rounded-lg">
              <div className="text-sm text-crd-lightGray mb-1 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4" />
                Time Remaining
              </div>
              <div className="text-xl font-bold text-white">
                {timeRemaining}
              </div>
            </div>

            <div className="text-center p-4 bg-crd-mediumGray rounded-lg">
              <div className="text-sm text-crd-lightGray mb-1 flex items-center justify-center gap-1">
                <Users className="w-4 h-4" />
                Watchers
              </div>
              <div className="text-xl font-bold text-white">
                {listing.watchers_count || 0}
              </div>
            </div>
          </div>

          {/* Bid Form */}
          {!isAuctionEnded && (
            <div className="p-4 bg-crd-mediumGray rounded-lg">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={bidType === 'manual' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBidType('manual')}
                    className={bidType === 'manual' ? 'bg-crd-green text-black' : ''}
                  >
                    Manual Bid
                  </Button>
                  <Button
                    variant={bidType === 'proxy' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBidType('proxy')}
                    className={bidType === 'proxy' ? 'bg-crd-green text-black' : ''}
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Proxy Bid
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-crd-lightGray mb-2 block">
                      {bidType === 'manual' ? 'Your Bid' : 'Initial Bid'} (min: ${minimumBid})
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-crd-lightGray" />
                      <Input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={minimumBid.toString()}
                        className="pl-10 bg-crd-dark border-crd-mediumGray text-white"
                        min={minimumBid}
                        step="0.01"
                      />
                    </div>
                  </div>

                  {bidType === 'proxy' && (
                    <div>
                      <label className="text-sm text-crd-lightGray mb-2 block">
                        Maximum Bid (auto-bid up to this amount)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-crd-lightGray" />
                        <Input
                          type="number"
                          value={proxyMaxAmount}
                          onChange={(e) => setProxyMaxAmount(e.target.value)}
                          placeholder="Maximum amount"
                          className="pl-10 bg-crd-dark border-crd-mediumGray text-white"
                          step="0.01"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handlePlaceBid}
                  disabled={isPlacingBid || !bidAmount}
                  className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-semibold"
                >
                  {isPlacingBid ? 'Placing Bid...' : `Place ${bidType === 'proxy' ? 'Proxy ' : ''}Bid`}
                </Button>

                {bidType === 'proxy' && (
                  <div className="text-xs text-crd-lightGray">
                    <Shield className="w-3 h-3 inline mr-1" />
                    Proxy bidding will automatically bid for you up to your maximum amount when outbid.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reserve Price Info */}
          {listing.reserve_price && (
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="text-sm text-orange-400">
                <Shield className="w-4 h-4 inline mr-1" />
                This auction has a reserve price. The item will only sell if the reserve is met.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bid History */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white">Bid History</CardTitle>
        </CardHeader>
        <CardContent>
          {bidsLoading ? (
            <div className="text-center py-4 text-crd-lightGray">Loading bid history...</div>
          ) : bids.length === 0 ? (
            <div className="text-center py-4 text-crd-lightGray">No bids yet. Be the first to bid!</div>
          ) : (
            <div className="space-y-2">
              {bids.map((bid, index) => (
                <div
                  key={bid.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    bid.is_winning_bid 
                      ? 'bg-crd-green/20 border border-crd-green/30' 
                      : 'bg-crd-mediumGray'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      bid.is_winning_bid ? 'bg-crd-green text-black' : 'bg-crd-lightGray text-crd-dark'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-white">${bid.amount.toFixed(2)}</div>
                      <div className="text-xs text-crd-lightGray">
                        {bid.bid_type === 'proxy' && '(Proxy) '}
                        {formatDistanceToNow(new Date(bid.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  
                  {bid.is_winning_bid && (
                    <Badge className="bg-crd-green text-black">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Winning
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

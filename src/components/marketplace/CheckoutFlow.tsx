
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Truck, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { MarketplaceListing } from '@/types/marketplace';

interface CheckoutFlowProps {
  listing: MarketplaceListing | null;
  open: boolean;
  onClose: () => void;
}

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  listing,
  open,
  onClose
}) => {
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });

  const calculateTotal = () => {
    if (!listing) return 0;
    const subtotal = listing.price;
    const shipping = listing.shipping_cost || 0;
    const platformFee = subtotal * 0.05; // 5% platform fee
    return subtotal + shipping + platformFee;
  };

  const handlePurchase = async () => {
    if (!listing) return;

    try {
      setLoading(true);

      // Create Stripe checkout session
      const { data, error } = await supabase.functions.invoke('marketplace-checkout', {
        body: {
          listing_id: listing.id,
          shipping_address: shippingAddress,
          return_url: window.location.origin + '/marketplace/success',
          cancel_url: window.location.origin + '/marketplace'
        }
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!listing) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Complete Your Purchase
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="flex gap-4">
              {listing.card?.image_url && (
                <img
                  src={listing.card.image_url}
                  alt={listing.title}
                  className="w-20 h-28 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h4 className="font-medium">{listing.title}</h4>
                <p className="text-sm text-gray-600">Condition: {listing.condition}</p>
                <p className="text-sm text-gray-600">Seller: {listing.seller?.username}</p>
                <p className="text-lg font-semibold mt-2">${listing.price.toFixed(2)}</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Item Price</span>
                <span>${listing.price.toFixed(2)}</span>
              </div>
              {listing.shipping_cost && (
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${listing.shipping_cost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Platform Fee (5%)</span>
                <span>${(listing.price * 0.05).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Shipping Address
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={shippingAddress.name}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={shippingAddress.email}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                required
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  value={shippingAddress.zip}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, zip: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Secure Payment</h4>
                <p className="text-sm text-blue-700">
                  Your payment is processed securely through Stripe. Funds are held in escrow until delivery confirmation.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handlePurchase} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Processing...' : `Pay $${calculateTotal().toFixed(2)}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

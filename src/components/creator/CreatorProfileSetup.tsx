
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useCreatorProfile } from '@/hooks/creator/useCreatorProfile';
import { Palette, DollarSign, Star, Users } from 'lucide-react';
import { toast } from 'sonner';

export const CreatorProfileSetup: React.FC = () => {
  const { createProfile, setupStripeAccount } = useCreatorProfile();
  const [formData, setFormData] = useState({
    bio: '',
    portfolio_url: '',
    specialties: [] as string[],
    commission_rates: {
      standard: 50,
      premium: 100,
      custom: 150,
    },
  });

  const [currentSpecialty, setCurrentSpecialty] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createProfile.mutateAsync({
        ...formData,
        verification_status: 'pending',
      });
    } catch (error) {
      console.error('Profile creation failed:', error);
    }
  };

  const addSpecialty = () => {
    if (currentSpecialty.trim() && !formData.specialties.includes(currentSpecialty.trim())) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, currentSpecialty.trim()],
      });
      setCurrentSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter(s => s !== specialty),
    });
  };

  return (
    <div className="min-h-screen bg-crd-darkest p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Become a Creator</h1>
          <p className="text-crd-lightGray text-lg">
            Join our creator economy and start earning from your card designs
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-crd-dark border-crd-mediumGray text-center">
            <CardContent className="p-6">
              <DollarSign className="w-8 h-8 text-crd-green mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">70% Revenue Share</h3>
              <p className="text-sm text-crd-lightGray">Keep most of what you earn</p>
            </CardContent>
          </Card>

          <Card className="bg-crd-dark border-crd-mediumGray text-center">
            <CardContent className="p-6">
              <Palette className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Professional Tools</h3>
              <p className="text-sm text-crd-lightGray">Advanced design studio</p>
            </CardContent>
          </Card>

          <Card className="bg-crd-dark border-crd-mediumGray text-center">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Global Marketplace</h3>
              <p className="text-sm text-crd-lightGray">Reach millions of users</p>
            </CardContent>
          </Card>

          <Card className="bg-crd-dark border-crd-mediumGray text-center">
            <CardContent className="p-6">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Monthly Payouts</h3>
              <p className="text-sm text-crd-lightGray">Automated Stripe transfers</p>
            </CardContent>
          </Card>
        </div>

        {/* Setup Form */}
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardHeader>
            <CardTitle className="text-white">Setup Your Creator Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself and your design style..."
                    className="bg-crd-mediumGray border-crd-lightGray text-white"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio" className="text-white">Portfolio URL</Label>
                  <Input
                    id="portfolio"
                    type="url"
                    placeholder="https://your-portfolio.com"
                    className="bg-crd-mediumGray border-crd-lightGray text-white"
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-white">Specialties</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a specialty (e.g., Sports Cards, Fantasy Art)"
                    className="bg-crd-mediumGray border-crd-lightGray text-white"
                    value={currentSpecialty}
                    onChange={(e) => setCurrentSpecialty(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                  />
                  <Button type="button" onClick={addSpecialty} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeSpecialty(specialty)}
                    >
                      {specialty} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-white">Commission Rates (USD)</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="standard-rate" className="text-sm text-crd-lightGray">Standard</Label>
                    <Input
                      id="standard-rate"
                      type="number"
                      min="25"
                      max="500"
                      className="bg-crd-mediumGray border-crd-lightGray text-white"
                      value={formData.commission_rates.standard}
                      onChange={(e) => setFormData({
                        ...formData,
                        commission_rates: {
                          ...formData.commission_rates,
                          standard: parseInt(e.target.value) || 50,
                        },
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="premium-rate" className="text-sm text-crd-lightGray">Premium</Label>
                    <Input
                      id="premium-rate"
                      type="number"
                      min="50"
                      max="1000"
                      className="bg-crd-mediumGray border-crd-lightGray text-white"
                      value={formData.commission_rates.premium}
                      onChange={(e) => setFormData({
                        ...formData,
                        commission_rates: {
                          ...formData.commission_rates,
                          premium: parseInt(e.target.value) || 100,
                        },
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-rate" className="text-sm text-crd-lightGray">Custom</Label>
                    <Input
                      id="custom-rate"
                      type="number"
                      min="100"
                      max="2000"
                      className="bg-crd-mediumGray border-crd-lightGray text-white"
                      value={formData.commission_rates.custom}
                      onChange={(e) => setFormData({
                        ...formData,
                        commission_rates: {
                          ...formData.commission_rates,
                          custom: parseInt(e.target.value) || 150,
                        },
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-crd-green hover:bg-green-600 text-black flex-1"
                  disabled={createProfile.isPending}
                >
                  {createProfile.isPending ? 'Creating Profile...' : 'Create Creator Profile'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-crd-mediumGray text-crd-lightGray"
                  onClick={() => setupStripeAccount.mutateAsync(formData)}
                  disabled={setupStripeAccount.isPending}
                >
                  {setupStripeAccount.isPending ? 'Setting up...' : 'Setup Stripe Account'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

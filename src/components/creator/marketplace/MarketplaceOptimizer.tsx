
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useMarketplaceOptimization } from '@/hooks/creator/useMarketplaceOptimization';
import { TrendingUp, Search, Share2, Target, BarChart3 } from 'lucide-react';

export const MarketplaceOptimizer: React.FC = () => {
  const { 
    seoProfile, 
    performanceMetrics, 
    loadingSEO, 
    createOrUpdateSEO, 
    calculateSEOScore,
    getRecentTrend 
  } = useMarketplaceOptimization();

  const [seoData, setSeoData] = useState({
    meta_title: seoProfile?.meta_title || '',
    meta_description: seoProfile?.meta_description || '',
    keywords: seoProfile?.keywords?.join(', ') || '',
    custom_url_slug: seoProfile?.custom_url_slug || '',
    social_media_links: {
      twitter: seoProfile?.social_media_links?.twitter || '',
      instagram: seoProfile?.social_media_links?.instagram || '',
    }
  });

  const handleSaveSEO = async () => {
    await createOrUpdateSEO.mutateAsync({
      meta_title: seoData.meta_title,
      meta_description: seoData.meta_description,
      keywords: seoData.keywords.split(',').map(k => k.trim()).filter(Boolean),
      custom_url_slug: seoData.custom_url_slug,
      social_media_links: seoData.social_media_links,
    });
  };

  const seoScore = calculateSEOScore(seoProfile);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Marketplace Optimization</h2>
        <p className="text-crd-lightGray">
          Optimize your presence and boost discoverability in the marketplace
        </p>
      </div>

      {/* SEO Score Overview */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            SEO Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-white">{seoScore}%</div>
            <div className="flex-1">
              <div className="w-full bg-crd-mediumGray rounded-full h-3">
                <div 
                  className="bg-crd-green h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${seoScore}%` }}
                />
              </div>
              <p className="text-crd-lightGray text-sm mt-2">
                {seoScore >= 80 ? 'Excellent' : seoScore >= 60 ? 'Good' : seoScore >= 40 ? 'Fair' : 'Needs Improvement'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Configuration */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="w-5 h-5" />
            SEO Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="meta_title" className="text-white">Meta Title</Label>
            <Input
              id="meta_title"
              value={seoData.meta_title}
              onChange={(e) => setSeoData(prev => ({ ...prev, meta_title: e.target.value }))}
              placeholder="Your creative studio - Premium card designs"
              className="bg-crd-mediumGray border-crd-lightGray text-white"
              maxLength={60}
            />
            <p className="text-crd-lightGray text-xs mt-1">
              {seoData.meta_title.length}/60 characters
            </p>
          </div>

          <div>
            <Label htmlFor="meta_description" className="text-white">Meta Description</Label>
            <Textarea
              id="meta_description"
              value={seoData.meta_description}
              onChange={(e) => setSeoData(prev => ({ ...prev, meta_description: e.target.value }))}
              placeholder="Discover unique, high-quality card designs created by professional artists..."
              className="bg-crd-mediumGray border-crd-lightGray text-white"
              maxLength={160}
            />
            <p className="text-crd-lightGray text-xs mt-1">
              {seoData.meta_description.length}/160 characters
            </p>
          </div>

          <div>
            <Label htmlFor="keywords" className="text-white">Keywords</Label>
            <Input
              id="keywords"
              value={seoData.keywords}
              onChange={(e) => setSeoData(prev => ({ ...prev, keywords: e.target.value }))}
              placeholder="trading cards, sports cards, custom designs, collectibles"
              className="bg-crd-mediumGray border-crd-lightGray text-white"
            />
            <p className="text-crd-lightGray text-xs mt-1">
              Separate keywords with commas
            </p>
          </div>

          <div>
            <Label htmlFor="custom_url" className="text-white">Custom URL Slug</Label>
            <Input
              id="custom_url"
              value={seoData.custom_url_slug}
              onChange={(e) => setSeoData(prev => ({ ...prev, custom_url_slug: e.target.value }))}
              placeholder="my-creative-studio"
              className="bg-crd-mediumGray border-crd-lightGray text-white"
            />
            <p className="text-crd-lightGray text-xs mt-1">
              cardshow.com/creator/{seoData.custom_url_slug || 'your-slug'}
            </p>
          </div>

          <Button 
            onClick={handleSaveSEO}
            disabled={createOrUpdateSEO.isPending}
            className="bg-crd-green hover:bg-green-600 text-black"
          >
            {createOrUpdateSEO.isPending ? 'Saving...' : 'Save SEO Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* Social Media Integration */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Social Media Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="twitter" className="text-white">Twitter/X Profile</Label>
            <Input
              id="twitter"
              value={seoData.social_media_links.twitter}
              onChange={(e) => setSeoData(prev => ({ 
                ...prev, 
                social_media_links: { ...prev.social_media_links, twitter: e.target.value }
              }))}
              placeholder="https://twitter.com/yourusername"
              className="bg-crd-mediumGray border-crd-lightGray text-white"
            />
          </div>

          <div>
            <Label htmlFor="instagram" className="text-white">Instagram Profile</Label>
            <Input
              id="instagram"
              value={seoData.social_media_links.instagram}
              onChange={(e) => setSeoData(prev => ({ 
                ...prev, 
                social_media_links: { ...prev.social_media_links, instagram: e.target.value }
              }))}
              placeholder="https://instagram.com/yourusername"
              className="bg-crd-mediumGray border-crd-lightGray text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance Analytics */}
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-crd-mediumGray rounded-lg">
              <div className="text-2xl font-bold text-white">
                {performanceMetrics.filter(m => m.metric_name === 'profile_views').length}
              </div>
              <div className="text-crd-lightGray text-sm">Profile Views</div>
              <Badge variant="secondary" className="mt-2">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{Math.round(getRecentTrend('profile_views'))}%
              </Badge>
            </div>

            <div className="text-center p-4 bg-crd-mediumGray rounded-lg">
              <div className="text-2xl font-bold text-white">
                {performanceMetrics.filter(m => m.metric_name === 'card_downloads').length}
              </div>
              <div className="text-crd-lightGray text-sm">Card Downloads</div>
              <Badge variant="secondary" className="mt-2">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{Math.round(getRecentTrend('card_downloads'))}%
              </Badge>
            </div>

            <div className="text-center p-4 bg-crd-mediumGray rounded-lg">
              <div className="text-2xl font-bold text-white">
                {performanceMetrics.filter(m => m.metric_name === 'search_impressions').length}
              </div>
              <div className="text-crd-lightGray text-sm">Search Impressions</div>
              <Badge variant="secondary" className="mt-2">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{Math.round(getRecentTrend('search_impressions'))}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

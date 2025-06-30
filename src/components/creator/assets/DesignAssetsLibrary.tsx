
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDesignAssets } from '@/hooks/creator/useDesignAssets';
import { AssetUploadModal } from './AssetUploadModal';
import { Palette, Download, DollarSign, Eye, Search, Plus, Grid3x3, List } from 'lucide-react';

export const DesignAssetsLibrary: React.FC = () => {
  const { myAssets, publicAssets, loadingMyAssets, loadingPublicAssets, downloadAsset } = useDesignAssets();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const getAssetIcon = (assetType: string) => {
    switch (assetType) {
      case 'texture': return '🎨';
      case 'pattern': return '📐';
      case 'shape': return '⭕';
      case 'icon': return '🔸';
      case 'font': return '🔤';
      case 'template_element': return '🧩';
      case '3d_model': return '📦';
      case 'animation': return '🎬';
      default: return '📄';
    }
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredMyAssets = myAssets.filter(asset =>
    asset.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPublicAssets = publicAssets.filter(asset =>
    asset.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loadingMyAssets) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-crd-dark border-crd-mediumGray animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-crd-mediumGray rounded mb-2"></div>
              <div className="h-3 bg-crd-mediumGray rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Design Assets Library</h2>
          <p className="text-crd-lightGray">
            Manage your design assets and discover resources from the community
          </p>
        </div>
        <Button 
          onClick={() => setShowUploadModal(true)}
          className="bg-crd-green hover:bg-green-600 text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload Asset
        </Button>
      </div>

      {/* Search and Controls */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crd-lightGray w-4 h-4" />
          <Input
            placeholder="Search assets by name or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-crd-mediumGray border-crd-lightGray text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="my-assets" className="space-y-6">
        <TabsList className="bg-crd-dark border-crd-mediumGray">
          <TabsTrigger value="my-assets" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
            My Assets ({myAssets.length})
          </TabsTrigger>
          <TabsTrigger value="public-assets" className="data-[state=active]:bg-crd-green data-[state=active]:text-black">
            Community Assets ({publicAssets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-assets">
          {filteredMyAssets.length === 0 ? (
            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardContent className="text-center py-12">
                <Palette className="w-12 h-12 text-crd-lightGray mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">No assets found</h3>
                <p className="text-crd-lightGray mb-4">
                  {searchQuery ? `No assets match "${searchQuery}"` : 'Upload your first design asset to get started'}
                </p>
                <Button 
                  onClick={() => setShowUploadModal(true)}
                  className="bg-crd-green hover:bg-green-600 text-black"
                >
                  Upload Asset
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
              {filteredMyAssets.map((asset) => (
                <Card key={asset.id} className="bg-crd-dark border-crd-mediumGray hover:border-crd-green transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getAssetIcon(asset.asset_type)}</span>
                        <div>
                          <h4 className="text-white font-medium">{asset.title || 'Untitled Asset'}</h4>
                          <p className="text-crd-lightGray text-sm capitalize">
                            {asset.asset_type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <Badge variant={asset.usage_rights === 'free' ? 'secondary' : 'default'}>
                        {formatPrice(asset.price)}
                      </Badge>
                    </div>

                    {asset.description && (
                      <p className="text-crd-lightGray text-sm mb-3">{asset.description}</p>
                    )}

                    <div className="flex items-center justify-between text-sm text-crd-lightGray mb-3">
                      <span>{formatFileSize(asset.file_size)}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {asset.downloads_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {asset.is_public ? 'Public' : 'Private'}
                        </span>
                      </div>
                    </div>

                    {asset.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {asset.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {asset.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{asset.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-crd-green hover:bg-green-600 text-black"
                        onClick={() => window.open(asset.file_url, '_blank')}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="public-assets">
          {filteredPublicAssets.length === 0 ? (
            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardContent className="text-center py-12">
                <Palette className="w-12 h-12 text-crd-lightGray mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">No public assets found</h3>
                <p className="text-crd-lightGray">
                  {searchQuery ? `No assets match "${searchQuery}"` : 'No public assets available yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
              {filteredPublicAssets.map((asset) => (
                <Card key={asset.id} className="bg-crd-dark border-crd-mediumGray hover:border-crd-green transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getAssetIcon(asset.asset_type)}</span>
                        <div>
                          <h4 className="text-white font-medium">{asset.title || 'Untitled Asset'}</h4>
                          <p className="text-crd-lightGray text-sm capitalize">
                            {asset.asset_type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <Badge variant={asset.usage_rights === 'free' ? 'secondary' : 'default'}>
                        {formatPrice(asset.price)}
                      </Badge>
                    </div>

                    {asset.description && (
                      <p className="text-crd-lightGray text-sm mb-3">{asset.description}</p>
                    )}

                    <div className="flex items-center justify-between text-sm text-crd-lightGray mb-3">
                      <span>{formatFileSize(asset.file_size)}</span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {asset.downloads_count}
                      </span>
                    </div>

                    {asset.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {asset.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {asset.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{asset.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <Button 
                      size="sm" 
                      className="w-full bg-crd-green hover:bg-green-600 text-black"
                      onClick={() => {
                        downloadAsset.mutateAsync(asset.id);
                        window.open(asset.file_url, '_blank');
                      }}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      {asset.price > 0 ? `Purchase - ${formatPrice(asset.price)}` : 'Download Free'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Upload Asset Modal */}
      {showUploadModal && (
        <AssetUploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
};

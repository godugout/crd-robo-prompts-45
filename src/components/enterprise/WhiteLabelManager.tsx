
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Globe, Shield, Palette, Settings, Users, BarChart3 } from 'lucide-react';

interface WhiteLabelConfig {
  id: string;
  clientName: string;
  domain: string;
  customBranding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundImage?: string;
  };
  features: {
    analytics: boolean;
    marketplace: boolean;
    socialFeatures: boolean;
    aiGeneration: boolean;
    exportOptions: boolean;
  };
  userLimits: {
    maxUsers: number;
    maxCards: number;
    maxStorage: number; // in GB
  };
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
}

export const WhiteLabelManager: React.FC = () => {
  const [configs, setConfigs] = useState<WhiteLabelConfig[]>([
    {
      id: '1',
      clientName: 'SportsCorp',
      domain: 'cards.sportscorp.com',
      customBranding: {
        logo: '/client-logos/sportscorp.png',
        primaryColor: '#FF6B35',
        secondaryColor: '#004E89',
      },
      features: {
        analytics: true,
        marketplace: true,
        socialFeatures: false,
        aiGeneration: true,
        exportOptions: true,
      },
      userLimits: {
        maxUsers: 10000,
        maxCards: 100000,
        maxStorage: 500,
      },
      status: 'active',
      createdAt: '2024-01-15',
    },
  ]);

  const [selectedConfig, setSelectedConfig] = useState<WhiteLabelConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveConfig = (config: WhiteLabelConfig) => {
    setConfigs(prev => 
      prev.map(c => c.id === config.id ? config : c)
    );
    setIsEditing(false);
    setSelectedConfig(null);
  };

  const createNewConfig = () => {
    const newConfig: WhiteLabelConfig = {
      id: Date.now().toString(),
      clientName: '',
      domain: '',
      customBranding: {
        logo: '',
        primaryColor: '#00FF94',
        secondaryColor: '#0A0A0B',
      },
      features: {
        analytics: true,
        marketplace: true,
        socialFeatures: true,
        aiGeneration: true,
        exportOptions: true,
      },
      userLimits: {
        maxUsers: 1000,
        maxCards: 10000,
        maxStorage: 100,
      },
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setSelectedConfig(newConfig);
    setIsEditing(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">White-Label Manager</h1>
          <p className="text-crd-lightGray">Configure and manage enterprise client deployments</p>
        </div>
        <Button onClick={createNewConfig}>
          <Globe className="w-4 h-4 mr-2" />
          New Configuration
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration List */}
        <div className="lg:col-span-1">
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader>
              <CardTitle className="text-white">Client Configurations</CardTitle>
              <CardDescription>Active white-label deployments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {configs.map((config) => (
                <div
                  key={config.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedConfig?.id === config.id
                      ? 'border-crd-green bg-crd-green/10'
                      : 'border-crd-mediumGray hover:border-crd-lightGray'
                  }`}
                  onClick={() => setSelectedConfig(config)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white">{config.clientName}</h3>
                    <Badge variant={config.status === 'active' ? 'default' : 'secondary'}>
                      {config.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-crd-lightGray mb-2">{config.domain}</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3 text-crd-lightGray" />
                    <span className="text-xs text-crd-lightGray">
                      {config.userLimits.maxUsers.toLocaleString()} users max
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Configuration Details */}
        <div className="lg:col-span-2">
          {selectedConfig ? (
            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">
                    {isEditing ? 'Edit Configuration' : selectedConfig.clientName}
                  </CardTitle>
                  <CardDescription>{selectedConfig.domain}</CardDescription>
                </div>
                <div className="flex gap-2">
                  {!isEditing && (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Settings className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  {isEditing && (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => handleSaveConfig(selectedConfig)}>
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4 bg-crd-mediumGray">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="branding">Branding</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="limits">Limits</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="clientName" className="text-crd-lightGray">Client Name</Label>
                        <Input
                          id="clientName"
                          value={selectedConfig.clientName}
                          onChange={(e) => setSelectedConfig({
                            ...selectedConfig,
                            clientName: e.target.value
                          })}
                          disabled={!isEditing}
                          className="bg-crd-mediumGray border-crd-lightGray"
                        />
                      </div>
                      <div>
                        <Label htmlFor="domain" className="text-crd-lightGray">Custom Domain</Label>
                        <Input
                          id="domain"
                          value={selectedConfig.domain}
                          onChange={(e) => setSelectedConfig({
                            ...selectedConfig,
                            domain: e.target.value
                          })}
                          disabled={!isEditing}
                          className="bg-crd-mediumGray border-crd-lightGray"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="branding" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="primaryColor" className="text-crd-lightGray">Primary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="primaryColor"
                            type="color"
                            value={selectedConfig.customBranding.primaryColor}
                            onChange={(e) => setSelectedConfig({
                              ...selectedConfig,
                              customBranding: {
                                ...selectedConfig.customBranding,
                                primaryColor: e.target.value
                              }
                            })}
                            disabled={!isEditing}
                            className="w-16 h-10"
                          />
                          <Input
                            value={selectedConfig.customBranding.primaryColor}
                            disabled={!isEditing}
                            className="bg-crd-mediumGray border-crd-lightGray"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="secondaryColor" className="text-crd-lightGray">Secondary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="secondaryColor"
                            type="color"
                            value={selectedConfig.customBranding.secondaryColor}
                            onChange={(e) => setSelectedConfig({
                              ...selectedConfig,
                              customBranding: {
                                ...selectedConfig.customBranding,
                                secondaryColor: e.target.value
                              }
                            })}
                            disabled={!isEditing}
                            className="w-16 h-10"
                          />
                          <Input
                            value={selectedConfig.customBranding.secondaryColor}
                            disabled={!isEditing}
                            className="bg-crd-mediumGray border-crd-lightGray"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="features" className="space-y-4">
                    <div className="space-y-4">
                      {Object.entries(selectedConfig.features).map(([feature, enabled]) => (
                        <div key={feature} className="flex items-center justify-between">
                          <div>
                            <Label className="text-white capitalize">
                              {feature.replace(/([A-Z])/g, ' $1').trim()}
                            </Label>
                            <p className="text-sm text-crd-lightGray">
                              {getFeatureDescription(feature)}
                            </p>
                          </div>
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) => setSelectedConfig({
                              ...selectedConfig,
                              features: {
                                ...selectedConfig.features,
                                [feature]: checked
                              }
                            })}
                            disabled={!isEditing}
                          />
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="limits" className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="maxUsers" className="text-crd-lightGray">Max Users</Label>
                        <Input
                          id="maxUsers"
                          type="number"
                          value={selectedConfig.userLimits.maxUsers}
                          onChange={(e) => setSelectedConfig({
                            ...selectedConfig,
                            userLimits: {
                              ...selectedConfig.userLimits,
                              maxUsers: parseInt(e.target.value)
                            }
                          })}
                          disabled={!isEditing}
                          className="bg-crd-mediumGray border-crd-lightGray"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxCards" className="text-crd-lightGray">Max Cards</Label>
                        <Input
                          id="maxCards"
                          type="number"
                          value={selectedConfig.userLimits.maxCards}
                          onChange={(e) => setSelectedConfig({
                            ...selectedConfig,
                            userLimits: {
                              ...selectedConfig.userLimits,
                              maxCards: parseInt(e.target.value)
                            }
                          })}
                          disabled={!isEditing}
                          className="bg-crd-mediumGray border-crd-lightGray"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxStorage" className="text-crd-lightGray">Max Storage (GB)</Label>
                        <Input
                          id="maxStorage"
                          type="number"
                          value={selectedConfig.userLimits.maxStorage}
                          onChange={(e) => setSelectedConfig({
                            ...selectedConfig,
                            userLimits: {
                              ...selectedConfig.userLimits,
                              maxStorage: parseInt(e.target.value)
                            }
                          })}
                          disabled={!isEditing}
                          className="bg-crd-mediumGray border-crd-lightGray"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-crd-dark border-crd-mediumGray">
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Globe className="w-12 h-12 text-crd-lightGray mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Configuration Selected</h3>
                  <p className="text-crd-lightGray mb-4">
                    Select a client configuration to view and edit details
                  </p>
                  <Button onClick={createNewConfig}>
                    Create New Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const getFeatureDescription = (feature: string): string => {
  const descriptions: Record<string, string> = {
    analytics: 'Advanced analytics and reporting dashboard',
    marketplace: 'Built-in marketplace for trading cards',
    socialFeatures: 'Social sharing and community features',
    aiGeneration: 'AI-powered card generation tools',
    exportOptions: 'Export cards in various formats',
  };
  
  return descriptions[feature] || '';
};


import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  Bug, 
  Beaker, 
  TestTube, 
  Zap,
  Settings
} from 'lucide-react';

const Labs = () => {
  const labFeatures = [
    {
      title: 'Bulk Upload',
      description: 'Upload multiple card images at once and process them in batches',
      icon: Upload,
      path: '/labs/bulk-upload',
      status: 'Stable'
    },
    {
      title: 'Debug Detection',
      description: 'Advanced debugging tools for card detection and image processing',
      icon: Bug,
      path: '/labs/debug-detection',
      status: 'Beta'
    },
    {
      title: 'Feature Flags',
      description: 'Control experimental features and application toggles',
      icon: Settings,
      path: '/labs/feature-flags',
      status: 'Admin'
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Beaker className="w-8 h-8 text-crd-green" />
            <h1 className="text-3xl font-bold">CRD Labs</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experimental features and advanced tools for power users. 
            These features are in development and may change.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {labFeatures.map((feature) => (
            <Card key={feature.path} className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-crd-green/10">
                    <feature.icon className="w-5 h-5 text-crd-green" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      feature.status === 'Stable' ? 'bg-green-100 text-green-700' :
                      feature.status === 'Beta' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {feature.status}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <Link to={feature.path}>
                  <Button className="w-full">
                    Launch Feature
                    <TestTube className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold">Experimental Notice</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Features in Labs are experimental and may be unstable. They're designed for 
            testing and feedback. Use caution when using these features in production workflows.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Labs;

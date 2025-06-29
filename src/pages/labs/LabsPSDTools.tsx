
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileImage, 
  Eye, 
  Grid3X3,
  Layers,
  ArrowRight,
  Beaker,
  Star
} from 'lucide-react';

const LabsPSDTools: React.FC = () => {
  const psdTools = [
    {
      id: 'advanced-preview',
      title: 'Advanced PSD Preview',
      description: 'The most complete PSD analysis tool with 3D layer visualization, advanced canvas preview, and comprehensive inspection capabilities.',
      status: 'Recommended',
      link: '/labs/psd-tools/advanced-preview',
      color: 'bg-crd-green',
      icon: Eye,
      features: ['3D Layer Visualization', 'Advanced Canvas Preview', 'Layer Inspection', 'Save Functionality'],
      isRecommended: true
    },
    {
      id: 'simple-analysis',
      title: 'Simple PSD Analysis',
      description: 'Streamlined PSD analysis with clean interface for basic layer inspection and preview.',
      status: 'Stable',
      link: '/labs/psd-tools/simple-analysis',
      color: 'bg-blue-500',
      icon: FileImage,
      features: ['Layer Analysis', 'Clean Interface', 'Basic Preview', 'Quick Processing']
    },
    {
      id: 'bulk-analysis',
      title: 'Bulk PSD Analysis',
      description: 'Process multiple PSD files simultaneously with comparative analysis and batch operations.',
      status: 'Experimental',
      link: '/labs/psd-tools/bulk-analysis',
      color: 'bg-purple-500',
      icon: Grid3X3,
      features: ['Batch Processing', 'Comparative Analysis', 'Multiple File Upload', 'Grid View']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-dark to-crd-darkest">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-crd-green to-blue-500 rounded-2xl flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">PSD Tools Archive</h1>
              <p className="text-crd-lightGray">Experimental PSD processing and analysis tools</p>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-crd-lightGray mb-6">
              Welcome to our PSD tools collection! These are experimental and archived tools for 
              processing and analyzing Adobe Photoshop PSD files with various levels of complexity.
            </p>
            
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 mb-8">
              <Beaker className="w-3 h-3 mr-1" />
              Archived Tools
            </Badge>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {psdTools.map((tool) => (
            <Card key={tool.id} className={`bg-crd-mediumGray border-crd-mediumGray hover:border-crd-green/50 transition-all duration-300 ${tool.isRecommended ? 'ring-2 ring-crd-green/20' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 ${tool.color} rounded-lg flex items-center justify-center relative`}>
                    <tool.icon className="w-5 h-5 text-white" />
                    {tool.isRecommended && (
                      <Star className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 fill-current" />
                    )}
                  </div>
                  <Badge 
                    variant="outline"
                    className={
                      tool.status === 'Recommended' 
                        ? 'border-crd-green/50 text-crd-green'
                        : tool.status === 'Stable'
                        ? 'border-blue-500/50 text-blue-400'
                        : 'border-purple-500/50 text-purple-400'
                    }
                  >
                    {tool.status}
                  </Badge>
                </div>
                <CardTitle className="text-white flex items-center gap-2">
                  {tool.title}
                  {tool.isRecommended && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                </CardTitle>
                <p className="text-crd-lightGray">{tool.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Features</h4>
                    <ul className="space-y-1">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="text-sm text-crd-lightGray flex items-center">
                          <div className="w-1 h-1 bg-crd-green rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link to={tool.link}>
                    <Button 
                      className={`w-full ${tool.isRecommended ? 'bg-crd-green text-black hover:bg-crd-green/90' : 'border-white/20 text-white hover:bg-white/10'}`}
                      variant={tool.isRecommended ? 'default' : 'outline'}
                    >
                      {tool.isRecommended ? 'Launch Tool' : 'Explore Tool'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back to Labs */}
        <div className="text-center">
          <Link to="/labs">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Back to Labs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LabsPSDTools;

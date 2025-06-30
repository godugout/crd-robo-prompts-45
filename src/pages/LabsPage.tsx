
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Beaker, 
  FileImage, 
  Layers, 
  Sparkles, 
  ArrowRight,
  Grid,
  Upload,
  Eye
} from 'lucide-react';

const LabsPage: React.FC = () => {
  const psdTools = [
    {
      id: 'simple-analysis',
      title: 'Simple PSD Analysis',
      description: 'Clean, streamlined PSD layer analysis with visual preview',
      status: 'Active',
      route: '/debug/psd-preview',
      color: 'bg-crd-green',
      icon: FileImage,
      features: ['Layer extraction', 'Visual preview', 'Clean interface', 'Real-time analysis']
    },
    {
      id: 'advanced-analysis',
      title: 'Advanced PSD Analysis',
      description: 'Full-featured PSD analysis with advanced controls',
      status: 'Beta',
      route: '/debug/psd-preview-advanced',
      color: 'bg-blue-500',
      icon: Layers,
      features: ['Advanced controls', 'Multiple view modes', 'Layer manipulation', 'Export options']
    },
    {
      id: 'bulk-analysis',
      title: 'Bulk PSD Analysis',
      description: 'Process multiple PSD files simultaneously with comparison tools',
      status: 'Experimental',
      route: '/debug/bulk-psd-analysis',
      color: 'bg-purple-500',
      icon: Grid,
      features: ['Batch processing', 'Visual comparison', 'Interactive overlays', 'Bulk operations']
    }
  ];

  return (
    <div className="min-h-screen theme-bg-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-crd-green to-crd-blue rounded-2xl flex items-center justify-center">
              <Beaker className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold theme-text-primary">CardShow Labs</h1>
              <p className="theme-text-secondary">Advanced PSD processing and analysis tools</p>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-lg theme-text-secondary mb-6">
              Explore our cutting-edge PSD analysis tools designed to transform your card creation workflow. 
              Extract layers, analyze structure, and build stunning CRD frames from your PSD files.
            </p>
            
            <Badge className="bg-crd-green/20 text-crd-green border-crd-green/50 mb-8">
              <Sparkles className="w-3 h-3 mr-1" />
              Experimental Features
            </Badge>
          </div>
        </div>

        {/* PSD Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {psdTools.map((tool) => (
            <Card key={tool.id} className="theme-bg-secondary theme-border hover:border-crd-green/50 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 ${tool.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <tool.icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge 
                    variant="outline"
                    className={
                      tool.status === 'Active' 
                        ? 'border-green-500/50 text-green-400'
                        : tool.status === 'Beta'
                        ? 'border-blue-500/50 text-blue-400'
                        : 'border-purple-500/50 text-purple-400'
                    }
                  >
                    {tool.status}
                  </Badge>
                </div>
                <CardTitle className="theme-text-primary text-lg mb-2">{tool.title}</CardTitle>
                <p className="theme-text-secondary text-sm">{tool.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium theme-text-primary mb-2">Key Features</h4>
                    <ul className="space-y-1">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="text-sm theme-text-secondary flex items-center">
                          <div className="w-1 h-1 bg-crd-green rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link to={tool.route}>
                    <Button 
                      className="w-full bg-crd-green hover:bg-crd-green/90 text-black font-medium group-hover:bg-crd-green/80"
                    >
                      Launch Tool
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Start Guide */}
        <Card className="theme-bg-secondary theme-border mb-8">
          <CardHeader>
            <CardTitle className="theme-text-primary flex items-center gap-2">
              <Upload className="w-5 h-5 text-crd-green" />
              Quick Start Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-crd-green/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-crd-green font-bold">1</span>
                </div>
                <h3 className="theme-text-primary font-medium mb-2">Upload PSD</h3>
                <p className="theme-text-secondary text-sm">Choose your PSD file and let our tools analyze its structure</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-crd-green/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-crd-green font-bold">2</span>
                </div>
                <h3 className="theme-text-primary font-medium mb-2">Analyze Layers</h3>
                <p className="theme-text-secondary text-sm">Explore extracted layers with visual previews and metadata</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-crd-green/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-crd-green font-bold">3</span>
                </div>
                <h3 className="theme-text-primary font-medium mb-2">Build Frames</h3>
                <p className="theme-text-secondary text-sm">Transform layers into stunning CRD frames for your cards</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center">
          <Link to="/">
            <Button variant="outline" className="theme-border theme-text-primary hover:theme-bg-accent">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LabsPage;

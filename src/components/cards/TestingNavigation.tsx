
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TestTube, Archive } from 'lucide-react';

export const TestingNavigation = () => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Card Creator Testing
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Compare the original and enhanced card creation experiences side by side.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <Card className="relative overflow-hidden bg-editor-dark border-editor-border hover:border-crd-green/50 transition-all duration-300 group">
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex-shrink-0">
                  <TestTube className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-white">
                      Enhanced Card Creator
                    </h3>
                    <span className="px-2 py-1 text-xs font-bold bg-crd-green text-black rounded-full">
                      NEW
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    New enhanced layout with professional frame browser, large preview area, and improved user experience. Direct component bypass.
                  </p>
                  
                  <div className="relative z-20">
                    <Link to="/cards/enhanced">
                      <Button className="w-full bg-crd-green text-black hover:bg-crd-green/90 group-hover:translate-x-1 transition-transform">
                        Test Enhanced Version
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none z-0" />
          </Card>

          <Card className="relative overflow-hidden bg-editor-dark border-editor-border hover:border-blue-500/50 transition-all duration-300 group">
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 flex-shrink-0">
                  <Archive className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-white">
                      Original Card Hub
                    </h3>
                    <span className="px-2 py-1 text-xs font-bold bg-blue-500 text-white rounded-full">
                      BACKUP
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    The original working SimplifiedCardCreationHub for comparison and fallback purposes. Known to work correctly.
                  </p>
                  
                  <div className="relative z-20">
                    <Link to="/cards/enhanced">
                      <Button className="w-full bg-blue-500 text-white hover:bg-blue-600 group-hover:translate-x-1 transition-transform">
                        Test Original Version
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none z-0" />
          </Card>
        </div>

        <div className="text-center mt-12 space-y-4">
          <p className="text-gray-400 text-sm">
            For comparison, you can also test the existing routes:
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/cards">
              <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-800">
                /cards (Hub)
              </Button>
            </Link>
            <Link to="/cards/enhanced">
              <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-800">
                /cards/enhanced (Studio)
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

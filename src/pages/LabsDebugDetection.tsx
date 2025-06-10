
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Beaker } from 'lucide-react';
import { CardDetectionTester } from '@/components/debug/CardDetectionTester';

const LabsDebugDetection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-darker to-crd-darkest">
      {/* Lab Header */}
      <div className="bg-editor-dark/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-crd-lightGray hover:text-white"
              >
                <Link to="/labs">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Labs
                </Link>
              </Button>
              <div className="h-6 w-px bg-crd-mediumGray" />
              <div className="flex items-center gap-2">
                <Beaker className="w-5 h-5 text-crd-green" />
                <h1 className="text-xl font-bold text-white">Detection Debug Lab</h1>
                <span className="px-2 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded text-xs font-medium">
                  Experimental
                </span>
              </div>
            </div>
          </div>
          <p className="text-crd-lightGray text-sm mt-2 max-w-2xl">
            Advanced debugging tools for testing and analyzing card detection algorithms.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <CardDetectionTester />
      </div>
    </div>
  );
};

export default LabsDebugDetection;

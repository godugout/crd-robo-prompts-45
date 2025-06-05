
import React, { useEffect } from 'react';
import { CardDetectionTester } from '@/components/debug/CardDetectionTester';
import { Interactive3DCardDemo } from '@/components/viewer/Interactive3DCardDemo';
import { EffectCardViewer } from '@/components/viewer/EffectCardViewer';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { PageHeader } from '@/components/shared/PageHeader';
import { CRDCard } from '@/components/ui/design-system/Card';
import { Typography } from '@/components/ui/design-system/Typography';

const Labs = () => {
  useEffect(() => {
    console.log('🔧 Labs page mounted');
  }, []);

  return (
    <div className="crd-container bg-crd-darkest min-h-screen">
      <PageHeader 
        title="Labs" 
        subtitle="Experimental features and interactive tools for testing and development."
      />
      
      <div className="space-y-8">
        <section className="crd-section">
          <Typography variant="h2" className="mb-6">Card Effect System</Typography>
          <Typography variant="caption" className="mb-6 block">
            Experiment with advanced card effects, materials, and lighting combinations to create stunning card finishes.
          </Typography>
          <CRDCard variant="elevated" padding="none">
            <ErrorBoundary componentName="EffectCardViewer">
              <EffectCardViewer />
            </ErrorBoundary>
          </CRDCard>
        </section>

        <section className="crd-section">
          <Typography variant="h2" className="mb-6">Interactive 3D Experience</Typography>
          <Typography variant="caption" className="mb-6 block">
            Test different 3D interaction modes including tilt, orbital, physics, and magnetic effects.
          </Typography>
          <CRDCard variant="elevated" padding="lg">
            <ErrorBoundary componentName="Interactive3DCardDemo">
              <Interactive3DCardDemo />
            </ErrorBoundary>
          </CRDCard>
        </section>

        <section className="crd-section">
          <Typography variant="h2" className="mb-6">Card Detection Testing</Typography>
          <Typography variant="caption" className="mb-6 block">
            Upload images to test our enhanced rectangle detection algorithm for card identification.
          </Typography>
          <CRDCard variant="elevated" padding="none">
            <ErrorBoundary componentName="CardDetectionTester">
              <CardDetectionTester />
            </ErrorBoundary>
          </CRDCard>
        </section>
      </div>
    </div>
  );
};

export default Labs;

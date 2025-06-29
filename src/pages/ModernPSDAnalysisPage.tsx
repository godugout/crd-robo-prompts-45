
import React from 'react';
import { ModernPSDAnalyzer } from '@/components/debug/modern/ModernPSDAnalyzer';
import { PSDErrorBoundary } from '@/components/debug/components/PSDErrorBoundary';

const ModernPSDAnalysisPage: React.FC = () => {
  return (
    <div className="h-[calc(100vh-64px)]">
      <PSDErrorBoundary>
        <ModernPSDAnalyzer />
      </PSDErrorBoundary>
    </div>
  );
};

export default ModernPSDAnalysisPage;

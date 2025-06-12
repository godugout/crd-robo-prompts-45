
import React from 'react';
import { FeatureFlagsAdmin } from '@/components/admin/FeatureFlagsAdmin';

const LabsFeatureFlags = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Feature Flags</h1>
          <p className="text-muted-foreground">
            Manage experimental features and toggles for the application.
          </p>
        </div>
        
        <div className="grid gap-6">
          <FeatureFlagsAdmin />
        </div>
      </div>
    </div>
  );
};

export default LabsFeatureFlags;

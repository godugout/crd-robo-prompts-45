
import React from 'react';
import { Card } from '@/components/ui/card';

const Debug = () => {
  return (
    <div className="space-y-6 p-6 bg-gray-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Debug</h1>
        <p className="text-gray-400">Debug tools and system information.</p>
      </div>
      
      <Card className="p-6 bg-gray-900 border-gray-700">
        <h2 className="text-white text-xl font-bold mb-4">Debug Information</h2>
        <p className="text-gray-400">
          Debug tools and system diagnostics will be available here.
        </p>
      </Card>
    </div>
  );
};

export default Debug;

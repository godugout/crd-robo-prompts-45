
import React from 'react';
import { CardDetectionTester } from '@/components/debug/CardDetectionTester';

const Labs = () => {
  return (
    <div className="space-y-6 p-6 bg-gray-950 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Labs</h1>
        <p className="text-gray-400">Experimental features and interactive tools for testing and development.</p>
      </div>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Interactive Options</h2>
          <CardDetectionTester />
        </section>
      </div>
    </div>
  );
};

export default Labs;

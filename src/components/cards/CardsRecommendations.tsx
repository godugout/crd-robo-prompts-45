
import React from "react";

export const CardsRecommendations: React.FC = () => (
  <div className="mt-12 space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-4">Popular Creators</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(4).fill(null).map((_, i) => (
          <div key={i} className="bg-card p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div>
                <p className="font-medium">Creator {i+1}</p>
                <p className="text-sm text-gray-500">100+ cards</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    <section>
      <h2 className="text-2xl font-bold mb-4">Featured Collections</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array(3).fill(null).map((_, i) => (
          <div key={i} className="bg-card p-4 rounded-lg shadow">
            <div className="h-32 bg-gray-200 rounded-md mb-3"></div>
            <h3 className="font-medium">Collection {i+1}</h3>
            <p className="text-sm text-gray-500">20 cards</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

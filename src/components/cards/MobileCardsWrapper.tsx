
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { CardsPage } from './CardsPage';

export const MobileCardsWrapper: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-crd-darkest">
        <div className="mobile-card-workflow">
          <style>{`
            .mobile-card-workflow .max-w-7xl {
              max-width: 100%;
              padding-left: 1rem;
              padding-right: 1rem;
            }
            
            .mobile-card-workflow .grid {
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
              gap: 0.75rem;
            }
            
            .mobile-card-workflow .aspect-[3/4] {
              aspect-ratio: 3/4;
            }
            
            .mobile-card-workflow .text-2xl {
              font-size: 1.5rem;
            }
            
            .mobile-card-workflow .p-8 {
              padding: 1rem;
            }
            
            .mobile-card-workflow .gap-6 {
              gap: 1rem;
            }
          `}</style>
          <CardsPage />
        </div>
      </div>
    );
  }

  return <CardsPage />;
};

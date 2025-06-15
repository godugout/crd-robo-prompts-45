
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCardNavigation } from '@/hooks/useCardNavigation';

interface AutoHideCardNavigationProps {
  cardId: string;
}

export const AutoHideCardNavigation: React.FC<AutoHideCardNavigationProps> = ({
  cardId
}) => {
  const {
    navigationContext,
    isVisible,
    showNavigation,
    hideNavigation,
    navigateToCard,
    canNavigatePrev,
    canNavigateNext
  } = useCardNavigation(cardId);

  // Show navigation on mouse movement or scroll
  useEffect(() => {
    const handleMouseMove = () => showNavigation();
    
    const handleScroll = () => {
      // Show on scroll up, hide on scroll down
      const scrollY = window.scrollY;
      const lastScrollY = parseInt(sessionStorage.getItem('lastScrollY') || '0');
      
      if (scrollY < lastScrollY) {
        showNavigation();
      }
      
      sessionStorage.setItem('lastScrollY', scrollY.toString());
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && canNavigatePrev) {
        navigateToCard('prev');
      } else if (e.key === 'ArrowRight' && canNavigateNext) {
        navigateToCard('next');
      }
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showNavigation, canNavigatePrev, canNavigateNext, navigateToCard]);

  // Don't render if no navigation context
  if (!navigationContext) {
    return null;
  }

  const getSourceLabel = () => {
    switch (navigationContext.source) {
      case 'gallery': return 'Gallery';
      case 'profile': return 'Profile';
      case 'search': return 'Search';
      case 'collection': return 'Collection';
      default: return 'Cards';
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
      onMouseEnter={showNavigation}
      onMouseLeave={hideNavigation}
    >
      {/* Glass morphism background */}
      <div className="mx-auto max-w-md px-4 pb-safe">
        <div className="bg-black/60 backdrop-blur-lg border border-white/20 rounded-t-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Previous button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateToCard('prev')}
              disabled={!canNavigatePrev}
              className="text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Card counter and context */}
            <div className="text-center">
              <div className="text-white font-medium text-sm">
                {navigationContext.currentIndex + 1} / {navigationContext.total}
              </div>
              <div className="text-crd-lightGray text-xs">
                {getSourceLabel()}
              </div>
            </div>

            {/* Next button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateToCard('next')}
              disabled={!canNavigateNext}
              className="text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

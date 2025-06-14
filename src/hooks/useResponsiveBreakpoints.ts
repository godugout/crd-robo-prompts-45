
import { useState, useEffect } from 'react';

type BreakpointKey = 'mobile' | 'tablet' | 'desktop' | 'large' | 'ultrawide';

const breakpoints = {
  mobile: 0,      // < 768px
  tablet: 768,    // 768px - 1024px  
  desktop: 1024,  // 1024px - 1440px
  large: 1440,    // 1440px - 1920px
  ultrawide: 1920 // > 1920px
} as const;

export const useResponsiveBreakpoints = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointKey>('desktop');
  const [windowWidth, setWindowWidth] = useState(0);
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      
      if (width >= breakpoints.ultrawide) {
        setCurrentBreakpoint('ultrawide');
      } else if (width >= breakpoints.large) {
        setCurrentBreakpoint('large');
      } else if (width >= breakpoints.desktop) {
        setCurrentBreakpoint('desktop');
      } else if (width >= breakpoints.tablet) {
        setCurrentBreakpoint('tablet');
      } else {
        setCurrentBreakpoint('mobile');
      }
    };
    
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);
  
  return {
    currentBreakpoint,
    windowWidth,
    isMobile: currentBreakpoint === 'mobile',
    isTablet: currentBreakpoint === 'tablet',
    isDesktop: ['desktop', 'large', 'ultrawide'].includes(currentBreakpoint),
    isLargeDesktop: ['large', 'ultrawide'].includes(currentBreakpoint),
    isUltrawide: currentBreakpoint === 'ultrawide',
    
    // Responsive padding classes
    responsivePadding: {
      mobile: 'px-4',
      tablet: 'px-6 md:px-8',
      desktop: 'px-8 lg:px-12',
      large: 'px-12 xl:px-16',
      ultrawide: 'px-16 2xl:px-24'
    }[currentBreakpoint]
  };
};

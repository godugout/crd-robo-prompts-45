
import React, { createContext, useContext, useState, useEffect } from 'react';

type NavigationStyle = 'horizontal' | 'sidebar';

interface NavigationContextType {
  navigationStyle: NavigationStyle;
  setNavigationStyle: (style: NavigationStyle) => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigationStyle, setNavigationStyle] = useState<NavigationStyle>('horizontal');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only access localStorage after component mount
    const savedStyle = localStorage.getItem('navigation-style');
    const savedExpanded = localStorage.getItem('sidebar-expanded');
    
    if (savedStyle && (savedStyle === 'horizontal' || savedStyle === 'sidebar')) {
      setNavigationStyle(savedStyle as NavigationStyle);
    }
    
    if (savedExpanded) {
      try {
        setSidebarExpanded(JSON.parse(savedExpanded));
      } catch (e) {
        // fallback to default
        setSidebarExpanded(true);
      }
    }
    
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('navigation-style', navigationStyle);
    }
  }, [navigationStyle, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('sidebar-expanded', JSON.stringify(sidebarExpanded));
    }
  }, [sidebarExpanded, isInitialized]);

  return (
    <NavigationContext.Provider value={{
      navigationStyle,
      setNavigationStyle,
      sidebarExpanded,
      setSidebarExpanded
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

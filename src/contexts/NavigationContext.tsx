
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
  const [navigationStyle, setNavigationStyle] = useState<NavigationStyle>(() => {
    const saved = localStorage.getItem('navigation-style');
    return (saved as NavigationStyle) || 'horizontal';
  });
  
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebar-expanded');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('navigation-style', navigationStyle);
  }, [navigationStyle]);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

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

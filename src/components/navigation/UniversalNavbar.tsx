
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { 
  Home, 
  Plus, 
  Grid, 
  Users, 
  User,
  Beaker,
  LogIn,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Create', href: '/create', icon: Plus, requireAuth: true },
  { name: 'Collections', href: '/collections', icon: Grid },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Dashboard', href: '/creator-dashboard', icon: User, requireAuth: true },
  { name: 'Labs', href: '/labs', icon: Beaker, requireAuth: true },
];

export const UniversalNavbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className={cn(
      "sticky top-0 z-50 border-b transition-colors duration-300",
      "theme-bg-secondary theme-border backdrop-blur-md"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-crd-green rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-lg theme-text-primary">
                CardShow
              </span>
            </Link>
            
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                if (item.requireAuth && !user) return null;
                
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link key={item.name} to={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex items-center space-x-2 h-10 px-3 transition-colors",
                        isActive 
                          ? "theme-bg-accent text-crd-green" 
                          : "theme-text-secondary hover:theme-text-primary hover:theme-bg-accent"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.name}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            
            {user ? (
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="flex items-center space-x-2 theme-text-secondary hover:theme-text-primary"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            ) : (
              <Link to="/auth/signin">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 theme-text-secondary hover:theme-text-primary"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

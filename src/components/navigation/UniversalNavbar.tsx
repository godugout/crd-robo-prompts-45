
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, Plus, Palette, Users, Trophy, 
  Camera, Layers, Sparkles, Settings, User, Beaker 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { href: '/', label: 'Home', icon: Home, public: true },
  { href: '/create/enhanced', label: 'Create', icon: Plus, protected: true },
  { href: '/studio', label: 'Studio', icon: Palette, protected: true },
  { href: '/collections', label: 'Collections', icon: Camera, public: true },
  { href: '/community', label: 'Community', icon: Users, public: true },
  { href: '/creator-dashboard', label: 'Dashboard', icon: Trophy, protected: true },
  { href: '/labs', label: 'Labs', icon: Beaker, protected: true }
];

export const UniversalNavbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const visibleItems = navigationItems.filter(item => 
    item.public || (item.protected && user)
  );

  return (
    <nav className="bg-nav-dark border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-crd-green rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-nav-dark" />
            </div>
            <span className="text-xl font-bold text-nav-text">CardShow</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.href);
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-crd-green/20 text-crd-green" 
                      : "text-nav-secondary hover:text-nav-text hover:bg-white/10"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-nav-secondary">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.email?.split('@')[0]}</span>
                </div>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-nav-text hover:bg-white/10 bg-transparent"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth/signin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-nav-text hover:bg-white/10 bg-transparent"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/signup">
                  <Button
                    size="sm"
                    className="bg-crd-green hover:bg-crd-green-hover text-nav-dark font-semibold"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-nav-secondary hover:text-nav-text"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-white/10 py-3">
          <div className="flex flex-wrap gap-2">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.href);
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-crd-green/20 text-crd-green" 
                      : "text-nav-secondary hover:text-nav-text hover:bg-white/10"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Gallery, 
  Plus, 
  Sparkles, 
  User, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/home/navbar/Logo';
import { ProfileDropdown } from '@/components/home/navbar/ProfileDropdown';

const navigationItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/gallery', label: 'Gallery', icon: Gallery },
  { href: '/create', label: 'Create', icon: Plus },
  { href: '/cards/enhanced', label: 'Enhanced Studio', icon: Sparkles },
  { href: '/profile', label: 'Profile', icon: User },
];

export const AppSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { sidebarExpanded, setSidebarExpanded, setNavigationStyle } = useNavigation();

  return (
    <div className={cn(
      "h-screen bg-crd-darkest border-r border-crd-mediumGray/20 flex flex-col transition-all duration-300",
      sidebarExpanded ? "w-64" : "w-16"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-crd-mediumGray/20">
        <div className="flex items-center justify-between">
          {sidebarExpanded && (
            <div className="flex-1">
              <Logo onLogoChange={() => {}} />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNavigationStyle('horizontal')}
              className="text-crd-lightGray hover:text-white p-2"
              title="Switch to horizontal navigation"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="text-crd-lightGray hover:text-white p-2"
            >
              {sidebarExpanded ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  "hover:bg-crd-mediumGray/20 hover:text-white",
                  isActive 
                    ? "bg-crd-green text-black font-medium" 
                    : "text-crd-lightGray",
                  !sidebarExpanded && "justify-center"
                )}
                title={!sidebarExpanded ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarExpanded && (
                  <span className="text-sm">{item.label}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-crd-mediumGray/20">
        {user ? (
          <div className={cn(
            "flex items-center gap-3",
            !sidebarExpanded && "justify-center"
          )}>
            <ProfileDropdown />
            {sidebarExpanded && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {user.user_metadata?.full_name || user.email}
                </div>
                <div className="text-xs text-crd-lightGray truncate">
                  {user.email}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/auth/signin"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg bg-crd-green text-black font-medium hover:bg-crd-green/90 transition-colors",
              !sidebarExpanded && "justify-center"
            )}
          >
            <User className="w-5 h-5" />
            {sidebarExpanded && <span className="text-sm">Sign In</span>}
          </Link>
        )}
      </div>
    </div>
  );
};

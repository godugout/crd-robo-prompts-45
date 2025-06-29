
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CardshowLogo } from '@/assets/brand/CardshowLogo';
import { 
  Home, Beaker, Layers, Eye, FileImage, Grid3X3, Sparkles,
  ChevronDown, Menu, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const labsNavItems = [
  { href: '/labs', label: 'Labs Hub', icon: Beaker },
  { href: '/labs/psd-tools', label: 'PSD Tools', icon: Layers },
  { href: '/labs/psd-tools/modern-analysis', label: 'Modern Analysis', icon: Sparkles },
  { href: '/labs/psd-tools/advanced-preview', label: 'Advanced Preview', icon: Eye },
  { href: '/labs/psd-tools/simple-analysis', label: 'Simple Analysis', icon: FileImage },
  { href: '/labs/psd-tools/bulk-analysis', label: 'Bulk Analysis', icon: Grid3X3 },
];

export const LabsNavbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActivePath = (path: string) => {
    if (path === '/labs') {
      return location.pathname === '/labs';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-[#0A0A0B] border-b border-[#252526] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Links to Home */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <CardshowLogo size="lg" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {labsNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.href);
              const isNew = item.href.includes('modern-analysis');
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative",
                    isActive 
                      ? isNew 
                        ? "bg-emerald-500 text-black" 
                        : "bg-[#F97316] text-black"
                      : "text-[#9CA3AF] hover:text-white hover:bg-[#252526]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isNew && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#9CA3AF] hover:text-white hover:bg-[#252526]"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#252526] py-3">
            <div className="flex flex-col gap-1">
              {labsNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.href);
                const isNew = item.href.includes('modern-analysis');
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative",
                      isActive 
                        ? isNew 
                          ? "bg-emerald-500 text-black" 
                          : "bg-[#F97316] text-black"
                        : "text-[#9CA3AF] hover:text-white hover:bg-[#252526]"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                    {isNew && (
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

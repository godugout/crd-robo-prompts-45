import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { RouteErrorBoundary } from '@/components/layout/RouteErrorBoundary';
import { MobileOptimizedLayout } from '@/components/layout/MobileOptimizedLayout';
import { CardCreationFlow } from '@/components/editor/CardCreationFlow';
import { EnhancedCardCreator } from '@/components/cards/EnhancedCardCreator';
import CardsPage from '@/pages/CardsPage';
import Marketplace from '@/pages/Marketplace';
import CreatorHub from '@/pages/CreatorHub';
import CommunityPage from '@/pages/CommunityPage';
import AdvancedCreatorStudio from '@/pages/AdvancedCreatorStudio';
import { TemplateMarketplace } from '@/components/marketplace/TemplateMarketplace';
import EnhancedStudio from '@/pages/EnhancedStudio';
import { AuthPage } from '@/components/auth/AuthPage';
import { Toaster } from 'sonner';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import './App.css';

// Optimized query client with caching strategies
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/cards" replace />
      },
      {
        path: "cards",
        element: <CardCreationFlow />
      },
      {
        path: "cards/create",
        element: <CardCreationFlow />
      },
      {
        path: "cards/enhanced",
        element: <EnhancedCardCreator />
      },
      {
        path: "cards/gallery",
        element: <CardsPage />
      },
      {
        path: "marketplace",
        element: <Marketplace />
      },
      {
        path: "creator",
        element: <CreatorHub />
      },
      {
        path: "creator/advanced",
        element: <AdvancedCreatorStudio />
      },
      {
        path: "community",
        element: <CommunityPage />
      },
      {
        path: "templates",
        element: (
          <div className="min-h-screen bg-crd-darkest p-6">
            <TemplateMarketplace />
          </div>
        )
      },
      {
        path: "enhanced-studio",
        element: <EnhancedStudio />
      },
      {
        path: "auth",
        element: <AuthPage />
      },
      {
        path: "profile",
        element: <div>Profile page placeholder</div>
      }
    ]
  }
]);

function App() {
  const { measureApiCall } = usePerformanceMonitoring();

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Preload critical resources
    const criticalImages = [
      '/lovable-uploads/7697ffa5-ac9b-428b-9bc0-35500bcb2286.png',
      '/lovable-uploads/b3f6335f-9e0a-4a64-a665-15d04f456d50.png'
    ];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Performance monitoring setup
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Fallback for older browsers
        console.warn('Performance Observer not fully supported');
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MobileOptimizedLayout>
          <RouterProvider router={router} />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a1a',
                color: '#ffffff',
                border: '1px solid #333'
              }
            }}
          />
        </MobileOptimizedLayout>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

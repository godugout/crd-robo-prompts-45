
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { RouteErrorBoundary } from '@/components/layout/RouteErrorBoundary';
import { CardCreationFlow } from '@/components/editor/CardCreationFlow';
import { EnhancedCardCreator } from '@/components/cards/EnhancedCardCreator';
import CardsPage from '@/pages/CardsPage';
import Marketplace from '@/pages/Marketplace';
import CreatorHub from '@/pages/CreatorHub';
import { TemplateMarketplace } from '@/components/marketplace/TemplateMarketplace';
import EnhancedStudio from '@/pages/EnhancedStudio';
import { AuthPage } from '@/components/auth/AuthPage';
import { Toaster } from 'sonner';
import './App.css';

const queryClient = new QueryClient();

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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

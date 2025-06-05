
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/design-system';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description,
}) => {
  return (
    <div className="min-h-screen bg-crd-darkest flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Typography variant="h1" className="text-crd-white mb-2">
            Cardshow
          </Typography>
          <Typography variant="body" className="text-crd-lightGray">
            Welcome to the ultimate card collection platform
          </Typography>
        </div>
        
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardHeader className="text-center">
            <CardTitle className="text-crd-white">{title}</CardTitle>
            <CardDescription className="text-crd-lightGray">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

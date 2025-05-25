
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/design-system';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  step?: number;
  totalSteps?: number;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  title,
  description,
  step,
  totalSteps,
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
          {step && totalSteps && (
            <div className="mt-4">
              <Typography variant="caption" className="text-crd-lightGray">
                Step {step} of {totalSteps}
              </Typography>
              <div className="w-full bg-crd-mediumGray rounded-full h-2 mt-2">
                <div 
                  className="bg-crd-blue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}
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

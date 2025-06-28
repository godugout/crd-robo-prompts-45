
import React from 'react';
import { EnhancedCardCreator } from '@/components/creation/EnhancedCardCreator';
import { MainLayout } from '@/components/layout/MainLayout';

const EnhancedCardCreationPage: React.FC = () => {
  return (
    <MainLayout showNavbar={false}>
      <EnhancedCardCreator />
    </MainLayout>
  );
};

export default EnhancedCardCreationPage;

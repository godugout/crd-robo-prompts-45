
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PSDPreviewInterface } from '@/components/debug/PSDPreviewInterface';

const PSDPreviewPage: React.FC = () => {
  return (
    <MainLayout showNavbar={false}>
      <PSDPreviewInterface />
    </MainLayout>
  );
};

export default PSDPreviewPage;

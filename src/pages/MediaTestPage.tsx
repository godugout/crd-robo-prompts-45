
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MediaGallery } from '@/components/media/MediaGallery';

const MediaTestPage: React.FC = () => {
  return (
    <MainLayout showNavbar={true}>
      <div className="min-h-screen bg-[#0a0a0b]">
        <MediaGallery />
      </div>
    </MainLayout>
  );
};

export default MediaTestPage;

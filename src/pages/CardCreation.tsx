
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardCreationForm } from '@/components/card-creation/CardCreationForm';
import { UserCardsGallery } from '@/components/card-creation/UserCardsGallery';
import { Plus, Gallery } from 'lucide-react';

export const CardCreation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Card Studio</h1>
          <p className="text-xl text-gray-600">Create and manage your digital cards</p>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Card
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Gallery className="w-4 h-4" />
              My Cards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <CardCreationForm />
          </TabsContent>

          <TabsContent value="gallery">
            <UserCardsGallery />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CardCreation;

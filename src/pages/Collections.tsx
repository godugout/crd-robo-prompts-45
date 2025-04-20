
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader, Image } from 'lucide-react';

const Collections = () => {
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Collections</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="h-64">
          <CardHeader>
            <CardTitle>Create New Collection</CardTitle>
            <CardDescription>
              Group your cards into themed collections
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center pt-4">
            <Button>Create Collection</Button>
          </CardContent>
        </Card>
        
        <Card className="h-64 flex items-center justify-center">
          <div className="text-center p-6">
            <Image className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No collections yet</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Collections;

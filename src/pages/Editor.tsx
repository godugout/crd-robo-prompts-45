
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MediaUploader } from '@/components/media/MediaUploader';
import { MediaGallery } from '@/components/media/MediaGallery';
import { useUser } from '@/hooks/use-user';
import { Loader } from 'lucide-react';

const Editor = () => {
  const { user, loading } = useUser();
  const [activeTab, setActiveTab] = useState('create');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<any[]>([]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
        <Loader className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Card Editor</CardTitle>
            <CardDescription>Please sign in to create cards</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You need to be logged in to create and edit cards.</p>
          </CardContent>
          <CardFooter>
            <Button>Sign In</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Card Editor</CardTitle>
          <CardDescription>Create and customize your cards</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="create">Create New</TabsTrigger>
              <TabsTrigger value="templates">Use Template</TabsTrigger>
              <TabsTrigger value="drafts">My Drafts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Card Title</label>
                  <Input 
                    id="title" 
                    placeholder="Enter a title for your card" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your card" 
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Card Media</label>
                  <MediaUploader />
                </div>
                
                {selectedMedia.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Selected Media</label>
                    <MediaGallery media={selectedMedia} />
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline">Save Draft</Button>
                  <Button>Publish Card</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="templates">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((template) => (
                  <Card key={template} className="cursor-pointer hover:shadow-md transition-shadow">
                    <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">Template {template}</h3>
                      <p className="text-sm text-gray-500">Description of template {template}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="drafts">
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">No drafts found</h3>
                <p className="text-gray-500 mb-6">You haven't saved any drafts yet</p>
                <Button onClick={() => setActiveTab('create')}>Start Creating</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Editor;

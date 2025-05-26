
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCardEditor } from '@/hooks/useCardEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SimpleEditorProps {
  initialData?: any;
}

export const SimpleEditor: React.FC<SimpleEditorProps> = ({ initialData }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { cardData, updateCardField, saveCard, publishCard, isSaving } = useCardEditor(initialData);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleSave = async () => {
    await saveCard();
  };

  const handlePublish = async () => {
    await publishCard();
  };

  return (
    <div className="min-h-screen bg-crd-darkest p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-crd-white">Card Editor</h1>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-crd-blue hover:bg-crd-blue/90"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isSaving}
              className="bg-crd-green hover:bg-crd-green/90"
            >
              Publish
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader>
              <CardTitle className="text-crd-white">Card Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-crd-lightGray mb-2">Title</label>
                <Input
                  value={cardData.title}
                  onChange={(e) => updateCardField('title', e.target.value)}
                  placeholder="Enter card title"
                  className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
                />
              </div>

              <div>
                <label className="block text-crd-lightGray mb-2">Description</label>
                <Textarea
                  value={cardData.description || ''}
                  onChange={(e) => updateCardField('description', e.target.value)}
                  placeholder="Enter card description"
                  className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
                />
              </div>

              <div>
                <label className="block text-crd-lightGray mb-2">Image URL</label>
                <Input
                  value={cardData.image_url || ''}
                  onChange={(e) => updateCardField('image_url', e.target.value)}
                  placeholder="Enter image URL"
                  className="bg-crd-mediumGray border-crd-lightGray text-crd-white"
                />
              </div>

              <div>
                <label className="block text-crd-lightGray mb-2">Rarity</label>
                <Select value={cardData.rarity} onValueChange={(value: any) => updateCardField('rarity', value)}>
                  <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-crd-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="bg-crd-dark border-crd-mediumGray">
            <CardHeader>
              <CardTitle className="text-crd-white">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[3/4] bg-crd-mediumGray rounded-lg flex flex-col">
                {cardData.image_url ? (
                  <img
                    src={cardData.image_url}
                    alt={cardData.title}
                    className="w-full h-2/3 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-2/3 bg-crd-lightGray rounded-t-lg flex items-center justify-center text-crd-darkGray">
                    No Image
                  </div>
                )}
                <div className="p-4 flex-1">
                  <h3 className="text-crd-white font-bold text-lg">{cardData.title || 'Untitled Card'}</h3>
                  <p className="text-crd-lightGray text-sm mt-1">{cardData.description}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      cardData.rarity === 'legendary' ? 'bg-crd-orange text-white' :
                      cardData.rarity === 'rare' ? 'bg-crd-purple text-white' :
                      'bg-crd-lightGray text-crd-darkGray'
                    }`}>
                      {cardData.rarity.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

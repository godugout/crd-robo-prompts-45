
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreatorCommunity } from '@/hooks/community/useCreatorCommunity';
import { MessageSquare, Plus, Pin, Lock, Eye, Clock } from 'lucide-react';

interface CreatorForumsProps {
  searchQuery: string;
}

export const CreatorForums: React.FC<CreatorForumsProps> = ({ searchQuery }) => {
  const { forums, loadingForums, createForumTopic } = useCreatorCommunity();
  const [selectedForum, setSelectedForum] = useState<string>('');
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: '', content: '' });

  const filteredForums = forums.filter(forum =>
    forum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    forum.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTopic = async () => {
    if (!selectedForum || !newTopic.title || !newTopic.content) return;

    try {
      await createForumTopic.mutateAsync({
        forumId: selectedForum,
        title: newTopic.title,
        content: newTopic.content,
      });
      setNewTopic({ title: '', content: '' });
      setShowCreateTopic(false);
    } catch (error) {
      console.error('Failed to create topic:', error);
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loadingForums) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-crd-dark border-crd-mediumGray animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-crd-mediumGray rounded mb-2"></div>
              <div className="h-3 bg-crd-mediumGray rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Creator Forums</h2>
          <p className="text-crd-lightGray">
            Join discussions with fellow creators across different specialties and skill levels
          </p>
        </div>
        
        <Dialog open={showCreateTopic} onOpenChange={setShowCreateTopic}>
          <DialogTrigger asChild>
            <Button className="bg-crd-green hover:bg-green-600 text-black">
              <Plus className="w-4 h-4 mr-2" />
              New Topic
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-crd-dark border-crd-mediumGray text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Topic</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Forum</label>
                <Select value={selectedForum} onValueChange={setSelectedForum}>
                  <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-white">
                    <SelectValue placeholder="Select a forum" />
                  </SelectTrigger>
                  <SelectContent className="bg-crd-mediumGray border-crd-lightGray">
                    {forums.map((forum) => (
                      <SelectItem key={forum.id} value={forum.id} className="text-white">
                        {forum.name} - {forum.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  placeholder="Enter topic title"
                  className="bg-crd-mediumGray border-crd-lightGray text-white"
                  value={newTopic.title}
                  onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <Textarea
                  placeholder="Write your topic content..."
                  className="bg-crd-mediumGray border-crd-lightGray text-white min-h-32"
                  value={newTopic.content}
                  onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateTopic}
                  disabled={createForumTopic.isPending || !selectedForum || !newTopic.title || !newTopic.content}
                  className="bg-crd-green hover:bg-green-600 text-black"
                >
                  {createForumTopic.isPending ? 'Creating...' : 'Create Topic'}
                </Button>
                <Button variant="outline" onClick={() => setShowCreateTopic(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Forums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredForums.map((forum) => (
          <Card key={forum.id} className="bg-crd-dark border-crd-mediumGray hover:border-crd-green transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">{forum.name}</CardTitle>
                <Badge className={`${getSkillLevelColor(forum.skill_level)} text-white`}>
                  {forum.skill_level}
                </Badge>
              </div>
              <p className="text-crd-lightGray text-sm">
                {forum.description || `Discussion forum for ${forum.specialty} creators`}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-crd-lightGray">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>Topics</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>Active</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedForum(forum.id)}
                >
                  Enter Forum
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredForums.length === 0 && (
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-crd-lightGray mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">No forums found</h3>
            <p className="text-crd-lightGray">
              {searchQuery
                ? `No forums match "${searchQuery}"`
                : 'No forums available at the moment'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

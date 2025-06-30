
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreatorCommunity } from '@/hooks/community/useCreatorCommunity';
import { GitBranch, Plus, Users, Calendar, DollarSign, Target } from 'lucide-react';

interface CreatorCollaborationProps {
  searchQuery: string;
}

export const CreatorCollaboration: React.FC<CreatorCollaborationProps> = ({ searchQuery }) => {
  const { myCollaborations, loadingCollaborations, createCollaboration } = useCreatorCommunity();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollaboration, setNewCollaboration] = useState({
    projectType: '',
    collaborators: [] as string[],
    ownershipSplit: {} as Record<string, number>,
  });

  const filteredCollaborations = myCollaborations.filter(collab =>
    collab.project_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'template': return Target;
      case 'card_series': return GitBranch;
      case 'collection': return Users;
      case 'tutorial': return Target;
      default: return GitBranch;
    }
  };

  const handleCreateCollaboration = async () => {
    if (!newCollaboration.projectType || newCollaboration.collaborators.length === 0) return;

    try {
      await createCollaboration.mutateAsync({
        projectId: 'temp-project-id', // This would be selected from existing projects
        collaborators: newCollaboration.collaborators,
        ownershipSplit: newCollaboration.ownershipSplit,
        projectType: newCollaboration.projectType as any,
      });
      setShowCreateModal(false);
      setNewCollaboration({
        projectType: '',
        collaborators: [],
        ownershipSplit: {},
      });
    } catch (error) {
      console.error('Failed to create collaboration:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Creator Collaboration</h2>
          <p className="text-crd-lightGray">
            Work together with other creators on joint projects and share revenues
          </p>
        </div>
        
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-crd-green hover:bg-green-600 text-black">
              <Plus className="w-4 h-4 mr-2" />
              New Collaboration
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-crd-dark border-crd-mediumGray text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Collaboration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Type</label>
                <Select 
                  value={newCollaboration.projectType} 
                  onValueChange={(value) => setNewCollaboration({ ...newCollaboration, projectType: value })}
                >
                  <SelectTrigger className="bg-crd-mediumGray border-crd-lightGray text-white">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent className="bg-crd-mediumGray border-crd-lightGray">
                    <SelectItem value="template" className="text-white">Template</SelectItem>
                    <SelectItem value="card_series" className="text-white">Card Series</SelectItem>
                    <SelectItem value="collection" className="text-white">Collection</SelectItem>
                    <SelectItem value="tutorial" className="text-white">Tutorial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Collaborator Email</label>
                <Input
                  placeholder="Enter collaborator email"
                  className="bg-crd-mediumGray border-crd-lightGray text-white"
                />
                <Button size="sm" className="mt-2" variant="outline">
                  Add Collaborator
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateCollaboration}
                  disabled={createCollaboration.isPending}
                  className="bg-crd-green hover:bg-green-600 text-black"
                >
                  {createCollaboration.isPending ? 'Creating...' : 'Create Collaboration'}
                </Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Collaboration Projects */}
      <div className="space-y-4">
        {filteredCollaborations.map((collaboration) => {
          const Icon = getProjectTypeIcon(collaboration.project_type);
          
          return (
            <Card key={collaboration.id} className="bg-crd-dark border-crd-mediumGray hover:border-crd-green transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-crd-mediumGray rounded-lg">
                      <Icon className="w-6 h-6 text-crd-green" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg mb-1">
                        {collaboration.project_type.replace('_', ' ').toUpperCase()} Project
                      </CardTitle>
                      <p className="text-crd-lightGray text-sm">
                        {collaboration.collaborators.length} collaborators
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(collaboration.status)} text-white`}>
                    {collaboration.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Project Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-white mb-1">
                      <Users className="w-4 h-4" />
                      <span className="font-semibold">{collaboration.collaborators.length}</span>
                    </div>
                    <div className="text-xs text-crd-lightGray">Collaborators</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-white mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="font-semibold">
                        {collaboration.deadline ? new Date(collaboration.deadline).toLocaleDateString() : 'No deadline'}
                      </span>
                    </div>
                    <div className="text-xs text-crd-lightGray">Deadline</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-crd-green mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">Shared</span>
                    </div>
                    <div className="text-xs text-crd-lightGray">Revenue</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" className="bg-crd-green hover:bg-green-600 text-black">
                    Open Project
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCollaborations.length === 0 && (
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="text-center py-12">
            <GitBranch className="w-12 h-12 text-crd-lightGray mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">No collaborations found</h3>
            <p className="text-crd-lightGray mb-4">
              Start collaborating with other creators to create amazing projects together
            </p>
            <Button 
              className="bg-crd-green hover:bg-green-600 text-black"
              onClick={() => setShowCreateModal(true)}
            >
              Create Your First Collaboration
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

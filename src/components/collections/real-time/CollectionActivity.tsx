
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Minus, 
  Share2, 
  Edit, 
  Settings,
  Heart,
  MessageCircle,
  User
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { CollectionActivity as CollectionActivityType } from '@/types/collections';

interface CollectionActivityProps {
  collectionId: string;
  activities: CollectionActivityType[];
}

export const CollectionActivity: React.FC<CollectionActivityProps> = ({
  collectionId,
  activities
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'card_added':
        return <Plus className="w-4 h-4 text-green-400" />;
      case 'card_removed':
        return <Minus className="w-4 h-4 text-red-400" />;
      case 'shared':
        return <Share2 className="w-4 h-4 text-blue-400" />;
      case 'updated':
        return <Edit className="w-4 h-4 text-yellow-400" />;
      case 'created':
        return <Plus className="w-4 h-4 text-crd-green" />;
      case 'renamed':
        return <Edit className="w-4 h-4 text-blue-400" />;
      default:
        return <Settings className="w-4 h-4 text-crd-lightGray" />;
    }
  };

  const getActivityMessage = (activity: CollectionActivityType) => {
    const data = activity.activity_data;
    
    switch (activity.activity_type) {
      case 'card_added':
        return `added ${data.quantity || 1} card${(data.quantity || 1) > 1 ? 's' : ''} to the collection`;
      case 'card_removed':
        return 'removed a card from the collection';
      case 'shared':
        return `shared the collection with ${data.shared_with || 'others'}`;
      case 'updated':
        return `updated the collection ${data.field ? `(${data.field})` : ''}`;
      case 'created':
        return 'created the collection';
      case 'renamed':
        return `renamed the collection ${data.from ? `from "${data.from}"` : ''}`;
      default:
        return 'performed an action on the collection';
    }
  };

  if (activities.length === 0) {
    return (
      <Card className="bg-editor-dark border-crd-mediumGray/20">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-crd-mediumGray/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-crd-lightGray" />
          </div>
          <h3 className="text-lg font-semibold text-crd-white mb-2">No Activity Yet</h3>
          <p className="text-crd-lightGray">
            Collection activity will appear here as changes are made.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="bg-editor-dark border-crd-mediumGray/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Activity Icon */}
              <div className="flex-shrink-0 w-8 h-8 bg-crd-mediumGray/20 rounded-full flex items-center justify-center">
                {getActivityIcon(activity.activity_type)}
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-crd-white">
                    {activity.user?.username || 'Unknown User'}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {activity.activity_type.replace('_', ' ')}
                  </Badge>
                </div>

                <p className="text-crd-lightGray text-sm mb-2">
                  {getActivityMessage(activity)}
                </p>

                <div className="flex items-center gap-4 text-xs text-crd-lightGray">
                  <span>
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </span>
                  
                  {/* Additional activity data */}
                  {activity.activity_data.card_name && (
                    <span className="text-crd-green">
                      {activity.activity_data.card_name}
                    </span>
                  )}
                </div>
              </div>

              {/* User Avatar */}
              <div className="flex-shrink-0">
                {activity.user?.avatar_url ? (
                  <img 
                    src={activity.user.avatar_url} 
                    alt={activity.user.username}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-crd-mediumGray/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-crd-lightGray" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

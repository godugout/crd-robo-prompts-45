
import React from 'react';
import { useCollectionActivity } from '@/hooks/collections/useCollectionQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/common/LoadingState';
import { Plus, Minus, Share2, Edit, Palette, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CollectionActivityProps {
  collectionId: string;
  limit?: number;
}

const activityIcons = {
  card_added: Plus,
  card_removed: Minus,
  shared: Share2,
  updated: Edit,
  created: Palette,
  renamed: Star
};

const activityColors = {
  card_added: 'text-crd-green',
  card_removed: 'text-red-400',
  shared: 'text-crd-blue',
  updated: 'text-crd-orange',
  created: 'text-purple-400',
  renamed: 'text-yellow-400'
};

export const CollectionActivity: React.FC<CollectionActivityProps> = ({
  collectionId,
  limit = 50
}) => {
  const { data: activities, isLoading } = useCollectionActivity(collectionId, limit);

  if (isLoading) {
    return <LoadingState message="Loading activity..." />;
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="bg-crd-dark border-crd-mediumGray">
        <CardContent className="p-6 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-white mb-2">No activity yet</h3>
          <p className="text-crd-lightGray">
            Collection activities will appear here as you make changes.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getActivityDescription = (activity: any) => {
    switch (activity.activity_type) {
      case 'card_added':
        return `Added ${activity.activity_data?.quantity || 1} card(s)`;
      case 'card_removed':
        return 'Removed a card';
      case 'shared':
        return 'Shared the collection';
      case 'updated':
        return 'Updated collection details';
      case 'created':
        return 'Created the collection';
      case 'renamed':
        return 'Renamed the collection';
      default:
        return 'Unknown activity';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activityIcons[activity.activity_type as keyof typeof activityIcons] || Edit;
        const iconColor = activityColors[activity.activity_type as keyof typeof activityColors] || 'text-crd-lightGray';
        
        return (
          <Card key={activity.id} className="bg-crd-dark border-crd-mediumGray">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg bg-crd-mediumGray/20`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white font-medium">
                      {activity.user?.username || 'Unknown User'}
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-crd-mediumGray text-crd-lightGray"
                    >
                      {activity.activity_type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-crd-lightGray mb-2">
                    {getActivityDescription(activity)}
                  </p>
                  
                  <p className="text-xs text-crd-lightGray">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>

                  {/* Additional activity data */}
                  {activity.activity_data && Object.keys(activity.activity_data).length > 0 && (
                    <div className="mt-2 p-2 bg-crd-mediumGray/10 rounded text-xs text-crd-lightGray">
                      {activity.activity_data.card_id && (
                        <p>Card ID: {activity.activity_data.card_id}</p>
                      )}
                      {activity.activity_data.quantity && (
                        <p>Quantity: {activity.activity_data.quantity}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

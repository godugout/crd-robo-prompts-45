
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { CollectionComment } from '@/types/collections';

interface CollectionCommentsViewProps {
  collectionId: string;
  comments: CollectionComment[];
  canComment: boolean;
}

export const CollectionCommentsView: React.FC<CollectionCommentsViewProps> = ({
  collectionId,
  comments,
  canComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // TODO: Implement comment submission mutation
      console.log('Submitting comment:', newComment);
      setNewComment('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {canComment && (
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-4">
            <div className="space-y-4">
              <Textarea
                placeholder="Share your thoughts about this collection..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="bg-crd-mediumGray border-crd-mediumGray text-white placeholder:text-crd-lightGray"
                rows={3}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                  className="bg-crd-green text-black hover:bg-crd-green/80"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      {comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="bg-crd-dark border-crd-mediumGray">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-crd-green rounded-full flex items-center justify-center">
                    <span className="text-black text-sm font-bold">
                      {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white font-medium">
                        {comment.user?.username || 'Unknown User'}
                      </span>
                      <span className="text-xs text-crd-lightGray">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className="text-crd-lightGray leading-relaxed">
                      {comment.content}
                    </p>

                    {/* Comment Actions */}
                    <div className="flex items-center gap-4 mt-3">
                      <Button variant="ghost" size="sm" className="text-crd-lightGray hover:text-white">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-crd-dark border-crd-mediumGray">
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-white mb-2">No comments yet</h3>
            <p className="text-crd-lightGray">
              {canComment ? 'Be the first to share your thoughts!' : 'Sign in to leave a comment.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageCircle, 
  Reply, 
  Heart, 
  User,
  Send
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import type { CollectionComment } from '@/types/collections';

interface CollectionCommentsProps {
  collectionId: string;
  comments: CollectionComment[];
  canComment: boolean;
}

export const CollectionComments: React.FC<CollectionCommentsProps> = ({
  collectionId,
  comments,
  canComment
}) => {
  const { user } = useUser();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  const queryClient = useQueryClient();

  const addCommentMutation = useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string }) => {
      const { data, error } = await supabase
        .from('collection_comments')
        .insert({
          collection_id: collectionId,
          user_id: user?.id!,
          content,
          parent_id: parentId
        })
        .select(`
          *,
          crd_profiles!collection_comments_user_id_fkey (
            username,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-comments', collectionId] });
      setNewComment('');
      setReplyText('');
      setReplyingTo(null);
      toast.success('Comment added!');
    },
    onError: (error) => {
      console.error('Failed to add comment:', error);
      toast.error('Failed to add comment');
    }
  });

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    addCommentMutation.mutate({ content: newComment.trim() });
  };

  const handleSubmitReply = (parentId: string) => {
    if (!replyText.trim()) return;
    addCommentMutation.mutate({ 
      content: replyText.trim(), 
      parentId 
    });
  };

  if (!canComment && comments.length === 0) {
    return (
      <Card className="bg-editor-dark border-crd-mediumGray/20">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-crd-mediumGray/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-crd-lightGray" />
          </div>
          <h3 className="text-lg font-semibold text-crd-white mb-2">No Comments Yet</h3>
          <p className="text-crd-lightGray">
            Be the first to share your thoughts about this collection!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Comment Form */}
      {canComment && (
        <Card className="bg-editor-dark border-crd-mediumGray/20">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                {user?.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-crd-mediumGray/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-crd-lightGray" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <Textarea
                  placeholder="Share your thoughts about this collection..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="bg-crd-darkGray border-crd-mediumGray text-crd-white resize-none"
                  rows={3}
                />
                
                <div className="flex justify-end mt-3">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || addCommentMutation.isPending}
                    className="bg-crd-green text-black hover:bg-crd-green/90"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            canReply={canComment}
            isReplying={replyingTo === comment.id}
            replyText={replyText}
            onReplyTextChange={setReplyText}
            onStartReply={() => setReplyingTo(comment.id)}
            onCancelReply={() => {
              setReplyingTo(null);
              setReplyText('');
            }}
            onSubmitReply={() => handleSubmitReply(comment.id)}
            isSubmitting={addCommentMutation.isPending}
          />
        ))}
      </div>
    </div>
  );
};

interface CommentItemProps {
  comment: CollectionComment;
  canReply: boolean;
  isReplying: boolean;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onStartReply: () => void;
  onCancelReply: () => void;
  onSubmitReply: () => void;
  isSubmitting: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  canReply,
  isReplying,
  replyText,
  onReplyTextChange,
  onStartReply,
  onCancelReply,
  onSubmitReply,
  isSubmitting
}) => {
  return (
    <Card className="bg-editor-dark border-crd-mediumGray/20">
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            {comment.user?.avatar_url ? (
              <img 
                src={comment.user.avatar_url} 
                alt={comment.user.username}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-crd-mediumGray/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-crd-lightGray" />
              </div>
            )}
          </div>

          {/* Comment Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-crd-white">
                {comment.user?.username || 'Unknown User'}
              </span>
              <span className="text-xs text-crd-lightGray">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>

            <p className="text-crd-lightGray mb-3">{comment.content}</p>

            {/* Comment Actions */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-crd-lightGray hover:text-crd-white p-0 h-auto"
              >
                <Heart className="w-4 h-4 mr-1" />
                Like
              </Button>

              {canReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onStartReply}
                  className="text-crd-lightGray hover:text-crd-white p-0 h-auto"
                >
                  <Reply className="w-4 h-4 mr-1" />
                  Reply
                </Button>
              )}
            </div>

            {/* Reply Form */}
            {isReplying && (
              <div className="mt-4 pl-4 border-l-2 border-crd-mediumGray">
                <Textarea
                  placeholder="Write your reply..."
                  value={replyText}
                  onChange={(e) => onReplyTextChange(e.target.value)}
                  className="bg-crd-darkGray border-crd-mediumGray text-crd-white resize-none mb-3"
                  rows={2}
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={onSubmitReply}
                    disabled={!replyText.trim() || isSubmitting}
                    size="sm"
                    className="bg-crd-green text-black hover:bg-crd-green/90"
                  >
                    {isSubmitting ? 'Posting...' : 'Reply'}
                  </Button>
                  <Button
                    onClick={onCancelReply}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 pl-4 border-l-2 border-crd-mediumGray space-y-3">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-3">
                    <div className="flex-shrink-0">
                      {reply.user?.avatar_url ? (
                        <img 
                          src={reply.user.avatar_url} 
                          alt={reply.user.username}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-crd-mediumGray/20 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-crd-lightGray" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-crd-white text-sm">
                          {reply.user?.username || 'Unknown User'}
                        </span>
                        <span className="text-xs text-crd-lightGray">
                          {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-crd-lightGray text-sm">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

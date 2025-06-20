
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  User, 
  Reply, 
  MoreHorizontal,
  Send
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    // In real implementation, this would use a mutation to create the comment
    console.log('Submitting comment:', newComment);
    setNewComment('');
  };

  const handleSubmitReply = (parentId: string) => {
    if (!replyContent.trim()) return;
    
    // In real implementation, this would use a mutation to create the reply
    console.log('Submitting reply to:', parentId, replyContent);
    setReplyTo(null);
    setReplyContent('');
  };

  if (!canComment && comments.length === 0) {
    return (
      <Card className="bg-editor-dark border-crd-mediumGray/20">
        <CardContent className="p-8 text-center">
          <MessageCircle className="w-16 h-16 text-crd-lightGray mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-crd-white mb-2">No Comments Yet</h3>
          <p className="text-crd-lightGray">
            Be the first to share your thoughts about this collection.
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
          <CardHeader>
            <CardTitle className="text-crd-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Add a Comment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Share your thoughts about this collection..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-editor-dark border-crd-mediumGray text-crd-white resize-none"
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="bg-crd-green text-black hover:bg-crd-green/90"
              >
                <Send className="w-4 h-4 mr-2" />
                Post Comment
              </Button>
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
            canComment={canComment}
            replyTo={replyTo}
            replyContent={replyContent}
            setReplyTo={setReplyTo}
            setReplyContent={setReplyContent}
            onSubmitReply={handleSubmitReply}
          />
        ))}
      </div>

      {comments.length === 0 && canComment && (
        <div className="text-center py-8">
          <p className="text-crd-lightGray">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
};

interface CommentItemProps {
  comment: CollectionComment;
  canComment: boolean;
  replyTo: string | null;
  replyContent: string;
  setReplyTo: (id: string | null) => void;
  setReplyContent: (content: string) => void;
  onSubmitReply: (parentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  canComment,
  replyTo,
  replyContent,
  setReplyTo,
  setReplyContent,
  onSubmitReply
}) => {
  return (
    <Card className="bg-editor-dark border-crd-mediumGray/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            {comment.user?.avatar_url ? (
              <img 
                src={comment.user.avatar_url} 
                alt={comment.user.username}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-crd-mediumGray/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-crd-lightGray" />
              </div>
            )}
          </div>

          {/* Comment Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-crd-white">
                {comment.user?.username || 'Anonymous'}
              </span>
              <span className="text-xs text-crd-lightGray">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
              {comment.updated_at !== comment.created_at && (
                <Badge variant="secondary" className="text-xs">
                  edited
                </Badge>
              )}
            </div>

            <p className="text-crd-white mb-3">{comment.content}</p>

            {/* Comment Actions */}
            <div className="flex items-center gap-2">
              {canComment && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyTo(comment.id)}
                  className="text-crd-lightGray hover:text-crd-white"
                >
                  <Reply className="w-4 h-4 mr-1" />
                  Reply
                </Button>
              )}
            </div>

            {/* Reply Form */}
            {replyTo === comment.id && (
              <div className="mt-4 space-y-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="bg-editor-dark border-crd-mediumGray text-crd-white resize-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onSubmitReply(comment.id)}
                    disabled={!replyContent.trim()}
                    className="bg-crd-green text-black hover:bg-crd-green/90"
                  >
                    Reply
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setReplyTo(null)}
                    className="text-crd-lightGray"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 space-y-3 pl-4 border-l border-crd-mediumGray/20">
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    canComment={canComment}
                    replyTo={replyTo}
                    replyContent={replyContent}
                    setReplyTo={setReplyTo}
                    setReplyContent={setReplyContent}
                    onSubmitReply={onSubmitReply}
                  />
                ))}
              </div>
            )}
          </div>

          {/* More Actions */}
          <div className="flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Report</DropdownMenuItem>
                <DropdownMenuItem className="text-red-400">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

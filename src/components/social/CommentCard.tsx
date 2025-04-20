
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '@/hooks/use-user';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Reply } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as socialRepository from '@/repositories/social';
import type { Comment } from '@/types/social';
import { ReactionBar } from './ReactionBar';

interface CommentCardProps {
  comment: Comment;
  onUpdate?: (comment: Comment) => void;
  onDelete?: (id: string) => void;
}

export const CommentCard = ({ comment, onUpdate, onDelete }: CommentCardProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Comment[]>(comment.replies || []);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = user?.id === comment.userId;
  
  const fetchReplies = async () => {
    try {
      setLoading(true);
      const response = await socialRepository.getComments({
        parentId: comment.id,
        page: 1,
        limit: 10
      });
      setReplies(response.comments);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load replies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!user || editContent.trim() === comment.content) {
      setIsEditing(false);
      return;
    }

    try {
      setSubmitting(true);
      const updatedComment = await socialRepository.updateComment(
        comment.id,
        user.id,
        editContent
      );
      if (onUpdate) onUpdate(updatedComment);
      setIsEditing(false);
      toast({
        description: "Comment updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    try {
      await socialRepository.deleteComment(comment.id, user.id);
      if (onDelete) onDelete(comment.id);
      toast({
        description: "Comment deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  const handleReply = async () => {
    if (!user || !replyContent.trim()) return;

    try {
      setSubmitting(true);
      const newReply = await socialRepository.addComment({
        userId: user.id,
        content: replyContent,
        parentId: comment.id,
        cardId: comment.cardId,
        collectionId: comment.collectionId
      });
      
      setReplies(prev => [newReply, ...prev]);
      setReplyContent('');
      setIsReplying(false);
      
      // Update parent comment's reply count
      if (onUpdate && comment.replyCount !== undefined) {
        onUpdate({
          ...comment,
          replyCount: comment.replyCount + 1
        });
      }
      
      toast({
        description: "Reply added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.user?.profileImage || undefined} alt={comment.user?.username} />
          <AvatarFallback>{comment.user?.username?.[0] || '?'}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.user?.username || 'Anonymous'}</span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px]"
              />
              <div className="flex gap-2">
                <Button onClick={handleEdit} disabled={submitting}>Save</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm">{comment.content}</p>
          )}

          <div className="flex items-center gap-4">
            <ReactionBar commentId={comment.id} initialReactions={comment.reactions} />
            
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => setIsReplying(!isReplying)}
            >
              <Reply className="h-4 w-4" />
              Reply
            </Button>
          </div>

          {isReplying && (
            <div className="mt-2 space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[60px]"
              />
              <div className="flex gap-2">
                <Button onClick={handleReply} disabled={submitting}>Reply</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {comment.replyCount && comment.replyCount > 0 && (
        <div className="pl-11">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (!showReplies) {
                fetchReplies();
              }
              setShowReplies(!showReplies);
            }}
          >
            {showReplies ? "Hide" : "Show"} {comment.replyCount} {comment.replyCount === 1 ? "reply" : "replies"}
          </Button>

          {showReplies && (
            <div className="mt-2 space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading replies...</p>
              ) : (
                replies.map(reply => (
                  <CommentCard
                    key={reply.id}
                    comment={reply}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                  />
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

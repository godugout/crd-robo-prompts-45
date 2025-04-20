
import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as socialRepository from '@/repositories/social';
import type { Comment } from '@/types/social';
import { CommentCard } from './CommentCard';

interface CommentSectionProps {
  memoryId?: string;
  collectionId?: string;
  expanded?: boolean;
}

export const CommentSection = ({ memoryId, collectionId, expanded = false }: CommentSectionProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchComments = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await socialRepository.getComments({
        cardId: memoryId, // Changed memoryId to cardId
        collectionId,
        page: pageNum,
        limit: 10
      });
      
      if (pageNum === 1) {
        setComments(response.comments);
      } else {
        setComments(prev => [...prev, ...response.comments]);
      }
      
      setTotalComments(response.total);
      setHasMore(response.hasMore);
      setPage(pageNum);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!memoryId && !collectionId) return;
    if (expanded) {
      setIsExpanded(true);
      fetchComments(1);
    }
  }, [memoryId, collectionId, expanded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      setSubmitting(true);
      const comment = await socialRepository.addComment({
        userId: user.id,
        content: newComment,
        cardId: memoryId, // Changed memoryId to cardId
        collectionId
      });
      
      setComments(prev => [comment, ...prev]);
      setTotalComments(prev => prev + 1);
      setNewComment('');
      
      toast({
        description: "Comment added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = (updatedComment: Comment) => {
    setComments(prev => 
      prev.map(c => c.id === updatedComment.id ? updatedComment : c)
    );
  };

  const handleDelete = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
    setTotalComments(prev => prev - 1);
  };

  if (!memoryId && !collectionId) return null;

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <MessageCircle className="h-4 w-4" />
        <span>{totalComments} Comments</span>
      </Button>

      {user && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
          />
          <Button type="submit" disabled={submitting}>
            Post
          </Button>
        </form>
      )}

      {isExpanded && (
        <div className="space-y-4">
          {loading && comments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No comments yet</p>
          ) : (
            <>
              {comments.map(comment => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
              
              {hasMore && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fetchComments(page + 1)}
                  disabled={loading}
                >
                  Load more
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

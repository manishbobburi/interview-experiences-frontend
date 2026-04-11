import React, { useState, useEffect } from 'react';
import { getCommentsByPostId, createComment, deleteComment } from '../../../services/comments.api';
import type { CommentProps } from '../post.types';
import Button from '../../../components/Button';
import { timeAgo } from '../../../utils/timeAgo';
import { useAuth } from '../../auth/auth.context';
import { MoreVertical } from 'lucide-react';
import DropDown from '../../../components/DropDown';
interface CommentSectionProps {
  postId: number;
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
}

export default function CommentSection({ postId, onCommentAdded, onCommentDeleted }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    const res = await getCommentsByPostId(postId);
    if (res.success && res.data) {
      setComments(res.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    const res = await createComment(postId, newComment);
    if (res.success && res.data) {
      const newCommentObj = {
        ...res.data,
        user: { name: user.name }
      };
      setComments([newCommentObj, ...comments]);
      setNewComment("");
      if (onCommentAdded) onCommentAdded();
    }
    setSubmitting(false);
  };

  const handleDelete = async (commentId: number) => {
    const res = await deleteComment(commentId);
    if (res.success) {
      setComments(comments.filter(c => c.id !== commentId));
      if (onCommentDeleted) onCommentDeleted();
    }
  };

  if (loading) return <div className="text-sm text-gray-400 py-4">Loading comments...</div>;

  return (
    <div className="mt-8" id="comment-section">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Comments ({comments.length})</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <input
            type="text"
            className="w-full pb-2 border-b border-gray-300 focus:outline-none focus:border-black bg-transparent text-sm text-gray-800 placeholder:text-gray-500"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          {newComment.trim().length > 0 && (
            <div className="flex justify-end mt-2">
              <div className="text-xs">
                 <Button type="submit" disabled={submitting}>
                   {submitting ? "Posting..." : "Post Comment"}
                 </Button>
              </div>
            </div>
          )}
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-500 text-center">
          Please sign in to leave a comment.
        </div>
      )}

      <div className="space-y-4">
        {(
          comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg border border-gray-200">
               <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                 <div className="flex items-center gap-3">
                   <span className="font-semibold text-sm text-gray-900">{comment.user?.name || "Anonymous"}</span>
                   <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                 </div>
                 {user && user.id === comment.userId && (
                   <div className="relative dropdown-container">
                     <button onClick={() => setOpenDropdownId(openDropdownId === comment.id ? null : comment.id)} className="text-gray-400 hover:text-gray-600 transition cursor-pointer" aria-label="Comment options">
                       <MoreVertical size={16} />
                     </button>
                     {openDropdownId === comment.id && (
                       <DropDown onDelete={() => handleDelete(comment.id)} onClose={() => setOpenDropdownId(null)} />
                     )}
                   </div>
                 )}
               </div>
               <div className="px-4 py-3">
                 <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{comment.text}</p>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

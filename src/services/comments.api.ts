import api from './axios';
import type { CommentProps } from '../features/posts/post.types';
import type { ApiResponse } from '../types/api.types';

export const getCommentsByPostId = async (postId: number): Promise<ApiResponse<CommentProps[]>> => {
  return await api.get(`/comments/post/${postId}`);
};

export const createComment = async (postId: number, text: string): Promise<ApiResponse<CommentProps>> => {
  return await api.post('/comments', { postId, text });
};

export const deleteComment = async (id: number): Promise<ApiResponse<void>> => {
  return await api.delete(`/comments/${id}`);
};

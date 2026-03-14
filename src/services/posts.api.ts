import api from './axios';
import type { Cursor, PaginatedPosts, PostProps } from '../features/posts/post.types';
import type { ApiResponse } from '../types/api.types'

export const getPosts = async (cursor?: Cursor): Promise<ApiResponse<PaginatedPosts>> => {
  const params = new URLSearchParams();
    if(cursor) {
      params.append("createdAt", cursor.createdAt);
      params.append("id", String(cursor.id));
    }
  return await api.get('/posts', { params });
};

export const getPostBySlug = async (slug: string): Promise<ApiResponse<PostProps>> => {
  return await api.get(`/posts/${slug}`);
}

export const getPostsByUserName = async (userId: number): Promise<ApiResponse<PostProps[]>> => {
  return await api.get(`/posts/user/${userId}`);
}

export const createPost = async (
  payload: Partial<PostProps>
): Promise<PostProps> => {
  return api.post('/posts', payload);
};

export const deletePost = async (id: number): Promise<void> => {
  return api.delete(`/posts/${id}`);
};
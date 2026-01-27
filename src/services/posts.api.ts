import api from './axios';
import type { PostProps } from '../features/posts/post.types';
import type { ApiResponse } from '../types/api.types'

export const getPosts = async (): Promise<ApiResponse<PostProps[]>> => {
  return await api.get('/posts');
};

export const getPostById = async (id: number): Promise<ApiResponse<PostProps>> => {
  return await api.get(`/posts/${id}`);
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
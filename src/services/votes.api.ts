import api from './axios';
import type { ApiResponse } from '../types/api.types';

export const toggleLike = async (postId: number): Promise<ApiResponse<{ liked: boolean }>> => {
  return await api.post('/votes/toggle', { postId });
};

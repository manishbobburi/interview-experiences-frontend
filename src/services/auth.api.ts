import api from './axios';
import type { ApiResponse } from '../types/api.types';
import type { SignInPayload, AuthResponse, SignUpPayload } from '../features/auth/auth.types';

export const signIn = async (data: SignInPayload): Promise<ApiResponse<AuthResponse>> => {
    return api.post('/users/signin', data);
}

export const signUp = async (data: SignUpPayload): Promise<ApiResponse<AuthResponse>> => {
    return api.post('/users/signup', data);
}

export const getMe = async (): Promise<ApiResponse<AuthResponse>> => {
    return api.get(`/users/me`);
}

export const verifyEmail = async (token: string): Promise<ApiResponse<null>> => {
    return api.get(`/auth/verify-email?token=${token}`);
}

export const resendVerification = async (email: string): Promise<ApiResponse<null>> => {
    return api.post('/auth/resend-verification', { email });
}
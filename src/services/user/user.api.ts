import api from "../axios";
import type { ApiResponse } from '../../types';
import type { AuthResponse } from "../../features/auth/auth.types";
import type { PasswordDetails, UserDetails } from "./user.types";

export const changeUserDetails = async (data: UserDetails): Promise<ApiResponse<AuthResponse>> => {
    return api.patch('/users/', data)
}

export const changeUserPassword = async (data: PasswordDetails): Promise<ApiResponse<AuthResponse>> => {
    return api.post('/users/change-password', data);
}
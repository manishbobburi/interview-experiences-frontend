import api from "../axios";
import type { ApiResponse } from '../../types';
import type { AuthResponse } from "../../features/auth/auth.types";
import type { UserDetails } from "./user.types";

export const changeUserDetails = async (data: UserDetails): Promise<ApiResponse<AuthResponse>> => {
    return api.patch('/users/', data)
}
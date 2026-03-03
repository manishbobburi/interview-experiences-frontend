import api from "./axios";
import type { ApiResponse } from '../types/api.types'
import type { Company } from "../features/posts/post.types";

export const getCompanies = async (): Promise<ApiResponse<Company[]>> => {
    return await api.get("/companies");
}


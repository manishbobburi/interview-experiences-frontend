export type ApiResponse<T> = {
    success: boolean,
    data: T,
    message: string,
}

export type ApiError = {
    type?: 'NETWORK_ERROR' | 'SERVER_ERROR' | 'API_ERROR';
    status?: number;
    message?: string;
}

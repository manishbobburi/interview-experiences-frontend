export type ApiResponse<T> = {
    success: boolean,
    data: T,
    message: string,
}

export type ApiError = {
    type: string;
    status?: number;
    message: string;
}

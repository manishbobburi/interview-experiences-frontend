import type { NavigateFunction } from "react-router-dom";
import type { ApiError } from "../types/api.types";

export function handleComponentError(err: ApiError, navigate: NavigateFunction) {
    if(err.type === 'NETWORK_ERROR')  navigate('/offline');
    else if(err.type === 'SERVER_ERROR') navigate('/500');
    else if(err.status === 401) navigate('/login');
}
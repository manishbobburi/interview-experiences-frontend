import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    res => res.data,
    err => {
        if(!err.response) {
            return Promise.reject({
                type: 'NETWORK_ERROR',
                message: 'Cannot connect to server. Please try again later.',
            });
        }

        const { status, data } = err.response;

        if(status >= 500) {
            return Promise.reject({
                type: 'SERVER_ERROR',
                status,
                message: 'Internal server error',
            });
        }

        return Promise.reject({
            type: data.code,
            status,
            message: data?.message || 'Request failed',
        });
    }
);

export default api;
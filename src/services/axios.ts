import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    res => res.data.data,
    err => {
        const message = err.response?.data?.message || 'Request failed';
        return Promise.reject(new Error(message));
    }
);

export default api;
import { redirect } from 'react-router-dom';
import type { ApiError } from '../types/api.types';

export function handleLoaderError(error: unknown): never {
    const err = error as ApiError;

    switch (err?.type) {
        case 'NETWORK_ERROR':
            throw redirect('/offline')

        case 'SERVER_ERROR':
            throw redirect('/500');
        
        case 'API_ERROR':
            if(err.status === 404) {
                throw redirect('/not-found');
            }
            throw redirect('/500');

        default:
            throw redirect('/500');
    }
}
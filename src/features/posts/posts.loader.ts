import { getPosts } from '../../services/posts.api';
import { handleLoaderError } from '../../utils/loaderErrorHandler';

export async function postsLoader() {
    try {
        return await getPosts();
    } catch (err) {
        handleLoaderError(err)
    }
}
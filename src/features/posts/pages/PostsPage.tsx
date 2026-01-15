import { useLoaderData  } from 'react-router-dom';
import PostCard from './components/PostCard';
import type { PostProps } from './post.types';
import type { ApiResponse } from '../../types';

function PostsPage() {
  const posts = useLoaderData<ApiResponse<PostProps[]>>();
  
  if(posts.data.length === 0) return <div>No posts found.</div>

  return (
    <div>
      {posts.data.map(post => (
          <PostCard key={post.id} post={post}/>
        ))}
    </div>
  )
}

export default PostsPage;
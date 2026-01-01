import { useLoaderData  } from 'react-router-dom';
import PostCard from './components/PostCard';
import type { PostProps } from './post.types';

function PostsPage() {
  const posts = useLoaderData<PostProps[]>();
  
  if(posts.length === 0) return <div>No posts found.</div>

  return (
    <div>
      {posts.map(post => (
          <PostCard key={post.id} post={post}/>
        ))}
    </div>
  )
}

export default PostsPage;
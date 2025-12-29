import { useState, useEffect } from 'react';
import PostCard from './components/PostCard';
import type { PostProps } from '../../types';
import { getPosts } from '../../services/posts.api';

function PostsPage() {
  
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPosts()
    .then(setPosts)
    .catch(e => setError(e.message))
    .finally(() => setLoading(false));
    console.log(posts);
  },[]);

  if(loading) return <div>Loading...</div>

  if(error) return <div>{error}</div>
  
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
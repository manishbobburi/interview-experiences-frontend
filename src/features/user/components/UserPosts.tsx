import { useState, useEffect } from "react";
import { getPostsByUserName } from "../../../services/posts.api";
import PostCard from "../../posts/components/PostCard";
import type { PostProps } from "../../posts/post.types";
import { useAuth } from "../../auth/auth.context";

function UserPosts() {
  const { user } = useAuth();

  const [userPosts, setUserPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchPosts = async () => {
      try {
        const response = await getPostsByUserName(user.id);
        setUserPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch user posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [user?.id]);

  if (userPosts.length === 0) return <div>No posts created.</div>;

  if (loading) return <div>Loading posts...</div>;

  return (
    userPosts && (
      <>
        <div>
          {userPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </>
    )
  );
}

export default UserPosts;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPostsByUserName } from "../../../services/posts.api";
import PostCard from "../../posts/components/PostCard";
import type { PostProps } from "../../posts/post.types";

function UserPosts() {
  const { userId } = useParams<{ userId: string }>();

  const [userPosts, setUserPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      try {
        const response = await getPostsByUserName(Number(userId));
        setUserPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch user posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [userId]);

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

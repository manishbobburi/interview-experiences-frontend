import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import PostCard from "../components/PostCard";
import type { PaginatedPosts, PostProps, Cursor } from "../post.types";
import { getPosts } from "../../../services/posts.api";
import type { ApiResponse } from "../../../types";

function PostsPage() {
  const initial = useLoaderData<ApiResponse<PaginatedPosts>>();

  const [posts, setPosts] = useState<PostProps[]>(initial.data.items);
  const [cursor, setCursor] = useState<Cursor | null>(initial.data.nextCursor);
  const [hasMore, setHasMore] = useState(initial.data.hasMore);
  const [loading, setLoading] = useState(false);

  async function fetchMore() {
    if (!hasMore || loading) return;

    setLoading(true);

    const params = new URLSearchParams();
    if(cursor) {
      params.append("createdAt", cursor.createdAt);
      params.append("id", String(cursor.id));
    }

    const res = await getPosts(cursor ?? undefined); 

    const page = res.data;

    setPosts((prev) => [
      ...prev,
      ...page.items,
    ]);
    setCursor(page.nextCursor);
    setHasMore(page.hasMore);

    setLoading(false);
  }

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      },
      { threshold: 0.5 }
      /*
        IntersectionObserver: is a browser API that watches an element and tells you when it becomes visble inside the viewport
       */
      /* 
        This threshold controls how early the fetch happens
        0 -> trigger as soon as even 1 pixel is visible.
        0.5 -> half visible.
        1 -> fully visible
       */
    );

    if(bottomRef.current)
      observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [cursor, hasMore, loading]);

  if (posts.length === 0) return <div>No posts found.</div>;

  return (
    <div className="pt-15">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {loading && <p className="text-center">Loading...</p>}

      <div ref={bottomRef}/>

      {!hasMore && <p className="text-center">You have reached end.</p>}
    </div>
  );
}

export default PostsPage;

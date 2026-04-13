import { useEffect, useMemo, useRef, useState } from "react";
import { useLoaderData, useOutletContext } from "react-router-dom";
import PostCard from "../components/PostCard";
import type { ApiResponse } from "../../../types";
import { getPosts } from "../../../services/posts.api";
import type { PaginatedPosts, PostProps, Cursor } from "../post.types";

function PostsPage() {
  const initial = useLoaderData<ApiResponse<PaginatedPosts>>();

  const [posts, setPosts] = useState<PostProps[]>(initial.data.items);
  const [cursor, setCursor] = useState<Cursor | null>(initial.data.nextCursor);
  const [hasMore, setHasMore] = useState(initial.data.hasMore);
  const [loading, setLoading] = useState(false);
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const bottomRef = useRef<HTMLDivElement | null>(null);


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

  useEffect(() => {
    const timer = setTimeout(() =>  {
      setDebouncedSearch(searchQuery);
    }, 400)

    return () => clearTimeout(timer);
  },[searchQuery]);

  const visiblePosts = useMemo(() => {
    if(!searchQuery) return posts;
    
    const q = debouncedSearch.toLowerCase();

    return posts.filter(p => 
      p.company.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q)
    )
  }, [posts, debouncedSearch])


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      },
      { threshold: 0.5 }
      /*
        IntersectionObserver: is a browser API that watches an element and tells me when it becomes visble inside the viewport
       */
      /* 
        threshold controls how early the fetch happens
        0 -> trigger as soon as even 1 pixel is visible.
        0.5 -> half visible.
        1 -> fully visible
       */
    );

    if(bottomRef.current)
      observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [cursor, hasMore, loading]);

  if (posts.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-sm">Be the first one to create.</p>
    </div>
  );

  return (
    <div className="pt-16 px-4 sm:px-6 md:px-10 lg:px-14">
      {visiblePosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {loading && <p className="text-center">Loading...</p>}

      <div ref={bottomRef}/>

      {visiblePosts.length === 0 && <p className="text-center">No results found.</p>}

      {!hasMore && visiblePosts.length !== 0 && <p className="text-center">You have reached end.</p>}
    </div>
  );
}

export default PostsPage;

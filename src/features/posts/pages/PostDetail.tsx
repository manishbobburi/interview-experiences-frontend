import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../../components/Card";
import type { PostProps } from "../post.types";
import { mapDifficulty } from "../../../utils/difficulty";
import { getPostById } from "../../../services/posts.api";
import DifficultyBadge from "../../../components/DifficultyBadge";


export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<PostProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadPost = async () => {
      setLoading(true);
      const res = await getPostById(Number(id));
      if (res.success) {
        setPost(res.data);
      } else {
        setError("Could not load this post.");
      }
      setLoading(false);
    };

    loadPost();
  }, [id]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500 text-sm">{error ?? "Post not found."}</p>
        <button
          onClick={() => navigate("/")}
          className="text-sm text-black underline cursor-pointer"
        >
          ← Back to Feed
        </button>
      </div>
    );
  }

  const displayAuthor = post.isAnonymous
    ? "Anonymous"
    : post.user?.name ?? post.displayName;

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-items-start px-6 py-3 border-b border-gray-100">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
        >
          ← Back
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">{post.company}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{post.role}</p>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <DifficultyBadge level={mapDifficulty(post.overallDifficulty).value} />
            <span className="text-xs text-gray-400">
              {displayAuthor} · {formattedDate}
            </span>
          </div>

          <hr className="border-gray-100 mb-6" />

          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.body}
          </div>
        </Card>
      </main>
    </div>
  );
}

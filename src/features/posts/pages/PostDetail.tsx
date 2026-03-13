import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../../components/Card";
import type { PostProps } from "../post.types";
import { mapDifficulty } from "../../../utils/difficulty";
import { getPostById } from "../../../services/posts.api";
import DifficultyBadge from "../../../components/DifficultyBadge";
import BackButton from "../../../components/BackButton";
import { getAssetUrl } from "../../../utils/getAssetUrl";


export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<PostProps | null>(null);
  const [loading, setLoading] = useState(false);
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
  <div className="min-h-screen bg-white pt-14">
    <main className="max-w-3xl mx-auto px-4 py-8">
      <Card className="py-6">
        <div className="flex">

          <div className="w-10 -ml-2 mr-2">
            <BackButton />
          </div>

          <div className="flex-1">
            <div>
              <div className="flex items-center gap-2 leading-none">
                <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                  <img
                    src={getAssetUrl(post.company.logoPath)}
                    alt={post.company.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {post.company.name}
                </h1>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                {post.role}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pt-2">
                <DifficultyBadge
                  level={mapDifficulty(post.overallDifficulty).value}
                />
                <span className="text-xs text-gray-400">
                  {displayAuthor} · {formattedDate}
                </span>
              </div>
            </div>

            <hr className="border-gray-100 my-6" />

            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.body}
            </div>
          </div>
        </div>
      </Card>
    </main>
  </div>
);
}

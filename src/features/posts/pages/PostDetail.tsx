import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import Card from "../../../components/Card";
import type { PostProps } from "../post.types";
import { mapDifficulty } from "../../../utils/difficulty";
import { getPostBySlug } from "../../../services/posts.api";
import DifficultyBadge from "../../../components/DifficultyBadge";
import BackButton from "../../../components/BackButton";
import { getAssetUrl } from "../../../utils/getAssetUrl";
import { useAuth } from "../../auth/auth.context";
import { ThumbsUp, MessageSquare } from "lucide-react";
import { toggleLike } from "../../../services/votes.api";
import CommentSection from "../components/CommentSection";


export default function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<PostProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!slug) return;

    const loadPost = async () => {
      setLoading(true);
      const res = await getPostBySlug(slug);
      if (res.success) {
        setPost(res.data);
      } else {
        setError("Could not load this post.");
      }
      setLoading(false);
    };

    loadPost();
  }, [slug]);


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

  const handleLike = async () => {
    if (!user) {
      toast.info("Please sign in to like this post.");
      return;
    }
    const res = await toggleLike(post.id);
    if (res.success && res.data) {
      setPost({
        ...post,
        hasLiked: res.data.liked,
        upvotes: post.upvotes + (res.data.liked ? 1 : -1)
      });
    }
  };

return (
  <div className="min-h-screen bg-white pt-14">
  <main className="max-w-3xl mx-auto px-4 py-8">
    <Card className="py-6">
      <div className="flex">

        <div className="w-10 -ml-2 mr-2 shrink-0">
          <BackButton />
        </div>

        <div className="flex-1 min-w-0">
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

            <div
            className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none wrap-break-word"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.body, {
                ALLOWED_TAGS: [
                  "p", "br", "strong", "em", "s", "code", "pre",
                  "h1", "h2", "h3", "h4", "h5", "h6",
                  "ul", "ol", "li", "blockquote", "a",
                ],
                ALLOWED_ATTR: ["href", "target", "rel", "class"],
              }),
            }}
          />

          <hr className="border-gray-100 my-6" />

          {/* Actions Toolbar */}
          <div className="flex items-center gap-6 mt-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors text-sm font-medium cursor-pointer ${post.hasLiked ? 'text-black' : 'text-gray-500 hover:text-black'}`}
            >
              <ThumbsUp size={18} className={post.hasLiked ? "fill-black" : ""} />
              <span>{post.upvotes} {post.upvotes === 1 ? 'Like' : 'Likes'}</span>
            </button>
            <div 
              className="flex items-center gap-1.5 text-gray-500 text-sm font-medium cursor-pointer hover:text-black transition-colors"
              onClick={() => document.getElementById('comment-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <MessageSquare size={18} />
              <span>{post.commentsCount} {post.commentsCount === 1 ? 'Comment' : 'Comments'}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>

    <div className="px-4 md:px-0">
      <CommentSection 
        postId={post.id} 
        onCommentAdded={() => setPost({...post, commentsCount: post.commentsCount + 1})}
        onCommentDeleted={() => setPost({...post, commentsCount: Math.max(0, post.commentsCount - 1)})}
      />
    </div>
  </main>
</div>

);
}

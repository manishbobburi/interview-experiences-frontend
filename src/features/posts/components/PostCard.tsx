import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import { EllipsisVertical, ThumbsUp, MessageSquare } from "lucide-react";
import Card from "../../../components/Card";
import type { PostProps } from "../post.types";
import Button from "../../../components/Button";
import { timeAgo } from "../../../utils/timeAgo";
import { useAuth } from "../../auth/auth.context";
import DropDown from "../../../components/DropDown";
import { deletePost } from '../../../services/posts.api';
import { toggleLike } from "../../../services/votes.api";
import DifficultyBadge from "../../../components/DifficultyBadge";
import { mapDifficulty } from "../../../utils/difficulty";
import { hasRole } from "../../../utils/hasRole";
import { getAssetUrl } from "../../../utils/getAssetUrl";

type PostCardProps = {
  post: PostProps;
};

export default function PostCard({ post }: PostCardProps) {
  const [isClicked, setIsClicked] = useState(false);
  const createdAt = timeAgo(post.createdAt);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = hasRole(user, ["ADMIN"]);
  const isOwner = Boolean(post?.isOwner);

  const [hasLiked, setHasLiked] = useState(post.hasLiked);
  const [upvotes, setUpvotes] = useState(post.upvotes);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.info("Please sign in to like this post.");
      return;
    }
    const res = await toggleLike(post.id);
    if (res.success && res.data) {
      setHasLiked(res.data.liked);
      setUpvotes(prev => prev + (res.data.liked ? 1 : -1));
    }
  };

  const stripHtml = (html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
    return temp.textContent || temp.innerText || "";
  };

  return (
    <Card className="my-4 cursor-pointer" onClick={() => navigate(`/post/${post.slug}`)}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <img
              src={getAssetUrl(post.company.logoPath)}
              alt={post.company.name}
              loading="lazy"
              className="w-6 h-6 object-contain shrink-0"
            />
            <h2 className="text-xl font-semibold text-gray-900 leading-tight">
              {post.company.name}
            </h2>
          </div>

          <p className="text-sm text-gray-500 font-medium mt-0.5">
            {post.role}
          </p>

          <div className="mt-2">
            <DifficultyBadge
              level={mapDifficulty(post.overallDifficulty).value}
            />
          </div>
        </div>

        {(isOwner || isAdmin) && (
          <div className="relative"  onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer"
              onClick={() => setIsClicked((prev) => !prev)}
            >
              <EllipsisVertical size={15}/>
            </Button>

            {isClicked && <DropDown onClose={() => setIsClicked(false)} onDelete={async () => {
             await  deletePost(post.id)
            }}/>}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-700 mt-3 line-clamp-3">
        {stripHtml(post.body)}
      </p>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
          <div className={`flex items-center gap-1.5 cursor-pointer transition-colors ${hasLiked ? 'text-black' : 'hover:text-black'}`}
               onClick={handleLike}>
            <ThumbsUp size={16} className={hasLiked ? "fill-black" : ""} />
            <span>{upvotes}</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-black cursor-pointer transition-colors"
               onClick={(e) => { e.stopPropagation(); navigate(`/post/${post.slug}`); }}>
            <MessageSquare size={16} />
            <span>{post.commentsCount}</span>
          </div>
        </div>

        <span className="text-sm text-gray-500">
          {post.displayName} • {createdAt}
        </span>
      </div>
    </Card>
  );
}

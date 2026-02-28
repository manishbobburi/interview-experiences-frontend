import { useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";
import { EllipsisVertical } from "lucide-react";
import Card from "../../../components/Card";
import type { PostProps } from "../post.types";
import Button from "../../../components/Button";
import { timeAgo } from "../../../utils/timeAgo";
import { useAuth } from "../../auth/auth.context";
import DropDown from "../../../components/DropDown";
import { deletePost } from '../../../services/posts.api';
import DifficultyBadge from "../../../components/DifficultyBadge";
import { mapDifficulty } from "../../../utils/difficulty";

type PostCardProps = {
  post: PostProps;
};

export default function PostCard({ post }: PostCardProps) {
  const [isClicked, setIsClicked] = useState(false);
  const createdAt = timeAgo(post.createdAt);
  const { user } = useAuth();
  const navigate = useNavigate();
  const match = useMatch("/user/:id");
  const inProfile = Boolean(match);

  return (
    <Card className="my-4 cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-semibold text-lg">{post.company}</h2>
          <p className="text-sm text-gray-500">{post.role}</p>
          <div className="mt-1.5">
            <DifficultyBadge level={mapDifficulty(post.overallDifficulty).value} />
          </div>
        </div>

        {inProfile && (user?.id === post.userId) && (
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
        {post.body || "N/A"}
      </p>

      <div className="flex justify-end items-center text-sm text-gray-500 mt-4">
        <span>
          {post.displayName} • {createdAt}
        </span>
      </div>
    </Card>
  );
}

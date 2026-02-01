import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import Card from "../../../components/Card";
import type { PostProps } from "../post.types";
import Button from "../../../components/Button";
import { timeAgo } from "../../../utils/timeAgo";
import { useAuth } from "../../auth/auth.context";
import DropDown from "../../../components/DropDown";
import { deletePost } from '../../../services/posts.api';
import DifficultyBadge from "../../../components/DifficultyBadge";

type PostCardProps = {
  post: PostProps;
};

export default function PostCard({ post }: PostCardProps) {
  const [isClicked, setIsClicked] = useState(false);
  const createdAt = timeAgo(post.createdAt);
  const { user } = useAuth();

  return (
    <Card className="my-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-semibold text-lg">{post.company}</h2>
          <p className="text-sm text-gray-500">{post.role}</p>
        </div>

        <DifficultyBadge level={post.overallDifficulty} />

        {user?.id === post.userId && (
          <div className="relative">
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
            }} onEdit={() => console.log("Clicked Edit")}/>}
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

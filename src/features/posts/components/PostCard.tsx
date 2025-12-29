import Card from '../../../components/Card';
import DifficultyBadge from '../../../components/DifficultyBadge';
import type { PostProps } from '../post.types';

type PostCardProps = {
  post: PostProps
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card>

      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-semibold text-lg">{post.company}</h2>
          <p className="text-sm text-gray-500">{post.role}</p>
        </div>
        <DifficultyBadge level={post.difficulty} />
      </div>


      <p className="text-sm text-gray-700 mt-3 line-clamp-3">
        {post.summary || "Grind Leetcode till your fingers **"}
      </p>


      <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
        <div className="flex gap-4">
          <span>⬆ {post.upvotes}</span>
          <span>⬇ {post.downvotes}</span>
          <span>💬 {post.commentsCount}</span>
        </div>
        <span>
          {post.isAnonymous ? "Anonymous" : "User"} • {post.createdAt}
        </span>
      </div>
    </Card>
  );
}

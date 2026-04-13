export type Difficulty =
  | 'Easy'
  | 'Easy_Medium'
  | 'Medium'
  | 'Medium_Hard'
  | 'Hard';


export type Cursor = {
  createdAt: string;
  id: number;
}

export type PostProps = {
  id: number;
  userId: number;
  companyId: number;
  role: string;
  overallDifficulty: number;
  body: string;
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  isAnonymous: boolean;
  createdAt: string;
  displayName: string;
  user?: User;
  company: Company;
  slug: string;
  hasLiked?: boolean;
};

export interface CommentProps {
  id: number;
  postId: number;
  userId: number;
  text: string;
  createdAt: string;
  user: {
    name: string;
  };
}

export type PaginatedPosts = {
  items: PostProps[];
  nextCursor: Cursor | null;
  hasMore: boolean;
}

export interface CreatePostPayload {
  userId: number | undefined;
  companyId: number;
  role: string;
  difficulty: Difficulty;
  summary: string;
  isAnonymous: boolean;
}

interface User {
  name: string;
}

export interface Company {
  id: number;
  name: string;
  logoPath: string;
}
type Difficulty =
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
  company: string;
  role: string;
  overallDifficulty: Difficulty;
  body: string;
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  isAnonymous: boolean;
  createdAt: string;
  displayName: string;
  user?: userObj;
};

export type PaginatedPosts = {
  items: PostProps[];
  nextCursor: Cursor | null;
  hasMore: boolean;
}

export interface CreatePostPayload {
  userId: number | undefined;
  company: string;
  role: string;
  difficulty: Difficulty;
  summary: string;
  isAnonymous: boolean;
}

type userObj = {
  name: string;
}
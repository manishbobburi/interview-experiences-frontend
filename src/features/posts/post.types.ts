type Difficulty =
  | 'Easy'
  | 'Easy_Medium'
  | 'Medium'
  | 'Medium_Hard'
  | 'Hard';

export type PostProps = {
  id: number;
  company: string;
  role: string;
  difficulty: Difficulty;
  summary: string;
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  isAnonymous: boolean;
  createdAt: string;
};

export interface CreatePostPayload {
  company: string;
  role: string;
  difficulty: Difficulty;
  summary: string;
  isAnonymous: boolean;
}

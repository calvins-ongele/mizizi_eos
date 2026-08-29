export interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  image?: string | null;
  created_at?: string;
}
 
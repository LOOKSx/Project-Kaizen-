export interface Comment {
  id?: number;
  article_id?: number;
  author_name: string;
  author_avatar?: string;
  content: string;
  created_at?: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image: string;
  read_time: string;
  views: number;
  featured: boolean;
  author_name: string;
  author_avatar: string;
  tags: string;
  created_at: string;
  updated_at: string;
  likes?: number;
  liked?: boolean;
  comments?: Comment[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  count: number;
}

export interface AuthorProfile {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  cover_image: string;
  articles_count: number;
  countries_visited: number;
  photos_taken: number;
  location: string;
  instagram: string;
  youtube: string;
  facebook: string;
  github: string;
}

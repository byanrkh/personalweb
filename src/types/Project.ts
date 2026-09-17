export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  stack: string[];
  cover_image: string | null;
  project_url: string | null;
  repo_url: string | null;
  year: number | null;
  featured: boolean;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
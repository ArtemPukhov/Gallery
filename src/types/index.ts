export type Work = {
  id: string;
  title: string;
  year?: string;
  imageUrl: string;
  description: string;
  tags?: string[];
  artistSlug: string;
};

export type Artist = {
  slug: string;
  name: string;
  bio: string;
  years?: string;
  works: Omit<Work, "artistSlug">[];
};

export interface Image {
  height: number | null;
  url: string;
  width: number | null;
}

export interface Artist {
  id: string;
  name: string;
  images: Image[];
  followers?: {
    total: number;
  };
  genres?: string[];
}

export interface Album {
  id: string;
  name: string;
  artists: Artist[];
  images: Image[];
  album_type?: string;
  release_date: string;
  tracks: {
    total: number;
    items: Track[];
  };
}

export interface Track {
  id: string;
  name: string;
  album: Album;
  artists: Artist[];
  duration_ms: number;
  preview_url: string;
}

export type Playlist = {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: {
    external_urls: {
      spotify: string;
    };
    followers: {
      href: string | null;
      total: number;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
    display_name: string | null;
  };
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  uri: string;
};

export interface CategoryItem {
  href: string;
  icons: Image[];
  id: string;
  name: string;
}

export interface Category {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: CategoryItem[];
}

export interface MediaItem {
  id: number;
  title: string;
  type: string;
  owner: string;
  songs: number;
  image: string;
}
